import type { HonorModel, Player, SportConfig } from "../types";
import { CHESS_PLAYERS } from "./data";
import { CHESS_MODEL, CHESS_LEAGUES, CHESS_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "garry-kasparov": "加里·卡斯帕罗夫", "magnus-carlsen": "马格努斯·卡尔森", "anatoly-karpov": "阿纳托利·卡尔波夫",
  "bobby-fischer": "鲍比·菲舍尔", "emanuel-lasker": "埃马努埃尔·拉斯克", "jose-raul-capablanca": "何塞·劳尔·卡帕布兰卡",
  "alexander-alekhine": "亚历山大·阿廖欣", "mikhail-botvinnik": "米哈伊尔·博特温尼克", "vladimir-kramnik": "弗拉基米尔·克拉姆尼克",
  "viswanathan-anand": "维斯瓦纳坦·阿南德", "tigran-petrosian": "提格兰·彼得罗相", "boris-spassky": "鲍里斯·斯帕斯基",
  "mikhail-tal": "米哈伊尔·塔尔", "vasily-smyslov": "瓦西里·斯梅斯洛夫", "max-euwe": "马克斯·尤伟",
  "wilhelm-steinitz": "威廉·斯坦尼茨", "paul-morphy": "保罗·莫菲", "viktor-korchnoi": "维克托·科尔奇诺伊",
  "fabiano-caruana": "法比亚诺·卡鲁阿纳", "ding-liren": "丁立人", "hikaru-nakamura": "中村光",
  "judit-polgar": "尤迪特·波尔加",
  "veselin-topalov": "韦塞林·托帕洛夫", "ian-nepomniachtchi": "伊恩·涅波姆尼亚奇",
  "gukesh-dommaraju": "古克什·多马拉朱", "david-bronstein": "大卫·布龙施泰因",
};

// Base stature (0-100): consensus all-time standing, before era adjustment.
const STATURE: Record<string, number> = {
  "garry-kasparov": 99, "magnus-carlsen": 99, "bobby-fischer": 97, "anatoly-karpov": 95,
  "jose-raul-capablanca": 94, "emanuel-lasker": 93, "mikhail-botvinnik": 90, "mikhail-tal": 90,
  "alexander-alekhine": 92, "viswanathan-anand": 90, "vladimir-kramnik": 89, "tigran-petrosian": 86,
  "boris-spassky": 85, "vasily-smyslov": 84, "paul-morphy": 88, "wilhelm-steinitz": 85,
  "judit-polgar": 83, "max-euwe": 78, "viktor-korchnoi": 82, "fabiano-caruana": 80,
  "ding-liren": 78, "hikaru-nakamura": 80,
  "veselin-topalov": 85, "david-bronstein": 84, "gukesh-dommaraju": 80, "ian-nepomniachtchi": 79,
};

const players: Player[] = CHESS_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const CHESS: SportConfig = {
  id: "chess",
  label: "Chess",
  basePath: "/chess",
  leagues: CHESS_LEAGUES,
  positions: CHESS_POSITIONS,
  headlineTypes: ["wc_title", "world_no1", "candidates"],
  model: CHESS_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  statureSources: ["World Chess Hall of Fame", "Comparison of top chess players (Wikipedia)"],
  dataSources: ["FIDE records", "Wikipedia"],
};
