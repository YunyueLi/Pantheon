/**
 * Dump the full player roster to scripts/.roster.tmp.json for the photo-extraction
 * workflow (workflow agents Read it by slice). Not committed; safe to delete.
 *   npx tsx scripts/dump-roster.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SPORTS } from "../src/lib/sport/registry";
import { ranked } from "../src/lib/sport/honor";

const TOP = Number(process.argv.find((a) => a.startsWith("--top="))?.split("=")[1] ?? 10);
const dir = path.dirname(fileURLToPath(import.meta.url));
const roster = SPORTS.flatMap((s) =>
  ranked(s.players, s.model)
    .slice(0, TOP)
    .map(({ player: p }) => ({ id: p.id, name: p.name, realName: p.realName ?? null, sport: s.id, nation: p.nation }))
);
fs.writeFileSync(path.join(dir, ".roster.tmp.json"), JSON.stringify(roster));
console.log(`${roster.length} players → scripts/.roster.tmp.json`);
