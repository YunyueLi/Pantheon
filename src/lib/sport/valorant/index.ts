import type { HonorModel, Player, SportConfig } from "../types";
import { VALORANT_PLAYERS } from "./data";
import { VALORANT_MODEL, VALORANT_LEAGUES, VALORANT_POSITIONS } from "./model";

const STATURE: Record<string, number> = {
  "aspas": 97, "tenz": 94, "demon1": 88, "derke": 87, "chronicle": 86, "alfajer": 85, "less": 84,
  "cned": 83, "sacy": 83, "nats": 81, "yay": 82, "boaster": 80, "leo": 82, "zekken": 80, "f0rsaken": 80,
  "t3xture": 79, "jinggg": 78, "pancada": 78, "saadhak": 80, "something": 77, "stax": 72, "buzz": 71,
  "mako": 71, "scream": 70,
};

const players: Player[] = VALORANT_PLAYERS.map((p) => ({
  ...p,
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const VALORANT: SportConfig = {
  id: "valorant",
  label: "VALORANT",
  basePath: "/valorant",
  leagues: VALORANT_LEAGUES,
  positions: VALORANT_POSITIONS,
  headlineTypes: ["champions_title", "masters_title", "champions_mvp"],
  model: VALORANT_MODEL as HonorModel,
  players,
};
