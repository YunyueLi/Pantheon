# Real-Data Sync — Scoping Proposal

> Status: proposal / scoping. Nothing here is implemented beyond the existing
> `scripts/ingest-leaguepedia.mjs` (which currently writes an empty
> `src/lib/players.generated.json`). This doc defines how to turn that stub into a
> repeatable, human-reviewed sync and how to extend it to the other sports.

## TL;DR

- **All player/achievement data today is hand-seeded** (see `DATA_NOTE` in `src/lib/data.ts`). The goal is to replace approximate counts with sourced ones **without** giving up the editorial honor *weights*.
- **Pilot with LoL.** A pipeline already half-exists (`scripts/ingest-leaguepedia.mjs`), Leaguepedia exposes a real **Cargo query API** under CC BY-SA, and the LoL merge in `data.ts` is already **additive** (a sync can only add honors, never drop curated ones). Lowest risk, highest leverage.
- **Pipeline shape:** per-sport Node script `scripts/sync-<sport>.mjs` → fetch → normalize → map to our `Achievement` shape → emit a **diff for human review** (`data/sync/<sport>.diff.json` + a CSV) → on approval, write the typed data file. The script never edits weights and never silently overwrites curated rows.
- **The split that makes this safe:** *sync provides the raw counts; humans keep the weights.* `base`/`tier`/`bucket`/`share` (the editorial judgments) live in `model.ts` and the curated seed and are **out of scope for any scraper**.
- **Biggest risks:** (1) **fuzzy name → roster-id matching** across sources (esports handles, accents, romanization, club-name drift); (2) **keeping weights stable** when counts change underneath them; (3) **no clean API for several sports** (football, basketball, go, table tennis) — those degrade to Wikidata + a reviewed CSV rather than a live query.

---

## 0. What we're mapping onto (the target schema)

Defined in `src/lib/sport/types.ts`. Every sport is a self-contained plugin —
`data.ts` (roster) + `model.ts` (`HonorModel`) + `index.ts` (`SportConfig`) —
registered in `src/lib/sport/registry.ts`. A sync writes the **roster**; it never
touches `model.ts`.

```ts
// the two shapes a sync produces (abridged from types.ts)
type Achievement = {
  type: string;     // a key into HonorModel.achievementMeta (e.g. "worlds_title")
  year: number;
  event?: string;   // "Worlds 2023"
  team?: string;    // team/club represented at the time
  share?: number;   // 0..1 vote share for voted individual awards (default 1) — EDITORIAL
  part?: number;    // 0..1 squad/bench participation factor (default 1)         — EDITORIAL
  count?: number;   // bulk multiplicity, e.g. one row "2008: 5 wins"            — SYNCABLE
};

type Player = {
  id: string; name: string; realName?: string;
  sport: SportId; league: string; position: string; team: string; nation: string;
  active: boolean; debutYear: number; blurb?: string; photo?: string;
  stature?: number;            // 0..100 cultural footprint — EDITORIAL, never synced
  achievements: Achievement[];
};
```

`base`, `tier`, `bucket` live only in `HonorModel.achievementMeta` (e.g.
`worlds_title` → `base: 1000`). They are **the product**, not the data — out of
scope for sync.

### What is syncable vs. editorial

| Field | Source of truth | Synced? |
|---|---|---|
| `achievements[].type` | derived by the script's classifier from source rows | yes (classifier) |
| `achievements[].year` | source row | yes |
| `achievements[].event` | source row (tournament name) | yes |
| `achievements[].team` | source row (team/club at the time) | yes |
| `achievements[].count` | source aggregate (e.g. wins-per-season) | yes |
| `achievements[].share` | hand-set from vote tallies | **no — editorial** |
| `achievements[].part` | hand-set for documented bench/reserve cases | **no — editorial** |
| `Player.stature` | all-time rankings + fan vote, curated | **no — editorial** |
| `achievementMeta[].base/tier/bucket` | `model.ts` | **no — editorial** |
| `Player.blurb` | hand-written | **no — editorial** |

---

## 1. Per-sport authoritative sources

"Queryable" = a real API returning structured rows. "Scrape-only" = HTML / wiki
templates with no clean endpoint → degrade to a reviewed CSV. Wikidata is the
common reconciliation spine for all of them (§3).

