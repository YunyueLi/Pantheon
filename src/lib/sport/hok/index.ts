import type { HonorModel, Player, SportConfig } from "../types";
import { HOK_PLAYERS } from "./data";
import { HOK_MODEL, HOK_LEAGUES, HOK_POSITIONS } from "./model";

// These players are known by their in-game IDs; the map gives the Chinese ID / real
// name commonly used by the KPL community (real name first where widely known).
const ZH_NAMES: Record<string, string> = {
  "fly": "彭云飞 Fly", "cat": "陈正正 猫神", "alan": "王添龙 Alan", "huahai": "罗思源 花海",
  "qingrong": "黄垚钦 清融", "tanran": "孙麟威 坦然", "ziyang": "向阳 紫阳", "jiucheng": "曹智舜 久诚",
  "nuanyang": "林桓 暖阳", "laoshuai": "张宇晨 老帅", "yinuo": "徐必成 一诺", "zhongyi": "陈嘉豪 钟意",
  "changsheng": "谢承峻 长生", "xiaopang": "李达亨 小胖",
};

// Base stature (0-100): consensus all-time standing / cultural footprint in the KPL
// scene, kept separate from the trophy-based Honor Index.
const STATURE: Record<string, number> = {
  "fly": 96, "cat": 95, "huahai": 92, "yinuo": 91, "alan": 88, "jiucheng": 87, "zhongyi": 86,
  "changsheng": 83, "nuanyang": 80, "xiaopang": 80, "qingrong": 78, "tanran": 77, "laoshuai": 74,
  "ziyang": 73,
};

const players: Player[] = HOK_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const HOK: SportConfig = {
  id: "hok",
  label: "Honor of Kings",
  basePath: "/hok",
  leagues: HOK_LEAGUES,
  positions: HOK_POSITIONS,
  headlineTypes: ["world_champ", "kpl_title", "kpl_fmvp"],
  model: HOK_MODEL as HonorModel,
  players,
  dataUpdated: "2026-07",
  statureSources: ["KPL community consensus / player renown", "Liquipedia (Honor of Kings)"],
  dataSources: ["Liquipedia (Honor of Kings)", "KPL official records"],
};
