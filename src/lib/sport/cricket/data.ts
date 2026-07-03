import type { Achievement, Player } from "../types";

/**
 * Cricket roster — 24 batsmen, bowlers and all-rounders spanning 1900s to 2020s,
 * ranked as one pool. All honors are WEB-VERIFIED against Wisden, ESPNcricinfo and
 * Wikipedia and FROZEN at end-2025.
 *
 * - Wisden Leading Cricketer in the World (`wl`) is recorded PER YEAR at the cricket
 *   year won, taken verbatim from Wikipedia's list (retrospective 1900+ AND current
 *   2003+). This is the era-spanning individual metric, so the timeline and peak
 *   lenses read truthfully across generations (e.g. Bradman's 1930s cluster, Kohli's
 *   2016-18 three-peat).
 * - ICC Cricketer of the Year (`icc`), World Cup titles (`wc`, each an ODI/T20/WTC
 *   won as a squad member) and Wisden Cricketer of the Year (`coy`) are dated entries.
 *   The 2005 ICC award was shared (Kallis) — a shared win still counts one.
 *
 * PART factor: Malcolm Marshall was a member of the winning 1979 ODI World Cup SQUAD
 * but played no match and had not yet made his Test debut (May 1980); his title
 * carries part:0.5 to reflect the non-playing squad medal, per the type-system rule.
 */
const WL = (years: number[]): Achievement[] => years.map((year) => ({ type: "wisden_leading", year }));
const AT = (type: string, years: number[] = []): Achievement[] => years.map((year) => ({ type, year }));

type WC = { year: number; event: string; part?: number };

type Raw = {
  id: string; name: string; nation: string; league: string; active: boolean; debut: number; blurb: string;
  wl?: number[]; icc?: number[]; wc?: WC[]; coy?: number[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "cricket", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...WL(r.wl ?? []),
    ...AT("icc_award", r.icc),
    ...(r.wc ?? []).map((w) => ({ type: "wc_title", year: w.year, event: w.event, ...(w.part != null ? { part: w.part } : {}) })),
    ...AT("wisden_coty", r.coy),
  ],
});

