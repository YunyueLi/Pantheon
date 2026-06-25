import type { HonorModel, Player, SportConfig } from "../types";
import { F1_PLAYERS } from "./data";
import { F1_MODEL, F1_LEAGUES, F1_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "lewis-hamilton": "刘易斯·汉密尔顿", "michael-schumacher": "迈克尔·舒马赫",
  "juan-manuel-fangio": "胡安·曼努埃尔·范吉奥", "ayrton-senna": "艾尔顿·塞纳",
  "max-verstappen": "马克斯·维斯塔潘", "alain-prost": "阿兰·普罗斯特",
  "sebastian-vettel": "塞巴斯蒂安·维特尔", "jackie-stewart": "杰基·斯图尔特",
  "jim-clark": "吉姆·克拉克", "niki-lauda": "尼基·劳达", "nelson-piquet": "内尔森·皮奎特",
  "fernando-alonso": "费尔南多·阿隆索", "jack-brabham": "杰克·布拉巴姆", "stirling-moss": "斯特林·莫斯",
  "kimi-raikkonen": "基米·莱科宁", "nigel-mansell": "奈杰尔·曼塞尔", "emerson-fittipaldi": "埃莫森·菲蒂帕尔迪",
  "mika-hakkinen": "米卡·哈基宁", "charles-leclerc": "夏尔·勒克莱尔", "graham-hill": "格雷厄姆·希尔",
  "alberto-ascari": "阿尔贝托·阿斯卡里", "jenson-button": "简森·巴顿", "nico-rosberg": "尼科·罗斯伯格",
  "damon-hill": "达蒙·希尔", "jacques-villeneuve": "雅克·维伦纽夫", "james-hunt": "詹姆斯·亨特",
  "mario-andretti": "马里奥·安德烈蒂", "jody-scheckter": "乔迪·谢克特", "alan-jones": "阿兰·琼斯",
  "keke-rosberg": "凯克·罗斯伯格", "denny-hulme": "丹尼·休姆", "jochen-rindt": "约亨·林特",
  "giuseppe-farina": "朱塞佩·法里纳", "john-surtees": "约翰·苏蒂斯", "mike-hawthorn": "迈克·霍索恩",
  "phil-hill": "菲尔·希尔", "lando-norris": "兰多·诺里斯", "valtteri-bottas": "瓦尔特利·博塔斯",
  "rubens-barrichello": "鲁本斯·巴里切罗", "david-coulthard": "大卫·库尔特哈德", "carlos-reutemann": "卡洛斯·罗伊特曼",
  "felipe-massa": "费利佩·马萨", "george-russell": "乔治·拉塞尔", "gerhard-berger": "格哈德·贝格尔",
  "carlos-sainz": "卡洛斯·塞恩斯", "daniel-ricciardo": "丹尼尔·里卡多", "ronnie-peterson": "罗尼·彼得森",
  "mark-webber": "马克·韦伯", "sergio-perez": "塞尔吉奥·佩雷斯", "rene-arnoux": "勒内·阿尔努",
  "jacky-ickx": "杰基·伊克斯", "gilles-villeneuve": "吉尔·维伦纽夫", "juan-pablo-montoya": "胡安·巴勃罗·蒙托亚",
  "clay-regazzoni": "克莱·雷加佐尼", "riccardo-patrese": "里卡多·帕特雷塞", "jacques-laffite": "雅克·拉菲特",
  "oscar-piastri": "奥斯卡·皮亚斯特里", "tony-brooks": "托尼·布鲁克斯", "eddie-irvine": "埃迪·埃尔文",
  "jean-alesi": "让·阿莱西",
};

// Base stature (0-100): consensus all-time standing, before era adjustment.
const STATURE: Record<string, number> = {
  "lewis-hamilton": 99, "michael-schumacher": 99, "juan-manuel-fangio": 97, "ayrton-senna": 96,
  "max-verstappen": 94, "alain-prost": 94, "sebastian-vettel": 90, "jackie-stewart": 90, "jim-clark": 90,
  "niki-lauda": 89, "fernando-alonso": 88, "nelson-piquet": 87, "jack-brabham": 84, "stirling-moss": 84,
  "kimi-raikkonen": 82, "nigel-mansell": 82, "alberto-ascari": 80, "emerson-fittipaldi": 80, "mika-hakkinen": 80,
  "graham-hill": 79, "charles-leclerc": 78, "mario-andretti": 75, "jenson-button": 75, "nico-rosberg": 74,
  "damon-hill": 73, "jacques-villeneuve": 72, "james-hunt": 71, "john-surtees": 67, "jody-scheckter": 68,
  "alan-jones": 67, "lando-norris": 67, "jochen-rindt": 66, "giuseppe-farina": 66, "valtteri-bottas": 66,
  "rubens-barrichello": 66, "keke-rosberg": 65, "david-coulthard": 65, "denny-hulme": 64, "carlos-reutemann": 64,
  "felipe-massa": 64, "gilles-villeneuve": 64, "gerhard-berger": 63, "ronnie-peterson": 63, "mike-hawthorn": 62,
  "george-russell": 62, "carlos-sainz": 62, "daniel-ricciardo": 62, "phil-hill": 61, "jacky-ickx": 60,
  "sergio-perez": 60, "juan-pablo-montoya": 60, "rene-arnoux": 58, "riccardo-patrese": 58, "oscar-piastri": 58,
  "clay-regazzoni": 56, "tony-brooks": 56, "jacques-laffite": 55, "eddie-irvine": 53, "jean-alesi": 53,
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
  dataUpdated: "2026-06",
  dataSources: ["FIA / Formula 1 official records", "Wikidata"],
};
