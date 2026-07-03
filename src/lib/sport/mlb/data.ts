import type { Achievement, Player } from "../types";

/**
 * MLB roster — 24 of the consensus all-time greats in ONE mixed pool of hitters
 * and pitchers. MVP / Cy Young / Triple Crown / World Series / All-Star counts are
 * WEB-VERIFIED against each player's English Wikipedia infobox, cross-checked
 * against Baseball Almanac / MLB.com / the Hall of Fame, FROZEN at end of 2025.
 *
 * Counting conventions (see model.ts for the full era caveat):
 *   - `mvp` / `cy_young` / `triple_crown` / `ws_title` recorded at their exact years.
 *   - `mvp` follows each player's Wikipedia infobox, so pre-1931 award variants the
 *     infoboxes label "AL/NL MVP" count (Cobb 1911 Chalmers, W. Johnson 1913/1924
 *     League Awards, Ruth 1923). Wagner / Cy Young won none → 0, verified.
 *   - `triple_crown` counts BOTH batting (BA/HR/RBI) and pitching (W/ERA/K) Triple
 *     Crowns — symmetric season-dominance capstones in a mixed pool.
 *   - `stat_title` = seasons a player LED his league in a major category (hitters:
 *     HR, batting average, RBI, on-base %, slugging %, stolen bases; pitchers: wins,
 *     ERA, strikeouts). This is the era-spanning "black-ink" honor that keeps the
 *     pre-award greats (Ruth, Cobb, Wagner, Ted Williams, Walter Johnson) from being
 *     buried by the award timeline. Totals are compiled from standard black-ink
 *     references and stored as a per-career count spread across the leading span
 *     (only the total is load-bearing for the Index; the exact intra-span year is not).
 *   - `all_star` uses the published "N× All-Star" figure; distributed across the span.
 *     Pre-1933 legends (Cobb, Wagner, Cy Young, Walter Johnson) carry 0 by era.
 */

// Exact-year honors (one entry per award/title year).
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));
// Count-only honors: distribute `count` entries across [first, last] for display.
const spread = (type: string, count: number, first: number, last: number): Achievement[] => {
  if (count <= 0) return [];
  if (count === 1) return [{ type, year: first }];
  const step = (last - first) / (count - 1);
  return Array.from({ length: count }, (_, i) => ({ type, year: Math.round(first + step * i) }));
};

type Raw = {
  id: string;
  name: string;
  nation: string;
  league: string;
  active: boolean;
  debut: number;
  blurb: string;
  mvp?: number[];
  cy?: number[];
  tc?: number[];
  ws?: number[];
  /** [count, firstYear, lastYear] of league-leading category titles. */
  st?: [number, number, number];
  /** [count, firstYear, lastYear] for All-Star selections; omitted if none. */
  as?: [number, number, number];
};

const mk = (r: Raw): Player => ({
  id: r.id,
  name: r.name,
  sport: "mlb",
  league: r.league,
  position: "",
  team: "",
  nation: r.nation,
  active: r.active,
  debutYear: r.debut,
  blurb: r.blurb,
  achievements: [
    ...A("mvp", r.mvp ?? []),
    ...A("cy_young", r.cy ?? []),
    ...A("triple_crown", r.tc ?? []),
    ...A("ws_title", r.ws ?? []),
    ...(r.st ? spread("stat_title", r.st[0], r.st[1], r.st[2]) : []),
    ...(r.as ? spread("all_star", r.as[0], r.as[1], r.as[2]) : []),
  ],
});

