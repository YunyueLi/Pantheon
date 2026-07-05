import type { Achievement, Player } from "../types";

/**
 * MLB roster — 45 of the consensus all-time greats in ONE mixed pool of hitters
 * and pitchers. MVP / Cy Young / Triple Crown / World Series / All-Star counts are
 * WEB-VERIFIED against each player's English Wikipedia infobox, cross-checked
 * against Baseball Almanac / MLB.com / the Hall of Fame, FROZEN at end of 2025.
 *
 * Counting conventions (see model.ts for the full era caveat):
 *   - `mvp` / `cy` / `tc` / `ws` recorded at their exact years.
 *   - `mvp` follows each player's Wikipedia infobox, so pre-1931 award variants the
 *     infoboxes label "AL/NL MVP" count (Cobb 1911 Chalmers, W. Johnson 1913/1924
 *     League Awards, Ruth 1923, Speaker 1912). Wagner / Cy Young / Lajoie won none → 0.
 *   - `tc` counts BOTH batting (BA/HR/RBI) and pitching (W/ERA/K) Triple Crowns.
 *   - `st` (`stat_title`) = the REAL YEARS a player LED his league in a major category
 *     (hitters: HR, batting average, RBI, on-base %, slugging %, stolen bases; pitchers:
 *     wins, ERA, strikeouts). Each season-category led is one title, so a season a
 *     player led several categories repeats that year — those multi-title seasons show
 *     as the player's genuine peaks. Counts were compiled category-by-category from
 *     Wikipedia's annual league-leader lists, cross-checked against Baseball Almanac;
 *     this is the era-spanning "black-ink" honor that keeps the pre-award greats (Ruth,
 *     Cobb, Wagner, Ted Williams, Walter Johnson) from being buried by the award timeline.
 *   - `as` = the published "N× All-Star" figure (distinct seasons), distributed across
 *     the span for display. Pre-1933 legends (Cobb, Wagner, Cy Young, Walter Johnson,
 *     Hornsby, Lajoie, Speaker, Mathewson, Alexander) carry 0 by era.
 */

// Exact-year honors (one entry per award/title year, repeats allowed for stat_title).
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
  /** Real years a league-leading category title was won (multiset; a multi-category season repeats the year). */
  st?: number[];
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
    ...A("stat_title", r.st ?? []),
    ...(r.as ? spread("all_star", r.as[0], r.as[1], r.as[2]) : []),
  ],
});

