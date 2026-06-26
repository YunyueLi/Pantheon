# Pantheon — Design Language ("The Codex")

*中文版 / Chinese: [DESIGN.zh-CN.md](./DESIGN.zh-CN.md)*

The single written source of truth for the visual system. The **canonical
implementation** is the code — `src/app/globals.css` (`:root` tokens + `@layer
components` primitives) and the shared components in `src/components/ui/`. This
document explains the *intent* so changes stay coherent; when code and doc
disagree, the code wins and this doc should be updated.

**Maintenance:** this doc and its Chinese mirror [`DESIGN.zh-CN.md`](./DESIGN.zh-CN.md)
are section-for-section equivalents. When the visual system changes, update **both
in the same commit** so they never drift; the code stays the single source of truth.

---

## 0. Product thesis (the lens for every decision)

**Singular · transparent · authoritative.** Pantheon is a monument, not an app:
one definitive ranking + a method you can re-derive by hand. Every design choice
serves that. Knobs, polls, "make your own", and other generic app-features
dilute the authority and were deliberately cut (2026-06-25 audit). When unsure,
choose the option that makes the verdict feel *more* singular and hand-made, not
more interactive.

---

## 1. Lineage & reference

Mood reference: **Nous Research's Hermes agent site**
(`hermes-agent.nousresearch.com`). We borrowed the **spirit, not the form**.

- **Taken from Hermes:** oversized display typography; numbered sections; quiet,
  scroll-revealed disclosure; a dark luminous field; clarity over ornament.
- **Deliberately diverged (Pantheon's own):**
  - all-**serif** Didone — Hermes is sans-serif;
  - dramatic **asymmetry** + a hairline grid — Hermes is centered/symmetrical;
  - **halftone duotone + line-art engravings + ghost glyphs** — Hermes uses 3D
    photoreal renders;
  - a saturated **crimson** identity (+ obsidian / paper);
  - a Latin **"monument / codex"** tone ("MMXXVI", roman numerals).
- **Rejected dead-end:** the literal parchment / Cinzel / gold "Hermetic" pastiche
  — abandoned as a clumsy imitation. Don't revive it.

Numbered Hermes sections → our **roman-numeral Plates (Ⅰ–Ⅶ)**; Hermes' oversized
hero type → our `.mega`; its scroll disclosure → our `data-reveal`.

---

## 2. Themes & color tokens

Three themes, cycled by the nav theme button. **Obsidian is the default.** Only
the *base* tokens are overridden per theme; *derived* tokens (`--accent-soft`,
`--bg-glass`, `--gold-soft`, `--gold-line`) recompute from them via `color-mix`.

| token | obsidian (`.dark`, default) | crimson (`:root`) | paper (`.paper`) |
|---|---|---|---|
| `--bg` / `--surface` | `#0c0b0a` | `#cc1326` | `#f3eee2` |
| `--fg` | `#f3efe6` (bone) | `#ffffff` | `#221c14` (ink) |
| `--fg-2` / `--fg-3` | bone 68% / 46% | white 72% / 54% | ink 70% / 50% |
| `--border` / `--border-strong` | bone 18% / 42% | white 26% / 52% | ink 20% / 42% |
| `--accent` | `#e23a4e` (crimson) | `#ffffff` (white ink) | `#cc1326` (crimson) |
| `--accent-contrast` | `#0c0b0a` | `#cc1326` | `#ffffff` |
| `--medal-gold` | `#e8c879` | `#ffe7ad` | `#9c7b2e` |

Persisted in `localStorage` as `pantheon-mode`; an inline script in `layout.tsx`
sets the class pre-paint (no flash). `theme-provider.tsx` is the source of truth
for mode logic.

---

## 3. Typography

- **Display = serif.** Latin = **Playfair Display** (Didone, high contrast); CJK =
  **Noto Serif SC** (a Song with matching contrast). Composed in `--font-display:
  var(--font-latin), var(--font-cjk), Georgia, …, serif` so every serif rule picks
  the right glyph per script. The serif carries all the big/editorial type — hero,
  names, Plates, numerals.
- **UI chrome = sans** (`--font-ui`: **Geist** + system CJK sans). The small
  label / eyebrow / nav / control / caption voice (`.label`, per-page `.kick`) is a
  clean grotesque, uppercase + tracked — more legible at small sizes and across
  scripts than the Didone. (Added 2026-06-26; the UI was all-serif before then.)
- **Display:** `.mega` (weight 900, `line-height:0.84`, tight tracking, uppercase).
- **Numerals:** tabular + lining (`.tnum`, `.ledger-num`) — rankings, scores,
  years must not shift width.
- **Scale:** fluid `clamp()`. Desktop uses the vw/max end; mobile lowers the *min*
  only. CJK has no italic → faux-slant is acceptable.

---

## 4. Layout & grid

- **Hairline 6-column overlay** (`.col-grid`; collapses to 3 columns ≤640px) — the
  structural signature behind heroes and bands.
- **The `.pad` rail:** horizontal padding `clamp(20px,5vw,64px)`, shared by every
  header/hero/filter row so content aligns to one edge.
  - **RULE:** any layout class that co-occurs with `.pad` must set vertical padding
    via **`padding-block`**, never the 4-value `padding` shorthand — the shorthand
    resets left/right to 0 and shoves content to the viewport edge.
- **Full-bleed** (no `max-w` wrappers on board/compare), **dramatic asymmetry**,
  bottom-anchored poster heroes.

---

## 5. Motion

- `data-reveal` → fade + rise on scroll (`ScrollReveal`, mounted once in layout).
  Gated behind `.js` (added pre-paint) + `prefers-reduced-motion`. Reveals in-view
  elements immediately, observes the rest via `IntersectionObserver`, and has a
  2.5s fallback so content is **never stuck hidden**. Stagger via inline
  `transitionDelay`.
- **RULE:** never put `data-reveal` on a conditionally/interaction-mounted node —
  the observer is built once at load and won't see it, leaving it at `opacity:0`.

---

## 6. The monument primitives (the vocabulary)

Defined in `globals.css` `@layer components`. **Build with these; don't invent
generic widgets.**

| class | what it is |
|---|---|
| `.col-grid` | hairline 6-col background overlay |
| `.v-edge` | vertical (rotated) edge label, e.g. `PANTHEON · ANNO MMXXVI` |
| `.ghost-glyph` | oversized faint glyph (★ ♛ Σ / sport mark), `opacity:.05`, bled off-edge |
| `.mega` / `.mega-outline` | display type / outlined-stroke display type |
| `.ledger-num` | tabular lining numerals |
| `.plate` (+`-n` `-t` `-note`) | **the canonical section header** — roman/index + serif title + note over a hairline. Use `<Plate n title note/>` (`ui/plate.tsx`) |
| `.label` | serif uppercase tracked (eyebrow/nav/caption) |
| `.ftog` / `.fsel` | **flat controls** (`ui/flat-controls.tsx`): underlined-label `FlatSelect` (self-drawn listbox, not native `<select>`) + `FlatToggle` |

Page-specific layout lives in each component's **scoped `<style>`** keyed to a root
class — never leaks globally.

---

## 7. Imagery & iconography

- **The portrait** (`Portrait`, player profile) — a halftone duotone field with a
  radiating sunburst + radial bloom and the player's monogram engraved over it.
  Where a **freely-licensed likeness** exists it renders as a clean, high-contrast
  **monochrome "monument" portrait** (grayscale + steep contrast, feathered out of
  the dark field so the figure emerges from the light); otherwise the radiant
  monogram field stands alone. Clean B&W is the standard — no halftone dots / grain.
- **Player photos** — sourced from Wikimedia Commons (mostly CC BY-SA), declared in
  `src/lib/player-photos.ts`, stored at `/public/players/<id>.jpg`, and attributed on
  the **`/credits`** page. Esports players rarely have free images → field fallback.
- **Monogram engraving** — the player's initials as a giant faint stroke (first +
  last initial for multi-word names, first two letters for mononyms).
