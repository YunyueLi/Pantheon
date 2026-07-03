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

// Order = display order in the switcher, grouped by family:
// ball-team · racing · racket/individual · combat · mind · esports.
export const SPORTS: SportConfig[] = [
  LOL,
  FOOTBALL, BASKETBALL, MLB, CRICKET,
  F1,
  TENNIS, GOLF, SNOOKER, TABLE_TENNIS,
  UFC,
  GO, CHESS,
  DOTA2, VALORANT, CSGO, HOK, MLBB,
].map(withStature);

export function getSport(id: SportId): SportConfig | undefined {
  return SPORTS.find((s) => s.id === id);
}

export function listSports(): SportConfig[] {
  return SPORTS;
}
