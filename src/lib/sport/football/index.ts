import type { SportConfig } from "../types";
import { FOOTBALL_MODEL, FOOTBALL_LEAGUES, FOOTBALL_POSITIONS } from "./model";
import { FOOTBALL_PLAYERS } from "./data";

export const FOOTBALL: SportConfig = {
  id: "football",
  label: "Football",
  basePath: "/football",
  leagues: FOOTBALL_LEAGUES,
  positions: FOOTBALL_POSITIONS,
  headlineTypes: ["world_cup", "champions_league", "ballon_dor"],
  model: FOOTBALL_MODEL,
  players: FOOTBALL_PLAYERS,
};
