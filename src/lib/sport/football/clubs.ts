import type { Player } from "../types";
import { honorScore } from "../honor";
import { FOOTBALL_PLAYERS } from "./data";
import { FOOTBALL_MODEL } from "./model";

export type Confederation = "UEFA" | "CONMEBOL";

export type Club = {
  id: string;
  name: string;
  code: string;
  league: string;
  confederation: Confederation;
  /** Domestic top-flight league titles. */
  leagueTitles: number;
  /** European Cup / UEFA Champions League (UEFA clubs). */
  championsLeague: number;
  /** Copa Libertadores (CONMEBOL clubs). */
  libertadores: number;
  /** Intercontinental Cup (1960–2004) + FIFA Club World Cup (all editions through the June–July 2025 expanded one). */
  intercontinental: number;
  /** UEFA Cup / Europa League (NOT the old Inter-Cities Fairs Cup, NOT the Cup Winners' Cup). */
  europa: number;
};

/**
 * Every count below was verified club-by-club against English Wikipedia honours
 * sections (cross-checked against club/official sources) as of **1 August 2025** —
 * i.e. INCLUDING the 2024-25 European season and the June–July 2025 expanded FIFA
 * Club World Cup (won by Chelsea), and EXCLUDING the 2025-26 season. Wikipedia's
 * live infoboxes already carry several post-cutoff 2025-26 figures that are
 * deliberately NOT used here: Bayern "35" league, Inter "21", PSV "27", Arsenal
 * "14", Flamengo "8 league / 4 Libertadores", Estudiantes' 2025 title, etc.
 *
 * Contested figures resolved to the officially-recognized count:
 *  - Juventus league = 36 (FIGC-official; the 2004-05 title was stripped and 2005-06
 *    reassigned to Inter after Calciopoli — partisans claim 38).
 *  - Inter league = 20 (incl. the retroactively-awarded 2005-06; the 2023-24 was the 20th).
 *  - Bayern = 34 German championships (33 Bundesliga-era + 1932).
 *  - Marseille league = 9 (the stripped 1992-93 title is excluded; the 1993 European Cup stands).
 *  - Brazilian league counts use the CBF-unified national title (Taça Brasil 1959-68 +
 *    Torneio Roberto Gomes Pedrosa 1967-70 + Campeonato Brasileiro 1971–): Palmeiras 12,
 *    Santos 8, Corinthians/Flamengo 7, São Paulo 6, Cruzeiro 4, Internacional 3, Grêmio 2.
 *  - Uruguayan counts include the historically-recognized continuity (Peñarol 52 incl. 5
 *    CURCC; Nacional 49) — these huge weak-league tallies are scaled down by league strength.
 * `intercontinental` folds the old Intercontinental Cup and every FIFA Club World Cup
 * into one cross-confederation count (e.g. Real Madrid = 3 Intercontinental + 5 CWC = 8;
 * Corinthians = 0 + 2 CWC = 2; Boca = 3 + 0 = 3).
 */