- **Ghost glyphs** — large, faint, bled off an edge; never a soft gradient "orb".
- **No discipline emblems** — the nav is **type-only** (the sport name). Abstract
  pictographic marks read as generic "AI" iconography; dropped 2026-06-26. Richness
  lives in the portraits + typography (Hermes uses no pictograms either).
- **`trophy-icon.tsx`** — classical **engravings** (cup / goblet / medallion+ribbon
  / faceted star), toned by medal rank.
- **OG share cards** (`scripts/generate-og.ts`, build-time PNG via satori→resvg):
  hairline grid + monogram engraving + `Nº` + Honor Index — a "torn page of the
  codex". `public/og/` is gitignored, regenerated at `prebuild`.

---

## 8. Page archetypes (root classes)

| class | page |
|---|---|
| `.home` | homepage |
| `.board` | leaderboard (full-bleed register + flat serif filters) |
| `.enshrine` | player profile (poster hero, № fractions, verdict pull-quote, haul, ledger) |
| `.oracle` | compare (head-to-head duel, ghost "VS", radar) |
| `.codex` | methodology (formula hero, ghost Σ, roman-numeral articles, tariff ledger) |
| `.houses` / `.crest` | club lists / club profile |

---

## 9. Do / Don't (anti-slop)

**Do** — extend the primitives above; roman-numeral **Plates** for every section;
hairline rules and ledger numerals; the Latin/monument tone; render *one*
verdict.

**Don't** (these read as generic "AI" templating and were audited out 2026-06-25):

- rounded pills / chips for status or labels;
- native OS `<select>` dropdowns;
- soft gradient **"orbs" / blobs** as decoration;
- decorative **colored-dot legends**;
- two-sided **"the case for / against"** debate panels (a Pantheon doesn't hedge);
- **vote / poll** widgets and crowd input (it doesn't poll its own verdicts);
- free-form **user knobs** ("build your own ranking") that dilute the one index —
  curated preset *lenses* are fine, an infinite slider toy is not.
- abstract pictographic **discipline emblems / icon-set marks** — they read as
  generic; the nav is type-only and imagery carries identity (dropped 2026-06-26).

---

## 10. File map

- `src/app/globals.css` — tokens, `@layer components` primitives, `@media print`.
- `src/components/theme-provider.tsx` — 3 themes. `reveal.tsx` — scroll motion.
- `src/components/ui/plate.tsx` — section header. `ui/flat-controls.tsx` — controls.
- `src/components/trophy-icon.tsx` — trophy engravings. `player-profile.tsx` `Portrait` — monument photo treatment.
- `src/lib/player-photos.ts` — freely-licensed photo manifest, attributed on `app/credits/page.tsx`.
- `scripts/generate-og.ts` — build-time OG cards.
- Per page: `leaderboard.tsx`, `player-profile.tsx`, `compare-view.tsx`,
  `methodology.tsx`, `team-profile.tsx`, `football-clubs.tsx`, etc.
