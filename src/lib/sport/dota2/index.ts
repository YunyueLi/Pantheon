import type { HonorModel, Player, SportConfig } from "../types";
import { DOTA2_PLAYERS } from "./data";
import { DOTA2_MODEL, DOTA2_LEAGUES, DOTA2_POSITIONS } from "./model";

// Esports gamer tags are universal — no per-locale name translation needed.
const STATURE: Record<string, number> = {
  "n0tail": 99, "puppey": 93, "miracle-": 92, "jerax": 92, "kuroky": 91, "ana": 91, "yatoro": 90,
  "topson": 90, "dendi": 89, "collapse": 88, "ceb": 88, "sumail": 87, "33": 86, "arteezy": 85,
  "burning": 85, "mira": 84, "miposhka": 84, "s4": 83, "nisha": 83, "gh": 82, "ame": 82,
  "torontotokyo": 82, "matumbaman": 81, "fy": 80, "faith_bian": 80, "ferrari_430": 80,
  "mind_control": 79, "fear": 79, "universe": 79, "larl": 79, "mushi": 78, "maybe": 78,
  "iceiceice": 78, "chuan": 77, "fly": 77, "ramzes666": 77, "hao": 76, "xiao8": 76, "solo": 75,
  "ppd": 75, "saksa": 75, "zai": 75, "midone": 74, "yapzor": 74, "aui_2000": 73, "noone": 73,
  "y": 73, "sylar": 72, "9pasha": 72, "fng": 72, "cr1t-": 72, "nothingtosay": 71, "xnova": 71,
  "iceice": 71, "resolut1on": 70, "xinq": 70, "sccc": 69,
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
  headlineTypes: ["ti_title", "ti_runner_up", "valve_major_title"],
  model: DOTA2_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  dataSources: ["Liquipedia (CC BY-SA)", "Valve DPC / The International records", "Wikidata"],
};