export const CLUBS: Club[] = [
  // ---- UEFA · Spain ----
  { id: "real-madrid", name: "Real Madrid", code: "RMA", league: "LALIGA", confederation: "UEFA", leagueTitles: 36, championsLeague: 15, libertadores: 0, intercontinental: 8, europa: 2 },
  { id: "barcelona", name: "Barcelona", code: "BAR", league: "LALIGA", confederation: "UEFA", leagueTitles: 28, championsLeague: 5, libertadores: 0, intercontinental: 3, europa: 0 },
  { id: "atletico-madrid", name: "Atlético Madrid", code: "ATM", league: "LALIGA", confederation: "UEFA", leagueTitles: 11, championsLeague: 0, libertadores: 0, intercontinental: 1, europa: 3 },
  { id: "sevilla", name: "Sevilla", code: "SEV", league: "LALIGA", confederation: "UEFA", leagueTitles: 1, championsLeague: 0, libertadores: 0, intercontinental: 0, europa: 7 },
  { id: "valencia", name: "Valencia", code: "VAL", league: "LALIGA", confederation: "UEFA", leagueTitles: 6, championsLeague: 0, libertadores: 0, intercontinental: 0, europa: 1 },
  // ---- UEFA · Germany ----
  { id: "bayern", name: "Bayern Munich", code: "BAY", league: "BUNDESLIGA", confederation: "UEFA", leagueTitles: 34, championsLeague: 6, libertadores: 0, intercontinental: 4, europa: 1 },
  { id: "dortmund", name: "Borussia Dortmund", code: "BVB", league: "BUNDESLIGA", confederation: "UEFA", leagueTitles: 8, championsLeague: 1, libertadores: 0, intercontinental: 1, europa: 0 },
  { id: "hamburg", name: "Hamburg", code: "HSV", league: "BUNDESLIGA", confederation: "UEFA", leagueTitles: 6, championsLeague: 1, libertadores: 0, intercontinental: 0, europa: 0 },
  // ---- UEFA · France ----
  { id: "psg", name: "Paris Saint-Germain", code: "PSG", league: "LIGUE1", confederation: "UEFA", leagueTitles: 13, championsLeague: 1, libertadores: 0, intercontinental: 0, europa: 0 },
  { id: "marseille", name: "Marseille", code: "OM", league: "LIGUE1", confederation: "UEFA", leagueTitles: 9, championsLeague: 1, libertadores: 0, intercontinental: 0, europa: 0 },
  // ---- UEFA · Italy ----
  { id: "ac-milan", name: "AC Milan", code: "MIL", league: "SERIEA", confederation: "UEFA", leagueTitles: 19, championsLeague: 7, libertadores: 0, intercontinental: 4, europa: 0 },
  { id: "inter", name: "Inter Milan", code: "INT", league: "SERIEA", confederation: "UEFA", leagueTitles: 20, championsLeague: 3, libertadores: 0, intercontinental: 3, europa: 3 },
  { id: "juventus", name: "Juventus", code: "JUV", league: "SERIEA", confederation: "UEFA", leagueTitles: 36, championsLeague: 2, libertadores: 0, intercontinental: 2, europa: 3 },
  { id: "napoli", name: "Napoli", code: "NAP", league: "SERIEA", confederation: "UEFA", leagueTitles: 4, championsLeague: 0, libertadores: 0, intercontinental: 0, europa: 1 },
  // ---- UEFA · England ----
  { id: "liverpool", name: "Liverpool", code: "LIV", league: "PL", confederation: "UEFA", leagueTitles: 20, championsLeague: 6, libertadores: 0, intercontinental: 1, europa: 3 },
  { id: "man-united", name: "Manchester United", code: "MUN", league: "PL", confederation: "UEFA", leagueTitles: 20, championsLeague: 3, libertadores: 0, intercontinental: 2, europa: 1 },
  { id: "man-city", name: "Manchester City", code: "MCI", league: "PL", confederation: "UEFA", leagueTitles: 10, championsLeague: 1, libertadores: 0, intercontinental: 1, europa: 0 },
  { id: "arsenal", name: "Arsenal", code: "ARS", league: "PL", confederation: "UEFA", leagueTitles: 13, championsLeague: 0, libertadores: 0, intercontinental: 0, europa: 0 },
  { id: "chelsea", name: "Chelsea", code: "CHE", league: "PL", confederation: "UEFA", leagueTitles: 6, championsLeague: 2, libertadores: 0, intercontinental: 2, europa: 2 },
  { id: "tottenham", name: "Tottenham Hotspur", code: "TOT", league: "PL", confederation: "UEFA", leagueTitles: 2, championsLeague: 0, libertadores: 0, intercontinental: 0, europa: 3 },
  { id: "nottingham-forest", name: "Nottingham Forest", code: "NFO", league: "PL", confederation: "UEFA", leagueTitles: 1, championsLeague: 2, libertadores: 0, intercontinental: 0, europa: 0 },
  { id: "aston-villa", name: "Aston Villa", code: "AVL", league: "PL", confederation: "UEFA", leagueTitles: 7, championsLeague: 1, libertadores: 0, intercontinental: 0, europa: 0 },
  // ---- UEFA · Portugal ----
  { id: "benfica", name: "Benfica", code: "BEN", league: "PRIMEIRA", confederation: "UEFA", leagueTitles: 38, championsLeague: 2, libertadores: 0, intercontinental: 0, europa: 0 },
  { id: "porto", name: "Porto", code: "POR", league: "PRIMEIRA", confederation: "UEFA", leagueTitles: 31, championsLeague: 2, libertadores: 0, intercontinental: 2, europa: 2 },
  // ---- UEFA · Netherlands ----
  { id: "ajax", name: "Ajax", code: "AJA", league: "EREDIVISIE", confederation: "UEFA", leagueTitles: 36, championsLeague: 4, libertadores: 0, intercontinental: 2, europa: 1 },
  { id: "feyenoord", name: "Feyenoord", code: "FEY", league: "EREDIVISIE", confederation: "UEFA", leagueTitles: 16, championsLeague: 1, libertadores: 0, intercontinental: 1, europa: 2 },
  { id: "psv", name: "PSV Eindhoven", code: "PSV", league: "EREDIVISIE", confederation: "UEFA", leagueTitles: 26, championsLeague: 1, libertadores: 0, intercontinental: 0, europa: 1 },
  // ---- UEFA · smaller leagues (European Cup winners) ----
  { id: "celtic", name: "Celtic", code: "CEL", league: "SCO", confederation: "UEFA", leagueTitles: 55, championsLeague: 1, libertadores: 0, intercontinental: 0, europa: 0 },
  { id: "red-star", name: "Red Star Belgrade", code: "CRV", league: "SRB", confederation: "UEFA", leagueTitles: 35, championsLeague: 1, libertadores: 0, intercontinental: 1, europa: 0 },
  { id: "steaua", name: "Steaua Bucharest", code: "FCS", league: "ROU", confederation: "UEFA", leagueTitles: 28, championsLeague: 1, libertadores: 0, intercontinental: 0, europa: 0 },
  // ---- CONMEBOL · Argentina ----
  { id: "boca-juniors", name: "Boca Juniors", code: "BOC", league: "ARG", confederation: "CONMEBOL", leagueTitles: 35, championsLeague: 0, libertadores: 6, intercontinental: 3, europa: 0 },
  { id: "river-plate", name: "River Plate", code: "RIV", league: "ARG", confederation: "CONMEBOL", leagueTitles: 38, championsLeague: 0, libertadores: 4, intercontinental: 1, europa: 0 },
  { id: "independiente", name: "Independiente", code: "IND", league: "ARG", confederation: "CONMEBOL", leagueTitles: 16, championsLeague: 0, libertadores: 7, intercontinental: 2, europa: 0 },
  { id: "estudiantes", name: "Estudiantes", code: "EST", league: "ARG", confederation: "CONMEBOL", leagueTitles: 6, championsLeague: 0, libertadores: 4, intercontinental: 1, europa: 0 },
  // ---- CONMEBOL · Brazil (CBF-unified national titles) ----
  { id: "sao-paulo", name: "São Paulo", code: "SAO", league: "BRA", confederation: "CONMEBOL", leagueTitles: 6, championsLeague: 0, libertadores: 3, intercontinental: 3, europa: 0 },
  { id: "santos", name: "Santos", code: "SAN", league: "BRA", confederation: "CONMEBOL", leagueTitles: 8, championsLeague: 0, libertadores: 3, intercontinental: 2, europa: 0 },
  { id: "palmeiras", name: "Palmeiras", code: "PAL", league: "BRA", confederation: "CONMEBOL", leagueTitles: 12, championsLeague: 0, libertadores: 3, intercontinental: 0, europa: 0 },
  { id: "corinthians", name: "Corinthians", code: "COR", league: "BRA", confederation: "CONMEBOL", leagueTitles: 7, championsLeague: 0, libertadores: 1, intercontinental: 2, europa: 0 },
  { id: "flamengo", name: "Flamengo", code: "FLA", league: "BRA", confederation: "CONMEBOL", leagueTitles: 7, championsLeague: 0, libertadores: 3, intercontinental: 1, europa: 0 },
  { id: "gremio", name: "Grêmio", code: "GRE", league: "BRA", confederation: "CONMEBOL", leagueTitles: 2, championsLeague: 0, libertadores: 3, intercontinental: 1, europa: 0 },
  { id: "internacional", name: "Internacional", code: "SCI", league: "BRA", confederation: "CONMEBOL", leagueTitles: 3, championsLeague: 0, libertadores: 2, intercontinental: 1, europa: 0 },
  { id: "cruzeiro", name: "Cruzeiro", code: "CRU", league: "BRA", confederation: "CONMEBOL", leagueTitles: 4, championsLeague: 0, libertadores: 2, intercontinental: 0, europa: 0 },
  // ---- CONMEBOL · Uruguay / Paraguay / Colombia ----
  { id: "penarol", name: "Peñarol", code: "PEN", league: "URU", confederation: "CONMEBOL", leagueTitles: 52, championsLeague: 0, libertadores: 5, intercontinental: 3, europa: 0 },
  { id: "nacional-uru", name: "Club Nacional", code: "NAC", league: "URU", confederation: "CONMEBOL", leagueTitles: 49, championsLeague: 0, libertadores: 3, intercontinental: 3, europa: 0 },
  { id: "olimpia", name: "Olimpia", code: "OLI", league: "PAR", confederation: "CONMEBOL", leagueTitles: 47, championsLeague: 0, libertadores: 3, intercontinental: 1, europa: 0 },
  { id: "atletico-nacional", name: "Atlético Nacional", code: "ATN", league: "COL", confederation: "CONMEBOL", leagueTitles: 18, championsLeague: 0, libertadores: 2, intercontinental: 0, europa: 0 },
];

