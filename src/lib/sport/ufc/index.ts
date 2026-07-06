import type { HonorModel, Player, SportConfig } from "../types";
import { UFC_PLAYERS } from "./data";
import { UFC_MODEL, UFC_LEAGUES, UFC_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "jon-jones": "乔恩·琼斯", "georges-st-pierre": "乔治·圣皮埃尔", "anderson-silva": "安德森·席尔瓦",
  "khabib-nurmagomedov": "哈比布·努尔马戈梅多夫", "demetrious-johnson": "迪米特里厄斯·约翰逊",
  "kamaru-usman": "卡马鲁·乌斯曼", "israel-adesanya": "伊斯雷尔·阿德萨尼亚", "daniel-cormier": "丹尼尔·科米尔",
  "stipe-miocic": "斯蒂佩·米奥奇奇", "max-holloway": "马克斯·霍洛威", "alexander-volkanovski": "亚历山大·沃尔卡诺夫斯基",
  "conor-mcgregor": "康纳·麦格雷戈", "jose-aldo": "何塞·奥尔多", "henry-cejudo": "亨利·塞胡多",
  "tj-dillashaw": "TJ·迪拉肖", "dominick-cruz": "多米尼克·克鲁兹", "amanda-nunes": "阿曼达·努内斯",
  "valentina-shevchenko": "瓦伦蒂娜·舍甫琴科", "ronda-rousey": "隆达·鲁西", "charles-oliveira": "查尔斯·奥利维拉",
  "islam-makhachev": "伊斯拉姆·马哈切夫", "randy-couture": "兰迪·库图尔",
};

// Base stature (0-100): consensus all-time pound-for-pound standing, before era
// adjustment. One mixed scale across weight classes and genders — the women are
// rated against the same P4P yardstick as the men (Nunes as the female GOAT).
const STATURE: Record<string, number> = {
  "jon-jones": 99, "georges-st-pierre": 97, "anderson-silva": 96, "khabib-nurmagomedov": 94,
  "demetrious-johnson": 93, "amanda-nunes": 92, "islam-makhachev": 90, "jose-aldo": 88,
  "daniel-cormier": 88, "kamaru-usman": 86, "conor-mcgregor": 87, "stipe-miocic": 85,
  "israel-adesanya": 85, "alexander-volkanovski": 85, "henry-cejudo": 83, "valentina-shevchenko": 84,
  "dominick-cruz": 80, "randy-couture": 82, "max-holloway": 83, "tj-dillashaw": 76,
  "charles-oliveira": 81, "ronda-rousey": 82,
};

const players: Player[] = UFC_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const UFC: SportConfig = {
  id: "ufc",
  label: "UFC",
  basePath: "/ufc",
  leagues: UFC_LEAGUES,
  positions: UFC_POSITIONS,
  headlineTypes: ["ufc_title", "title_defense", "double_champ"],
  model: UFC_MODEL as HonorModel,
  players,
  dataUpdated: "2026-07",
  statureSources: ["UFC pound-for-pound rankings", "ESPN / MMA all-time rankings"],
  dataSources: ["UFC official records", "Wikipedia"],
};
