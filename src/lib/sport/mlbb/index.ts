import type { HonorModel, Player, SportConfig } from "../types";
import { MLBB_PLAYERS } from "./data";
import { MLBB_MODEL, MLBB_LEAGUES, MLBB_POSITIONS } from "./model";

// MLBB pro handles are stylized gamer tags rather than names, so most are kept as-is;
// a few render naturally into Chinese.
const ZH_NAMES: Record<string, string> = {
  "ohmyv33nus": "V33nus 女帝",
  "super-frince": "Super Frince",
  "oura": "Oura",
};

// Base stature (0-100): consensus all-time standing in the MLBB competitive scene,
// weighing world titles, dynasty impact, and cultural footprint.
const STATURE: Record<string, number> = {
  "kairi": 96, "karltzy": 96, "ohmyv33nus": 94, "wise": 92, "flaptzy": 91, "kelra": 90,
  "oheb": 89, "bennyqt": 88, "cw": 87, "kiboy": 86, "sanz": 84, "sanford": 84,
  "oura": 83, "ribo": 80, "lusty": 76, "kirk": 75, "k1ngkong": 74, "super-frince": 72,
};

const players: Player[] = MLBB_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const MLBB: SportConfig = {
  id: "mlbb",
  label: "Mobile Legends",
  basePath: "/mlbb",
  leagues: MLBB_LEAGUES,
  positions: MLBB_POSITIONS,
  headlineTypes: ["m_world", "mpl_title", "finals_mvp"],
  model: MLBB_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  statureSources: ["Liquipedia (Mobile Legends)", "ONE Esports all-time rankings"],
  dataSources: ["Liquipedia (Mobile Legends)"],
};
