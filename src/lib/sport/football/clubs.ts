import type { Player } from "../types";
import { honorScore } from "../honor";
import { FOOTBALL_PLAYERS } from "./data";
import { FOOTBALL_MODEL } from "./model";

export type Club = {
  id: string;
  name: string;
  code: string;
  league: string;
  /** Domestic top-flight league titles. */
  leagueTitles: number;
  /** Top continental club title: European Cup/Champions League, or Copa Libertadores. */
  continental: number;
  /** Intercontinental Cup + FIFA Club World Cup. */
  intercontinental: number;
};

// First-pass figures — UCL/European-Cup counts are high-confidence; domestic league
// totals are the commonly-cited figures and should be re-verified before production.
export const CLUBS: Club[] = [
  { id: "real-madrid", name: "Real Madrid", code: "RMA", league: "LALIGA", leagueTitles: 36, continental: 15, intercontinental: 8 },
  { id: "barcelona", name: "Barcelona", code: "BAR", league: "LALIGA", leagueTitles: 27, continental: 5, intercontinental: 3 },
  { id: "atletico-madrid", name: "Atlético Madrid", code: "ATM", league: "LALIGA", leagueTitles: 11, continental: 0, intercontinental: 1 },
  { id: "bayern", name: "Bayern Munich", code: "BAY", league: "BUNDESLIGA", leagueTitles: 33, continental: 6, intercontinental: 4 },
  { id: "dortmund", name: "Borussia Dortmund", code: "BVB", league: "BUNDESLIGA", leagueTitles: 8, continental: 1, intercontinental: 1 },
  { id: "ac-milan", name: "AC Milan", code: "MIL", league: "SERIEA", leagueTitles: 19, continental: 7, intercontinental: 7 },
  { id: "inter", name: "Inter Milan", code: "INT", league: "SERIEA", leagueTitles: 20, continental: 3, intercontinental: 3 },
  { id: "juventus", name: "Juventus", code: "JUV", league: "SERIEA", leagueTitles: 36, continental: 2, intercontinental: 2 },
  { id: "liverpool", name: "Liverpool", code: "LIV", league: "PL", leagueTitles: 19, continental: 6, intercontinental: 1 },
  { id: "man-united", name: "Manchester United", code: "MUN", league: "PL", leagueTitles: 20, continental: 3, intercontinental: 2 },
  { id: "man-city", name: "Manchester City", code: "MCI", league: "PL", leagueTitles: 10, continental: 1, intercontinental: 1 },
  { id: "arsenal", name: "Arsenal", code: "ARS", league: "PL", leagueTitles: 13, continental: 0, intercontinental: 0 },
  { id: "chelsea", name: "Chelsea", code: "CHE", league: "PL", leagueTitles: 6, continental: 2, intercontinental: 1 },
  { id: "benfica", name: "Benfica", code: "BEN", league: "PRIMEIRA", leagueTitles: 38, continental: 2, intercontinental: 0 },
  { id: "porto", name: "Porto", code: "POR", league: "PRIMEIRA", leagueTitles: 30, continental: 2, intercontinental: 2 },
  { id: "ajax", name: "Ajax", code: "AJA", league: "EREDIVISIE", leagueTitles: 36, continental: 4, intercontinental: 2 },
  { id: "boca-juniors", name: "Boca Juniors", code: "BOC", league: "SOUTHAM", leagueTitles: 35, continental: 6, intercontinental: 3 },
  { id: "river-plate", name: "River Plate", code: "RIV", league: "SOUTHAM", leagueTitles: 38, continental: 4, intercontinental: 1 },
];

export function clubHonor(c: Club): number {
  return c.continental * 500 + c.leagueTitles * 100 + c.intercontinental * 150;
}

export function getClub(id: string): Club | undefined {
  return CLUBS.find((c) => c.id === id);
}

export function rankedClubs(): { club: Club; honor: number; rank: number }[] {
  return CLUBS.map((club) => ({ club, honor: clubHonor(club) }))
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
