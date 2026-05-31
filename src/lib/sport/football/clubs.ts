import type { Player } from "../types";
import { honorScore } from "../honor";
import { FOOTBALL_PLAYERS } from "./data";
import { FOOTBALL_MODEL } from "./model";

export type Confederation = "UEFA" | "CONMEBOL";

export type Club = {
  id: string;
  name: string;
  code: string;
  league: string;
  confederation: Confederation;
  /** Domestic top-flight league titles. */
  leagueTitles: number;
  /** European Cup / UEFA Champions League (UEFA clubs). */
  championsLeague: number;
  /** Copa Libertadores (CONMEBOL clubs). */
  libertadores: number;
  /** Intercontinental Cup (1960–2004) + FIFA Club World Cup (all editions, incl. the 2025 expanded one). */
  intercontinental: number;
  /** UEFA Cup / Europa League. */
  europa: number;
};

/**
 * Honors verified against club records as of the 2024-25 European season plus the
 * June–July 2025 expanded FIFA Club World Cup (won by Chelsea). The 2025-26 season
 * is intentionally excluded — its outcomes are too fresh and contested to assert.
 *
 * Disputed figures resolved to the officially-recognized count:
 *  - Juventus league = 36 (FIGC-official; the two Calciopoli titles, 2004-05 stripped
 *    and 2005-06 reassigned to Inter, are NOT counted — some partisans claim 38).
 *  - Inter league = 20 (incl. the retroactively-awarded 2005-06).
 *  - Bayern = 34 German championships (33 Bundesliga-era + 1932).
 *  - Arsenal = 13 English titles at the 2024-25 cutoff.
 * `intercontinental` folds the old Intercontinental Cup and every FIFA Club World Cup
 * into one cross-confederation count (e.g. Real Madrid = 3 Intercontinental + 5 CWC = 8).
 */
export const CLUBS: Club[] = [
  // ---- UEFA ----
  { id: "real-madrid", name: "Real Madrid", code: "RMA", league: "LALIGA", confederation: "UEFA", leagueTitles: 36, championsLeague: 15, libertadores: 0, intercontinental: 8, europa: 2 },
  { id: "barcelona", name: "Barcelona", code: "BAR", league: "LALIGA", confederation: "UEFA", leagueTitles: 28, championsLeague: 5, libertadores: 0, intercontinental: 3, europa: 0 },
  { id: "atletico-madrid", name: "Atlético Madrid", code: "ATM", league: "LALIGA", confederation: "UEFA", leagueTitles: 11, championsLeague: 0, libertadores: 0, intercontinental: 1, europa: 3 },
  { id: "bayern", name: "Bayern Munich", code: "BAY", league: "BUNDESLIGA", confederation: "UEFA", leagueTitles: 34, championsLeague: 6, libertadores: 0, intercontinental: 4, europa: 1 },
  { id: "dortmund", name: "Borussia Dortmund", code: "BVB", league: "BUNDESLIGA", confederation: "UEFA", leagueTitles: 8, championsLeague: 1, libertadores: 0, intercontinental: 1, europa: 0 },
  { id: "ac-milan", name: "AC Milan", code: "MIL", league: "SERIEA", confederation: "UEFA", leagueTitles: 19, championsLeague: 7, libertadores: 0, intercontinental: 4, europa: 0 },
  { id: "inter", name: "Inter Milan", code: "INT", league: "SERIEA", confederation: "UEFA", leagueTitles: 20, championsLeague: 3, libertadores: 0, intercontinental: 3, europa: 3 },
  { id: "juventus", name: "Juventus", code: "JUV", league: "SERIEA", confederation: "UEFA", leagueTitles: 36, championsLeague: 2, libertadores: 0, intercontinental: 2, europa: 3 },
  { id: "liverpool", name: "Liverpool", code: "LIV", league: "PL", confederation: "UEFA", leagueTitles: 20, championsLeague: 6, libertadores: 0, intercontinental: 1, europa: 3 },
  { id: "man-united", name: "Manchester United", code: "MUN", league: "PL", confederation: "UEFA", leagueTitles: 20, championsLeague: 3, libertadores: 0, intercontinental: 2, europa: 1 },
  { id: "man-city", name: "Manchester City", code: "MCI", league: "PL", confederation: "UEFA", leagueTitles: 10, championsLeague: 1, libertadores: 0, intercontinental: 1, europa: 0 },
  { id: "arsenal", name: "Arsenal", code: "ARS", league: "PL", confederation: "UEFA", leagueTitles: 13, championsLeague: 0, libertadores: 0, intercontinental: 0, europa: 0 },
  { id: "chelsea", name: "Chelsea", code: "CHE", league: "PL", confederation: "UEFA", leagueTitles: 6, championsLeague: 2, libertadores: 0, intercontinental: 2, europa: 2 },
  { id: "benfica", name: "Benfica", code: "BEN", league: "PRIMEIRA", confederation: "UEFA", leagueTitles: 38, championsLeague: 2, libertadores: 0, intercontinental: 0, europa: 0 },
  { id: "porto", name: "Porto", code: "POR", league: "PRIMEIRA", confederation: "UEFA", leagueTitles: 31, championsLeague: 2, libertadores: 0, intercontinental: 2, europa: 2 },
  { id: "ajax", name: "Ajax", code: "AJA", league: "EREDIVISIE", confederation: "UEFA", leagueTitles: 36, championsLeague: 4, libertadores: 0, intercontinental: 2, europa: 1 },
  // ---- CONMEBOL ----
  { id: "boca-juniors", name: "Boca Juniors", code: "BOC", league: "SOUTHAM", confederation: "CONMEBOL", leagueTitles: 35, championsLeague: 0, libertadores: 6, intercontinental: 3, europa: 0 },
  { id: "independiente", name: "Independiente", code: "IND", league: "SOUTHAM", confederation: "CONMEBOL", leagueTitles: 16, championsLeague: 0, libertadores: 7, intercontinental: 2, europa: 0 },
  { id: "river-plate", name: "River Plate", code: "RIV", league: "SOUTHAM", confederation: "CONMEBOL", leagueTitles: 38, championsLeague: 0, libertadores: 4, intercontinental: 1, europa: 0 },
];

