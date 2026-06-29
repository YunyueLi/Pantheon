import type { HonorModel, Player, SportConfig } from "../types";
import { TENNIS_PLAYERS } from "./data";
import { TENNIS_MODEL, TENNIS_LEAGUES, TENNIS_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "novak-djokovic": "诺瓦克·德约科维奇", "rafael-nadal": "拉斐尔·纳达尔", "roger-federer": "罗杰·费德勒",
  "pete-sampras": "皮特·桑普拉斯", "rod-laver": "罗德·拉沃", "bjorn-borg": "比约恩·博格",
  "jimmy-connors": "吉米·康纳斯", "ivan-lendl": "伊万·伦德尔", "andre-agassi": "安德烈·阿加西",
  "john-mcenroe": "约翰·麦肯罗", "mats-wilander": "马茨·维兰德", "john-newcombe": "约翰·纽科姆",
  "ken-rosewall": "肯·罗斯维尔", "boris-becker": "鲍里斯·贝克尔", "stefan-edberg": "斯特凡·埃德伯格",
  "carlos-alcaraz": "卡洛斯·阿尔卡拉斯", "jannik-sinner": "扬尼克·辛纳", "jim-courier": "吉姆·考瑞尔",
  "andy-murray": "安迪·穆雷", "lleyton-hewitt": "莱顿·休伊特", "ilie-nastase": "伊利耶·纳斯塔塞",
  "margaret-court": "玛格丽特·考特", "serena-williams": "塞雷娜·威廉姆斯", "steffi-graf": "斯特菲·格拉芙",
  "helen-wills": "海伦·威尔斯", "martina-navratilova": "玛蒂娜·纳芙拉蒂洛娃", "chris-evert": "克里斯·埃弗特",
  "billie-jean-king": "比莉·简·金", "monica-seles": "莫妮卡·塞莱斯", "evonne-goolagong": "伊冯·古拉贡",
  "venus-williams": "维纳斯·威廉姆斯", "justine-henin": "贾斯汀·海宁", "iga-swiatek": "伊加·斯瓦泰克",
  "maria-sharapova": "玛丽亚·莎拉波娃", "martina-hingis": "玛蒂娜·辛吉斯", "lindsay-davenport": "林赛·达文波特",
  "naomi-osaka": "大坂直美", "aryna-sabalenka": "阿丽娜·萨巴伦卡", "ashleigh-barty": "阿什利·巴蒂",
  "kim-clijsters": "金·克里斯特尔斯", "coco-gauff": "可可·高芙",
};

// Base stature (0-100): consensus all-time standing, before era adjustment.
const STATURE: Record<string, number> = {
  "novak-djokovic": 99, "roger-federer": 99, "rafael-nadal": 98, "rod-laver": 95, "pete-sampras": 92,
  "bjorn-borg": 92, "john-mcenroe": 88, "andre-agassi": 87, "carlos-alcaraz": 87, "ivan-lendl": 86,
  "jimmy-connors": 86, "jannik-sinner": 84, "andy-murray": 83, "boris-becker": 82, "ken-rosewall": 80,
  "stefan-edberg": 80, "mats-wilander": 76, "john-newcombe": 75, "lleyton-hewitt": 72, "jim-courier": 70,
  "ilie-nastase": 70,
  "steffi-graf": 99, "serena-williams": 99, "martina-navratilova": 97, "chris-evert": 95, "margaret-court": 94,
  "billie-jean-king": 90, "helen-wills": 88, "iga-swiatek": 87, "maria-sharapova": 86, "justine-henin": 85,
  "venus-williams": 85, "monica-seles": 84, "naomi-osaka": 82, "aryna-sabalenka": 82, "martina-hingis": 80,
  "kim-clijsters": 79, "ashleigh-barty": 79, "coco-gauff": 80, "evonne-goolagong": 78, "lindsay-davenport": 76,
};

const players: Player[] = TENNIS_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const TENNIS: SportConfig = {
  id: "tennis",
  label: "Tennis",
  basePath: "/tennis",
  leagues: TENNIS_LEAGUES,
  positions: TENNIS_POSITIONS,
  roleNoun: "leaderboard.colGender",
  splitByPosition: true,
  headlineTypes: ["slam", "ye_no1", "finals"],
  model: TENNIS_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  statureSources: ["International Tennis Hall of Fame", "ATP / WTA all-time rankings"],
  dataSources: ["ATP / WTA official records", "International Tennis Hall of Fame", "Wikipedia / Wikidata"],
};
