import type { HonorModel, Player, SportConfig } from "../types";
import { VALORANT_PLAYERS } from "./data";
import { VALORANT_MODEL, VALORANT_LEAGUES, VALORANT_POSITIONS } from "./model";

const STATURE: Record<string, number> = {
  "aspas": 97, "tenz": 94, "derke": 87, "zmjjkk": 87, "chronicle": 86, "alfajer": 85, "less": 84,
  "cned": 83, "sacy": 83, "leo": 82, "yay": 82, "nats": 81, "zekken": 81, "f0rsaken": 81, "boaster": 80,
  "saadhak": 80, "fns": 79, "t3xture": 79, "demon1": 88, "marved": 78, "shao": 78, "pancada": 78, "jinggg": 78,
  "something": 78, "victor": 75, "crashies": 76, "johnqt": 76, "suygetsu": 76, "redgar": 74, "zellsis": 74,
  "nobody": 74, "benjyfishy": 74, "ange1": 73, "ardiis": 72, "stax": 72, "chichoo": 72, "zyppan": 71, "buzz": 71,
  "mako": 71, "smoggy": 71, "scream": 70, "jamppi": 70, "d4v41": 70, "mazino": 70, "s1mon": 70, "asuna": 70,
  "boo": 70, "mindfreak": 69, "riens": 69, "sayf": 68, "miniboo": 68, "wo0t": 68, "xeppaa": 68, "valyn": 67,
  "benkai": 65, "haodong": 64, "purp0": 64, "kaajak": 64, "koldamenta": 64, "jonahp": 64, "cloud": 62,
  "mrfalin": 62, "runi": 62, "trexx": 62,
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
  dataUpdated: "2026-06",
  dataSources: ["Liquipedia (CC BY-SA)", "VCT official records", "Wikidata"],
};
