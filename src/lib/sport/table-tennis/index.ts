import type { HonorModel, Player, SportConfig } from "../types";
import { TABLE_TENNIS_PLAYERS } from "./data";
import { TABLE_TENNIS_MODEL, TABLE_TENNIS_LEAGUES, TABLE_TENNIS_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "ma-long": "马龙", "fan-zhendong": "樊振东", "zhang-jike": "张继科", "wang-hao": "王皓",
  "wang-liqin": "王励勤", "ma-lin": "马琳", "kong-linghui": "孔令辉", "liu-guoliang": "刘国梁",
  "xu-xin": "许昕", "wang-chuqin": "王楚钦", "liang-jingkun": "梁靖崑", "lin-gaoyuan": "林高远",
  "jiang-jialiang": "江嘉良", "guo-yuehua": "郭跃华", "jan-ove-waldner": "瓦尔德内尔", "jorgen-persson": "佩尔森",
  "mikael-appelgren": "阿佩伊伦", "jean-philippe-gatien": "盖亭", "werner-schlager": "施拉格",
  "vladimir-samsonov": "萨姆索诺夫", "timo-boll": "波尔", "dimitrij-ovtcharov": "奥恰洛夫",
  "zoran-primorac": "普里莫拉茨", "jorg-rosskopf": "罗斯科普夫", "ryu-seung-min": "柳承敏", "yoo-nam-kyu": "刘南奎",
  "kim-taek-soo": "金泽洙", "joo-sae-hyuk": "朱世赫", "chuang-chih-yuan": "庄智渊", "tomokazu-harimoto": "张本智和",
  "hugo-calderano": "卡尔德拉诺", "zhang-yining": "张怡宁", "deng-yaping": "邓亚萍", "wang-nan": "王楠",
  "ding-ning": "丁宁", "li-xiaoxia": "李晓霞", "chen-meng": "陈梦", "sun-yingsha": "孙颖莎",
  "liu-shiwen": "刘诗雯", "guo-yue": "郭跃", "wang-manyu": "王曼昱", "chen-xingtong": "陈幸同",
  "qiao-hong": "乔红", "li-ju": "李菊", "chen-jing": "陈静", "jiao-zhimin": "焦志敏",
  "geng-lijuan": "耿丽娟", "zhang-deying": "张德英", "hyun-jung-hwa": "玄静和", "mima-ito": "伊藤美诚",
  "kasumi-ishikawa": "石川佳纯", "miu-hirano": "平野美宇", "feng-tianwei": "冯天薇", "tie-yana": "帖雅娜",
  "gao-jun": "高军",
};

const STATURE: Record<string, number> = {
  "ma-long": 100, "zhang-yining": 97, "deng-yaping": 96, "jan-ove-waldner": 93, "wang-nan": 92,
  "zhang-jike": 90, "fan-zhendong": 89, "ding-ning": 88, "li-xiaoxia": 86, "kong-linghui": 85,
  "liu-guoliang": 84, "chen-meng": 84, "wang-liqin": 83, "ma-lin": 83, "sun-yingsha": 83, "wang-hao": 80,
  "liu-shiwen": 79, "xu-xin": 78, "wang-chuqin": 78, "timo-boll": 77, "samsonov": 76, "vladimir-samsonov": 76,
  "guo-yuehua": 75, "jiang-jialiang": 74, "wang-manyu": 74, "qiao-hong": 74, "mima-ito": 74, "jean-philippe-gatien": 72,
  "dimitrij-ovtcharov": 72, "ryu-seung-min": 71, "hyun-jung-hwa": 71, "hugo-calderano": 71, "werner-schlager": 70,
  "mikael-appelgren": 70, "tomokazu-harimoto": 70, "zoran-primorac": 69, "yoo-nam-kyu": 69, "guo-yue": 68,
  "li-ju": 67, "chen-jing": 67, "chen-xingtong": 67, "miu-hirano": 67, "jorg-rosskopf": 66, "kasumi-ishikawa": 66,
  "chuang-chih-yuan": 66, "feng-tianwei": 66, "joo-sae-hyuk": 64, "kim-taek-soo": 62, "liang-jingkun": 60,
  "jiao-zhimin": 60, "geng-lijuan": 60, "tie-yana": 60, "lin-gaoyuan": 59, "zhang-deying": 58, "gao-jun": 58,
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
  dataUpdated: "2026-07",
  dataSources: ["ITTF records", "Wikidata"],
};