| Sport | Primary source | Access | Licensing / attribution |
|---|---|---|---|
| **LoL** | **Leaguepedia** Cargo tables (`Tournaments`, `TournamentResults`, `IndividualAchievements`) | **Queryable** — MediaWiki `cargoquery` (§2). Anon ~1 req/min; bot login lifts it. | **CC BY-SA 3.0** — must credit "Leaguepedia contributors, CC BY-SA 3.0" in-UI and keep derived data share-alike. Already noted in the ingest script header. |
| **LoL (cross-check)** | **Wikidata** (`participant of` / `winner` claims on Worlds editions) | Queryable (SPARQL) | CC0 — no attribution required. |
| **Dota 2** | **Liquipedia** (`liquipediadota`) LPDB via the API | **Queryable** with strict terms | **CC BY-SA**. Liquipedia requires a custom `User-Agent`, **≥30s between requests**, and explicit credit + backlink. Use sparingly; cache hard. |
| **Valorant** | **Liquipedia** (`liquipediavalorant`) LPDB | Queryable (same terms as Dota) | CC BY-SA, same constraints as above. |
| **Football** | **Wikidata** for awards/national-team honors; **RSSSF** for historical league/cup winners; **Transfermarkt** for club/position metadata | Wikidata queryable; **RSSSF + Transfermarkt are scrape-only** (Transfermarkt also disallows scraping in ToS) | Wikidata CC0; RSSSF "free for non-commercial with credit"; **Transfermarkt — do not scrape**, use only for manual lookup. |
| **Basketball** | **Basketball-Reference** (awards, champions, All-NBA); **Wikidata** | **Scrape-only** (BBR ToS forbids scraping/bulk export) + Wikidata queryable | BBR — manual/eyeball only, no automated pull; Wikidata CC0. |
| **F1** | **Ergast / Jolpica-F1** successor API (seasons, results, qualifying); **Wikidata** | **Queryable** — JSON/CSV REST; gives per-season wins/poles/podiums directly | Ergast CC-BY-NC-style; Jolpica community-run. Credit the API. |
| **Table tennis** | **ITTF** rankings/results pages; **Wikidata** for Olympic/Worlds medals | **Scrape-only** (ITTF) + Wikidata queryable | ITTF — no open API; Wikidata CC0. |
| **Go (围棋)** | **Sensei's Library** + **Go Ratings**; **Wikidata** for major-title holders | **Scrape-only** + Wikidata queryable | Sensei's Library text under its own free license; verify per page. |

**Net:** three sports have a real structured API (LoL, F1, and — under heavy
constraints — Dota/Valorant via Liquipedia). The rest are **Wikidata + reviewed
CSV**. That asymmetry drives the rollout order in §6.

---

## 2. Leaguepedia Cargo API (LoL)

Leaguepedia runs on MediaWiki with the **Cargo** extension: wiki data is stored in
SQL-like tables you query through the standard API. We already target this in
`scripts/ingest-leaguepedia.mjs` — this section documents it so the script can be
calibrated and reused.

### Endpoint

```
GET https://lol.fandom.com/api.php
    ?action=cargoquery
    &format=json
    &limit=500
    &tables=...&join_on=...&fields=...&where=...
```

Send a descriptive `User-Agent`. Anon rate limit is **~1 request/min**; the script
paces at 8s and backs off 65s on `ratelimited`. For a real batch, **create a
Fandom/Leaguepedia bot account** and log in (`LP_USER`/`LP_PASS`) to lift the cap.
**The sandbox in this repo is 403'd by Fandom** — the script must be run from an
unblocked machine (that is why `players.generated.json` is still `{}`).

### Relevant tables

- **`Tournaments`** — one row per event. Useful fields: `OverviewPage` (join key),
  `Name` ("Worlds 2023"), `League`, `Region`, `Year`, `TournamentLevel`
  ("Primary"/"Major"…). Filter on `TournamentLevel="Primary"` to keep split finals
  and drop showmatches.
- **`TournamentResults`** — placement rows per event: `OverviewPage` (join key),
  `Place` ("1","2",…), `Team`, `RosterPlayers` (`;`-separated handles).
- **`IndividualAchievements`** — awards: `Player`, `Achievement` ("Finals MVP",
  "1st Team All-Pro"…), `Tournament`, `Date`.

### Example query — Worlds champions & finalists, all years

