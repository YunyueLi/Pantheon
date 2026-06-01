import type { HonorModel, Player, SportConfig } from "../types";
import { DOTA2_PLAYERS } from "./data";
import { DOTA2_MODEL, DOTA2_LEAGUES, DOTA2_POSITIONS } from "./model";

// Esports gamer tags are universal — no per-locale name translation needed.
const STATURE: Record<string, number> = {
  "n0tail": 99, "puppey": 93, "miracle-": 92, "jerax": 92, "kuroky": 91, "ana": 91, "yatoro": 90,
  "topson": 90, "collapse": 88, "ceb": 88, "33": 86, "sumail": 86, "dendi": 84, "mira": 84,
  "miposhka": 84, "s4": 83, "nisha": 83, "gh": 82, "ame": 82, "matumbaman": 81, "faith_bian": 80,
  "maybe": 78, "arteezy": 76,
};

const players: Player[] = DOTA2_PLAYERS.map((p) => ({
  ...p,
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const DOTA2: SportConfig = {
  id: "dota2",
  label: "Dota 2",
  basePath: "/dota2",
  leagues: DOTA2_LEAGUES,
  positions: DOTA2_POSITIONS,
  headlineTypes: ["ti_title", "valve_major_title", "premier_title"],
  model: DOTA2_MODEL as HonorModel,
  players,
};
