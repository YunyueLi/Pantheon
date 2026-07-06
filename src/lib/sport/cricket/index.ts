import type { HonorModel, Player, SportConfig } from "../types";
import { CRICKET_PLAYERS } from "./data";
import { CRICKET_MODEL, CRICKET_LEAGUES, CRICKET_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "don-bradman": "唐·布拉德曼", "garfield-sobers": "加菲尔德·索伯斯", "sachin-tendulkar": "萨钦·坦度卡尔",
  "viv-richards": "维夫·理查兹", "shane-warne": "沙恩·沃恩", "muttiah-muralitharan": "穆蒂亚·穆拉利塔兰",
  "brian-lara": "布莱恩·拉拉", "jacques-kallis": "雅克·卡利斯", "ricky-ponting": "里基·庞廷",
  "virat-kohli": "维拉特·科利", "sunil-gavaskar": "苏尼尔·高瓦斯卡", "imran-khan": "伊姆兰·汗",
  "richard-hadlee": "理查德·哈德利", "wasim-akram": "瓦西姆·阿克拉姆", "glenn-mcgrath": "格伦·麦格拉思",
  "jack-hobbs": "杰克·霍布斯", "kumar-sangakkara": "库马尔·桑加卡拉", "rahul-dravid": "拉胡尔·德拉维德",
  "ab-de-villiers": "AB·德维利尔斯", "steve-smith": "史蒂夫·史密斯", "joe-root": "乔·鲁特",
  "kane-williamson": "凯恩·威廉姆森", "adam-gilchrist": "亚当·吉尔克里斯特", "malcolm-marshall": "马尔科姆·马歇尔",
  "kapil-dev": "卡皮尔·德夫", "ms-dhoni": "马亨德拉·辛格·多尼", "dennis-lillee": "丹尼斯·利利",
  "curtly-ambrose": "柯特利·安布罗斯", "allan-border": "艾伦·博德", "steve-waugh": "史蒂夫·沃",
  "anil-kumble": "阿尼尔·库姆布莱", "james-anderson": "詹姆斯·安德森", "wally-hammond": "沃利·哈蒙德",
  "len-hutton": "伦·赫顿", "clive-lloyd": "克莱夫·劳埃德", "sydney-barnes": "悉尼·巴恩斯",
  "dale-steyn": "戴尔·斯泰恩", "ben-stokes": "本·斯托克斯",
};

// Base stature (0-100): consensus all-time standing, before era adjustment.
const STATURE: Record<string, number> = {
  "don-bradman": 100, "garfield-sobers": 97, "sachin-tendulkar": 97, "viv-richards": 94, "shane-warne": 94,
  "muttiah-muralitharan": 92, "brian-lara": 93, "jacques-kallis": 91, "ricky-ponting": 90, "virat-kohli": 93,
  "sunil-gavaskar": 89, "imran-khan": 90, "richard-hadlee": 87, "wasim-akram": 90, "glenn-mcgrath": 88,
  "jack-hobbs": 90, "kumar-sangakkara": 89, "rahul-dravid": 88, "ab-de-villiers": 86, "steve-smith": 88,
  "joe-root": 86, "kane-williamson": 85, "adam-gilchrist": 87, "malcolm-marshall": 91,
  "wally-hammond": 89, "len-hutton": 88, "kapil-dev": 88, "ms-dhoni": 88, "dennis-lillee": 88,
  "allan-border": 87, "curtly-ambrose": 87, "steve-waugh": 87, "sydney-barnes": 87, "ben-stokes": 87,
  "dale-steyn": 87, "clive-lloyd": 86, "james-anderson": 86, "anil-kumble": 85,
};

const players: Player[] = CRICKET_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const CRICKET: SportConfig = {
  id: "cricket",
  label: "Cricket",
  basePath: "/cricket",
  leagues: CRICKET_LEAGUES,
  positions: CRICKET_POSITIONS,
  headlineTypes: ["wisden_leading", "icc_award", "wc_title"],
  model: CRICKET_MODEL as HonorModel,
  players,
  dataUpdated: "2026-07",
  statureSources: ["ESPNcricinfo all-time rankings", "Wisden Cricketers of the Century", "ICC Hall of Fame"],
  dataSources: ["Wisden", "ESPNcricinfo", "Wikipedia"],
};
