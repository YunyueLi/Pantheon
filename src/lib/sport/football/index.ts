import type { SportConfig } from "../types";
import { FOOTBALL_MODEL, FOOTBALL_LEAGUES, FOOTBALL_POSITIONS } from "./model";
import { FOOTBALL_PLAYERS } from "./data";

// Chinese display names for players (coaches carry their own i18n inline).
// The Latin `name` remains the fallback for every other locale.
const ZH_NAMES: Record<string, string> = {
  messi: "利昂内尔·梅西", "cristiano-ronaldo": "克里斯蒂亚诺·罗纳尔多", pele: "贝利",
  maradona: "迭戈·马拉多纳", "di-stefano": "阿尔弗雷多·迪斯蒂法诺", cruyff: "约翰·克鲁伊夫",
  beckenbauer: "弗朗茨·贝肯鲍尔", "ronaldo-r9": "罗纳尔多·纳扎里奥", zidane: "齐内丁·齐达内",
  ronaldinho: "罗纳尔迪尼奥", "van-basten": "马尔科·范巴斯滕", platini: "米歇尔·普拉蒂尼",
  xavi: "哈维·埃尔南德斯", iniesta: "安德烈斯·伊涅斯塔", modric: "卢卡·莫德里奇",
  maldini: "保罗·马尔蒂尼", cannavaro: "法比奥·卡纳瓦罗", buffon: "吉安路易吉·布冯",
  mbappe: "基利安·姆巴佩", henry: "蒂埃里·亨利",
  "fan-houtai": "范厚泰", "zhao-dongxu": "赵冬旭", "teng-shuai": "滕帅", "gao-chi": "高驰",
};

const players = FOOTBALL_PLAYERS.map((p) =>
  ZH_NAMES[p.id] ? { ...p, i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : p
);

export const FOOTBALL: SportConfig = {
  id: "football",
  label: "Football",
  basePath: "/football",
  leagues: FOOTBALL_LEAGUES,
  positions: FOOTBALL_POSITIONS,
  headlineTypes: ["world_cup", "champions_league", "ballon_dor"],
  model: FOOTBALL_MODEL,
  players,
};
