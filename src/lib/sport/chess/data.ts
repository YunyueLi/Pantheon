import type { Achievement, Player } from "../types";

/**
 * Chess roster — 22 all-time greats ranked in ONE open pool. All counts verified
 * against Wikipedia (World Chess Championship, List of FIDE chess world number
 * ones, Candidates Tournament) and FIDE records; FROZEN at the end of 2025.
 *
 * Each World Championship match win/defense is a dated entry at its match year
 * (so the timeline and peak lenses are truthful); each year-end world No. 1 and
 * each Candidates win is likewise a dated entry. See model.ts for the exact
 * counting rules. Year-end world No. 1 exists only from 1971 (the FIDE rating
 * era), so pre-rating champions (Steinitz, Lasker, Capablanca, Alekhine, Euwe,
 * Botvinnik, Smyslov, Tal, Petrosian, Spassky) carry none — by design.
 */
const AT = (type: string, years: number[] = []): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; nation: string; league: string; active: boolean; debut: number; blurb: string;
  /** Years of a successful WC match (win or defense), classical/undisputed lineage. */
  wc?: number[];
  /** Calendar years finished as FIDE world No. 1 (rating era, from 1971). */
  no1?: number[];
  /** Years a Candidates Tournament / Candidates final was won. */
  cand?: number[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "chess", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...AT("wc_title", r.wc),
    ...AT("world_no1", r.no1),
    ...AT("candidates", r.cand),
  ],
});