```bash
curl -s 'https://lol.fandom.com/api.php' \
  -H 'User-Agent: PantheonHonorsBot/0.1 (contact@example.com)' \
  --data-urlencode 'action=cargoquery' \
  --data-urlencode 'format=json' \
  --data-urlencode 'limit=500' \
  --data-urlencode 'tables=TournamentResults,Tournaments' \
  --data-urlencode 'join_on=TournamentResults.OverviewPage=Tournaments.OverviewPage' \
  --data-urlencode 'fields=TournamentResults.RosterPlayers=roster,TournamentResults.Place=place,Tournaments.Name=name,Tournaments.Year=year' \
  --data-urlencode 'where=Tournaments.Name LIKE "%World Championship%" AND TournamentResults.Place IN ("1","2")'
```

Response (`cargoquery[].title`):

```json
{ "cargoquery": [
  { "title": { "roster": "Zeus;Oner;Faker;Gumayusi;Keria", "place": "1", "name": "World Championship 2023", "year": "2023" } },
  { "title": { "roster": "Rookie;JieJie;...;...;...",        "place": "2", "name": "World Championship 2023", "year": "2023" } }
] }
```

### Row → `Achievement` mapping

| Cargo field | → `Achievement` | Rule |
|---|---|---|
| `Tournaments.Name` LIKE `%World Championship%` + `Place="1"` | `type: "worlds_title"` | placement 1 at a Worlds event |
| same, `Place="2"` | `type: "worlds_runnerup"` | placement 2 |
| `Tournaments.Name` LIKE `%Mid-Season Invitational%`, `Place="1"` | `type: "msi_title"` | — |
| `Tournaments.League IN (LCK, LPL, LEC, LCS …)` + `Level="Primary"` + `Place="1"/"2"` | `regional_title` / `regional_runnerup` | domestic split finals |
| `IndividualAchievements.Achievement` ~ "Finals MVP" at a Worlds/MSI event | `worlds_mvp` / `msi_mvp` | classified by tournament (`awardType()` in the script) |
| `Achievement` ~ "MVP" (regular season) | `season_mvp` | — |
| `Achievement` ~ "1st/2nd/3rd Team All-Pro" | `all_pro_1/2/3` | — |
| `Tournaments.Year` (fallback: `Date[0:4]`) | `year` | — |
| `Tournaments.Name` | `event` | display label |
| `TournamentResults.Team` | `team` | team at the time |

`share` (vote share on MVPs) is **not** in these tables at usable granularity →
left to editorial. Honors the scraper does **not** cover — `ewc_title`,
`asian_games_gold`, `first_stand_title`, `msc_title` — stay in the curated seed;
the additive merge (§4) guarantees they survive a sync.

---

## 3. Wikidata reconciliation

Wikidata QIDs are **stable, language-neutral cross-source IDs**. We use them to (a)
dedupe a player across sources and sync runs, and (b) enrich `nation` / `realName`
/ `debutYear` consistently.

- **Add an optional `wikidata` QID to each roster entry's raw record** (not to the
  `Player` type — keep it in the per-sport raw map / a sidecar
  `data/sync/<sport>.ids.json`). Example: Faker → `Q15050042`, Messi → `Q615`.
- **Reconcile once, reuse forever.** A handle like `Faker` or an accented name like
  `Räikkönen` is ambiguous across sources; a QID is not. Match the messy source row
  to a QID, then map the QID → our stable `id` via the sidecar. This turns the §7
  fuzzy-matching problem from "every sync" into "once per new player."
- **SPARQL example** — fetch nation + birth year for a batch of QIDs:

```sparql
SELECT ?p ?pLabel ?countryLabel ?birth WHERE {
  VALUES ?p { wd:Q15050042 wd:Q615 }
  OPTIONAL { ?p wdt:P27 ?country. }       # country of citizenship
  OPTIONAL { ?p wdt:P569 ?birth. }        # date of birth
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
```

- **Cross-source dedupe:** when two sources disagree on a name spelling, the QID is
  the join key — e.g. Leaguepedia `Faker` and an esports-DB `T1 Faker` both
  reconcile to `Q15050042`, so they merge cleanly.
- Wikidata is **CC0** → no attribution burden, safe to lean on as the spine even
  where the honor data itself comes from a share-alike source.

---

## 4. The pipeline (semi-automated, no backend)

The site is a static export — there is **no server, no DB, no runtime fetch**.
Everything happens at author time via a Node script, and the output is a typed file
checked into git. A human gate sits in the middle.