/**
 * Prestige weights. The European Cup / Champions League is the global club pinnacle and
 * is weighted far above the Copa Libertadores — treating them as equal is what wrongly
 * floated South American clubs to the top. League titles are scaled by league strength,
 * so a flood of titles in a weaker league cannot out-rank continental silverware.
 */
export const TROPHY_WEIGHT = {
  championsLeague: 100,
  // Libertadores at 40% of the UCL. Research (CONMEBOL prize money, IFFHS rating it
  // a peer top-tier continental cup, the even 22–21 Intercontinental Cup era) backs
  // ~0.40–0.55; we sit at the LOW end because Europe has won every world club title
  // since 2013 and outspends ~7×. Up from a too-low 32 that under-rated South
  // America's premier trophy.
  libertadores: 40,
  // World club title (Intercontinental Cup + FIFA CWC): just below a continental
  // crown, clearly above the Europa League. Historically a formality in Europe but
  // a genuine, FIFA-recognized world-champion honor.
  intercontinental: 35,
  // Europa League ≈ 0.27 of the UCL — UEFA prize pool ≈0.23, winner payout ≈0.28,
  // and the coefficient knockout bonus is 2/3 of the UCL. Up from a too-low 18.
  europa: 27,
  leagueTitle: 10,
} as const;

