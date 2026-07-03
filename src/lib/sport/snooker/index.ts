import type { HonorModel, Player, SportConfig } from "../types";
import { SNOOKER_PLAYERS } from "./data";
import { SNOOKER_MODEL, SNOOKER_LEAGUES, SNOOKER_POSITIONS } from "./model";

const ZH_NAMES: Record<string, string> = {
  "ronnie-osullivan": "罗尼·奥沙利文", "stephen-hendry": "斯蒂芬·亨德利", "steve-davis": "史蒂夫·戴维斯",
  "ray-reardon": "雷·里尔登", "john-higgins": "约翰·希金斯", "mark-selby": "马克·塞尔比",
  "mark-williams": "马克·威廉姆斯", "john-spencer": "约翰·斯宾塞", "alex-higgins": "亚历克斯·希金斯",
  "judd-trump": "贾德·特朗普", "neil-robertson": "尼尔·罗伯逊", "cliff-thorburn": "克里夫·索本",
  "dennis-taylor": "丹尼斯·泰勒", "terry-griffiths": "特里·格里菲斯", "ken-doherty": "肯·多赫蒂",
  "peter-ebdon": "彼得·艾伯顿", "shaun-murphy": "肖恩·墨菲", "stuart-bingham": "斯图尔特·宾汉姆",
  "jimmy-white": "吉米·怀特",
};

// Base stature (0-100): consensus all-time standing, before era adjustment.
const STATURE: Record<string, number> = {
  "ronnie-osullivan": 99, "stephen-hendry": 97, "steve-davis": 94, "john-higgins": 90, "ray-reardon": 88,
  "mark-williams": 86, "judd-trump": 86, "mark-selby": 85, "neil-robertson": 83, "alex-higgins": 88,
  "john-spencer": 80, "cliff-thorburn": 78, "jimmy-white": 84, "dennis-taylor": 74, "terry-griffiths": 73,
  "shaun-murphy": 72, "ken-doherty": 70, "peter-ebdon": 69, "stuart-bingham": 66,
};

const players: Player[] = SNOOKER_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const SNOOKER: SportConfig = {
  id: "snooker",
  label: "Snooker",
  basePath: "/snooker",
  leagues: SNOOKER_LEAGUES,
  positions: SNOOKER_POSITIONS,
  headlineTypes: ["world_title", "triple_crown", "ranking_title"],
  model: SNOOKER_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  statureSources: ["World Snooker Tour records", "Wikipedia"],
  dataSources: ["World Snooker Tour records", "Wikipedia"],
};
