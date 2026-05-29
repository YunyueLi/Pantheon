import type { Player, Region } from "./types";
import { PLAYERS } from "./data";
import { honorScore } from "./honor";

export type Team = {
  id: string;
  name: string;
  region: Region;
  /** Former names / aliases used to resolve the messy team strings on player honors. */
  aka?: string[];
  worlds: number[]; // years won the World Championship
  msi: number[]; // years won MSI
  worldsRunnerup?: number[]; // years as Worlds finalist
};

// International hardware per org (Worlds + MSI title years), verified via Wikipedia/Liquipedia.
export const TEAMS: Team[] = [
  { id: "t1", name: "T1", region: "LCK", aka: ["SKT", "SKT T1", "SK Telecom T1"], worlds: [2013, 2015, 2016, 2023, 2024, 2025], msi: [2016, 2017], worldsRunnerup: [2017, 2022] },
  { id: "geng", name: "Gen.G", region: "LCK", aka: ["Samsung", "Samsung White", "Samsung Galaxy", "KSV"], worlds: [2014, 2017], msi: [2024, 2025], worldsRunnerup: [2016] },
  { id: "dk", name: "Dplus KIA", region: "LCK", aka: ["DAMWON", "DAMWON Gaming", "DWG KIA", "DWG", "DK"], worlds: [2020], msi: [], worldsRunnerup: [2021] },
  { id: "drx", name: "DRX", region: "LCK", worlds: [2022], msi: [] },
  { id: "ig", name: "Invictus Gaming", region: "LPL", aka: ["IG"], worlds: [2018], msi: [] },
  { id: "fpx", name: "FunPlus Phoenix", region: "LPL", aka: ["FPX"], worlds: [2019], msi: [] },
  { id: "edg", name: "EDward Gaming", region: "LPL", aka: ["EDG"], worlds: [2021], msi: [2015] },
  { id: "rng", name: "Royal Never Give Up", region: "LPL", aka: ["RNG", "Royal Club"], worlds: [], msi: [2018, 2021, 2022], worldsRunnerup: [2013] },
  { id: "jdg", name: "JD Gaming", region: "LPL", aka: ["JDG"], worlds: [], msi: [2023] },
  { id: "blg", name: "Bilibili Gaming", region: "LPL", aka: ["BLG"], worlds: [], msi: [], worldsRunnerup: [2024] },
  { id: "g2", name: "G2 Esports", region: "LEC", aka: ["G2"], worlds: [], msi: [2019], worldsRunnerup: [2019] },
  { id: "fnatic", name: "Fnatic", region: "LEC", aka: ["FNC"], worlds: [2011], msi: [], worldsRunnerup: [2018] },
];

export function teamHonor(t: Team): number {
  return t.worlds.length * 1000 + t.msi.length * 300 + (t.worldsRunnerup?.length ?? 0) * 300;
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

/** Players who earned at least one honor with this org, strongest first. */
export function teamPlayers(team: Team): Player[] {
  return PLAYERS.filter((p) =>
    p.achievements.some((a) => teamIdFromName(a.team) === team.id) || teamIdFromName(p.team) === team.id
  ).sort((a, b) => honorScore(b) - honorScore(a));
}
