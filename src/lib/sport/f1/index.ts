import type { HonorModel, Player, SportConfig } from "../types";
import { F1_PLAYERS } from "./data";
import { F1_MODEL, F1_LEAGUES, F1_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "lewis-hamilton": "刘易斯·汉密尔顿", "michael-schumacher": "迈克尔·舒马赫",
  "juan-manuel-fangio": "胡安·曼努埃尔·范吉奥", "ayrton-senna": "艾尔顿·塞纳",
  "alain-prost": "阿兰·普罗斯特", "max-verstappen": "马克斯·维斯塔潘",
  "sebastian-vettel": "塞巴斯蒂安·维特尔", "niki-lauda": "尼基·劳达",
  "jackie-stewart": "杰基·斯图尔特", "jim-clark": "吉姆·克拉克",
  "fernando-alonso": "费尔南多·阿隆索", "nelson-piquet": "内尔森·皮奎特",
  "nigel-mansell": "奈杰尔·曼塞尔", "jack-brabham": "杰克·布拉巴姆",
  "stirling-moss": "斯特林·莫斯", "mika-hakkinen": "米卡·哈基宁",
  "emerson-fittipaldi": "埃莫森·菲蒂帕尔迪", "graham-hill": "格雷厄姆·希尔",
  "kimi-raikkonen": "基米·莱科宁", "damon-hill": "达蒙·希尔",
  "jenson-button": "简森·巴顿", "mario-andretti": "马里奥·安德烈蒂",
  "alberto-ascari": "阿尔贝托·阿斯卡里", "nico-rosberg": "尼科·罗斯伯格",
  "gilles-villeneuve": "吉尔·维伦纽夫",
};

// Base stature (0-100): consensus all-time standing, before the era-strength
// adjustment applied in the registry.
const STATURE: Record<string, number> = {
  "lewis-hamilton": 100, "michael-schumacher": 99, "juan-manuel-fangio": 98, "ayrton-senna": 98,
  "max-verstappen": 96, "alain-prost": 95, "jim-clark": 95, "niki-lauda": 93, "fernando-alonso": 93,
  "sebastian-vettel": 92, "jackie-stewart": 92, "stirling-moss": 90, "nelson-piquet": 88,
  "jack-brabham": 87, "mika-hakkinen": 87, "alberto-ascari": 86, "nigel-mansell": 86, "graham-hill": 85,
  "kimi-raikkonen": 85, "mario-andretti": 84, "emerson-fittipaldi": 84, "gilles-villeneuve": 80,
  "jenson-button": 80, "damon-hill": 78, "nico-rosberg": 76,
};

const players: Player[] = F1_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const F1: SportConfig = {
  id: "f1",
  label: "Formula 1",
  basePath: "/f1",
  leagues: F1_LEAGUES,
  positions: F1_POSITIONS,
  headlineTypes: ["wdc", "race_win", "podium"],
  model: F1_MODEL as HonorModel,
  players,
};