export const MLB_PLAYERS: Player[] = [
  mk({
    id: "babe-ruth", name: "Babe Ruth", nation: "United States", league: "USA", active: false, debut: 1914,
    blurb: "The game's first true slugger and a two-way phenom — seven World Series titles and 714 home runs that remade the sport.",
    mvp: [1923], ws: [1915, 1916, 1918, 1923, 1927, 1928, 1932], st: [42, 1918, 1931], as: [2, 1933, 1934],
  }),
  mk({
    id: "barry-bonds", name: "Barry Bonds", nation: "United States", league: "USA", active: false, debut: 1986,
    blurb: "A record seven MVPs and the all-time home-run king; the most feared hitter the game has ever seen, though a title always eluded him.",
    mvp: [1990, 1992, 1993, 2001, 2002, 2003, 2004], st: [22, 1990, 2004], as: [14, 1990, 2007],
  }),
  mk({
    id: "willie-mays", name: "Willie Mays", nation: "United States", league: "USA", active: false, debut: 1951,
    blurb: "The five-tool ideal — two MVPs, 24 All-Star nods and 660 home runs from the most complete center fielder in history.",
    mvp: [1954, 1965], ws: [1954], st: [16, 1954, 1965], as: [24, 1954, 1973],
  }),
  mk({
    id: "hank-aaron", name: "Hank Aaron", nation: "United States", league: "USA", active: false, debut: 1954,
    blurb: "Baseball's longtime home-run king with 755, an MVP and a record 25 All-Star selections across an unmatched run of consistency.",
    mvp: [1957], ws: [1957], st: [14, 1956, 1967], as: [25, 1955, 1975],
  }),
  mk({
    id: "ted-williams", name: "Ted Williams", nation: "United States", league: "USA", active: false, debut: 1939,
    blurb: "The last man to bat .400 and a two-time Triple Crown winner; arguably the purest hitter ever, despite years lost to two wars.",
    mvp: [1946, 1949], tc: [1942, 1947], st: [35, 1941, 1958], as: [19, 1940, 1960],
  }),
  mk({
    id: "mickey-mantle", name: "Mickey Mantle", nation: "United States", league: "USA", active: false, debut: 1951,
    blurb: "A switch-hitting Triple Crown winner with three MVPs and seven titles; the thunderous heart of the Yankees dynasty.",
    mvp: [1956, 1957, 1962], tc: [1956], ws: [1951, 1952, 1953, 1956, 1958, 1961, 1962], st: [13, 1955, 1964], as: [20, 1952, 1968],
  }),
  mk({
    id: "ty-cobb", name: "Ty Cobb", nation: "United States", league: "USA", active: false, debut: 1905,
    blurb: "The dead-ball era's fiercest competitor — a .366 career average, 12 batting titles and the 1909 Triple Crown. Predates the All-Star era.",
    mvp: [1911], tc: [1909], st: [37, 1907, 1919], as: undefined,
  }),
  mk({
    id: "lou-gehrig", name: "Lou Gehrig", nation: "United States", league: "USA", active: false, debut: 1923,
    blurb: "The Iron Horse — two MVPs, the 1934 Triple Crown, six titles and 2,130 straight games before illness ended a peerless career.",
    mvp: [1927, 1936], tc: [1934], ws: [1927, 1928, 1932, 1936, 1937, 1938], st: [18, 1927, 1937], as: [7, 1933, 1939],
  }),
  mk({
    id: "stan-musial", name: "Stan Musial", nation: "United States", league: "USA", active: false, debut: 1941,
    blurb: "Stan the Man — three MVPs, three titles and 24 All-Star selections built on a .331 average and relentless year-to-year excellence.",
    mvp: [1943, 1946, 1948], ws: [1942, 1944, 1946], st: [21, 1943, 1957], as: [24, 1943, 1963],
  }),
  mk({
    id: "honus-wagner", name: "Honus Wagner", nation: "United States", league: "USA", active: false, debut: 1897,
    blurb: "The Flying Dutchman — the greatest shortstop of the dead-ball era, an eight-time batting champion and 1909 World Series winner. Predates the MVP and All-Star eras.",
    ws: [1909], st: [27, 1900, 1912], as: undefined,
  }),
  mk({
    id: "joe-dimaggio", name: "Joe DiMaggio", nation: "United States", league: "USA", active: false, debut: 1936,
    blurb: "The Yankee Clipper — three MVPs, nine titles and the untouchable 56-game hitting streak; grace personified in center field.",
    mvp: [1939, 1941, 1947], ws: [1936, 1937, 1938, 1939, 1941, 1947, 1949, 1950, 1951], st: [8, 1937, 1948], as: [13, 1936, 1951],
  }),
  mk({
    id: "ken-griffey-jr", name: "Ken Griffey Jr.", nation: "United States", league: "USA", active: false, debut: 1989,
    blurb: "The Kid — an MVP, 630 home runs and 13 All-Star nods with the sweetest swing of his generation, all cleanly earned.",
    mvp: [1997], st: [6, 1994, 1999], as: [13, 1990, 2007],
  }),
  mk({
    id: "rickey-henderson", name: "Rickey Henderson", nation: "United States", league: "USA", active: false, debut: 1979,
    blurb: "The greatest leadoff hitter ever — an MVP, two titles and all-time records for runs and stolen bases (1,406).",
    mvp: [1990], ws: [1989, 1993], st: [13, 1980, 1991], as: [10, 1980, 1991],
  }),
  mk({
    id: "albert-pujols", name: "Albert Pujols", nation: "Dominican Republic", league: "DOM", active: false, debut: 2001,
    blurb: "La Máquina — three MVPs, two titles and 703 home runs; the most dominant right-handed hitter of the 2000s.",
    mvp: [2005, 2008, 2009], ws: [2006, 2011], st: [7, 2003, 2010], as: [11, 2001, 2022],
  }),
  mk({
    id: "mike-trout", name: "Mike Trout", nation: "United States", league: "USA", active: true, debut: 2011,
    blurb: "The defining talent of the 2010s — three MVPs and a decade as the game's best all-around player, still chasing October.",
    mvp: [2014, 2016, 2019], st: [10, 2012, 2022], as: [11, 2012, 2023],
  }),
  mk({
    id: "shohei-ohtani", name: "Shohei Ohtani", nation: "Japan", league: "JPN", active: true, debut: 2018,
    blurb: "The two-way unicorn — four unanimous MVPs and back-to-back titles with the Dodgers; a hitter and ace in one, unseen since Ruth.",
    mvp: [2021, 2023, 2024, 2025], ws: [2024, 2025], st: [7, 2021, 2025], as: [5, 2021, 2025],
  }),
  mk({
    id: "alex-rodriguez", name: "Alex Rodriguez", nation: "United States", league: "USA", active: false, debut: 1994,
    blurb: "A three-time MVP, 696 home runs and a 2009 title; a generational shortstop-turned-slugger whose legacy is shadowed by PED admissions.",
    mvp: [2003, 2005, 2007], ws: [2009], st: [11, 1996, 2007], as: [14, 1996, 2010],
  }),
  mk({
    id: "walter-johnson", name: "Walter Johnson", nation: "United States", league: "USA", active: false, debut: 1907,
    blurb: "The Big Train — two MVPs, three pitching Triple Crowns and 417 wins; the hardest thrower of his age. Predates the Cy Young and All-Star eras.",
    mvp: [1913, 1924], tc: [1913, 1918, 1924], ws: [1924], st: [23, 1910, 1924], as: undefined,
  }),
  mk({
    id: "cy-young", name: "Cy Young", nation: "United States", league: "USA", active: false, debut: 1890,
    blurb: "The winningest pitcher ever with 511 victories and the sport's signature pitching award named for him. Predates that award, the MVP and the All-Star era.",
    tc: [1901], ws: [1903], st: [9, 1892, 1905], as: undefined,
  }),
  mk({
    id: "roger-clemens", name: "Roger Clemens", nation: "United States", league: "USA", active: false, debut: 1984,
    blurb: "The Rocket — a record seven Cy Youngs, an MVP and two titles; the most decorated pitcher of the modern era, though PED allegations linger.",
    mvp: [1986], cy: [1986, 1987, 1991, 1997, 1998, 2001, 2004], tc: [1997], ws: [1999, 2000], st: [16, 1986, 2005], as: [11, 1986, 2005],
  }),
  mk({
    id: "greg-maddux", name: "Greg Maddux", nation: "United States", league: "USA", active: false, debut: 1986,
    blurb: "The Professor — four straight Cy Youngs and a 1995 title built on pinpoint command; the smartest pitcher of his generation.",
    cy: [1992, 1993, 1994, 1995], ws: [1995], st: [7, 1992, 1995], as: [8, 1988, 2000],
  }),
  mk({
    id: "randy-johnson", name: "Randy Johnson", nation: "United States", league: "USA", active: false, debut: 1988,
    blurb: "The Big Unit — five Cy Youngs, a pitching Triple Crown and a co-MVP 2001 title; the most intimidating left-hander ever.",
    cy: [1995, 1999, 2000, 2001, 2002], tc: [2002], ws: [2001], st: [14, 1993, 2004], as: [10, 1990, 2004],
  }),
  mk({
    id: "pedro-martinez", name: "Pedro Martínez", nation: "Dominican Republic", league: "DOM", active: false, debut: 1992,
    blurb: "Pound-for-pound the most dominant arm of his era — three Cy Youngs and a 2004 title that broke Boston's curse.",
    cy: [1997, 1999, 2000], ws: [2004], st: [9, 1997, 2003], as: [8, 1996, 2006],
  }),
  mk({
    id: "sandy-koufax", name: "Sandy Koufax", nation: "United States", league: "USA", active: false, debut: 1955,
    blurb: "The most dominant peak ever — three unanimous Cy Youngs and three pitching Triple Crowns in his final six years, then retired at 30.",
    mvp: [1963], cy: [1963, 1965, 1966], tc: [1963, 1965, 1966], ws: [1955, 1959, 1963, 1965], st: [12, 1961, 1966], as: [6, 1961, 1966],
  }),
];
