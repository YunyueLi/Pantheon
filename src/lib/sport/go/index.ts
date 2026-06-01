import type { HonorModel, Player, SportConfig } from "../types";
import { GO_PLAYERS } from "./data";
import { GO_MODEL, GO_LEAGUES, GO_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "go-seigen": "吴清源", "lee-chang-ho": "李昌镐", "lee-sedol": "李世石", "cho-hunhyun": "曹薰铉",
  "ke-jie": "柯洁", "gu-li": "古力", "shin-jinseo": "申真谞", "park-junghwan": "朴廷桓",
  "iyama-yuta": "井山裕太", "cho-chikun": "赵治勋", "kobayashi-koichi": "小林光一", "sakata-eio": "坂田荣男",
  "nie-weiping": "聂卫平", "ma-xiaochun": "马晓春", "chang-hao": "常昊", "kong-jie": "孔杰",
  "choi-cheol-han": "崔哲瀚", "fan-tingyu": "范廷钰", "mi-yuting": "芈昱廷", "tang-weixing": "唐韦星",
  "takemiya-masaki": "武宫正树", "rin-kaiho": "林海峰",
};

const STATURE: Record<string, number> = {
  "go-seigen": 100, "lee-chang-ho": 99, "lee-sedol": 97, "cho-hunhyun": 95, "ke-jie": 92,
  "shin-jinseo": 90, "gu-li": 88, "cho-chikun": 86, "park-junghwan": 84, "sakata-eio": 83,
  "iyama-yuta": 80, "kobayashi-koichi": 79, "rin-kaiho": 78, "nie-weiping": 78, "ma-xiaochun": 77,
  "chang-hao": 76, "takemiya-masaki": 75, "choi-cheol-han": 71, "kong-jie": 70, "tang-weixing": 69,
  "mi-yuting": 68, "fan-tingyu": 66,
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
