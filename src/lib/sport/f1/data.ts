import type { Achievement, Player } from "../types";

/**
 * Formula 1 roster — 25 consensus all-time-great drivers. World title YEARS are
 * exact; win/pole/podium career totals are carried as a single bulk entry with
 * `count` (so "105 wins" is one row, not 105). All figures verified against
 * English Wikipedia and capped at the END of the 2024 season (2025 excluded).
 */

// Dated honor (one entry per year) — used for World Championships.
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));
// Bulk volume honor — a single entry carrying the career count.
const C = (type: string, count: number, year: number): Achievement[] =>
  count > 0 ? [{ type, year, count }] : [];

type Raw = {
  id: string;
  name: string;
  nation: string;
  league: string;
  active: boolean;
  debut: number;
  blurb: string;
  honors: Achievement[];
};

const mk = (r: Raw): Player => ({
  id: r.id,
  name: r.name,
  sport: "f1",
  league: r.league,
  position: "",
  team: "",
  nation: r.nation,
  active: r.active,
  debutYear: r.debut,
  blurb: r.blurb,
  achievements: r.honors,
});

export const F1_PLAYERS: Player[] = [
  mk({
    id: "lewis-hamilton", name: "Lewis Hamilton", nation: "United Kingdom", league: "GBR", active: true, debut: 2007,
    blurb: "Joint-record seven titles and all-time records for wins, poles and podiums; the modern statistical GOAT.",
    honors: [...A("wdc", [2008, 2014, 2015, 2017, 2018, 2019, 2020]), ...C("race_win", 105, 2020), ...C("pole", 104, 2020), ...C("podium", 202, 2021)],
  }),
  mk({
    id: "michael-schumacher", name: "Michael Schumacher", nation: "Germany", league: "GER", active: false, debut: 1991,
    blurb: "Seven-time champion who redefined professionalism and dragged Ferrari to five consecutive titles.",
    honors: [...A("wdc", [1994, 1995, 2000, 2001, 2002, 2003, 2004]), ...C("race_win", 91, 2002), ...C("pole", 68, 2002), ...C("podium", 155, 2003)],
  }),
  mk({
    id: "juan-manuel-fangio", name: "Juan Manuel Fangio", nation: "Argentina", league: "ARG", active: false, debut: 1950,
    blurb: "Won five titles with four different teams in F1's deadly first decade; the original maestro.",
    honors: [...A("wdc", [1951, 1954, 1955, 1956, 1957]), ...C("race_win", 24, 1955), ...C("pole", 29, 1955), ...C("podium", 35, 1955)],
  }),
  mk({
    id: "ayrton-senna", name: "Ayrton Senna", nation: "Brazil", league: "BRA", active: false, debut: 1984,
    blurb: "Three titles and a near-mythic qualifying genius; widely revered as the most naturally gifted ever.",
    honors: [...A("wdc", [1988, 1990, 1991]), ...C("race_win", 41, 1990), ...C("pole", 65, 1990), ...C("podium", 80, 1991)],
  }),
  mk({
    id: "alain-prost", name: "Alain Prost", nation: "France", league: "FRA", active: false, debut: 1980,
    blurb: "Four titles and a cerebral racecraft that earned him the nickname 'The Professor'.",
    honors: [...A("wdc", [1985, 1986, 1989, 1993]), ...C("race_win", 51, 1988), ...C("pole", 33, 1988), ...C("podium", 106, 1990)],
  }),
  mk({
    id: "max-verstappen", name: "Max Verstappen", nation: "Netherlands", league: "NED", active: true, debut: 2015,
    blurb: "Four straight titles by end-2024, including a record-breaking 2023; the dominant force of his era.",
    honors: [...A("wdc", [2021, 2022, 2023, 2024]), ...C("race_win", 63, 2023), ...C("pole", 40, 2023), ...C("podium", 112, 2024)],
  }),
  mk({
    id: "sebastian-vettel", name: "Sebastian Vettel", nation: "Germany", league: "GER", active: false, debut: 2007,
    blurb: "Four consecutive Red Bull titles; once the youngest world champion in F1 history.",
    honors: [...A("wdc", [2010, 2011, 2012, 2013]), ...C("race_win", 53, 2013), ...C("pole", 57, 2013), ...C("podium", 122, 2018)],
  }),
  mk({
    id: "niki-lauda", name: "Niki Lauda", nation: "Austria", league: "AUT", active: false, debut: 1971,
    blurb: "Three titles either side of a near-fatal 1976 fire; an icon of resilience and analytical racing.",
    honors: [...A("wdc", [1975, 1977, 1984]), ...C("race_win", 25, 1977), ...C("pole", 24, 1977), ...C("podium", 54, 1978)],
  }),
  mk({
    id: "jackie-stewart", name: "Jackie Stewart", nation: "United Kingdom", league: "GBR", active: false, debut: 1965,
    blurb: "Three-time champion and the sport's foremost safety crusader, transforming F1 off the track.",
    honors: [...A("wdc", [1969, 1971, 1973]), ...C("race_win", 27, 1971), ...C("pole", 17, 1971), ...C("podium", 43, 1972)],
  }),
  mk({
    id: "jim-clark", name: "Jim Clark", nation: "United Kingdom", league: "GBR", active: false, debut: 1960,
    blurb: "Two titles and a sublime natural talent at Lotus; regarded by peers as untouchable before his 1968 death.",
    honors: [...A("wdc", [1963, 1965]), ...C("race_win", 25, 1965), ...C("pole", 33, 1965), ...C("podium", 32, 1965)],
  }),
  mk({
    id: "fernando-alonso", name: "Fernando Alonso", nation: "Spain", league: "ESP", active: true, debut: 2001,
    blurb: "Ended Schumacher's reign with back-to-back titles; revered for elite racecraft across two decades.",
    honors: [...A("wdc", [2005, 2006]), ...C("race_win", 32, 2013), ...C("pole", 22, 2012), ...C("podium", 106, 2023)],
  }),
  mk({
    id: "nelson-piquet", name: "Nelson Piquet", nation: "Brazil", league: "BRA", active: false, debut: 1978,
    blurb: "Three-time champion of the turbo era, blending raw speed with shrewd technical feedback.",
    honors: [...A("wdc", [1981, 1983, 1987]), ...C("race_win", 23, 1986), ...C("pole", 24, 1986), ...C("podium", 60, 1987)],
  }),
  mk({
    id: "nigel-mansell", name: "Nigel Mansell", nation: "United Kingdom", league: "GBR", active: false, debut: 1980,
    blurb: "Won 31 races and a dominant 1992 title; a fearless, fan-adored attacker behind the wheel.",
    honors: [...A("wdc", [1992]), ...C("race_win", 31, 1992), ...C("pole", 32, 1992), ...C("podium", 59, 1991)],
  }),
  mk({
    id: "jack-brabham", name: "Jack Brabham", nation: "Australia", league: "AUS", active: false, debut: 1955,
    blurb: "Three-time champion and the only man to win a title in a car of his own construction.",
    honors: [...A("wdc", [1959, 1960, 1966]), ...C("race_win", 14, 1960), ...C("pole", 13, 1960), ...C("podium", 31, 1966)],
  }),
  mk({
    id: "stirling-moss", name: "Stirling Moss", nation: "United Kingdom", league: "GBR", active: false, debut: 1951,
    blurb: "The greatest driver never to win the title, finishing championship runner-up four times.",
    honors: [...C("race_win", 16, 1958), ...C("pole", 16, 1958), ...C("podium", 24, 1958)],
  }),
  mk({
    id: "mika-hakkinen", name: "Mika Häkkinen", nation: "Finland", league: "FIN", active: false, debut: 1991,
    blurb: "Back-to-back McLaren titles and the one rival Schumacher openly said he respected most.",
    honors: [...A("wdc", [1998, 1999]), ...C("race_win", 20, 1999), ...C("pole", 26, 1999), ...C("podium", 51, 2000)],
  }),
  mk({
    id: "emerson-fittipaldi", name: "Emerson Fittipaldi", nation: "Brazil", league: "BRA", active: false, debut: 1970,
    blurb: "Then the youngest champion in 1972 and a two-time winner who later conquered IndyCar too.",
    honors: [...A("wdc", [1972, 1974]), ...C("race_win", 14, 1973), ...C("pole", 6, 1973), ...C("podium", 35, 1974)],
  }),
  mk({
    id: "graham-hill", name: "Graham Hill", nation: "United Kingdom", league: "GBR", active: false, debut: 1958,
    blurb: "Two-time champion and the only driver to win motorsport's Triple Crown of Monaco, Indy 500 and Le Mans.",
    honors: [...A("wdc", [1962, 1968]), ...C("race_win", 14, 1965), ...C("pole", 13, 1965), ...C("podium", 36, 1968)],
  }),
  mk({
    id: "kimi-raikkonen", name: "Kimi Räikkönen", nation: "Finland", league: "FIN", active: false, debut: 2001,
    blurb: "2007 Ferrari champion and the sport's all-time starts leader; the cult-favourite 'Iceman'.",
    honors: [...A("wdc", [2007]), ...C("race_win", 21, 2008), ...C("pole", 18, 2008), ...C("podium", 103, 2018)],
  }),
  mk({
    id: "damon-hill", name: "Damon Hill", nation: "United Kingdom", league: "GBR", active: false, debut: 1992,
    blurb: "1996 champion who, with father Graham, formed F1's only father-and-son title-winning pair.",
    honors: [...A("wdc", [1996]), ...C("race_win", 22, 1996), ...C("pole", 20, 1996), ...C("podium", 42, 1995)],
  }),
  mk({
    id: "jenson-button", name: "Jenson Button", nation: "United Kingdom", league: "GBR", active: false, debut: 2000,
    blurb: "2009 Brawn champion renowned for silky smoothness and mastery of changeable wet conditions.",
    honors: [...A("wdc", [2009]), ...C("race_win", 15, 2011), ...C("pole", 8, 2009), ...C("podium", 50, 2012)],
  }),
  mk({
    id: "mario-andretti", name: "Mario Andretti", nation: "United States", league: "USA", active: false, debut: 1968,
    blurb: "1978 Lotus champion and a uniquely versatile American great across F1, IndyCar and NASCAR.",
    honors: [...A("wdc", [1978]), ...C("race_win", 12, 1977), ...C("pole", 18, 1977), ...C("podium", 19, 1978)],
  }),
  mk({
    id: "alberto-ascari", name: "Alberto Ascari", nation: "Italy", league: "ITA", active: false, debut: 1950,
    blurb: "F1's first two-time champion, utterly dominant for Ferrari across the 1952 and 1953 seasons.",
    honors: [...A("wdc", [1952, 1953]), ...C("race_win", 13, 1952), ...C("pole", 14, 1952), ...C("podium", 17, 1953)],
  }),
  mk({
    id: "nico-rosberg", name: "Nico Rosberg", nation: "Germany", league: "GER", active: false, debut: 2006,
    blurb: "Beat team-mate Hamilton to the 2016 title, then immediately retired as reigning champion.",
    honors: [...A("wdc", [2016]), ...C("race_win", 23, 2015), ...C("pole", 30, 2016), ...C("podium", 57, 2016)],
  }),
  mk({
    id: "gilles-villeneuve", name: "Gilles Villeneuve", nation: "Canada", league: "CAN", active: false, debut: 1977,
    blurb: "A spectacular, fearless Ferrari hero whose legend outstrips his stats; killed qualifying in 1982.",
    honors: [...C("race_win", 6, 1979), ...C("pole", 2, 1979), ...C("podium", 13, 1979)],
  }),
];
