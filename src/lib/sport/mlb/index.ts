import type { HonorModel, Player, SportConfig } from "../types";
import { MLB_PLAYERS } from "./data";
import { MLB_MODEL, MLB_LEAGUES, MLB_POSITIONS } from "./model";

// Chinese display names, keyed by player id.
const ZH_NAMES: Record<string, string> = {
  "babe-ruth": "贝比·鲁斯", "barry-bonds": "巴里·邦兹", "willie-mays": "威利·梅斯",
  "hank-aaron": "汉克·阿伦", "ted-williams": "泰德·威廉姆斯", "mickey-mantle": "米奇·曼特尔",
  "ty-cobb": "泰·柯布", "lou-gehrig": "卢·格里格", "stan-musial": "斯坦·穆西亚尔",
  "honus-wagner": "霍纳斯·瓦格纳", "joe-dimaggio": "乔·迪马乔", "ken-griffey-jr": "小肯·格里菲",
  "rickey-henderson": "里基·亨德森", "albert-pujols": "阿尔伯特·普霍尔斯", "mike-trout": "迈克·特劳特",
  "shohei-ohtani": "大谷翔平", "alex-rodriguez": "亚历克斯·罗德里格斯", "walter-johnson": "沃尔特·约翰逊",
  "cy-young": "赛·扬", "roger-clemens": "罗杰·克莱门斯", "greg-maddux": "格雷格·马达克斯",
  "randy-johnson": "兰迪·约翰逊", "pedro-martinez": "佩德罗·马丁内斯", "sandy-koufax": "桑迪·库法克斯",
};

// Stature / influence (0-100): all-time standing and cultural footprint, from
// consensus all-time rankings (Baseball-Reference JAWS/black-ink, Hall of Fame
// standing, ESPN / The Athletic all-time lists). SEPARATE from the award-based
// Honor Index — an optional lens, deliberately not blended in. This is where the
// pre-award legends (Cobb, Wagner, Cy Young, Walter Johnson) are credited for a
// greatness the MVP/Cy Young/All-Star timeline cannot capture.
const STATURE: Record<string, number> = {
  "babe-ruth": 100, "willie-mays": 98, "barry-bonds": 97, "ted-williams": 96, "hank-aaron": 96,
  "ty-cobb": 95, "honus-wagner": 94, "walter-johnson": 93, "stan-musial": 93, "lou-gehrig": 92,
  "cy-young": 92, "mickey-mantle": 92, "shohei-ohtani": 92, "sandy-koufax": 90, "joe-dimaggio": 90,
  "roger-clemens": 90, "mike-trout": 90, "albert-pujols": 90, "ken-griffey-jr": 89, "randy-johnson": 88,
  "greg-maddux": 88, "pedro-martinez": 88, "rickey-henderson": 88, "alex-rodriguez": 88,
};

const players: Player[] = MLB_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const MLB: SportConfig = {
  id: "mlb",
  label: "MLB",
  basePath: "/mlb",
  leagues: MLB_LEAGUES,
  positions: MLB_POSITIONS,
  headlineTypes: ["mvp", "stat_title", "ws_title"],
  model: MLB_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  statureSources: ["Baseball-Reference JAWS / all-time rankings", "National Baseball Hall of Fame"],
  dataSources: ["Baseball-Reference", "MLB records", "Wikipedia"],
};
