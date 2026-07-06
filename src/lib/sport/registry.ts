import type { SportConfig, SportId } from "./types";
import { withEraStature } from "./stature";
import { LOL } from "./lol";
import { FOOTBALL } from "./football";
import { BASKETBALL } from "./basketball";
import { F1 } from "./f1";
import { TABLE_TENNIS } from "./table-tennis";
import { GO } from "./go";
import { DOTA2 } from "./dota2";
import { VALORANT } from "./valorant";
import { TENNIS } from "./tennis";
import { GOLF } from "./golf";
import { SNOOKER } from "./snooker";
import { CHESS } from "./chess";
import { UFC } from "./ufc";
import { MLB } from "./mlb";
import { CRICKET } from "./cricket";
import { CSGO } from "./csgo";
import { HOK } from "./hok";
import { MLBB } from "./mlbb";

/** Apply the era-strength → Stature engine to every sport, uniformly. */
function withStature(cfg: SportConfig): SportConfig {
  return { ...cfg, players: withEraStature(cfg.players, cfg.model) };
}

// Disciplines grouped by family, in display order. This single source drives BOTH
// the switcher's grouped dropdown (a hairline divider between families) and the flat
// SPORTS list used everywhere else (its .flat()). Traditional sport leads — team
// ball, motorsport, racket/precision, combat, mind — and the esports the hall grew
// from come last. The homepage's default "explore" target is LOL regardless of this
// order (see getDefaultSport), so it isn't tied to whatever sits at index 0.
const FAMILIES: SportConfig[][] = [
  [FOOTBALL, BASKETBALL, MLB, CRICKET], // team ball
  [F1], // motorsport
  [TENNIS, TABLE_TENNIS, GOLF, SNOOKER], // racket & precision
  [UFC], // combat
  [GO, CHESS], // mind
  [LOL, DOTA2, CSGO, VALORANT, HOK, MLBB], // esports
];

/** Sports grouped by family (display order) — powers the switcher's dividers. */
export const SPORT_GROUPS: SportConfig[][] = FAMILIES.map((g) => g.map(withStature));

/** Flat list in the same order; source of truth for lookups, ranking and the homepage. */
export const SPORTS: SportConfig[] = SPORT_GROUPS.flat();

/** Flagship / default landing discipline, independent of the display order above. */
export const DEFAULT_SPORT_ID: SportId = "lol";

export function getSport(id: SportId): SportConfig | undefined {
  return SPORTS.find((s) => s.id === id);
}

/** The flagship discipline the homepage / off-sport pages default to. */
export function getDefaultSport(): SportConfig {
  return getSport(DEFAULT_SPORT_ID) ?? SPORTS[0];
}

export function listSports(): SportConfig[] {
  return SPORTS;
}

/** Sports grouped by family, for the switcher's sectioned dropdown. */
export function listSportGroups(): SportConfig[][] {
  return SPORT_GROUPS;
}