export const CHESS_PLAYERS: Player[] = [
  mk({ id: "garry-kasparov", name: "Garry Kasparov", nation: "Russia", league: "RUS", active: false, debut: 1980, wc: [1985, 1986, 1987, 1990, 1993, 1995], no1: [1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005], cand: [1984], blurb: "Six world-title matches won and a record 21 years as the world's No. 1; the most dominant force the board has known." }),
  mk({ id: "magnus-carlsen", name: "Magnus Carlsen", nation: "Norway", league: "NOR", active: true, debut: 2001, wc: [2013, 2014, 2016, 2018, 2021], no1: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], cand: [2013], blurb: "Five title matches won and an unbroken reign atop the rating list since 2011; the highest-rated player in history." }),
  mk({ id: "anatoly-karpov", name: "Anatoly Karpov", nation: "Russia", league: "RUS", active: false, debut: 1970, wc: [1975, 1978, 1981], no1: [1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1994], cand: [1974], blurb: "Classical champion for a decade and nine years the world No. 1; a positional python who smothered a generation." }),
  mk({ id: "bobby-fischer", name: "Bobby Fischer", nation: "United States", league: "USA", active: false, debut: 1958, wc: [1972], no1: [1971, 1972, 1973, 1974, 1975], cand: [1971], blurb: "The 1972 world champion and the first-ever FIDE No. 1; a lone American genius who broke the Soviet monopoly." }),
  mk({ id: "emanuel-lasker", name: "Emanuel Lasker", nation: "Germany", league: "GER", active: false, debut: 1889, wc: [1894, 1897, 1907, 1908, 1910, 1911], blurb: "World champion for a record 27 years with six title matches won; a fighting universalist decades ahead of his time." }),
  mk({ id: "jose-raul-capablanca", name: "José Raúl Capablanca", nation: "Cuba", league: "CUB", active: false, debut: 1909, wc: [1921], blurb: "The 1921 world champion who lost only a handful of games in his prime; a flawless endgame technician nicknamed the chess machine." }),
  mk({ id: "alexander-alekhine", name: "Alexander Alekhine", nation: "France", league: "FRA", active: false, debut: 1914, wc: [1927, 1929, 1934, 1937], blurb: "Four title matches won across two reigns and the only champion to die holding the crown; a ferocious attacking artist." }),
  mk({ id: "mikhail-botvinnik", name: "Mikhail Botvinnik", nation: "Russia", league: "RUS", active: false, debut: 1927, wc: [1948, 1951, 1954, 1958, 1961], blurb: "Three-time world champion who twice regained the title by rematch; the patriarch of the Soviet chess school." }),
  mk({ id: "vladimir-kramnik", name: "Vladimir Kramnik", nation: "Russia", league: "RUS", active: false, debut: 1992, wc: [2000, 2004, 2006], blurb: "Dethroned Kasparov in 2000 and reunified the crown in 2006; a deep strategist who never lost a title match on the board." }),
  mk({ id: "viswanathan-anand", name: "Viswanathan Anand", nation: "India", league: "IND", active: false, debut: 1987, wc: [2007, 2008, 2010, 2012], no1: [2007, 2008, 2009, 2010], cand: [2014], blurb: "Undisputed champion 2007–2013 with three defenses; India's first grandmaster and the fastest calculator of his era." }),
  mk({ id: "tigran-petrosian", name: "Tigran Petrosian", nation: "Armenia", league: "ARM", active: false, debut: 1946, wc: [1963, 1966], cand: [1962], blurb: "World champion 1963–69 and the hardest man to beat in history; a prophylactic genius who saw danger before it formed." }),
  mk({ id: "boris-spassky", name: "Boris Spassky", nation: "Russia", league: "RUS", active: false, debut: 1953, wc: [1969], cand: [1965, 1968], blurb: "The 1969 world champion and a two-time Candidates winner; a universal player famed for the 1972 match with Fischer." }),
  mk({ id: "mikhail-tal", name: "Mikhail Tal", nation: "Latvia", league: "LAT", active: false, debut: 1949, wc: [1960], cand: [1959], blurb: "The youngest champion of his day and the great sacrificial magician; a whirlwind attacker adored the world over." }),
  mk({ id: "vasily-smyslov", name: "Vasily Smyslov", nation: "Russia", league: "RUS", active: false, debut: 1938, wc: [1957], cand: [1953, 1956], blurb: "World champion 1957–58 and still a Candidates finalist at 63; a harmonious virtuoso with a flawless positional touch." }),
  mk({ id: "max-euwe", name: "Max Euwe", nation: "Netherlands", league: "NED", active: false, debut: 1921, wc: [1935], blurb: "The 1935–37 world champion and later FIDE president; a scholarly amateur who toppled Alekhine at his peak." }),
  mk({ id: "wilhelm-steinitz", name: "Wilhelm Steinitz", nation: "Austria", league: "AUT", active: false, debut: 1862, wc: [1886, 1889, 1891, 1892], blurb: "The first official world champion and father of positional chess; codified the principles the modern game rests on." }),
  mk({ id: "paul-morphy", name: "Paul Morphy", nation: "United States", league: "USA", active: false, debut: 1857, blurb: "The unofficial champion of the 1850s who crushed all of Europe; a pre-title prodigy whose brilliance became legend." }),
  mk({ id: "viktor-korchnoi", name: "Viktor Korchnoi", nation: "Russia", league: "RUS", active: false, debut: 1946, cand: [1977, 1980], blurb: "Two-time challenger who twice pushed Karpov to the brink; the fiercest fighter never to hold the crown." }),
  mk({ id: "fabiano-caruana", name: "Fabiano Caruana", nation: "United States", league: "USA", active: true, debut: 2007, cand: [2018], blurb: "The 2018 challenger and world No. 2 with a 2844 peak; America's finest classical player of the modern era." }),
  mk({ id: "ding-liren", name: "Ding Liren", nation: "China", league: "CHN", active: true, debut: 2009, wc: [2023], blurb: "The 2023 world champion and China's first; a resilient, deeply calculating talent who reached the sport's summit." }),
  mk({ id: "hikaru-nakamura", name: "Hikaru Nakamura", nation: "United States", league: "USA", active: true, debut: 2003, blurb: "A five-time U.S. champion and world No. 2 in classical, blitz and rapid; the game's most influential streaming star." }),
  mk({ id: "judit-polgar", name: "Judit Polgár", nation: "Hungary", league: "HUN", active: false, debut: 1988, blurb: "The strongest female player in history, peaking at world No. 8 in the open field; a fearless attacker who beat every champion of her era." }),
];
