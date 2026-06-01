import type { Player } from "../types";
import { honorScore } from "../honor";
import { BASKETBALL_PLAYERS } from "./data";
import { BASKETBALL_MODEL } from "./model";

export type Conference = "East" | "West";

export type Franchise = {
  id: string;
  name: string;
  code: string;
  conference: Conference;
  /** NBA Championships won (franchise-continuous; ABA/NBL titles excluded). */
  titles: number;
  /** Total NBA Finals appearances (wins + losses, franchise-continuous). */
  finals: number;
  titleYears: number[];
};

/**
 * NBA franchise honors, verified against English Wikipedia franchise pages cross-
 * checked with the "List of NBA champions" master table, as of the end of the
 * 2024-25 season (the June 2025 Finals — Oklahoma City won its first OKC-era title).
 * Counts are FRANCHISE-CONTINUOUS (relocations/renames included): Lakers include the
 * 5 Minneapolis titles; Warriors include Philadelphia/San Francisco; 76ers include
 * the 1955 Syracuse Nationals; Thunder include the 1979 Seattle SuperSonics; Hawks
 * include 1958 St. Louis; Wizards include the 1978 Bullets; Kings include 1951
 * Rochester. ABA titles (Nets, Pacers, Spurs, Nuggets) and pre-NBA NBL titles
 * (Lakers 1948, Kings 1946) are NOT counted as NBA championships.
 * Franchises that have never reached an NBA Finals are omitted from this ranking.
 */
export const FRANCHISES: Franchise[] = [
  { id: "boston-celtics", name: "Boston Celtics", code: "BOS", conference: "East", titles: 18, finals: 23, titleYears: [1957, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1968, 1969, 1974, 1976, 1981, 1984, 1986, 2008, 2024] },
  { id: "los-angeles-lakers", name: "Los Angeles Lakers", code: "LAL", conference: "West", titles: 17, finals: 32, titleYears: [1949, 1950, 1952, 1953, 1954, 1972, 1980, 1982, 1985, 1987, 1988, 2000, 2001, 2002, 2009, 2010, 2020] },
  { id: "golden-state-warriors", name: "Golden State Warriors", code: "GSW", conference: "West", titles: 7, finals: 12, titleYears: [1947, 1956, 1975, 2015, 2017, 2018, 2022] },
  { id: "chicago-bulls", name: "Chicago Bulls", code: "CHI", conference: "East", titles: 6, finals: 6, titleYears: [1991, 1992, 1993, 1996, 1997, 1998] },
  { id: "san-antonio-spurs", name: "San Antonio Spurs", code: "SAS", conference: "West", titles: 5, finals: 6, titleYears: [1999, 2003, 2005, 2007, 2014] },
  { id: "philadelphia-76ers", name: "Philadelphia 76ers", code: "PHI", conference: "East", titles: 3, finals: 9, titleYears: [1955, 1967, 1983] },
  { id: "detroit-pistons", name: "Detroit Pistons", code: "DET", conference: "East", titles: 3, finals: 7, titleYears: [1989, 1990, 2004] },
  { id: "miami-heat", name: "Miami Heat", code: "MIA", conference: "East", titles: 3, finals: 6, titleYears: [2006, 2012, 2013] },
  { id: "new-york-knicks", name: "New York Knicks", code: "NYK", conference: "East", titles: 2, finals: 8, titleYears: [1970, 1973] },
  { id: "oklahoma-city-thunder", name: "Oklahoma City Thunder", code: "OKC", conference: "West", titles: 2, finals: 5, titleYears: [1979, 2025] },
  { id: "houston-rockets", name: "Houston Rockets", code: "HOU", conference: "West", titles: 2, finals: 4, titleYears: [1994, 1995] },
  { id: "milwaukee-bucks", name: "Milwaukee Bucks", code: "MIL", conference: "East", titles: 2, finals: 3, titleYears: [1971, 2021] },
  { id: "cleveland-cavaliers", name: "Cleveland Cavaliers", code: "CLE", conference: "East", titles: 1, finals: 5, titleYears: [2016] },
  { id: "atlanta-hawks", name: "Atlanta Hawks", code: "ATL", conference: "East", titles: 1, finals: 4, titleYears: [1958] },
  { id: "washington-wizards", name: "Washington Wizards", code: "WAS", conference: "East", titles: 1, finals: 4, titleYears: [1978] },
  { id: "dallas-mavericks", name: "Dallas Mavericks", code: "DAL", conference: "West", titles: 1, finals: 3, titleYears: [2011] },
  { id: "portland-trail-blazers", name: "Portland Trail Blazers", code: "POR", conference: "West", titles: 1, finals: 3, titleYears: [1977] },
  { id: "denver-nuggets", name: "Denver Nuggets", code: "DEN", conference: "West", titles: 1, finals: 1, titleYears: [2023] },
  { id: "sacramento-kings", name: "Sacramento Kings", code: "SAC", conference: "West", titles: 1, finals: 1, titleYears: [1951] },
  { id: "toronto-raptors", name: "Toronto Raptors", code: "TOR", conference: "East", titles: 1, finals: 1, titleYears: [2019] },
  { id: "phoenix-suns", name: "Phoenix Suns", code: "PHX", conference: "West", titles: 0, finals: 3, titleYears: [] },
  { id: "utah-jazz", name: "Utah Jazz", code: "UTA", conference: "West", titles: 0, finals: 2, titleYears: [] },
  { id: "orlando-magic", name: "Orlando Magic", code: "ORL", conference: "East", titles: 0, finals: 2, titleYears: [] },
  { id: "indiana-pacers", name: "Indiana Pacers", code: "IND", conference: "East", titles: 0, finals: 2, titleYears: [] },
  { id: "brooklyn-nets", name: "Brooklyn Nets", code: "BKN", conference: "East", titles: 0, finals: 2, titleYears: [] },
];

/** Championship is the pinnacle; each Finals appearance adds a sustained-contention bonus. */
export const TITLE_WEIGHT = 100;
export const FINALS_WEIGHT = 8;

export function franchiseHonor(f: Franchise): number {
  return f.titles * TITLE_WEIGHT + f.finals * FINALS_WEIGHT;
}

export function getFranchise(id: string): Franchise | undefined {
  return FRANCHISES.find((f) => f.id === id);
}

/** Global ranking. Pass a conference to view (and re-rank within) one conference. */
export function rankedFranchises(conference?: Conference): { franchise: Franchise; honor: number; rank: number }[] {
  return FRANCHISES.filter((f) => !conference || f.conference === conference)
    .map((franchise) => ({ franchise, honor: franchiseHonor(franchise) }))
    .sort((a, b) => b.honor - a.honor)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

/** Roster players most associated with this franchise (exact team match). */
export function franchisePlayers(f: Franchise): Player[] {
  return BASKETBALL_PLAYERS.filter((p) => p.team === f.name).sort(
    (a, b) => honorScore(b, BASKETBALL_MODEL) - honorScore(a, BASKETBALL_MODEL)
  );
}
