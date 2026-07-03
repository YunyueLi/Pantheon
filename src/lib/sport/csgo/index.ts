import type { HonorModel, Player, SportConfig } from "../types";
import { CSGO_PLAYERS } from "./data";
import { CSGO_MODEL, CSGO_LEAGUES, CSGO_POSITIONS } from "./model";

// CS players are universally known by their handle; the handle stands as the
// display name in every locale. Real names live in each player's blurb.
const ZH_NAMES: Record<string, string> = {
  "s1mple": "s1mple", "zywoo": "ZywOo", "device": "device", "coldzera": "coldzera", "niko": "NiKo",
  "dupreeh": "dupreeh", "getright": "GeT_RiGhT", "olofmeister": "olofmeister", "electronic": "electronic",
  "xyp9x": "Xyp9x", "magisk": "Magisk", "gla1ve": "gla1ve", "fallen": "FalleN", "fer": "fer",
  "kennys": "kennyS", "guardian": "GuardiaN", "nbk": "NBK-", "twistzz": "Twistzz", "rain": "rain",
  "ropz": "ropz", "sh1ro": "sh1ro", "m0nesy": "m0NESY", "b1t": "b1t", "elige": "EliGE",
};

// Base stature (0-100): consensus all-time standing, before era adjustment.
const STATURE: Record<string, number> = {
  "s1mple": 99, "zywoo": 98, "device": 96, "coldzera": 93, "niko": 92, "dupreeh": 90, "getright": 90,
  "fallen": 88, "olofmeister": 87, "gla1ve": 85, "m0nesy": 85, "xyp9x": 84, "ropz": 84, "magisk": 83,
  "electronic": 82, "kennys": 82, "sh1ro": 82, "guardian": 80, "twistzz": 80, "elige": 80, "fer": 79,
  "rain": 78, "b1t": 76, "nbk": 74,
};

const players: Player[] = CSGO_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const CSGO: SportConfig = {
  id: "csgo",
  label: "CS:GO",
  basePath: "/csgo",
  leagues: CSGO_LEAGUES,
  positions: CSGO_POSITIONS,
  headlineTypes: ["major", "hltv_top1", "major_mvp"],
  model: CSGO_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  statureSources: ["HLTV Top 20 Players of the Year", "HLTV / Liquipedia all-time coverage"],
  dataSources: ["HLTV", "Liquipedia", "Wikipedia"],
};
