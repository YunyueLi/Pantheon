# Contributing to Pantheon

Thanks for helping! Pantheon is a Next.js + TypeScript app.

## Setup

```bash
npm install
npm run dev
```

## Project layout

- `src/app` — routes. The home page, plus a single dynamic `[sport]` segment that serves every
  sport's `/leaderboard`, `/compare`, `/methodology` and `/players/[id]`. Sport-specific extras keep
  their own paths (`/lol/teams`, `/football/clubs`, `/basketball/clubs`).
- `src/lib/sport` — the sport-neutral core. `honor.ts` is the Honor Index engine (scoring, ranking,
  radar axes); `stature.ts` is the era-strength engine; `types.ts` is the data contract; `registry.ts`
  wires the sports together. Each sport plugs in under `sport/<id>/` with its own `model` (achievement
  weights, presets, axes) and `data` (roster).
- `src/lib/data.ts` — the League of Legends roster seed (the `sport/lol` plugin reads it)
- `src/lib/players.generated.json` — real LoL honors synced from Leaguepedia (merged onto bios)
- `src/lib/i18n` — locales & dictionaries
- `src/lib/__tests__` — Vitest suite (honor math, data integrity, ranking snapshots, i18n parity)
- `src/components` — UI (charts, table, avatar, trophy icons, theme & i18n providers)
- `scripts/ingest-leaguepedia.mjs` — data ingestion

## Adding or editing a player (seed)

For League of Legends, edit `src/lib/data.ts`: add a `Player` with an `id`, bio (`region`, `role`,
`team`, `country`, `debutYear`), an optional `blurb`, and `achievements` typed by `AchievementType`.
For any other sport, edit that sport's `src/lib/sport/<id>/data.ts`. The Honor Index recomputes
automatically — no manual scores. `npm test` will flag a typo'd achievement type, a duplicate id, or
an impossible year before it ships.

## Syncing real honors

See the README → Data section. If Cargo errors `no field X`, the field names live in the `F`
config block at the top of `scripts/ingest-leaguepedia.mjs`; adjust and re-run with `--dry`.
Keep credentials in `.env.local` (git-ignored) — never commit `LP_USER` / `LP_PASS`.

## Player photos

Add licensed or owned images to `public/players/<id>.(jpg|png|webp)`. **Do not commit copyrighted
photos.** If you add a third-party image, record its author, source, and license.

## Adding a language

Add the locale to `LOCALES` in `src/lib/i18n/config.ts` and a matching dictionary in
`dictionaries.ts` — TypeScript enforces that every key is translated.

Player bios are separate: translate them in `src/lib/i18n/blurbs.ts`, keyed by player id
(seeded with each sport's headline player). Anything untranslated falls back to the English
`blurb`, so partial coverage is fine — `npm test` checks the ids are real and every locale
covers the same players.

## Tests

```bash
npm test          # run once
npm run test:watch
```

Vitest covers the scoring math (invariants that must hold for every sport), per-sport data integrity
(unknown achievement types, impossible years, duplicate ids), top-15 ranking snapshots, and i18n key
parity. After a deliberate data change that reorders a leaderboard, refresh the snapshots with
`npx vitest -u` and review the diff.

## Conventions

- Keep the design premium-minimal: near-monochrome + the single gold accent, generous spacing,
  tabular numerals for stats. No second accent color.
- Run `npm test` and `npm run build` before opening a PR (build type-checks and lints; CI runs both).
- Use conventional commits (`feat:`, `fix:`, `chore:`, …).

## Data licensing

Honors synced from Leaguepedia are CC BY-SA 3.0 — any derivative data you redistribute must keep
attribution and remain share-alike.
