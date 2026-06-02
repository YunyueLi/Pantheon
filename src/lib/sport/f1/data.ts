import type { Achievement, Player } from "../types";

/**
 * Formula 1 roster — 60 drivers: every World Drivers' Champion (1950–2024) plus
 * the leading non-champions by wins/poles/podiums. World-title YEARS are exact;
 * win/pole/podium totals are bulk counts (shown ×N, not tied to one season).
 * All figures verified against English Wikipedia + statsf1 and FROZEN at the end
 * of the 2024 season (2025 results excluded).
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));
const C = (type: string, count: number, year: number): Achievement[] =>
  count > 0 ? [{ type, year, count }] : [];

type Raw = {
  id: string; name: string; nation: string; league: string; active: boolean; debut: number;
  blurb: string; wdc: number[]; wins: number; poles: number; podiums: number;
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "f1", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...A("wdc", r.wdc),
    ...C("race_win", r.wins, r.debut + 8), ...C("pole", r.poles, r.debut + 8), ...C("podium", r.podiums, r.debut + 8),
  ],
});

export const F1_PLAYERS: Player[] = [
  mk({ id: "lewis-hamilton", name: "Lewis Hamilton", nation: "United Kingdom", league: "GBR", active: true, debut: 2007, wdc: [2008, 2014, 2015, 2017, 2018, 2019, 2020], wins: 105, poles: 104, podiums: 202, blurb: "Record-holder for wins, poles and podiums; seven titles tie the all-time championship record." }),
  mk({ id: "michael-schumacher", name: "Michael Schumacher", nation: "Germany", league: "GER", active: false, debut: 1991, wdc: [1994, 1995, 2000, 2001, 2002, 2003, 2004], wins: 91, poles: 68, podiums: 155, blurb: "Ferrari's dynasty-builder with seven titles and five straight; redefined driver fitness and team-building." }),
  mk({ id: "juan-manuel-fangio", name: "Juan Manuel Fangio", nation: "Argentina", league: "ARG", active: false, debut: 1950, wdc: [1951, 1954, 1955, 1956, 1957], wins: 24, poles: 29, podiums: 35, blurb: "Five titles with four different marques and the highest win percentage in Formula One history." }),
  mk({ id: "ayrton-senna", name: "Ayrton Senna", nation: "Brazil", league: "BRA", active: false, debut: 1984, wdc: [1988, 1990, 1991], wins: 41, poles: 65, podiums: 80, blurb: "Three-time champion revered for qualifying genius and wet-weather mastery before his 1994 death." }),
  mk({ id: "max-verstappen", name: "Max Verstappen", nation: "Netherlands", league: "NED", active: true, debut: 2015, wdc: [2021, 2022, 2023, 2024], wins: 63, poles: 40, podiums: 112, blurb: "Four consecutive titles and a record-breaking 2023 season; youngest race winner in F1 history." }),
  mk({ id: "alain-prost", name: "Alain Prost", nation: "France", league: "FRA", active: false, debut: 1980, wdc: [1985, 1986, 1989, 1993], wins: 51, poles: 33, podiums: 106, blurb: "The Professor: four titles and a calculating, points-maximising style that long held the wins record." }),
  mk({ id: "sebastian-vettel", name: "Sebastian Vettel", nation: "Germany", league: "GER", active: false, debut: 2007, wdc: [2010, 2011, 2012, 2013], wins: 53, poles: 57, podiums: 122, blurb: "Four straight Red Bull titles; youngest-ever champion at the time of his 2010 crown." }),
  mk({ id: "jackie-stewart", name: "Jackie Stewart", nation: "United Kingdom", league: "GBR", active: false, debut: 1965, wdc: [1969, 1971, 1973], wins: 27, poles: 17, podiums: 43, blurb: "Three titles and a transformative safety crusade that reshaped the sport for generations." }),
  mk({ id: "jim-clark", name: "Jim Clark", nation: "United Kingdom", league: "GBR", active: false, debut: 1960, wdc: [1963, 1965], wins: 25, poles: 33, podiums: 32, blurb: "Lotus virtuoso whose dominance and natural speed made him many peers' greatest-ever pick." }),
  mk({ id: "niki-lauda", name: "Niki Lauda", nation: "Austria", league: "AUT", active: false, debut: 1971, wdc: [1975, 1977, 1984], wins: 25, poles: 24, podiums: 54, blurb: "Three titles either side of a near-fatal 1976 fire; the analytical comeback icon." }),
  mk({ id: "nelson-piquet", name: "Nelson Piquet", nation: "Brazil", league: "BRA", active: false, debut: 1978, wdc: [1981, 1983, 1987], wins: 23, poles: 24, podiums: 60, blurb: "Three-time champion of the turbo era, blending raw speed with shrewd technical feedback." }),
  mk({ id: "fernando-alonso", name: "Fernando Alonso", nation: "Spain", league: "ESP", active: true, debut: 2001, wdc: [2005, 2006], wins: 32, poles: 22, podiums: 106, blurb: "Ended Schumacher's reign with back-to-back titles; an enduring benchmark for racecraft across decades." }),
  mk({ id: "jack-brabham", name: "Jack Brabham", nation: "Australia", league: "AUS", active: false, debut: 1955, wdc: [1959, 1960, 1966], wins: 14, poles: 13, podiums: 31, blurb: "Three titles, the last in a car bearing his own name — a feat never repeated." }),
  mk({ id: "stirling-moss", name: "Stirling Moss", nation: "United Kingdom", league: "GBR", active: false, debut: 1951, wdc: [], wins: 16, poles: 16, podiums: 24, blurb: "The greatest driver never to win the title; his 16 wins long led all non-champions." }),
  mk({ id: "kimi-raikkonen", name: "Kimi Räikkönen", nation: "Finland", league: "FIN", active: false, debut: 2001, wdc: [2007], wins: 21, poles: 18, podiums: 103, blurb: "Ferrari's last champion to date; longevity icon with the most race starts at retirement." }),
  mk({ id: "nigel-mansell", name: "Nigel Mansell", nation: "United Kingdom", league: "GBR", active: false, debut: 1980, wdc: [1992], wins: 31, poles: 32, podiums: 59, blurb: "Crowd-favourite charger whose dominant 1992 finally delivered a long-chased world title." }),
  mk({ id: "emerson-fittipaldi", name: "Emerson Fittipaldi", nation: "Brazil", league: "BRA", active: false, debut: 1970, wdc: [1972, 1974], wins: 14, poles: 6, podiums: 35, blurb: "Two-time champion and, in 1972, the youngest title-winner for over three decades." }),
  mk({ id: "mika-hakkinen", name: "Mika Häkkinen", nation: "Finland", league: "FIN", active: false, debut: 1991, wdc: [1998, 1999], wins: 20, poles: 26, podiums: 51, blurb: "Back-to-back McLaren titles and the rival Schumacher himself most respected." }),
  mk({ id: "charles-leclerc", name: "Charles Leclerc", nation: "Monaco", league: "MCO", active: true, debut: 2018, wdc: [], wins: 8, poles: 26, podiums: 52, blurb: "Ferrari's qualifying specialist holding the most poles of any driver yet to win a title." }),
  mk({ id: "graham-hill", name: "Graham Hill", nation: "United Kingdom", league: "GBR", active: false, debut: 1958, wdc: [1962, 1968], wins: 14, poles: 13, podiums: 36, blurb: "Two-time champion and the only driver to win the Triple Crown of Monaco, Indy 500 and Le Mans." }),
  mk({ id: "alberto-ascari", name: "Alberto Ascari", nation: "Italy", league: "ITA", active: false, debut: 1950, wdc: [1952, 1953], wins: 13, poles: 14, podiums: 17, blurb: "Ferrari's first great champion, utterly dominant across the 1952-53 seasons." }),
  mk({ id: "jenson-button", name: "Jenson Button", nation: "United Kingdom", league: "GBR", active: false, debut: 2000, wdc: [2009], wins: 15, poles: 8, podiums: 50, blurb: "Seized the fairytale 2009 Brawn title after nearly a decade chasing his first." }),
  mk({ id: "nico-rosberg", name: "Nico Rosberg", nation: "Germany", league: "GER", active: false, debut: 2006, wdc: [2016], wins: 23, poles: 30, podiums: 57, blurb: "Beat team-mate Hamilton to the 2016 crown, then retired five days later." }),
  mk({ id: "damon-hill", name: "Damon Hill", nation: "United Kingdom", league: "GBR", active: false, debut: 1992, wdc: [1996], wins: 22, poles: 20, podiums: 42, blurb: "Williams champion of 1996 and the first son of a champion to take the title." }),
  mk({ id: "jacques-villeneuve", name: "Jacques Villeneuve", nation: "Canada", league: "CAN", active: false, debut: 1996, wdc: [1997], wins: 11, poles: 13, podiums: 23, blurb: "Indy 500 winner turned 1997 F1 champion in a celebrated title-decider with Schumacher." }),
  mk({ id: "james-hunt", name: "James Hunt", nation: "United Kingdom", league: "GBR", active: false, debut: 1973, wdc: [1976], wins: 10, poles: 14, podiums: 23, blurb: "Won the dramatic 1976 title by a single point in his rivalry with Lauda." }),
  mk({ id: "mario-andretti", name: "Mario Andretti", nation: "United States", league: "USA", active: false, debut: 1968, wdc: [1978], wins: 12, poles: 18, podiums: 19, blurb: "1978 champion and a motorsport all-rounder who also won the Indy 500 and Daytona 500." }),
  mk({ id: "jody-scheckter", name: "Jody Scheckter", nation: "South Africa", league: "RSA", active: false, debut: 1972, wdc: [1979], wins: 10, poles: 3, podiums: 33, blurb: "Ferrari's 1979 champion; no Scuderia driver matched his title for twenty-one years." }),
  mk({ id: "alan-jones", name: "Alan Jones", nation: "Australia", league: "AUS", active: false, debut: 1975, wdc: [1980], wins: 12, poles: 6, podiums: 24, blurb: "Tough, no-nonsense Australian who powered Williams to its maiden title in 1980." }),
  mk({ id: "keke-rosberg", name: "Keke Rosberg", nation: "Finland", league: "FIN", active: false, debut: 1978, wdc: [1982], wins: 5, poles: 5, podiums: 17, blurb: "Took the 1982 title with a single win in a famously open, attritional season." }),
  mk({ id: "denny-hulme", name: "Denny Hulme", nation: "New Zealand", league: "NZL", active: false, debut: 1965, wdc: [1967], wins: 8, poles: 1, podiums: 33, blurb: "New Zealand's only champion, taking the 1967 crown for Brabham with steady consistency." }),
  mk({ id: "jochen-rindt", name: "Jochen Rindt", nation: "Austria", league: "AUT", active: false, debut: 1964, wdc: [1970], wins: 6, poles: 10, podiums: 13, blurb: "Formula One's only posthumous champion, killed at Monza while leading the 1970 standings." }),
  mk({ id: "giuseppe-farina", name: "Giuseppe Farina", nation: "Italy", league: "ITA", active: false, debut: 1950, wdc: [1950], wins: 5, poles: 5, podiums: 20, blurb: "The sport's very first World Champion, winning the inaugural 1950 title with Alfa Romeo." }),
  mk({ id: "john-surtees", name: "John Surtees", nation: "United Kingdom", league: "GBR", active: false, debut: 1960, wdc: [1964], wins: 6, poles: 8, podiums: 24, blurb: "The only champion on both two and four wheels, adding the 1964 F1 crown to motorcycle titles." }),
  mk({ id: "mike-hawthorn", name: "Mike Hawthorn", nation: "United Kingdom", league: "GBR", active: false, debut: 1952, wdc: [1958], wins: 3, poles: 4, podiums: 18, blurb: "Britain's first World Champion in 1958, clinching it by a single point with consistency." }),
  mk({ id: "phil-hill", name: "Phil Hill", nation: "United States", league: "USA", active: false, debut: 1958, wdc: [1961], wins: 3, poles: 6, podiums: 16, blurb: "First American-born World Champion, taking the 1961 title with Ferrari at Monza." }),
  mk({ id: "lando-norris", name: "Lando Norris", nation: "United Kingdom", league: "GBR", active: true, debut: 2019, wdc: [], wins: 4, poles: 9, podiums: 26, blurb: "McLaren star who broke through for his maiden win in 2024 after a podium-laden wait." }),
  mk({ id: "valtteri-bottas", name: "Valtteri Bottas", nation: "Finland", league: "FIN", active: true, debut: 2013, wdc: [], wins: 10, poles: 20, podiums: 67, blurb: "Ten-time winner and key Mercedes number-two through their championship-dynasty years." }),
  mk({ id: "rubens-barrichello", name: "Rubens Barrichello", nation: "Brazil", league: "BRA", active: false, debut: 1993, wdc: [], wins: 11, poles: 14, podiums: 68, blurb: "Most race starts in history at retirement and the most podiums of any non-champion." }),
  mk({ id: "david-coulthard", name: "David Coulthard", nation: "United Kingdom", league: "GBR", active: false, debut: 1994, wdc: [], wins: 13, poles: 12, podiums: 62, blurb: "Thirteen wins and a 2001 runner-up finish across a long McLaren and Red Bull career." }),
  mk({ id: "carlos-reutemann", name: "Carlos Reutemann", nation: "Argentina", league: "ARG", active: false, debut: 1972, wdc: [], wins: 12, poles: 6, podiums: 45, blurb: "Mercurial talent who lost the 1981 title by a single point in the finale." }),
  mk({ id: "felipe-massa", name: "Felipe Massa", nation: "Brazil", league: "BRA", active: false, debut: 2002, wdc: [], wins: 11, poles: 16, podiums: 41, blurb: "Lost the 2008 title at the final corner of his home race by one point." }),
  mk({ id: "george-russell", name: "George Russell", nation: "United Kingdom", league: "GBR", active: true, debut: 2019, wdc: [], wins: 3, poles: 9, podiums: 15, blurb: "Mercedes' next-generation leader with multiple wins and poles by the end of 2024." }),
  mk({ id: "gerhard-berger", name: "Gerhard Berger", nation: "Austria", league: "AUT", active: false, debut: 1984, wdc: [], wins: 10, poles: 12, podiums: 48, blurb: "Ten-time winner for Ferrari, McLaren and Benetton across a popular fourteen-season career." }),
  mk({ id: "carlos-sainz", name: "Carlos Sainz Jr.", nation: "Spain", league: "ESP", active: true, debut: 2015, wdc: [], wins: 4, poles: 6, podiums: 27, blurb: "Consistent Ferrari race-winner whose 2024 included victories in Australia and Mexico." }),
  mk({ id: "daniel-ricciardo", name: "Daniel Ricciardo", nation: "Australia", league: "AUS", active: false, debut: 2011, wdc: [], wins: 8, poles: 3, podiums: 32, blurb: "Eight-time winner famed for audacious late braking and a beloved trademark charisma." }),
  mk({ id: "ronnie-peterson", name: "Ronnie Peterson", nation: "Sweden", league: "SWE", active: false, debut: 1970, wdc: [], wins: 10, poles: 14, podiums: 26, blurb: "Spectacular Swede and two-time runner-up, regarded as one of the fastest of his era." }),
  mk({ id: "mark-webber", name: "Mark Webber", nation: "Australia", league: "AUS", active: false, debut: 2002, wdc: [], wins: 9, poles: 13, podiums: 42, blurb: "Nine-time winner and frequent title contender alongside Vettel in Red Bull's dominant years." }),
  mk({ id: "sergio-perez", name: "Sergio Pérez", nation: "Mexico", league: "MEX", active: false, debut: 2011, wdc: [], wins: 6, poles: 3, podiums: 39, blurb: "Mexico's most successful F1 driver and Verstappen's title-winning Red Bull wingman." }),
  mk({ id: "rene-arnoux", name: "René Arnoux", nation: "France", league: "FRA", active: false, debut: 1978, wdc: [], wins: 7, poles: 18, podiums: 22, blurb: "Turbo-era charger whose 18 poles rank among the most for any non-champion." }),
  mk({ id: "jacky-ickx", name: "Jacky Ickx", nation: "Belgium", league: "BEL", active: false, debut: 1966, wdc: [], wins: 8, poles: 13, podiums: 25, blurb: "Two-time runner-up and six-time Le Mans winner, a giant of endurance and grand prix racing." }),
  mk({ id: "gilles-villeneuve", name: "Gilles Villeneuve", nation: "Canada", league: "CAN", active: false, debut: 1977, wdc: [], wins: 6, poles: 2, podiums: 13, blurb: "Fearless Ferrari icon whose spectacular flair made him a legend despite never winning the title." }),
  mk({ id: "juan-pablo-montoya", name: "Juan Pablo Montoya", nation: "Colombia", league: "COL", active: false, debut: 2001, wdc: [], wins: 7, poles: 13, podiums: 30, blurb: "Indy 500 winner and aggressive seven-time F1 victor who later conquered NASCAR and IndyCar." }),
  mk({ id: "clay-regazzoni", name: "Clay Regazzoni", nation: "Switzerland", league: "SUI", active: false, debut: 1970, wdc: [], wins: 5, poles: 5, podiums: 28, blurb: "Five-time winner, 1974 runner-up, and the driver who took Williams its first-ever victory." }),
  mk({ id: "riccardo-patrese", name: "Riccardo Patrese", nation: "Italy", league: "ITA", active: false, debut: 1977, wdc: [], wins: 6, poles: 8, podiums: 37, blurb: "Once held the record for most career starts; 1992 runner-up across seventeen seasons." }),
  mk({ id: "jacques-laffite", name: "Jacques Laffite", nation: "France", league: "FRA", active: false, debut: 1974, wdc: [], wins: 6, poles: 7, podiums: 32, blurb: "Six-time winner and Ligier mainstay whose career ended in a 1986 Brands Hatch crash." }),
  mk({ id: "oscar-piastri", name: "Oscar Piastri", nation: "Australia", league: "AUS", active: true, debut: 2023, wdc: [], wins: 2, poles: 0, podiums: 10, blurb: "Fast-rising McLaren talent who took his first two grand prix wins during 2024." }),
  mk({ id: "tony-brooks", name: "Tony Brooks", nation: "United Kingdom", league: "GBR", active: false, debut: 1956, wdc: [], wins: 6, poles: 3, podiums: 10, blurb: "1959 runner-up and a dentist-racer Fangio rated among the finest of his generation." }),
  mk({ id: "eddie-irvine", name: "Eddie Irvine", nation: "United Kingdom", league: "GBR", active: false, debut: 1993, wdc: [], wins: 4, poles: 0, podiums: 26, blurb: "Ferrari's 1999 title challenger, losing the crown to Häkkinen by two points." }),
  mk({ id: "jean-alesi", name: "Jean Alesi", nation: "France", league: "FRA", active: false, debut: 1989, wdc: [], wins: 1, poles: 2, podiums: 32, blurb: "Beloved Ferrari fan-favourite with 32 podiums but only a single, emotional 1995 win." }),
];