```
scripts/sync-<sport>.mjs
  1. FETCH      query the source API (or load a hand-collected CSV for scrape-only sports)
  2. NORMALIZE  flatten rows; resolve names → QIDs → our roster id via data/sync/<sport>.ids.json
  3. MAP        classify each row into our Achievement {type,year,event,team,count}
                (NEVER sets share/part/base/tier — those are editorial)
  4. DIFF       compare against the current data file; write data/sync/<sport>.diff.json
                + a human-readable data/sync/<sport>.diff.csv  ── STOP. nothing in src/ is touched.
  ── HUMAN REVIEW GATE ───────────────────────────────────────────────────────────
     a reviewer reads the CSV: confirms classifications, sets share on new MVPs,
     flags fuzzy name matches, rejects junk rows.
  5. APPLY      `node scripts/sync-<sport>.mjs --apply` re-runs 1-4 and, for APPROVED
                rows only, writes the typed roster file.
```

### The merge contract is already additive (and we keep it)

`src/lib/data.ts` already merges the LoL generated file onto the curated seed
**additively, matched on `type|year|team`**:

```ts
const achKey = (a: Achievement) => `${a.type}|${a.year}|${a.team ?? ""}`;
// every curated honor is kept; a synced honor is added only if not already present.
```

This is exactly the property we want everywhere: **a sync can only improve
coverage, never silently drop a curated title or overwrite an editorial `share`.**
The pilot reuses this; new sports replicate the same `achKey` merge in their
`data.ts`.

### Commands

```bash
node scripts/sync-lol.mjs --dry      # fetch + print sample rows, write nothing
node scripts/sync-lol.mjs            # write data/sync/lol.diff.{json,csv} for review
node scripts/sync-lol.mjs --apply    # after review: write src/lib/players.generated.json
npm test                             # honor-math + schema tests must pass post-apply
```

(`scripts/ingest-leaguepedia.mjs` is the existing LoL fetch+map+write; the only new
work for the pilot is splitting out the **diff/review step** before it writes.)

### Why a human gate, not full automation

The honor *weights* (`base`, `tier`, `bucket`) and the per-award `share` are
**editorial judgments**, not facts — e.g. football era-gates Olympic gold into
three tiers (`olympic_gold_early/amateur/u23`) by year. A scraper supplies the raw
count and year; a human decides what it's worth. Auto-applying would let a source's
schema drift quietly rewrite the rankings. The gate also satisfies CC BY-SA
diligence (a person confirms attribution-bearing data before it ships).

---

## 5. Schema-mapping table (cross-sport) + the tricky bits

| Source concept | → our field | Notes / gotchas |
|---|---|---|
| Tournament winner row | `Achievement{type, year, event, team}` | `type` is **classified**, not copied — map source event name → our model key. |
| Voted individual award | `Achievement{type, share}` | **`share` is NOT in most sources** at vote-tally granularity → leave default 1, hand-set during review. This is the single biggest "looks automatable but isn't" trap. |
| Season stat totals (F1 wins, poles, podiums) | one `Achievement{type, year, count}` **per season** | Use the `count` field — do **not** emit N rows. See `S()` helper in `src/lib/sport/f1/data.ts` (`{2008: 5}` → one row, `count: 5`). Never combine `count` with a `repeatDecay` type. |
| Repeated discrete titles (Worlds, leagues) | **N enumerated rows**, one per year | The opposite of `count`: LoL/football enumerate so `repeatDecay` and per-year `event`/`team` work. F1 uses `count`; LoL does not — pick per sport, never mix within a type. |
| Olympic gold (football) | `olympic_gold_early` \| `_amateur` \| `_u23` | **Era-gated by year:** pre-1932 / 1936–1988 / 1992+ map to different `type`s and very different `base` (300 / 90 / 40). The sync must branch on `year`; a flat mapping is wrong. See header of `src/lib/sport/football/model.ts`. |
| Pre-1995 non-European greats (football) | `ballon_dor_retro` | France Football's 2016 retroactive palmarès, a **separate type** from `ballon_dor`. Do not fold retroactive awards into the real award. |
| Player name (any source) | `Player.id` via QID sidecar | Two-hop: source name → Wikidata QID → our `id`. Never key achievements directly on a raw handle (§3, §7). |
| Country / citizenship | `Player.nation` | Prefer Wikidata `P27`; sources disagree on dual nationals — reviewer picks. |
| Squad/bench medal | `Achievement{part}` | `part < 1` only for **documented** limited-role titles (unused reserve). Sources don't encode minutes-played reliably → editorial, default 1. |
| Award/honor *weight* | `achievementMeta[].base/tier/bucket` in `model.ts` | **Never synced.** The whole point of the project. |

