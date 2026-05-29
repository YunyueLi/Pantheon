# Pantheon

**English** · [简体中文](./README.zh-CN.md)

A visual hall of fame for competitive play. Pantheon turns scattered championships, MVPs, and
All-Pro selections into a single, transparent **Honor Index** — sliced by region and role, and
built to settle the GOAT debate with numbers you can audit.

> Beachhead: League of Legends esports. The data model is sport-agnostic, designed to extend to
> other esports and traditional sports.

## Features

- **Honor leaderboard** — every pro ranked by a tier-weighted Honor Index; slice by region
  (LCK / LPL / LEC / LCS) and role (Top / Jungle / Mid / Bot / Support), and switch weighting
  presets to re-rank instantly.
- **Player profiles** — a large Honor Index + percentile, a trophy cabinet with competition icons
  (runner-ups shown as faded "ghost" cups), a career timeline (visx), and an index-composition
  donut (Recharts).
- **Head-to-head compare** — five honor dimensions on a radar.
- **Transparent methodology** — every weight is documented and auditable at `/methodology`.
- **Internationalized** — English / 简体中文 / 한국어 (cookie-based, flash-free).
- **Light & dark**, premium-minimal design with a single champagne-gold accent.
- **Photo-ready avatars** — drop licensed images into `public/players/`.

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · visx · Recharts ·
TanStack Table · Motion · lucide-react · Geist.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
# production
npm run build && npm start
```

Requires Node.js 18.17+ (20+ recommended).

## Data

The repo ships with a small **curated seed** dataset (`src/lib/data.ts`) so the app runs out of the
box. Seed honors are approximate until synced.

Real honors come from **Leaguepedia** (Cargo API, CC BY-SA 3.0):

```bash
node scripts/ingest-leaguepedia.mjs --dry   # preview rows, writes nothing
node scripts/ingest-leaguepedia.mjs         # writes src/lib/players.generated.json
```

The script merges real championships / runner-ups / MVP / All-Pro onto the curated bios (region,
role and blurb stay; achievements are replaced). The anonymous API is heavily rate-limited
(~1 req/min) — for batch syncs, create a Leaguepedia/Fandom bot account and export `LP_USER` /
`LP_PASS` via `.env.local` (never commit credentials). Synced data stays CC BY-SA, so keep the
attribution.

## Player photos

Drop licensed or owned headshots into `public/players/<id>.(jpg|png|webp)` (e.g. `faker.jpg`).
They appear automatically, cropped to a circle; until then a clean monogram shows. **Only add
images you have the rights to use — this repo does not bundle copyrighted photos.**

## Internationalization

Add a locale in `src/lib/i18n/` (`config.ts` + a matching dictionary in `dictionaries.ts`). All UI
strings and honor / role / region / axis labels go through `t()`.

## Project structure

```
src/app          routes: home, /lol/leaderboard, /lol/players/[id], /compare, /methodology
src/lib/honor.ts the Honor Index engine (weights, buckets, presets, radar axes)
src/lib/data.ts  curated player seed + accessors
src/lib/i18n     locales & dictionaries
src/components   charts, table, avatar, trophy icons, theme/i18n providers
scripts          Leaguepedia ingestion
```

## License

Code is released under the [MIT License](./LICENSE). Honors data synced from Leaguepedia is
licensed **CC BY-SA 3.0** and must retain attribution and stay share-alike. The Geist font is
© Vercel.

## Disclaimer

Not affiliated with or endorsed by Riot Games. Player, team, and competition names are the
property of their respective owners. Seed honors data is illustrative until synced.
