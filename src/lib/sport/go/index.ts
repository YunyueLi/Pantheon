import type { HonorModel, Player, SportConfig } from "../types";
import { GO_PLAYERS } from "./data";
import { GO_MODEL, GO_LEAGUES, GO_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "go-seigen": "吴清源", "honinbo-shusaku": "本因坊秀策", "kitani-minoru": "木谷实",
  "fujisawa-hideyuki": "藤泽秀行", "sakata-eio": "坂田荣男", "rin-kaiho": "林海峰",
  "takemiya-masaki": "武宫正树", "otake-hideo": "大竹英雄", "kato-masao": "加藤正夫",
  "kobayashi-koichi": "小林光一", "cho-chikun": "赵治勋", "cho-u": "张栩",
  "iyama-yuta": "井山裕太", "ichiriki-ryo": "一力辽", "cho-hunhyun": "曹薰铉",
  "yoo-changhyuk": "刘昌赫", "lee-chang-ho": "李昌镐", "lee-sedol": "李世石",
  "choi-cheol-han": "崔哲瀚", "park-junghwan": "朴廷桓", "shin-jinseo": "申真谞",
  "byun-sang-il": "卞相壹", "choi-jeong": "崔精", "nie-weiping": "聂卫平",
  "ma-xiaochun": "马晓春", "chang-hao": "常昊", "kong-jie": "孔杰", "gu-li": "古力",
  "fan-tingyu": "范廷钰", "mi-yuting": "芈昱廷", "tang-weixing": "唐韦星",
  "gu-zihao": "辜梓豪", "ke-jie": "柯洁", "ding-hao": "丁浩",
  // ---- added 2026-06 ----
  "yoda-norimoto": "依田纪基", "o-meien": "王铭琬", "yamashita-keigo": "山下敬吾",
  "seo-bongsoo": "徐奉洙", "mok-jinseok": "睦镇硕", "won-seongjin": "元晟溱",
  "park-yeonghun": "朴永训", "kang-dongyun": "姜东润", "kim-jiseok": "金志锡",
  "shin-minjun": "申旻埈", "luo-xihe": "罗洗河", "chen-yaoye": "陈耀烨",
  "shi-yue": "时越", "zhou-ruiyang": "周睿羊", "jiang-weijie": "江维杰",
  "tuo-jiaxi": "柁嘉熹", "tan-xiao": "檀啸", "yang-dingxin": "杨鼎新",
  "li-xuanhao": "李轩豪", "wang-xinghao": "王星昊",
};

const STATURE: Record<string, number> = {
  "go-seigen": 100, "lee-chang-ho": 99, "lee-sedol": 96, "ke-jie": 93, "honinbo-shusaku": 92,
  "cho-hunhyun": 90, "shin-jinseo": 90, "cho-chikun": 88, "gu-li": 86, "kitani-minoru": 84,
  "sakata-eio": 82, "park-junghwan": 82, "iyama-yuta": 81, "rin-kaiho": 80,
  "yoo-changhyuk": 79, "kobayashi-koichi": 79, "nie-weiping": 78, "takemiya-masaki": 78,
  "chang-hao": 76, "fujisawa-hideyuki": 76, "ma-xiaochun": 74, "ding-hao": 73, "yamashita-keigo": 72,
  "otake-hideo": 72, "kato-masao": 71, "chen-yaoye": 71, "cho-u": 70, "ichiriki-ryo": 70,
  "yoda-norimoto": 68, "choi-cheol-han": 68, "kong-jie": 68, "seo-bongsoo": 67, "gu-zihao": 67,
  "byun-sang-il": 67, "kang-dongyun": 66, "park-yeonghun": 66, "tang-weixing": 66, "choi-jeong": 64,
  "o-meien": 63, "fan-tingyu": 63, "won-seongjin": 62, "li-xuanhao": 62, "mi-yuting": 62,
  "yang-dingxin": 61, "jiang-weijie": 61, "zhou-ruiyang": 61, "shi-yue": 61, "tuo-jiaxi": 60,
  "tan-xiao": 60, "luo-xihe": 60, "shin-minjun": 60, "kim-jiseok": 59, "wang-xinghao": 58,
  "mok-jinseok": 55,
};

const players: Player[] = GO_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const GO: SportConfig = {
  id: "go",
  label: "Go",
  basePath: "/go",
  leagues: GO_LEAGUES,
  positions: GO_POSITIONS,
  headlineTypes: ["world_title", "domestic_title"],
  model: GO_MODEL as HonorModel,
  players,
};