/**
 * League-strength multiplier applied to domestic titles. Documented on the clubs page.
 * The weak-league bucket (0.12) is deliberately low: clubs like Celtic (55), Peñarol (52),
 * Nacional (49) or Olimpia (47) have enormous title counts in weak leagues, and without a
 * strong discount their domestic dominance would float them above continental winners.
 */
export const LEAGUE_STRENGTH: Record<string, number> = {
  // Big four kept level at the top (all current/recent UCL producers).
  PL: 1,
  LALIGA: 1,
  SERIEA: 1,
  BUNDESLIGA: 1,
  // Ligue 1 is a clear 5th on the UEFA country coefficient (~0.63 of England), not a
  // near-peer of the big four — trimmed from 0.85.
  LIGUE1: 0.75,
  PRIMEIRA: 0.55,
  EREDIVISIE: 0.55,
  // Brazil's Série A ranks top-4 worldwide on IFFHS (above the Bundesliga in several
  // years), Argentina just below. Raised from 0.50/0.45 — but held under the raw
  // IFFHS level, which double-counts Libertadores runs this model scores separately.
  BRA: 0.6,
  ARG: 0.5,
  // Weak leagues (Scotland, Serbia, Romania, Uruguay, Paraguay, Colombia): heavy
  // discount so a century of titles in a weak league can't out-rank silverware.
  SCO: 0.14,
  SRB: 0.14,
  ROU: 0.14,
  URU: 0.14,
  PAR: 0.14,
  COL: 0.14,
};

