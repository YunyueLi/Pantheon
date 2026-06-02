import type { HonorModel, Player, SportConfig } from "../types";
import { TABLE_TENNIS_PLAYERS } from "./data";
import { TABLE_TENNIS_MODEL, TABLE_TENNIS_LEAGUES, TABLE_TENNIS_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "ma-long": "马龙", "zhang-yining": "张怡宁", "deng-yaping": "邓亚萍", "jan-ove-waldner": "瓦尔德内尔",
  "wang-nan": "王楠", "zhang-jike": "张继科", "fan-zhendong": "樊振东", "ding-ning": "丁宁",
  "li-xiaoxia": "李晓霞", "chen-meng": "陈梦", "kong-linghui": "孔令辉", "liu-guoliang": "刘国梁",
  "wang-liqin": "王励勤", "ma-lin": "马琳", "wang-hao": "王皓", "xu-xin": "许昕",
  "sun-yingsha": "孙颖莎", "wang-chuqin": "王楚钦", "liu-shiwen": "刘诗雯", "guo-yue": "郭跃",
  "timo-boll": "蒂姆·波尔", "werner-schlager": "维尔纳·施拉格", "ryu-seung-min": "柳承敏", "chen-jing": "陈静",
};

const STATURE: Record<string, number> = {
  "ma-long": 100, "zhang-yining": 97, "deng-yaping": 96, "jan-ove-waldner": 93, "wang-nan": 92,
  "zhang-jike": 90, "fan-zhendong": 89, "ding-ning": 88, "li-xiaoxia": 86, "kong-linghui": 85,
  "chen-meng": 84, "liu-guoliang": 84, "wang-liqin": 83, "ma-lin": 83, "sun-yingsha": 82,
  "wang-hao": 80, "liu-shiwen": 79, "xu-xin": 78, "wang-chuqin": 76, "timo-boll": 75,
  "ryu-seung-min": 71, "werner-schlager": 70, "guo-yue": 68, "chen-jing": 64,
};

const players: Player[] = TABLE_TENNIS_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const TABLE_TENNIS: SportConfig = {
  id: "table-tennis",
  label: "Table Tennis",
  basePath: "/table-tennis",
  leagues: TABLE_TENNIS_LEAGUES,
  positions: TABLE_TENNIS_POSITIONS,
  roleNoun: "leaderboard.colGender",
  splitByPosition: true,
  headlineTypes: ["olympic_singles_gold", "world_singles_gold", "world_cup_singles_gold"],
  model: TABLE_TENNIS_MODEL as HonorModel,
  players,
};
