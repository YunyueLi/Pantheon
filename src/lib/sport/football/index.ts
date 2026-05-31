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

// Stature / legacy (0-100): all-time standing sourced from authoritative rankings
// (IFFHS Century, World Soccer 100, FourFourTwo 100, France Football Dream Team,
// The Athletic). Separate from the trophy-based Honor Index — captures reputation
// and peak, so Maradona/Cruyff sit at the top regardless of trophy volume.
const STATURE: Record<string, number> = {
  messi: 100, pele: 99, maradona: 98, cruyff: 93, beckenbauer: 91, "di-stefano": 90,
  "cristiano-ronaldo": 90, "ronaldo-r9": 87, zidane: 84, platini: 82, puskas: 81,
  "george-best": 80, garrincha: 79, eusebio: 79, "van-basten": 78, "gerd-muller": 78,
  ronaldinho: 77, "bobby-charlton": 76, maldini: 76, zico: 74, baresi: 73, xavi: 73,
  romario: 72, iniesta: 71, "lev-yashin": 71, "roberto-baggio": 68, matthaus: 67,
  "carlos-alberto-torres": 66, socrates: 64, gullit: 64, buffon: 64, pirlo: 62, henry: 62,
  zoff: 61, "gordon-banks": 60, "daniel-passarella": 59, "gaetano-scirea": 58,
  "kenny-dalglish": 58, cafu: 57, "bobby-moore": 57, neuer: 56, "paolo-rossi": 56,
  rijkaard: 55, bergkamp: 54, modric: 54, stoichkov: 53, "george-weah": 53, rivaldo: 52,
  "roberto-carlos": 52, "mario-kempes": 51, schmeichel: 51, "hugo-sanchez": 50,
  "denis-law": 49, batistuta: 48, kaka: 48, shevchenko: 47, figo: 47, "ronald-koeman": 46,
  "dani-alves": 45, "sergio-ramos": 45, lahm: 44, "karim-benzema": 44, "ryan-giggs": 43,
  "sergio-busquets": 43, casillas: 43, "robert-lewandowski": 42, neymar: 42, beckham: 41,
  "samuel-etoo": 41, totti: 40, "toni-kroos": 39, mbappe: 39, "lilian-thuram": 38,
  lampard: 37, gerrard: 37, "zlatan-ibrahimovic": 36, "wayne-rooney": 36, "luis-suarez": 35,
  seedorf: 34, "didier-drogba": 33, "kevin-de-bruyne": 33, marcelo: 32, "del-piero": 32,
  "arjen-robben": 31, "mohamed-salah": 31, "sergio-aguero": 30, "edwin-van-der-sar": 28,
  cannavaro: 27, "sepp-maier": 27, nedved: 24, raul: 24, vieira: 22, puyol: 22, nesta: 22,
  "roy-keane": 21, "rio-ferdinand": 20, "thiago-silva": 20, "van-dijk": 20, kahn: 20,
  scholes: 20, "alan-shearer": 18, "wesley-sneijder": 18, "juan-roman-riquelme": 18,
  deco: 18, "yaya-toure": 18, "petr-cech": 17, griezmann: 17, schweinsteiger: 17,
  "david-villa": 16, "fernando-torres": 16, "harry-kane": 16, klose: 16, "michael-owen": 16,
  "vinicius-junior": 15, "jude-bellingham": 14, rodri: 14, "erling-haaland": 13,
  "son-heung-min": 12, donnarumma: 11,
};

const players = FOOTBALL_PLAYERS.map((p) => {
  const zh = ZH_NAMES[p.id];
  const stature = STATURE[p.id];
  return {
    ...p,
    ...(zh ? { i18n: { ...p.i18n, zh } } : {}),
    ...(stature != null ? { stature } : {}),
  };
});

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
