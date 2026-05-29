#!/usr/bin/env node
/**
 * Leaguepedia → Pantheon honors ingestion (CC BY-SA 3.0).
 *
 * Pulls real championships / runner-ups / MVP / All-Pro for the roster and writes
 * src/lib/players.generated.json as { [playerId]: Achievement[] }, which data.ts
 * merges onto the curated bios. Run it from an UNBLOCKED environment (this project's
 * sandbox is rate-limited + 403'd by Fandom):
 *
 *   node scripts/ingest-leaguepedia.mjs --dry     # print sample rows, write nothing
 *   node scripts/ingest-leaguepedia.mjs           # full run, writes the JSON
 *
 * Rate limit: anon API is ~1 req/min. For a real batch, create a Leaguepedia/Fandom
 * bot account and set LP_USER / LP_PASS env vars (this script logs in if both are set).
 * Field names below are my best-known schema — if Cargo errors "no field X", fix CONFIG
 * and/or paste the --dry output back to me and I'll calibrate.
 *
 * Attribution: data © Leaguepedia contributors, CC BY-SA 3.0 — keep a credit in the UI.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const API = "https://lol.fandom.com/api.php";
const UA = "PantheonHonorsBot/0.1 (open-source LoL honors prototype)";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "players.generated.json");
const DRY = process.argv.includes("--dry");

const PACE_MS = 8000; // gap between successful calls
const RATELIMIT_WAIT_MS = 65000; // backoff when throttled
const MAX_RETRIES = 8;

// Cargo field names (adjust here if the schema differs).
const F = {
  results: { table: "TournamentResults", overview: "OverviewPage", place: "Place", team: "Team", roster: "RosterPlayers" },
  tourney: { table: "Tournaments", overview: "OverviewPage", name: "Name", league: "League", region: "Region", year: "Year", level: "TournamentLevel" },
  awards: { table: "IndividualAchievements", player: "Player", achievement: "Achievement", tournament: "Tournament", date: "Date" },
};

// Domestic leagues that count as a "regional title" (Leaguepedia League values vary by era).
const REGIONAL_LEAGUES = [
  "LoL Champions Korea", "LCK",
  "Tencent LoL Pro League", "LPL",
  "LoL EMEA Championship", "LEC", "EU LCS", "League of Legends European Championship",
  "League Championship Series", "LCS", "NA LCS", "League of Legends Championship Series",
];

// id ↔ Leaguepedia player name. Achievements are matched by these names.
const ROSTER = [
  ["faker", "Faker"], ["showmaker", "ShowMaker"], ["chovy", "Chovy"], ["zeus", "Zeus"],
  ["oner", "Oner"], ["gumayusi", "Gumayusi"], ["keria", "Keria"], ["beryl", "BeryL"],
  ["deft", "Deft"], ["canyon", "Canyon"], ["ruler", "Ruler"], ["uzi", "Uzi"],
  ["jackeylove", "JackeyLove"], ["theshy", "TheShy"], ["rookie", "Rookie"], ["knight", "Knight"],
  ["xiaohu", "Xiaohu"], ["ming", "Ming"], ["scout", "Scout"], ["jiejie", "JieJie"],
  ["doinb", "Doinb"], ["tian", "Tian"], ["bin", "Bin"], ["caps", "Caps"],
  ["jankos", "Jankos"], ["rekkles", "Rekkles"], ["mikyx", "Mikyx"], ["bjergsen", "Bjergsen"],
  ["doublelift", "Doublelift"], ["corejj", "CoreJJ"], ["blaber", "Blaber"], ["impact", "Impact"],
];
const NAME_TO_ID = new Map(ROSTER.map(([id, name]) => [name.toLowerCase(), id]));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const quoteList = (arr) => arr.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(",");

async function cargo(params) {
  const url = `${API}?${new URLSearchParams({ action: "cargoquery", format: "json", limit: "500", ...params })}`;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Encoding": "gzip" } }).catch((e) => ({ _err: e }));
    if (res._err) { await sleep(PACE_MS); continue; }
    const json = await res.json().catch(() => null);
    if (json?.error?.code === "ratelimited") {
      console.warn(`  rate-limited, waiting ${RATELIMIT_WAIT_MS / 1000}s…`);
      await sleep(RATELIMIT_WAIT_MS);
      continue;
    }
    if (json?.error) throw new Error(`Cargo error: ${JSON.stringify(json.error)}`);
    await sleep(PACE_MS);
    return (json?.cargoquery ?? []).map((x) => x.title);
  }
  throw new Error("Cargo: giving up after retries");
}

const yearOf = (row, fallbackDate) =>
  Number(row[F.tourney.year]) || Number(String(fallbackDate ?? "").slice(0, 4)) || undefined;
const splitRoster = (s) => String(s ?? "").split(/[;,|]/).map((x) => x.trim()).filter(Boolean);

function awardType(achievement, tournament) {
  const a = String(achievement).toLowerCase();
  const t = String(tournament).toLowerCase();
  const intl = t.includes("world championship") || t.includes("worlds");
  const msi = t.includes("mid-season") || t.includes("msi");
  if (a.includes("finals mvp") || a.includes("final mvp")) {
    if (intl) return "worlds_mvp";
    if (msi) return "msi_mvp";
    return "finals_mvp";
  }
  if (a.includes("mvp")) {
    if (msi) return "msi_mvp";
    return "season_mvp";
  }
  if (a.includes("1st") && a.includes("all-pro")) return "all_pro_1";
  if (a.includes("2nd") && a.includes("all-pro")) return "all_pro_2";
  if (a.includes("3rd") && a.includes("all-pro")) return "all_pro_3";
  return null;
}

async function main() {
  const byId = Object.fromEntries(ROSTER.map(([id]) => [id, []]));
  const add = (id, ach) => { if (byId[id]) byId[id].push(ach); };
  const rosterNames = ROSTER.map(([, n]) => n);

  // Q1/Q2: international titles + runner-ups (one query each, all years).
  for (const [label, like, titleType, runnerType] of [
    ["Worlds", "%World Championship%", "worlds_title", "worlds_runnerup"],
    ["MSI", "%Mid-Season Invitational%", "msi_title", null],
  ]) {
    console.log(`Fetching ${label} results…`);
    const rows = await cargo({
      tables: `${F.results.table},${F.tourney.table}`,
      join_on: `${F.results.table}.${F.results.overview}=${F.tourney.table}.${F.tourney.overview}`,
      fields: `${F.results.roster}=roster,${F.results.place}=place,${F.tourney.name}=name,${F.tourney.year}=year`,
      where: `${F.tourney.table}.${F.tourney.name} LIKE "${like}" AND ${F.results.table}.${F.results.place} IN ("1","2")`,
    });
    if (DRY) console.log(JSON.stringify(rows.slice(0, 3), null, 2));
    for (const r of rows) {
      const type = r.place === "1" ? titleType : runnerType;
      if (!type) continue;
      const year = yearOf(r);
      for (const name of splitRoster(r.roster)) {
        const id = NAME_TO_ID.get(name.toLowerCase());
        if (id) add(id, { type, year, event: r.name });
      }
    }
  }

  // Q3: regional titles + runner-ups (primary domestic leagues).
  console.log("Fetching regional results…");
  const regRows = await cargo({
    tables: `${F.results.table},${F.tourney.table}`,
    join_on: `${F.results.table}.${F.results.overview}=${F.tourney.table}.${F.tourney.overview}`,
    fields: `${F.results.roster}=roster,${F.results.place}=place,${F.tourney.name}=name,${F.tourney.year}=year,${F.tourney.level}=level`,
    where: `${F.tourney.table}.${F.tourney.league} IN (${quoteList(REGIONAL_LEAGUES)}) AND ${F.results.table}.${F.results.place} IN ("1","2") AND ${F.tourney.table}.${F.tourney.level}="Primary"`,
  });
  if (DRY) console.log(JSON.stringify(regRows.slice(0, 3), null, 2));
  for (const r of regRows) {
    const type = r.place === "1" ? "regional_title" : "regional_runnerup";
    const year = yearOf(r);
    for (const name of splitRoster(r.roster)) {
      const id = NAME_TO_ID.get(name.toLowerCase());
      if (id) add(id, { type, year, event: r.name });
    }
  }

  // Q4: individual awards (MVP / All-Pro), batched over the roster.
  console.log("Fetching individual achievements…");
  const awardRows = await cargo({
    tables: F.awards.table,
    fields: `${F.awards.player}=player,${F.awards.achievement}=achievement,${F.awards.tournament}=tournament,${F.awards.date}=date`,
    where: `${F.awards.table}.${F.awards.player} IN (${quoteList(rosterNames)})`,
  });
  if (DRY) console.log(JSON.stringify(awardRows.slice(0, 5), null, 2));
  for (const r of awardRows) {
    const id = NAME_TO_ID.get(String(r.player).toLowerCase());
    const type = awardType(r.achievement, r.tournament);
    if (id && type) add(id, { type, year: yearOf(r, r.date), event: r.tournament });
  }

  const counts = Object.entries(byId).map(([id, a]) => `${id}:${a.length}`).join("  ");
  console.log(`\nHonors per player → ${counts}`);

  if (DRY) { console.log("\n[dry run] nothing written."); return; }
  await writeFile(OUT, JSON.stringify(byId, null, 2) + "\n");
  console.log(`\nWrote ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