/**
 * Prestige weights. The European Cup / Champions League is the global club pinnacle and
 * is weighted far above the Copa Libertadores — treating them as equal is what wrongly
 * floated South American clubs to the top. League titles are scaled by league strength,
 * so a flood of titles in a weaker league cannot out-rank continental silverware.
 */
export const TROPHY_WEIGHT = {
  championsLeague: 100,
  libertadores: 42,
  intercontinental: 30,
  europa: 18,
  leagueTitle: 10,
} as const;

/** League-strength multiplier applied to domestic titles. Documented on the clubs page. */
export const LEAGUE_STRENGTH: Record<string, number> = {
  PL: 1,
  LALIGA: 1,
  SERIEA: 1,
  BUNDESLIGA: 1,
  LIGUE1: 0.85,
  PRIMEIRA: 0.55,
  EREDIVISIE: 0.55,
  SOUTHAM: 0.45,
};

export function clubHonor(c: Club): number {
  const w = TROPHY_WEIGHT;
  const leagueFactor = LEAGUE_STRENGTH[c.league] ?? 0.5;
  return (
    c.championsLeague * w.championsLeague +
    c.libertadores * w.libertadores +
    c.intercontinental * w.intercontinental +
    c.europa * w.europa +
    c.leagueTitles * w.leagueTitle * leagueFactor
  );
}

export function getClub(id: string): Club | undefined {
  return CLUBS.find((c) => c.id === id);
}

/** Global ranking. Pass a confederation to view (and re-rank within) one confederation. */
export function rankedClubs(confederation?: Confederation): { club: Club; honor: number; rank: number }[] {
  return CLUBS.filter((c) => !confederation || c.confederation === confederation)
    .map((club) => ({ club, honor: clubHonor(club) }))
    .sort((a, b) => b.honor - a.honor)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

const NAME_INDEX = CLUBS.map((c) => ({ id: c.id, needle: c.name.toLowerCase() }));

export function clubIdFromName(name?: string): string | undefined {
  if (!name) return undefined;
  const s = name.toLowerCase();
  return NAME_INDEX.find(({ needle }) => s.includes(needle))?.id;
}

export function clubPlayers(club: Club): Player[] {
  return FOOTBALL_PLAYERS.filter((p) => clubIdFromName(p.team) === club.id).sort(
    (a, b) => honorScore(b, FOOTBALL_MODEL) - honorScore(a, FOOTBALL_MODEL)
  );
}