export function clubHonor(c: Club): number {
  const w = TROPHY_WEIGHT;
  const leagueFactor = LEAGUE_STRENGTH[c.league] ?? 0.5;
  return (
    c.championsLeague * w.championsLeague +
    c.libertadores * w.libertadores +
    c.intercontinental * w.intercontinental +
    c.europa * w.europa +
    c.leagueTitles * w.leagueTitle * leagueFactor
  );
}

export function getClub(id: string): Club | undefined {
  return CLUBS.find((c) => c.id === id);
}

/** Global ranking. Pass a confederation to view (and re-rank within) one confederation. */
export function rankedClubs(confederation?: Confederation): { club: Club; honor: number; rank: number }[] {
  return CLUBS.filter((c) => !confederation || c.confederation === confederation)
    .map((club) => ({ club, honor: clubHonor(club) }))
    .sort((a, b) => b.honor - a.honor)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

const NAME_INDEX = CLUBS.map((c) => ({ id: c.id, needle: c.name.toLowerCase() }));

export function clubIdFromName(name?: string): string | undefined {
  if (!name) return undefined;
  const s = name.toLowerCase();
  return NAME_INDEX.find(({ needle }) => s.includes(needle))?.id;
}

export function clubPlayers(club: Club): Player[] {
  return FOOTBALL_PLAYERS.filter((p) => clubIdFromName(p.team) === club.id).sort(
    (a, b) => honorScore(b, FOOTBALL_MODEL) - honorScore(a, FOOTBALL_MODEL)
  );
}

/**
 * Club display names in Chinese, keyed by the English `team` string stored on
 * achievements. Used to localize the club shown next to each trophy (and a
 * player's current team) for zh. Non-football teams (e.g. LoL orgs) aren't here,
 * so localizeTeam() returns them unchanged.
 */
export const CLUB_NAME_ZH: Record<string, string> = {
  Barcelona: "巴塞罗那", "Real Madrid": "皇家马德里", "Atlético Madrid": "马德里竞技",
  "Paris Saint-Germain": "巴黎圣日耳曼", "Manchester United": "曼联", "Manchester City": "曼城",
  "Bayern Munich": "拜仁慕尼黑", "Borussia Dortmund": "多特蒙德", "AC Milan": "AC米兰",
  "Inter Milan": "国际米兰", Juventus: "尤文图斯", Liverpool: "利物浦", Arsenal: "阿森纳",
  Chelsea: "切尔西", Benfica: "本菲卡", Porto: "波尔图", Ajax: "阿贾克斯",
  "Boca Juniors": "博卡青年", "River Plate": "河床", Independiente: "独立队",
  "PSV Eindhoven": "埃因霍温", Sampdoria: "桑普多利亚", Mallorca: "马略卡", Sevilla: "塞维利亚",
  Fluminense: "弗鲁米嫩塞", Santos: "桑托斯", "Atlético Mineiro": "米内罗竞技", Lyon: "里昂",
  "Tottenham Hotspur": "托特纳姆热刺", "Newcastle United": "纽卡斯尔联", "Blackburn Rovers": "布莱克本",
  Lazio: "拉齐奥", "AS Roma": "罗马", Roma: "罗马", Fiorentina: "佛罗伦萨", Valencia: "瓦伦西亚",
  Zaragoza: "萨拉戈萨", "Budapest Honvéd": "布达佩斯洪韦德", "Dynamo Moscow": "莫斯科迪纳摩",
  "Stoke City": "斯托克城", "West Ham United": "西汉姆联", "Vasco da Gama": "瓦斯科达伽马",
  Corinthians: "科林蒂安", Botafogo: "博塔弗戈", Monaco: "摩纳哥", Parma: "帕尔马",
  "Schalke 04": "沙尔克04", "Werder Bremen": "云达不莱梅", "Sparta Prague": "布拉格斯巴达",
  Feyenoord: "费耶诺德", "Dynamo Kyiv": "基辅迪纳摩",
  // Clubs added in the expanded ranking
  Marseille: "马赛", Napoli: "那不勒斯", Hamburg: "汉堡", "Nottingham Forest": "诺丁汉森林",
  "Aston Villa": "阿斯顿维拉", Celtic: "凯尔特人", "Red Star Belgrade": "贝尔格莱德红星",
  "Steaua Bucharest": "布加勒斯特星", "São Paulo": "圣保罗", Palmeiras: "帕尔梅拉斯",
  Flamengo: "弗拉门戈", Grêmio: "格雷米奥", Internacional: "巴西国际", Cruzeiro: "克鲁塞罗",
  Estudiantes: "拉普拉塔大学生", Peñarol: "佩纳罗尔", "Club Nacional": "民族队",
  Olimpia: "奥林匹亚", "Atlético Nacional": "国民竞技",
};

/** NBA franchise names in Chinese, keyed by the English `team` string on basketball players. */
export const NBA_TEAM_ZH: Record<string, string> = {
  "Atlanta Hawks": "亚特兰大老鹰", "Boston Celtics": "波士顿凯尔特人", "Brooklyn Nets": "布鲁克林篮网",
  "Charlotte Hornets": "夏洛特黄蜂", "Chicago Bulls": "芝加哥公牛", "Cleveland Cavaliers": "克利夫兰骑士",
  "Dallas Mavericks": "达拉斯独行侠", "Denver Nuggets": "丹佛掘金", "Detroit Pistons": "底特律活塞",
  "Golden State Warriors": "金州勇士", "Houston Rockets": "休斯顿火箭", "Indiana Pacers": "印第安纳步行者",
  "Los Angeles Clippers": "洛杉矶快船", "Los Angeles Lakers": "洛杉矶湖人", "Memphis Grizzlies": "孟菲斯灰熊",
  "Miami Heat": "迈阿密热火", "Milwaukee Bucks": "密尔沃基雄鹿", "Minnesota Timberwolves": "明尼苏达森林狼",
  "New Orleans Pelicans": "新奥尔良鹈鹕", "New York Knicks": "纽约尼克斯", "Oklahoma City Thunder": "俄克拉荷马城雷霆",
  "Orlando Magic": "奥兰多魔术", "Philadelphia 76ers": "费城76人", "Phoenix Suns": "菲尼克斯太阳",
  "Portland Trail Blazers": "波特兰开拓者", "Sacramento Kings": "萨克拉门托国王", "San Antonio Spurs": "圣安东尼奥马刺",
  "Toronto Raptors": "多伦多猛龙", "Utah Jazz": "犹他爵士", "Washington Wizards": "华盛顿奇才",
  // Historic / relocated NBA franchises (for older players' team strings)
  "Cincinnati Royals": "辛辛那提皇家", "New Jersey Nets": "新泽西篮网", "Buffalo Braves": "布法罗勇敢者",
  "New Orleans Jazz": "新奥尔良爵士", "Washington Bullets": "华盛顿子弹", "Kansas City Kings": "堪萨斯城国王",
  "St. Louis Hawks": "圣路易斯老鹰", "Minneapolis Lakers": "明尼阿波利斯湖人", "Philadelphia Warriors": "费城勇士",
  "Syracuse Nationals": "锡拉丘兹民族", "Seattle SuperSonics": "西雅图超音速",
  // EuroLeague clubs (international basketball players)
  "Cibona Zagreb": "萨格勒布西博纳", "Žalgiris Kaunas": "考纳斯萨格里斯", Panathinaikos: "帕纳辛奈科斯",
  "CSKA Moscow": "莫斯科中央陆军", Olympiacos: "奥林匹亚科斯", "FC Barcelona": "巴塞罗那",
  "Partizan Belgrade": "贝尔格莱德游击队",
};

/** Localize a club/team string to zh when available; unchanged for other locales/teams. */
export function localizeTeam(name: string | undefined, locale: string): string {
  if (!name) return "";
  if (locale !== "zh") return name;
  return CLUB_NAME_ZH[name] ?? NBA_TEAM_ZH[name] ?? name;
}
