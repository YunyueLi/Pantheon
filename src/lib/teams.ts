import type { Player, Region } from "./types";
import { PLAYERS } from "./data";
import { honorScore } from "./sport/honor";
import { LOL } from "./sport/lol";

export type Team = {
  id: string;
  name: string;
  /** Short display code shown on the team chip/avatar (2–3 letters), e.g. "JDG", "FNC". */
  code: string;
  region: Region;
  /** Former names / aliases used to resolve the messy team strings on player honors. */
  aka?: string[];
  worlds: number[]; // years won the World Championship
  msi: number[]; // years won MSI
  firstStand?: number[]; // years won the First Stand tournament
  ewc?: number[]; // years won the Esports World Cup (LoL)
  worldsRunnerup?: number[]; // years as Worlds finalist
};

// International hardware per org (Worlds + MSI title years), verified via Wikipedia/Liquipedia.
export const TEAMS: Team[] = [
  { id: "t1", name: "T1", code: "T1", region: "LCK", aka: ["SKT", "SKT T1", "SK Telecom T1"], worlds: [2013, 2015, 2016, 2023, 2024, 2025], msi: [2016, 2017], ewc: [2024], worldsRunnerup: [2017, 2022] },
  { id: "geng", name: "Gen.G", code: "GEN", region: "LCK", aka: ["Samsung", "Samsung White", "Samsung Galaxy", "KSV"], worlds: [2014, 2017], msi: [2024, 2025], ewc: [2025], worldsRunnerup: [2016] },
  { id: "dk", name: "Dplus KIA", code: "DK", region: "LCK", aka: ["DAMWON", "DAMWON Gaming", "DWG KIA", "DWG", "DK"], worlds: [2020], msi: [], worldsRunnerup: [2021] },
  { id: "drx", name: "DRX", code: "DRX", region: "LCK", worlds: [2022], msi: [] },
  { id: "hle", name: "Hanwha Life Esports", code: "HLE", region: "LCK", aka: ["HLE", "Hanwha Life"], worlds: [], msi: [], firstStand: [2025] },
  { id: "ig", name: "Invictus Gaming", code: "IG", region: "LPL", aka: ["IG"], worlds: [2018], msi: [] },
  { id: "fpx", name: "FunPlus Phoenix", code: "FPX", region: "LPL", aka: ["FPX"], worlds: [2019], msi: [] },
  { id: "edg", name: "EDward Gaming", code: "EDG", region: "LPL", aka: ["EDG"], worlds: [2021], msi: [2015] },
  { id: "rng", name: "Royal Never Give Up", code: "RNG", region: "LPL", aka: ["RNG", "Royal Club"], worlds: [], msi: [2018, 2021, 2022], worldsRunnerup: [2013] },
  { id: "jdg", name: "JD Gaming", code: "JDG", region: "LPL", aka: ["JDG"], worlds: [], msi: [2023] },
  { id: "blg", name: "Bilibili Gaming", code: "BLG", region: "LPL", aka: ["BLG"], worlds: [], msi: [], firstStand: [2026], worldsRunnerup: [2024] },
  { id: "g2", name: "G2 Esports", code: "G2", region: "LEC", aka: ["G2"], worlds: [], msi: [2019], worldsRunnerup: [2019] },
  { id: "fnatic", name: "Fnatic", code: "FNC", region: "LEC", aka: ["FNC"], worlds: [2011], msi: [], worldsRunnerup: [2018] },
  { id: "tpa", name: "Taipei Assassins", code: "TPA", region: "PCS", aka: ["TPA"], worlds: [2012], msi: [] },
];

export function teamHonor(t: Team): number {
  return (
    t.worlds.length * 1000 +
    t.msi.length * 300 +
    (t.firstStand?.length ?? 0) * 200 +
    (t.ewc?.length ?? 0) * 250 +
    (t.worldsRunnerup?.length ?? 0) * 300
  );
}

export function getTeam(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function rankedTeams(): { team: Team; honor: number; rank: number }[] {
  return TEAMS.map((team) => ({ team, honor: teamHonor(team) }))
    .sort((a, b) => b.honor - a.honor)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

const NAME_INDEX: { id: string; needles: string[] }[] = TEAMS.map((t) => ({
  id: t.id,
  needles: [t.name, ...(t.aka ?? [])].map((s) => s.toLowerCase()),
}));

/** Resolve a (possibly messy, multi-org) team string to a team id, e.g. "DAMWON / DRX" → "dk". */
export function teamIdFromName(name?: string): string | undefined {
  if (!name) return undefined;
  const s = name.toLowerCase();
  for (const { id, needles } of NAME_INDEX) {
    if (needles.some((n) => s.includes(n))) return id;
  }
  return undefined;
}

// Honor by player id, scored via the sport-neutral engine + LoL model. LOL.players
// share ids with the legacy roster, so we can sort legacy Player records by it
// without coupling these two Player shapes at the type level.
const HONOR_BY_ID = new Map(LOL.players.map((p) => [p.id, honorScore(p, LOL.model)]));

/**
 * Players associated with this org, strongest first.
 * Retired players appear ONLY under their last team; active players also surface
 * on the orgs where they earned honors (an alumni view).
 */
export function teamPlayers(team: Team): Player[] {
  return PLAYERS.filter((p) =>
    p.active
      ? p.achievements.some((a) => teamIdFromName(a.team) === team.id) || teamIdFromName(p.team) === team.id
      : teamIdFromName(p.team) === team.id
  ).sort((a, b) => (HONOR_BY_ID.get(b.id) ?? 0) - (HONOR_BY_ID.get(a.id) ?? 0));
}
