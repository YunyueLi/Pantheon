import type { HonorModel, Player, SportConfig } from "../types";
import { GOLF_PLAYERS } from "./data";
import { GOLF_MODEL, GOLF_LEAGUES, GOLF_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "jack-nicklaus": "杰克·尼克劳斯", "tiger-woods": "老虎·伍兹", "walter-hagen": "沃尔特·哈根",
  "ben-hogan": "本·霍根", "gary-player": "加里·普莱尔", "tom-watson": "汤姆·沃森",
  "arnold-palmer": "阿诺德·帕尔默", "gene-sarazen": "吉恩·萨拉森", "sam-snead": "山姆·斯尼德",
  "bobby-jones": "鲍比·琼斯", "phil-mickelson": "菲尔·米克尔森", "nick-faldo": "尼克·法尔多",
  "seve-ballesteros": "塞维·巴列斯特罗斯", "rory-mcilroy": "罗里·麦克罗伊", "brooks-koepka": "布鲁克斯·科普卡",
  "scottie-scheffler": "斯科蒂·舍夫勒",
  "patty-berg": "帕蒂·伯格", "mickey-wright": "米基·赖特", "louise-suggs": "路易丝·萨格斯",
  "annika-sorenstam": "安妮卡·索伦斯坦", "babe-zaharias": "贝比·扎哈里亚斯", "betsy-rawls": "贝琪·罗尔斯",
  "juli-inkster": "朱莉·英克斯特", "karrie-webb": "凯莉·韦布", "inbee-park": "朴仁妃",
  "se-ri-pak": "朴世莉", "nancy-lopez": "南希·洛佩兹", "lorena-ochoa": "洛雷娜·奥乔亚",
  "yani-tseng": "曾雅妮", "nelly-korda": "内莉·科尔达",
};

// Base stature (0-100): consensus all-time standing, before era adjustment.
const STATURE: Record<string, number> = {
  "jack-nicklaus": 100, "tiger-woods": 99, "ben-hogan": 95, "sam-snead": 92, "bobby-jones": 92,
  "arnold-palmer": 92, "gary-player": 90, "walter-hagen": 89, "gene-sarazen": 87, "tom-watson": 88,
  "rory-mcilroy": 86, "phil-mickelson": 85, "nick-faldo": 82, "seve-ballesteros": 83, "scottie-scheffler": 84,
  "brooks-koepka": 78,
  "mickey-wright": 98, "annika-sorenstam": 97, "babe-zaharias": 93, "patty-berg": 92, "louise-suggs": 88,
  "nancy-lopez": 88, "inbee-park": 85, "karrie-webb": 84, "betsy-rawls": 82, "juli-inkster": 82,
  "lorena-ochoa": 83, "se-ri-pak": 80, "yani-tseng": 78, "nelly-korda": 78,
};

const players: Player[] = GOLF_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const GOLF: SportConfig = {
  id: "golf",
  label: "Golf",
  basePath: "/golf",
  leagues: GOLF_LEAGUES,
  positions: GOLF_POSITIONS,
  roleNoun: "leaderboard.colGender",
  splitByPosition: true,
  headlineTypes: ["major", "poy", "tour_win"],
  model: GOLF_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  statureSources: ["World Golf Hall of Fame", "PGA / LPGA Tour all-time rankings"],
  dataSources: ["PGA/LPGA Tour records", "Wikipedia"],
};