---

## 6. Incremental rollout

**Pilot: League of Legends.** Rationale:

1. **The pipeline already exists** — `scripts/ingest-leaguepedia.mjs` does fetch +
   classify + write; only the diff/review step is missing.
2. **A real structured API** (Cargo) returns clean rows — no HTML scraping.
3. **The merge is already additive and tested** in `data.ts` (`achKey` on
   `type|year|team`), so applying a sync is low-risk by construction.
4. **Bounded, well-defined honors** — titles, runner-ups, MVP, All-Pro map cleanly;
   the editorial residue (`share`, the non-API EWC/Asian-Games honors) is small and
   already curated.
5. The only blocker is environmental (Fandom 403s the sandbox), not architectural —
   run the script from an unblocked machine + bot account and the loop closes.

**Then expand in order of API quality:**

1. **F1** — Ergast/Jolpica gives per-season wins/poles/podiums as JSON; maps
   straight onto the `count` pattern already in `f1/data.ts`. Almost pure win.
2. **Dota 2 / Valorant** — Liquipedia LPDB is structured but rate-/ToS-constrained
   (≥30s/req, mandatory credit). Reuse the LoL classifier shape; cache aggressively.
3. **Football, basketball, table tennis, go** — **Wikidata-first + reviewed CSV.**
   Wikidata covers major awards and national-team/Olympic honors via SPARQL; the
   long tail (domestic leagues, era-gated cases) comes from a hand-collected CSV run
   through the same map→diff→apply steps. No live scrape of BBR/Transfermarkt/ITTF.

Per new sport, the only bespoke parts are the **fetch** (or CSV loader) and the
**classifier**; normalize, diff, review, and the additive merge are shared.

---

## 7. What's genuinely hard / blocked — and honest mitigations

- **No clean API for football / basketball / go / table tennis.** Transfermarkt and
  Basketball-Reference forbid scraping; ITTF and Sensei's Library have no API.
  *Mitigation:* Wikidata SPARQL for the queryable majority (awards, Olympic/Worlds
  medals via QIDs) + a **hand-collected CSV** for the rest, fed through the same
  map→diff→apply gate. Accept that these sports stay partly manual; the value is the
  review tooling, not full automation.

- **Fuzzy name matching.** Esports handles collide and re-spell (`Faker`, accents
  like `Räikkönen`, romanization like `Xiaohu`/`Yu Wenbo`, club-tag prefixes).
  *Mitigation:* reconcile once to a **Wikidata QID** and store it in
  `data/sync/<sport>.ids.json` (§3). Matching becomes a one-time, reviewed step per
  new player rather than a per-sync gamble. Unmatched rows are surfaced in the diff
  CSV, never dropped silently.

- **Keeping editorial weights stable as counts move.** A sync changes *how many* of
  a thing a player has; it must not change *what each is worth*.
  *Mitigation:* the syncable/editorial split is enforced structurally — the script
  only ever writes `Achievement` rows and **cannot reach `model.ts`** or set
  `share`/`base`. The additive `achKey` merge means a re-sync can't clobber an
  editorial `share` already attached to a curated row.

- **CC BY-SA share-alike (Leaguepedia, Liquipedia).** Derived data inherits the
  license and needs visible attribution.
  *Mitigation:* keep the existing in-UI credit ("Leaguepedia contributors, CC BY-SA
  3.0"); add Liquipedia's required `User-Agent` + ≥30s pacing + backlink before
  touching Dota/Valorant; **do not** commingle CC BY-SA honors with an
  incompatibly-licensed source in the same field without noting provenance.

- **Source schema drift.** Cargo/LPDB field names change (the ingest script already
  centralizes them in a `F` config and warns "if Cargo errors 'no field X', fix
  CONFIG"). *Mitigation:* the `--dry` mode + the human diff gate catch a broken
  classifier before anything reaches `src/`; tests (`npm test`) run on apply.

- **Rate limits / blocked sandbox.** This repo's environment is 403'd by Fandom; the
  anon Cargo cap is ~1 req/min. *Mitigation:* run syncs from an unblocked machine
  with a bot account; the output is just a committed JSON file, so the static build
  never needs network access.
