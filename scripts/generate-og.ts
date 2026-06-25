/**
 * Build-time Open Graph card generator.
 *
 * `output: export` can't use Next's edge ImageResponse, so we pre-render a
 * 1200×630 PNG per player (plus a default site card) into public/og/ during the
 * `prebuild` step. Each player page points og:image at /og/<sport>-<id>.png.
 *
 *   npx tsx scripts/generate-og.ts                 # all players + default
 *   npx tsx scripts/generate-og.ts --only=football/messi
 *   npx tsx scripts/generate-og.ts --limit=5
 *
 * The card speaks the site's "Codex" language: an obsidian field, a hairline
 * 6-column grid, and the player's monogram as a ghost watermark (the same engraving
 * as the profile portrait) — no soft "orb". Latin-only (Playfair, the brand Didone);
 * player.name is Latin for ~all entries and the monogram is always 1–2 letters.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { SPORTS } from "../src/lib/sport/registry";
import { honorScore, ranked, countType } from "../src/lib/sport/honor";

const dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(dir, "..");
const OUT = path.join(ROOT, "public", "og");
const FONTS = path.join(ROOT, "node_modules/@fontsource/playfair-display/files");

// latin + latin-ext per weight so satori can fall back across them for Eastern-European
// accents (Modrić, Ibrahimović, …) that the basic latin subset omits.
const fonts = [
  { name: "Playfair", data: fs.readFileSync(path.join(FONTS, "playfair-display-latin-900-normal.woff")), weight: 900 as const, style: "normal" as const },
  { name: "PlayfairExt", data: fs.readFileSync(path.join(FONTS, "playfair-display-latin-ext-900-normal.woff")), weight: 900 as const, style: "normal" as const },
  { name: "Playfair", data: fs.readFileSync(path.join(FONTS, "playfair-display-latin-500-normal.woff")), weight: 500 as const, style: "normal" as const },
  { name: "PlayfairExt", data: fs.readFileSync(path.join(FONTS, "playfair-display-latin-ext-500-normal.woff")), weight: 500 as const, style: "normal" as const },
];

const BG = "#0c0b0a";
const FG = "#f3efe6";
const MUT = "rgba(243,239,230,0.62)";
const HAIR = "rgba(243,239,230,0.13)";
const GHOST = "rgba(243,239,230,0.05)";
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

// Minimal hyperscript → satori accepts this {type, props} VDOM shape directly.
type Node = string | { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: Node | Node[]): Node => ({
  type,
  props: children === undefined ? { style } : { style, children },
});

function nameSize(n: string): number {
  const L = n.length;
  if (L <= 9) return 132;
  if (L <= 13) return 108;
  if (L <= 18) return 82;
  if (L <= 26) return 62;
  return 48;
}

const monogram = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase();

// The shared frame: a hairline 6-column grid (= the site's .col-grid) plus, when a
// monogram is given, a giant faint engraving of it bleeding off the right edge — the
// same device as the profile portrait, and font-safe (Latin letters only).
function frame(mono?: string): Node[] {
  const grid = h("div", { position: "absolute", top: "0", left: "0", width: "1200px", height: "630px", display: "flex", backgroundImage: `repeating-linear-gradient(90deg, ${HAIR} 0, ${HAIR} 1px, transparent 1px, transparent 200px)` });
  if (!mono) return [grid];
  const ghost = h("div", { position: "absolute", right: "48px", top: "24px", display: "flex", fontSize: "470px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.05em", color: GHOST, fontFamily: "Playfair, PlayfairExt" }, mono);
  return [grid, ghost];
}

function playerCard(o: { sport: string; name: string; rank: number; pool: number; score: number; trophies: string }): Node {
  return h("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", backgroundColor: BG, color: FG, padding: "58px 72px", fontFamily: "Playfair, PlayfairExt", position: "relative", overflow: "hidden" }, [
    ...frame(monogram(o.name)),
    // Top band — wordmark + discipline, over a hairline rule.
    h("div", { display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", borderBottom: `1px solid ${HAIR}`, paddingBottom: "20px" }, [
      h("div", { display: "flex", fontSize: "30px", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" }, "PANTHEON"),
      h("div", { display: "flex", fontSize: "23px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: MUT }, o.sport),
    ]),
    // Middle — rank eyebrow + name.
    h("div", { display: "flex", flexDirection: "column", position: "relative" }, [
      h("div", { display: "flex", fontSize: "24px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: MUT, marginBottom: "14px" }, `Nº ${o.rank} of ${o.pool}`),
      h("div", { display: "flex", fontSize: `${nameSize(o.name)}px`, fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase" }, o.name),
    ]),
    // Bottom band — honor index + trophies, over a hairline rule.
    h("div", { display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", borderTop: `1px solid ${HAIR}`, paddingTop: "26px" }, [
      h("div", { display: "flex", flexDirection: "column" }, [
        h("div", { display: "flex", fontSize: "22px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: MUT, marginBottom: "8px" }, "Honor Index"),
        h("div", { display: "flex", fontSize: "88px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }, fmt(o.score)),
      ]),
      h("div", { display: "flex", maxWidth: "520px", textAlign: "right", justifyContent: "flex-end", fontSize: "25px", fontWeight: 500, letterSpacing: "0.02em", color: FG }, o.trophies),
    ]),
  ]);
}

function defaultCard(total: number): Node {
  return h("div", { display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", backgroundColor: BG, color: FG, padding: "72px", fontFamily: "Playfair, PlayfairExt", position: "relative", overflow: "hidden" }, [
    ...frame(),
    h("div", { display: "flex", position: "relative", borderBottom: `1px solid ${HAIR}`, paddingBottom: "20px", fontSize: "30px", fontWeight: 900, letterSpacing: "0.24em", textTransform: "uppercase" }, "PANTHEON"),
    h("div", { display: "flex", flexDirection: "column", position: "relative" }, [
      h("div", { display: "flex", fontSize: "118px", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase" }, "Every trophy,"),
      h("div", { display: "flex", fontSize: "118px", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.02em", textTransform: "uppercase" }, "one hall of fame."),
    ]),
    h("div", { display: "flex", position: "relative", borderTop: `1px solid ${HAIR}`, paddingTop: "24px", fontSize: "25px", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: MUT }, `8 disciplines · ${total} immortals · one transparent index`),
  ]);
}

async function renderTo(file: string, element: Node) {
  const svg = await satori(element as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  fs.writeFileSync(file, png);
}

async function main() {
  const args = process.argv.slice(2);
  const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];
  const limit = Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1]) || Infinity;
  fs.mkdirSync(OUT, { recursive: true });

  const total = SPORTS.reduce((n, s) => n + s.players.length, 0);
  let count = 0;
  for (const s of SPORTS) {
    for (const row of ranked(s.players, s.model)) {
      if (count >= limit) break;
      const p = row.player;
      if (only && `${s.id}/${p.id}` !== only) continue;
      const trophies =
        s.headlineTypes
          .map((type) => ({ n: countType(p, type), short: s.model.achievementMeta[type]?.short }))
          .filter((t) => t.n > 0 && t.short)
          .map((t) => `${t.n}× ${t.short}`)
          .join("  ·  ") || (s.leagues.find((l) => l.id === p.league)?.label ?? p.team ?? "");
      await renderTo(path.join(OUT, `${s.id}-${p.id}.png`), playerCard({ sport: s.label, name: p.name, rank: row.rank, pool: s.players.length, score: honorScore(p, s.model), trophies }));
      count++;
    }
  }
  if (!only) await renderTo(path.join(OUT, "default.png"), defaultCard(total));
  console.log(`OG: generated ${count} player card(s)${only ? "" : " + default.png"} → public/og/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
