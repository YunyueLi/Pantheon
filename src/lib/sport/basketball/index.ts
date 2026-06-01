import type { HonorModel, Player, SportConfig } from "../types";
import { BASKETBALL_PLAYERS } from "./data";
import { BASKETBALL_MODEL, BASKETBALL_LEAGUES, BASKETBALL_POSITIONS } from "./model";

// Chinese display names, keyed by player id.
const ZH_NAMES: Record<string, string> = {
  "michael-jordan": "迈克尔·乔丹", "lebron-james": "勒布朗·詹姆斯",
  "kareem-abdul-jabbar": "卡里姆·阿卜杜勒-贾巴尔", "bill-russell": "比尔·拉塞尔",
  "magic-johnson": "魔术师约翰逊", "larry-bird": "拉里·伯德", "wilt-chamberlain": "威尔特·张伯伦",
  "tim-duncan": "蒂姆·邓肯", "shaquille-oneal": "沙奎尔·奥尼尔", "kobe-bryant": "科比·布莱恩特",
  "stephen-curry": "斯蒂芬·库里", "hakeem-olajuwon": "哈基姆·奥拉朱旺",
  "oscar-robertson": "奥斯卡·罗伯特森", "jerry-west": "杰里·韦斯特", "kevin-durant": "凯文·杜兰特",
  "kevin-garnett": "凯文·加内特", "dirk-nowitzki": "德克·诺维茨基", "moses-malone": "摩西·马龙",
  "karl-malone": "卡尔·马龙", "david-robinson": "大卫·罗宾逊", "charles-barkley": "查尔斯·巴克利",
  "julius-erving": "朱利叶斯·欧文", "giannis-antetokounmpo": "扬尼斯·阿德托昆博",
  "nikola-jokic": "尼古拉·约基奇", "allen-iverson": "阿伦·艾弗森", "scottie-pippen": "斯科蒂·皮蓬",
  "patrick-ewing": "帕特里克·尤因", "john-stockton": "约翰·斯托克顿", "isiah-thomas": "以赛亚·托马斯",
  "dwyane-wade": "德维恩·韦德", "steve-nash": "史蒂夫·纳什", "elgin-baylor": "埃尔金·贝勒",
};

// Stature / influence (0-100): all-time cultural standing, from consensus GOAT
// rankings (ESPN, The Athletic Top-100, etc.). SEPARATE from the trophy-based
// Honor Index — an optional ranking lens, not blended in.
const STATURE: Record<string, number> = {
  "michael-jordan": 100, "lebron-james": 99, "kareem-abdul-jabbar": 96, "magic-johnson": 93,
  "bill-russell": 92, "wilt-chamberlain": 91, "larry-bird": 91, "kobe-bryant": 90,
  "tim-duncan": 89, "shaquille-oneal": 89, "stephen-curry": 88, "hakeem-olajuwon": 84,
  "kevin-durant": 83, "oscar-robertson": 82, "jerry-west": 82, "julius-erving": 80,
  "giannis-antetokounmpo": 80, "nikola-jokic": 79, "dirk-nowitzki": 78, "dwyane-wade": 76,
  "charles-barkley": 76, "kevin-garnett": 76, "david-robinson": 75, "karl-malone": 75,
  "allen-iverson": 74, "moses-malone": 73, "scottie-pippen": 73, "isiah-thomas": 71,
  "elgin-baylor": 70, "john-stockton": 70, "patrick-ewing": 69, "steve-nash": 67,
};

const players: Player[] = BASKETBALL_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const BASKETBALL: SportConfig = {
  id: "basketball",
  label: "Basketball",
  basePath: "/basketball",
  leagues: BASKETBALL_LEAGUES,
  positions: BASKETBALL_POSITIONS,
  headlineTypes: ["nba_title", "mvp", "nba_finals_mvp"],
  model: BASKETBALL_MODEL as HonorModel,
  players,
};