export const CRICKET_PLAYERS: Player[] = [
  mk({ id: "don-bradman", name: "Don Bradman", nation: "Australia", league: "AUS", active: false, debut: 1928, wl: [1930, 1931, 1932, 1934, 1936, 1937, 1938, 1939, 1946, 1948], coy: [1931], blurb: "A Test average of 99.94 that stands alone in all of sport, and a record 10 Wisden Leading Cricketer selections; cricket's undisputed GOAT." }),
  mk({ id: "garfield-sobers", name: "Garfield Sobers", nation: "West Indies", league: "WIN", active: false, debut: 1954, wl: [1958, 1960, 1962, 1964, 1965, 1966, 1968, 1970], coy: [1964], blurb: "The complete all-rounder — batting, three bowling styles and brilliant fielding — and a record eight Wisden Leading Cricketer awards." }),
  mk({ id: "sachin-tendulkar", name: "Sachin Tendulkar", nation: "India", league: "IND", active: false, debut: 1989, wl: [1998, 2010], icc: [2010], wc: [{ year: 2011, event: "ODI World Cup 2011" }], coy: [1997], blurb: "The most prolific run-scorer in international history — 100 centuries — crowned at last with the 2011 World Cup on home soil." }),
  mk({ id: "viv-richards", name: "Viv Richards", nation: "West Indies", league: "WIN", active: false, debut: 1974, wl: [1976, 1978, 1980], wc: [{ year: 1975, event: "ODI World Cup 1975" }, { year: 1979, event: "ODI World Cup 1979" }], coy: [1977], blurb: "The most feared batsman of his era and twice a World Cup winner; a swaggering, cap-only master of intimidation." }),
  mk({ id: "shane-warne", name: "Shane Warne", nation: "Australia", league: "AUS", active: false, debut: 1992, wl: [1993, 1997, 2004], wc: [{ year: 1999, event: "ODI World Cup 1999" }], coy: [1994], blurb: "708 Test wickets and the leg-spin revival single-handedly; a 1999 World Cup winner and the sport's great showman-genius." }),
  mk({ id: "muttiah-muralitharan", name: "Muttiah Muralitharan", nation: "Sri Lanka", league: "SL", active: false, debut: 1992, wl: [2000, 2006], wc: [{ year: 1996, event: "ODI World Cup 1996" }], coy: [2000], blurb: "The all-time leading Test (800) and ODI wicket-taker, and a 1996 World Cup winner; an unplayable spinning enigma." }),
  mk({ id: "brian-lara", name: "Brian Lara", nation: "West Indies", league: "WIN", active: false, debut: 1990, wl: [1994, 1995], coy: [1995], blurb: "Holder of the highest individual scores in both Tests (400*) and first-class cricket (501*); a left-handed batting artist." }),
  mk({ id: "jacques-kallis", name: "Jacques Kallis", nation: "South Africa", league: "RSA", active: false, debut: 1995, wl: [2007], icc: [2005], coy: [2001], blurb: "Over 13,000 Test runs and 292 wickets — the greatest all-round statistical career the game has seen." }),
  mk({ id: "ricky-ponting", name: "Ricky Ponting", nation: "Australia", league: "AUS", active: false, debut: 1995, wl: [2003], icc: [2006, 2007], wc: [{ year: 1999, event: "ODI World Cup 1999" }, { year: 2003, event: "ODI World Cup 2003" }, { year: 2007, event: "ODI World Cup 2007" }], coy: [2006], blurb: "Australia's most successful captain, with three World Cup titles and back-to-back ICC Cricketer of the Year awards." }),
  mk({ id: "virat-kohli", name: "Virat Kohli", nation: "India", league: "IND", active: true, debut: 2008, wl: [2016, 2017, 2018], icc: [2017, 2018], wc: [{ year: 2011, event: "ODI World Cup 2011" }, { year: 2024, event: "T20 World Cup 2024" }], coy: [2019], blurb: "The dominant chase-master of the modern game, with three straight Wisden Leading Cricketer awards and both white-ball World Cups." }),
  mk({ id: "sunil-gavaskar", name: "Sunil Gavaskar", nation: "India", league: "IND", active: false, debut: 1971, wc: [{ year: 1983, event: "ODI World Cup 1983" }], coy: [1980], blurb: "The first man to 10,000 Test runs and the archetype of the opening batsman; a 1983 World Cup winner who mastered the great West Indian pace." }),
  mk({ id: "imran-khan", name: "Imran Khan", nation: "Pakistan", league: "PAK", active: false, debut: 1971, wl: [1982], wc: [{ year: 1992, event: "ODI World Cup 1992" }], coy: [1983], blurb: "Pakistan's greatest all-rounder and the captain who lifted the 1992 World Cup; a fast-bowling and leadership colossus." }),
  mk({ id: "richard-hadlee", name: "Richard Hadlee", nation: "New Zealand", league: "NZL", active: false, debut: 1973, wl: [1985], coy: [1982], blurb: "The first bowler to 400 Test wickets and New Zealand's finest cricketer; a metronomic seam-bowling master." }),
  mk({ id: "wasim-akram", name: "Wasim Akram", nation: "Pakistan", league: "PAK", active: false, debut: 1984, wl: [1992], wc: [{ year: 1992, event: "ODI World Cup 1992" }], coy: [1993], blurb: "The 'Sultan of Swing' and the greatest left-arm fast bowler ever; 916 international wickets and a 1992 World Cup winner." }),
  mk({ id: "glenn-mcgrath", name: "Glenn McGrath", nation: "Australia", league: "AUS", active: false, debut: 1993, wl: [2001], wc: [{ year: 1999, event: "ODI World Cup 1999" }, { year: 2003, event: "ODI World Cup 2003" }, { year: 2007, event: "ODI World Cup 2007" }], coy: [1998], blurb: "563 Test wickets of relentless accuracy and three World Cup titles; the metronome of Australia's golden era." }),
  mk({ id: "jack-hobbs", name: "Jack Hobbs", nation: "England", league: "ENG", active: false, debut: 1908, wl: [1914, 1922, 1925], coy: [1909, 1926], blurb: "The 'Master' — a record 199 first-class centuries and 61,000 runs; the foremost opening batsman of the pre-war age." }),
  mk({ id: "kumar-sangakkara", name: "Kumar Sangakkara", nation: "Sri Lanka", league: "SL", active: false, debut: 2000, wl: [2011, 2014], icc: [2012], wc: [{ year: 2014, event: "T20 World Cup 2014" }], coy: [2012], blurb: "Over 28,000 international runs, elegant and voracious; a wicketkeeper-batsman and 2014 World T20 winner among the finest left-handers." }),
  mk({ id: "rahul-dravid", name: "Rahul Dravid", nation: "India", league: "IND", active: false, debut: 1996, icc: [2004], coy: [2000], blurb: "'The Wall' — 13,000-plus Test runs of monumental patience and the first-ever ICC Cricketer of the Year." }),
  mk({ id: "ab-de-villiers", name: "AB de Villiers", nation: "South Africa", league: "RSA", active: false, debut: 2004, blurb: "The '360-degree' innovator who could hit any bowler anywhere; owner of the fastest ODI fifty, hundred and 150." }),
  mk({ id: "steve-smith", name: "Steve Smith", nation: "Australia", league: "AUS", active: true, debut: 2010, icc: [2015], wc: [{ year: 2015, event: "ODI World Cup 2015" }, { year: 2021, event: "T20 World Cup 2021" }, { year: 2023, event: "World Test Championship 2023" }, { year: 2023, event: "ODI World Cup 2023" }], coy: [2016], blurb: "The best Test batsman of his generation — a near-Bradman peak average — and a four-time World Cup winner across all three formats." }),
  mk({ id: "joe-root", name: "Joe Root", nation: "England", league: "ENG", active: true, debut: 2012, wl: [2021], wc: [{ year: 2019, event: "ODI World Cup 2019" }], coy: [2014], blurb: "England's all-time leading Test run-scorer and a 2019 World Cup winner; the model of modern batting consistency." }),
  mk({ id: "kane-williamson", name: "Kane Williamson", nation: "New Zealand", league: "NZL", active: true, debut: 2010, wl: [2015], wc: [{ year: 2021, event: "World Test Championship 2021" }], coy: [2016], blurb: "New Zealand's greatest-ever batsman and captain of the inaugural World Test Championship winners; a serene, classical technician." }),
  mk({ id: "adam-gilchrist", name: "Adam Gilchrist", nation: "Australia", league: "AUS", active: false, debut: 1996, wc: [{ year: 1999, event: "ODI World Cup 1999" }, { year: 2003, event: "ODI World Cup 2003" }, { year: 2007, event: "ODI World Cup 2007" }], coy: [2002], blurb: "The wicketkeeper-batsman who redefined the role, with a match-winning 2007 final century and three World Cup titles." }),
  mk({ id: "malcolm-marshall", name: "Malcolm Marshall", nation: "West Indies", league: "WIN", active: false, debut: 1978, wl: [1986, 1988], wc: [{ year: 1979, event: "ODI World Cup 1979", part: 0.5 }], coy: [1983], blurb: "Widely rated the greatest fast bowler of all time — 376 Test wickets at 20.94 — the spearhead of West Indies' pace dynasty." }),
];