export const MLB_PLAYERS: Player[] = [
  mk({
    id: "babe-ruth", name: "Babe Ruth", nation: "United States", league: "USA", active: false, debut: 1914,
    blurb: "The game's first true slugger and a two-way phenom — seven World Series titles and 714 home runs that remade the sport.",
    mvp: [1923], ws: [1915, 1916, 1918, 1923, 1927, 1928, 1932], st: [1916, 1918, 1918, 1919, 1919, 1919, 1919, 1920, 1920, 1920, 1920, 1921, 1921, 1921, 1921, 1922, 1923, 1923, 1923, 1923, 1924, 1924, 1924, 1924, 1926, 1926, 1926, 1926, 1927, 1927, 1927, 1928, 1928, 1928, 1929, 1929, 1930, 1930, 1930, 1931, 1931, 1931, 1932], as: [2, 1933, 1934],
  }),
  mk({
    id: "barry-bonds", name: "Barry Bonds", nation: "United States", league: "USA", active: false, debut: 1986,
    blurb: "A record seven MVPs and the all-time home-run king; the most feared hitter the game has ever seen, though a title always eluded him.",
    mvp: [1990, 1992, 1993, 2001, 2002, 2003, 2004], st: [1990, 1991, 1992, 1993, 1993, 1993, 1993, 1995, 2001, 2001, 2001, 2002, 2002, 2002, 2003, 2003, 2004, 2004, 2004, 2004, 2006, 2007], as: [14, 1990, 2007],
  }),
  mk({
    id: "willie-mays", name: "Willie Mays", nation: "United States", league: "USA", active: false, debut: 1951,
    blurb: "The five-tool ideal — two MVPs, 24 All-Star nods and 660 home runs from the most complete center fielder in history.",
    mvp: [1954, 1965], ws: [1954], st: [1954, 1954, 1955, 1955, 1956, 1957, 1957, 1958, 1959, 1962, 1964, 1964, 1965, 1965, 1965, 1971], as: [24, 1954, 1973],
  }),
  mk({
    id: "hank-aaron", name: "Hank Aaron", nation: "United States", league: "USA", active: false, debut: 1954,
    blurb: "Baseball's longtime home-run king with 755, an MVP and a record 25 All-Star selections across an unmatched run of consistency.",
    mvp: [1957], ws: [1957], st: [1956, 1957, 1957, 1959, 1959, 1960, 1963, 1963, 1963, 1966, 1966, 1967, 1967, 1971], as: [25, 1955, 1975],
  }),
  mk({
    id: "ted-williams", name: "Ted Williams", nation: "United States", league: "USA", active: false, debut: 1939,
    blurb: "The last man to bat .400 and a two-time Triple Crown winner; arguably the purest hitter ever, despite years lost to two wars.",
    mvp: [1946, 1949], tc: [1942, 1947], st: [1939, 1940, 1941, 1941, 1941, 1941, 1942, 1942, 1942, 1942, 1942, 1946, 1946, 1947, 1947, 1947, 1947, 1947, 1948, 1948, 1948, 1949, 1949, 1949, 1949, 1951, 1951, 1954, 1954, 1956, 1957, 1957, 1957, 1958, 1958], as: [19, 1940, 1960],
  }),
  mk({
    id: "mickey-mantle", name: "Mickey Mantle", nation: "United States", league: "USA", active: false, debut: 1951,
    blurb: "A switch-hitting Triple Crown winner with three MVPs and seven titles; the thunderous heart of the Yankees dynasty.",
    mvp: [1956, 1957, 1962], tc: [1956], ws: [1951, 1952, 1953, 1956, 1958, 1961, 1962], st: [1955, 1955, 1955, 1956, 1956, 1956, 1956, 1958, 1960, 1961, 1962, 1962, 1964], as: [20, 1952, 1968],
  }),
  mk({
    id: "ty-cobb", name: "Ty Cobb", nation: "United States", league: "USA", active: false, debut: 1905,
    blurb: "The dead-ball era's fiercest competitor — a .366 career average, 12 batting titles and the 1909 Triple Crown. Predates the All-Star era.",
    mvp: [1911], tc: [1909], st: [1907, 1907, 1907, 1907, 1908, 1908, 1908, 1909, 1909, 1909, 1909, 1909, 1909, 1910, 1910, 1910, 1911, 1911, 1911, 1911, 1912, 1912, 1913, 1913, 1914, 1914, 1915, 1915, 1915, 1916, 1917, 1917, 1917, 1917, 1918, 1918, 1919],
  }),
  mk({
    id: "lou-gehrig", name: "Lou Gehrig", nation: "United States", league: "USA", active: false, debut: 1923,
    blurb: "The Iron Horse — two MVPs, the 1934 Triple Crown, six titles and 2,130 straight games before illness ended a peerless career.",
    mvp: [1927, 1936], tc: [1934], ws: [1927, 1928, 1932, 1936, 1937, 1938], st: [1927, 1928, 1928, 1930, 1931, 1931, 1934, 1934, 1934, 1934, 1934, 1935, 1936, 1936, 1936, 1937], as: [7, 1933, 1939],
  }),
  mk({
    id: "stan-musial", name: "Stan Musial", nation: "United States", league: "USA", active: false, debut: 1941,
    blurb: "Stan the Man — three MVPs, three titles and 24 All-Star selections built on a .331 average and relentless year-to-year excellence.",
    mvp: [1943, 1946, 1948], ws: [1942, 1944, 1946], st: [1943, 1943, 1943, 1944, 1944, 1946, 1946, 1948, 1948, 1948, 1948, 1949, 1950, 1950, 1951, 1952, 1952, 1953, 1956, 1957, 1957], as: [24, 1943, 1963],
  }),
  mk({
    id: "honus-wagner", name: "Honus Wagner", nation: "United States", league: "USA", active: false, debut: 1897,
    blurb: "The Flying Dutchman — the greatest shortstop of the dead-ball era, an eight-time batting champion and 1909 World Series winner. Predates the MVP and All-Star eras.",
    ws: [1909], st: [1900, 1900, 1901, 1901, 1902, 1902, 1902, 1903, 1904, 1904, 1904, 1904, 1906, 1907, 1907, 1907, 1907, 1908, 1908, 1908, 1908, 1908, 1909, 1909, 1909, 1909, 1911, 1912],
  }),
  mk({
    id: "joe-dimaggio", name: "Joe DiMaggio", nation: "United States", league: "USA", active: false, debut: 1936,
    blurb: "The Yankee Clipper — three MVPs, nine titles and the untouchable 56-game hitting streak; grace personified in center field.",
    mvp: [1939, 1941, 1947], ws: [1936, 1937, 1938, 1939, 1941, 1947, 1949, 1950, 1951], st: [1937, 1937, 1939, 1940, 1941, 1948, 1948, 1950], as: [13, 1936, 1951],
  }),
  mk({
    id: "ken-griffey-jr", name: "Ken Griffey Jr.", nation: "United States", league: "USA", active: false, debut: 1989,
    blurb: "The Kid — an MVP, 630 home runs and 13 All-Star nods with the sweetest swing of his generation, all cleanly earned.",
    mvp: [1997], st: [1994, 1997, 1997, 1998, 1999], as: [13, 1990, 2007],
  }),
  mk({
    id: "rickey-henderson", name: "Rickey Henderson", nation: "United States", league: "USA", active: false, debut: 1979,
    blurb: "The greatest leadoff hitter ever — an MVP, two titles and all-time records for runs and stolen bases (1,406).",
    mvp: [1990], ws: [1989, 1993], st: [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1988, 1989, 1990, 1990, 1991, 1998], as: [10, 1980, 1991],
  }),
  mk({
    id: "albert-pujols", name: "Albert Pujols", nation: "Dominican Republic", league: "DOM", active: false, debut: 2001,
    blurb: "La Máquina — three MVPs, two titles and 703 home runs; the most dominant right-handed hitter of the 2000s.",
    mvp: [2005, 2008, 2009], ws: [2006, 2011], st: [2003, 2006, 2008, 2009, 2009, 2009, 2010, 2010], as: [11, 2001, 2022],
  }),
  mk({
    id: "mike-trout", name: "Mike Trout", nation: "United States", league: "USA", active: true, debut: 2011,
    blurb: "The defining talent of the 2010s — three MVPs and a decade as the game's best all-around player, still chasing October.",
    mvp: [2014, 2016, 2019], st: [2012, 2014, 2015, 2016, 2017, 2017, 2018, 2019, 2019], as: [11, 2012, 2023],
  }),
  mk({
    id: "shohei-ohtani", name: "Shohei Ohtani", nation: "Japan", league: "JPN", active: true, debut: 2018,
    blurb: "The two-way unicorn — four unanimous MVPs and back-to-back titles with the Dodgers; a hitter and ace in one, unseen since Ruth.",
    mvp: [2021, 2023, 2024, 2025], ws: [2024, 2025], st: [2023, 2023, 2023, 2024, 2024, 2024, 2024, 2025], as: [5, 2021, 2025],
  }),
  mk({
    id: "alex-rodriguez", name: "Alex Rodriguez", nation: "United States", league: "USA", active: false, debut: 1994,
    blurb: "A three-time MVP, 696 home runs and a 2009 title; a generational shortstop-turned-slugger whose legacy is shadowed by PED admissions.",
    mvp: [2003, 2005, 2007], ws: [2009], st: [1996, 2001, 2002, 2002, 2003, 2003, 2005, 2005, 2007, 2007, 2007, 2008], as: [14, 1996, 2011],
  }),
  mk({
    id: "walter-johnson", name: "Walter Johnson", nation: "United States", league: "USA", active: false, debut: 1907,
    blurb: "The Big Train — two MVPs, three pitching Triple Crowns and 417 wins; the hardest thrower of his age. Predates the Cy Young and All-Star eras.",
    mvp: [1913, 1924], tc: [1913, 1918, 1924], ws: [1924], st: [1910, 1912, 1912, 1913, 1913, 1913, 1914, 1914, 1915, 1915, 1916, 1916, 1917, 1918, 1918, 1918, 1919, 1919, 1921, 1923, 1924, 1924, 1924],
  }),
  mk({
    id: "cy-young", name: "Cy Young", nation: "United States", league: "USA", active: false, debut: 1890,
    blurb: "The winningest pitcher ever with 511 victories and the sport's signature pitching award named for him. Predates that award, the MVP and the All-Star era.",
    tc: [1901], ws: [1903], st: [1892, 1892, 1895, 1896, 1901, 1901, 1901, 1902, 1903],
  }),
  mk({
    id: "roger-clemens", name: "Roger Clemens", nation: "United States", league: "USA", active: false, debut: 1984,
    blurb: "The Rocket — a record seven Cy Youngs, an MVP and two titles; the most decorated pitcher of the modern era, though PED allegations linger.",
    mvp: [1986], cy: [1986, 1987, 1991, 1997, 1998, 2001, 2004], tc: [1997], ws: [1999, 2000], st: [1986, 1986, 1987, 1988, 1990, 1991, 1991, 1992, 1996, 1997, 1997, 1997, 1998, 1998, 1998, 2005], as: [11, 1986, 2005],
  }),
  mk({
    id: "greg-maddux", name: "Greg Maddux", nation: "United States", league: "USA", active: false, debut: 1986,
    blurb: "The Professor — four straight Cy Youngs and a 1995 title built on pinpoint command; the smartest pitcher of his generation.",
    cy: [1992, 1993, 1994, 1995], ws: [1995], st: [1992, 1993, 1994, 1994, 1995, 1995, 1998], as: [8, 1988, 2000],
  }),
  mk({
    id: "randy-johnson", name: "Randy Johnson", nation: "United States", league: "USA", active: false, debut: 1988,
    blurb: "The Big Unit — five Cy Youngs, a pitching Triple Crown and a co-MVP 2001 title; the most intimidating left-hander ever.",
    cy: [1995, 1999, 2000, 2001, 2002], tc: [2002], ws: [2001], st: [1992, 1993, 1994, 1995, 1995, 1999, 1999, 2000, 2001, 2001, 2002, 2002, 2002, 2004], as: [10, 1990, 2004],
  }),
  mk({
    id: "pedro-martinez", name: "Pedro Martínez", nation: "Dominican Republic", league: "DOM", active: false, debut: 1992,
    blurb: "Pound-for-pound the most dominant arm of his era — three Cy Youngs and a 2004 title that broke Boston's curse.",
    cy: [1997, 1999, 2000], ws: [2004], st: [1997, 1999, 1999, 1999, 2000, 2000, 2002, 2002, 2003], as: [8, 1996, 2006],
  }),
  mk({
    id: "sandy-koufax", name: "Sandy Koufax", nation: "United States", league: "USA", active: false, debut: 1955,
    blurb: "The most dominant peak ever — three unanimous Cy Youngs and three pitching Triple Crowns in his final six years, then retired at 30.",
    mvp: [1963], cy: [1963, 1965, 1966], tc: [1963, 1965, 1966], ws: [1955, 1959, 1963, 1965], st: [1961, 1962, 1963, 1963, 1963, 1964, 1965, 1965, 1965, 1966, 1966, 1966], as: [6, 1961, 1966],
  }),

  // ---- Added 2026: inner-circle greats spanning the dead-ball era to the present ----
  mk({
    id: "rogers-hornsby", name: "Rogers Hornsby", nation: "United States", league: "USA", active: false, debut: 1915,
    blurb: "Two Triple Crowns, two MVPs and a .358 lifetime average, the highest by any right-handed hitter.",
    mvp: [1925, 1929], tc: [1922, 1925], ws: [1926], st: [1917, 1920, 1920, 1920, 1920, 1921, 1921, 1921, 1921, 1922, 1922, 1922, 1922, 1922, 1923, 1923, 1923, 1924, 1924, 1924, 1925, 1925, 1925, 1925, 1925, 1927, 1928, 1928, 1928, 1929],
  }),
  mk({
    id: "jimmie-foxx", name: "Jimmie Foxx", nation: "United States", league: "USA", active: false, debut: 1925,
    blurb: "Three MVPs, the 1933 Triple Crown and two titles from the first right-handed slugger to chase Ruth's home-run marks.",
    mvp: [1932, 1933, 1938], tc: [1933], ws: [1929, 1930], st: [1929, 1932, 1932, 1932, 1933, 1933, 1933, 1933, 1935, 1935, 1938, 1938, 1938, 1938, 1939, 1939, 1939], as: [9, 1933, 1941],
  }),
  mk({
    id: "frank-robinson", name: "Frank Robinson", nation: "United States", league: "USA", active: false, debut: 1956,
    blurb: "The only man named MVP in both leagues, with the 1966 Triple Crown and two titles for Baltimore.",
    mvp: [1961, 1966], tc: [1966], ws: [1966, 1970], st: [1960, 1961, 1962, 1962, 1966, 1966, 1966, 1966, 1966], as: [14, 1956, 1974],
  }),
  mk({
    id: "mike-schmidt", name: "Mike Schmidt", nation: "United States", league: "USA", active: false, debut: 1972,
    blurb: "Three MVPs, eight home-run titles and a 1980 championship from the greatest third baseman the game has seen.",
    mvp: [1980, 1981, 1986], ws: [1980], st: [1974, 1974, 1975, 1976, 1980, 1980, 1980, 1981, 1981, 1981, 1981, 1982, 1982, 1983, 1983, 1984, 1984, 1986, 1986, 1986], as: [12, 1974, 1989],
  }),
  mk({
    id: "johnny-bench", name: "Johnny Bench", nation: "United States", league: "USA", active: false, debut: 1967,
    blurb: "Two MVPs and two titles anchoring the Big Red Machine, the catcher every catcher since is measured against.",
    mvp: [1970, 1972], ws: [1975, 1976], st: [1970, 1970, 1972, 1972, 1974], as: [14, 1968, 1983],
  }),
  mk({
    id: "yogi-berra", name: "Yogi Berra", nation: "United States", league: "USA", active: false, debut: 1946,
    blurb: "Three MVPs and a record ten World Series titles as a player, the winningest man in the sport's history.",
    mvp: [1951, 1954, 1955], ws: [1947, 1949, 1950, 1951, 1952, 1953, 1956, 1958, 1961, 1962], as: [18, 1948, 1962],
  }),
  mk({
    id: "joe-morgan", name: "Joe Morgan", nation: "United States", league: "USA", active: false, debut: 1963,
    blurb: "Back-to-back MVPs and two titles as the engine of the Big Red Machine, the finest all-around second baseman ever.",
    mvp: [1975, 1976], ws: [1975, 1976], st: [1972, 1974, 1975, 1976, 1976], as: [10, 1966, 1979],
  }),
  mk({
    id: "jackie-robinson", name: "Jackie Robinson", nation: "United States", league: "USA", active: false, debut: 1947,
    blurb: "The 1949 MVP and batting champion who broke the color line and won the 1955 title with Brooklyn.",
    mvp: [1949], ws: [1955], st: [1947, 1949, 1949, 1952], as: [6, 1949, 1954],
  }),
  mk({
    id: "roberto-clemente", name: "Roberto Clemente", nation: "Puerto Rico", league: "PUR", active: false, debut: 1955,
    blurb: "An MVP, four batting titles and two championships from the greatest right fielder ever to come out of Puerto Rico.",
    mvp: [1966], ws: [1960, 1971], st: [1961, 1964, 1965, 1967], as: [15, 1960, 1972],
  }),
  mk({
    id: "cal-ripken-jr", name: "Cal Ripken Jr.", nation: "United States", league: "USA", active: false, debut: 1981,
    blurb: "Two MVPs, a 1983 title and 2,632 straight games, the shortstop who redefined the position and iron-man durability.",
    mvp: [1983, 1991], ws: [1983], as: [19, 1983, 2001],
  }),
  mk({
    id: "miguel-cabrera", name: "Miguel Cabrera", nation: "Venezuela", league: "VEN", active: false, debut: 2003,
    blurb: "Two MVPs and baseball's first Triple Crown in 45 years, the defining right-handed hitter of his generation.",
    mvp: [2012, 2013], tc: [2012], ws: [2003], st: [2008, 2010, 2010, 2011, 2011, 2012, 2012, 2012, 2012, 2013, 2013, 2013, 2015, 2015], as: [12, 2004, 2022],
  }),
  mk({
    id: "nap-lajoie", name: "Nap Lajoie", nation: "United States", league: "USA", active: false, debut: 1896,
    blurb: "The 1901 Triple Crown and a .426 season, the dead-ball era's premier second baseman. Predates the MVP and All-Star eras.",
    tc: [1901], st: [1897, 1898, 1901, 1901, 1901, 1901, 1901, 1903, 1903, 1904, 1904, 1904, 1904],
  }),
  mk({
    id: "tris-speaker", name: "Tris Speaker", nation: "United States", league: "USA", active: false, debut: 1907,
    blurb: "A 1912 MVP and three World Series titles, the finest defensive center fielder of the dead-ball era. Predates the All-Star era.",
    mvp: [1912], ws: [1912, 1915, 1920], st: [1912, 1912, 1916, 1916, 1916, 1922, 1923, 1925],
  }),
  mk({
    id: "christy-mathewson", name: "Christy Mathewson", nation: "United States", league: "USA", active: false, debut: 1900,
    blurb: "Two pitching Triple Crowns and 373 wins, the dead-ball era's defining right-hander. Predates the Cy Young and All-Star eras.",
    tc: [1905, 1908], ws: [1905], st: [1903, 1904, 1905, 1905, 1905, 1907, 1907, 1908, 1908, 1908, 1909, 1910, 1911, 1913],
  }),
  mk({
    id: "warren-spahn", name: "Warren Spahn", nation: "United States", league: "USA", active: false, debut: 1942,
    blurb: "A Cy Young, eight wins titles and 363 victories, the winningest left-hander in the sport's history.",
    cy: [1957], ws: [1957], st: [1947, 1949, 1949, 1950, 1950, 1951, 1952, 1953, 1953, 1957, 1958, 1959, 1960, 1961, 1961], as: [17, 1947, 1963],
  }),
  mk({
    id: "bob-gibson", name: "Bob Gibson", nation: "United States", league: "USA", active: false, debut: 1959,
    blurb: "An MVP, two Cy Youngs and two titles, whose 1.12 ERA in 1968 helped force baseball to lower the mound.",
    mvp: [1968], cy: [1968, 1970], ws: [1964, 1967], st: [1968, 1968, 1970], as: [9, 1962, 1972],
  }),
  mk({
    id: "tom-seaver", name: "Tom Seaver", nation: "United States", league: "USA", active: false, debut: 1967,
    blurb: "Three Cy Youngs and the ace of the 1969 Miracle Mets, the standard-setting power right-hander of his era.",
    cy: [1969, 1973, 1975], ws: [1969], st: [1969, 1970, 1970, 1971, 1971, 1973, 1973, 1975, 1975, 1976, 1981], as: [12, 1967, 1981],
  }),
  mk({
    id: "lefty-grove", name: "Lefty Grove", nation: "United States", league: "USA", active: false, debut: 1925,
    blurb: "An MVP, two pitching Triple Crowns, a record nine ERA titles and two championships, the dominant left-hander of the 1930s.",
    mvp: [1931], tc: [1930, 1931], ws: [1929, 1930], st: [1925, 1926, 1926, 1927, 1928, 1928, 1929, 1929, 1930, 1930, 1930, 1931, 1931, 1931, 1932, 1933, 1935, 1936, 1938, 1939], as: [6, 1933, 1939],
  }),
  mk({
    id: "grover-cleveland-alexander", name: "Grover Cleveland Alexander", nation: "United States", league: "USA", active: false, debut: 1911,
    blurb: "Three pitching Triple Crowns and 373 wins, one of the most decorated arms of the dead-ball era. Predates the Cy Young and All-Star eras.",
    tc: [1915, 1916, 1920], ws: [1926], st: [1911, 1912, 1914, 1914, 1915, 1915, 1915, 1916, 1916, 1916, 1917, 1917, 1919, 1920, 1920, 1920],
  }),
  mk({
    id: "steve-carlton", name: "Steve Carlton", nation: "United States", league: "USA", active: false, debut: 1965,
    blurb: "Four Cy Youngs, the 1972 pitching Triple Crown and two titles, the most decorated left-hander of his generation.",
    cy: [1972, 1977, 1980, 1982], tc: [1972], ws: [1967, 1980], st: [1972, 1972, 1972, 1974, 1977, 1980, 1980, 1982, 1982, 1983], as: [10, 1968, 1982],
  }),
  mk({
    id: "nolan-ryan", name: "Nolan Ryan", nation: "United States", league: "USA", active: false, debut: 1966,
    blurb: "A record 5,714 strikeouts, eleven strikeout titles and seven no-hitters, the hardest thrower the game has known.",
    ws: [1969], st: [1972, 1973, 1974, 1976, 1977, 1978, 1979, 1981, 1987, 1987, 1988, 1989, 1990], as: [8, 1972, 1989],
  }),
];
