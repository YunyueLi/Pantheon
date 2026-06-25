import type { HonorModel, Player, SportConfig } from "../types";
import { BASKETBALL_PLAYERS } from "./data";
import { BASKETBALL_MODEL, BASKETBALL_LEAGUES, BASKETBALL_POSITIONS } from "./model";

// Chinese display names, keyed by player id.
const ZH_NAMES: Record<string, string> = {
  "michael-jordan": "迈克尔·乔丹", "lebron-james": "勒布朗·詹姆斯",
  "kareem-abdul-jabbar": "卡里姆·阿卜杜勒-贾巴尔", "bill-russell": "比尔·拉塞尔",
  "magic-johnson": "魔术师约翰逊", "larry-bird": "拉里·伯德", "wilt-chamberlain": "威尔特·张伯伦",
  "tim-duncan": "蒂姆·邓肯", "shaquille-oneal": "沙奎尔·奥尼尔", "kobe-bryant": "科比·布莱恩特",
  "stephen-curry": "斯蒂芬·库里", "hakeem-olajuwon": "哈基姆·奥拉朱旺",
  "oscar-robertson": "奥斯卡·罗伯特森", "jerry-west": "杰里·韦斯特", "kevin-durant": "凯文·杜兰特",
  "kevin-garnett": "凯文·加内特", "dirk-nowitzki": "德克·诺维茨基", "moses-malone": "摩西·马龙",
  "karl-malone": "卡尔·马龙", "david-robinson": "大卫·罗宾逊", "charles-barkley": "查尔斯·巴克利",
  "julius-erving": "朱利叶斯·欧文", "giannis-antetokounmpo": "扬尼斯·阿德托昆博",
  "nikola-jokic": "尼古拉·约基奇", "allen-iverson": "阿伦·艾弗森", "scottie-pippen": "斯科蒂·皮蓬",
  "patrick-ewing": "帕特里克·尤因", "john-stockton": "约翰·斯托克顿", "isiah-thomas": "以赛亚·托马斯",
  "dwyane-wade": "德维恩·韦德", "steve-nash": "史蒂夫·纳什", "elgin-baylor": "埃尔金·贝勒",
  "james-harden": "詹姆斯·哈登", "russell-westbrook": "拉塞尔·威斯布鲁克", "chris-paul": "克里斯·保罗",
  "damian-lillard": "达米安·利拉德", "kawhi-leonard": "科怀·伦纳德", "carmelo-anthony": "卡梅隆·安东尼",
  "anthony-davis": "安东尼·戴维斯", "ray-allen": "雷·阿伦", "paul-pierce": "保罗·皮尔斯", "jason-kidd": "贾森·基德",
  "gary-payton": "加里·佩顿", "reggie-miller": "雷吉·米勒", "dominique-wilkins": "多米尼克·威尔金斯",
  "clyde-drexler": "克莱德·德雷克斯勒", "dennis-rodman": "丹尼斯·罗德曼", "kevin-mchale": "凯文·麦克海尔",
  "robert-parish": "罗伯特·帕里什", "james-worthy": "詹姆斯·沃西", "bob-mcadoo": "鲍勃·麦卡杜",
  "rick-barry": "里克·巴里", "pete-maravich": "皮特·马拉维奇", "george-gervin": "乔治·格文",
  "dave-cowens": "戴夫·考恩斯", "wes-unseld": "韦斯·昂塞尔德", "bill-walton": "比尔·沃顿",
  "john-havlicek": "约翰·哈夫利切克", "willis-reed": "威利斯·里德", "earl-monroe": "厄尔·门罗",
  "dave-bing": "戴夫·宾", "elvin-hayes": "埃尔文·海斯", "nate-archibald": "内特·阿奇博尔德",
  "billy-cunningham": "比利·坎宁安", "dave-debusschere": "戴夫·德布斯切尔", "jerry-lucas": "杰里·卢卡斯",
  "hal-greer": "哈尔·格里尔", "sam-jones": "萨姆·琼斯", "lenny-wilkens": "伦尼·威尔肯斯",
  "nate-thurmond": "内特·瑟蒙德", "bob-pettit": "鲍勃·佩蒂特", "walt-frazier": "沃尔特·弗雷泽",
  "george-mikan": "乔治·麦肯", "bob-cousy": "鲍勃·库西", "bill-sharman": "比尔·沙曼",
  "paul-arizin": "保罗·阿里津", "dolph-schayes": "多尔夫·谢伊斯",
  "drazen-petrovic": "德拉任·彼得洛维奇", "arvydas-sabonis": "阿尔维达斯·萨博尼斯",
  "dejan-bodiroga": "德扬·博迪洛加", "sarunas-marciulionis": "萨鲁纳斯·马修利奥尼斯",
  "theodoros-papaloukas": "西奥多罗斯·帕帕卢卡斯", "dimitris-diamantidis": "迪米特里斯·迪亚曼蒂迪斯",
  "vassilis-spanoulis": "瓦西里斯·斯帕诺利斯", "juan-carlos-navarro": "胡安·卡洛斯·纳瓦罗",
  "manu-ginobili": "马努·吉诺比利", "luis-scola": "路易斯·斯科拉",
  "sarunas-jasikevicius": "萨鲁纳斯·亚西凯维丘斯", "predrag-stojakovic": "佩贾·斯托贾科维奇",
  "toni-kukoc": "托尼·库科奇", "vlade-divac": "弗拉德·迪瓦茨",
  "kresimir-cosic": "克雷希米尔·丘西奇", "drazen-dalipagic": "德拉任·达利帕吉奇",
  "pau-gasol": "保罗·加索尔", "marc-gasol": "马克·加索尔", "ricky-rubio": "里基·卢比奥",
};

