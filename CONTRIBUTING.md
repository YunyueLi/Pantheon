# Contributing to Pantheon

Thanks for helping! Pantheon is a Next.js + TypeScript app.

## Setup

```bash
npm install
npm run dev
```

## Project layout

- `src/app` — routes (home, `/lol/leaderboard`, `/lol/players/[id]`, `/compare`, `/methodology`)
- `src/lib/honor.ts` — the Honor Index engine (weights, buckets, presets, radar axes)
- `src/lib/data.ts` — curated player seed + accessors
- `src/lib/players.generated.json` — real honors synced from Leaguepedia (merged onto bios)
- `src/lib/i18n` — locales & dictionaries
- `src/components` — UI (charts, table, avatar, trophy icons, theme & i18n providers)
- `scripts/ingest-leaguepedia.mjs` — data ingestion

## Adding or editing a player (seed)

Edit `src/lib/data.ts`: add a `Player` with an `id`, bio (`region`, `role`, `team`, `country`,
`debutYear`), an optional `blurb`, and `achievements` typed by `AchievementType`. The Honor Index
recomputes automatically — no manual scores.

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

## Conventions

- Keep the design premium-minimal: near-monochrome + the single gold accent, generous spacing,
  tabular numerals for stats. No second accent color.
- Run `npm run build` before opening a PR (it type-checks and lints).
- Use conventional commits (`feat:`, `fix:`, `chore:`, …).

## Data licensing

Honors synced from Leaguepedia are CC BY-SA 3.0 — any derivative data you redistribute must keep
attribution and remain share-alike.