// Stature / influence (0-100): all-time cultural standing, from consensus GOAT
// rankings (ESPN, The Athletic Top-100, etc.). SEPARATE from the trophy-based
// Honor Index — an optional ranking lens, not blended in.
const STATURE: Record<string, number> = {
  "michael-jordan": 100, "lebron-james": 99, "kareem-abdul-jabbar": 96, "magic-johnson": 93,
  "bill-russell": 92, "wilt-chamberlain": 91, "larry-bird": 91, "kobe-bryant": 90,
  "tim-duncan": 89, "shaquille-oneal": 89, "stephen-curry": 88, "hakeem-olajuwon": 84,
  "kevin-durant": 83, "oscar-robertson": 82, "jerry-west": 82, "julius-erving": 80,
  "giannis-antetokounmpo": 80, "nikola-jokic": 79, "dirk-nowitzki": 78, "dwyane-wade": 76,
  "charles-barkley": 76, "kevin-garnett": 76, "david-robinson": 75, "karl-malone": 75,
  "allen-iverson": 74, "moses-malone": 73, "scottie-pippen": 73, "isiah-thomas": 71,
  "elgin-baylor": 70, "john-stockton": 70, "patrick-ewing": 69, "steve-nash": 67,
  "john-havlicek": 76, "george-mikan": 78, "chris-paul": 74, "kawhi-leonard": 75, "jason-kidd": 72,
  "gary-payton": 72, "walt-frazier": 72, "clyde-drexler": 70, "bob-pettit": 70, "bob-cousy": 70,
  "james-harden": 72, "rick-barry": 68, "russell-westbrook": 68, "dennis-rodman": 68, "kevin-mchale": 68,
  "dominique-wilkins": 66, "pete-maravich": 66, "george-gervin": 66, "willis-reed": 66, "anthony-davis": 66,
  "ray-allen": 66, "james-worthy": 65, "paul-pierce": 67, "sam-jones": 64, "damian-lillard": 64,
  "reggie-miller": 64, "carmelo-anthony": 64, "elvin-hayes": 64, "bill-walton": 64, "robert-parish": 62,
  "wes-unseld": 62, "earl-monroe": 62, "dave-cowens": 60, "bob-mcadoo": 60, "nate-thurmond": 58,
  "nate-archibald": 58, "dave-bing": 56, "billy-cunningham": 56, "dave-debusschere": 56, "jerry-lucas": 56,
  "hal-greer": 56, "bill-sharman": 56, "paul-arizin": 56, "dolph-schayes": 56, "lenny-wilkens": 54,
  "manu-ginobili": 82, "arvydas-sabonis": 80, "drazen-petrovic": 78, "dejan-bodiroga": 70,
  "predrag-stojakovic": 64, "dimitris-diamantidis": 64, "vassilis-spanoulis": 64, "juan-carlos-navarro": 64,
  "sarunas-marciulionis": 64, "sarunas-jasikevicius": 62, "luis-scola": 60, "theodoros-papaloukas": 60,
  "pau-gasol": 82, "vlade-divac": 78, "toni-kukoc": 76, "kresimir-cosic": 70, "marc-gasol": 70,
  "drazen-dalipagic": 68, "ricky-rubio": 60,
};

const players: Player[] = BASKETBALL_PLAYERS.map((p) => ({
  ...p,
  ...(ZH_NAMES[p.id] ? { i18n: { ...p.i18n, zh: ZH_NAMES[p.id] } } : {}),
  ...(STATURE[p.id] != null ? { stature: STATURE[p.id] } : {}),
}));

export const BASKETBALL: SportConfig = {
  id: "basketball",
  label: "Basketball",
  basePath: "/basketball",
  leagues: BASKETBALL_LEAGUES,
  positions: BASKETBALL_POSITIONS,
  headlineTypes: ["nba_title", "mvp", "nba_finals_mvp"],
  model: BASKETBALL_MODEL as HonorModel,
  players,
  dataUpdated: "2026-06",
  dataSources: ["NBA official records", "Basketball-Reference", "Wikidata"],
};
