import type { Achievement, Player } from "../types";

/**
 * UFC roster — 22 all-time greats, ranked in ONE mixed pound-for-pound pool
 * across every weight class and both genders (the four women — Nunes,
 * Shevchenko, Rousey — sit in the same board as the men, because the P4P GOAT
 * debate does). Every figure is WEB-VERIFIED against each fighter's Wikipedia
 * infobox plus UFC / secondary sources, current through 2026-07-06.
 *
 * ENCODING (see model.ts for the counting rules):
 *   • `ufc_title`     — one dated entry per UNDISPUTED belt WON, at its real win
 *                       year. Regaining a belt in the SAME division is not a new
 *                       entry (peak/longevity carry that story).
 *   • `title_defense` — F1's bulk-count pattern: ONE entry carrying `count` at
 *                       the year a reign began. Split across entries when a
 *                       fighter defended in more than one division/reign so the
 *                       timeline stays truthful (e.g. Jones: 11 @2011 + 1 @2023).
 *   • `double_champ`  — a single dated bonus at the year the SECOND-division
 *                       belt was won.
 *
 * Notable verified edge cases: Islam Makhachev became a two-division champ at
 * UFC 322 (Nov 15, 2025) by taking welterweight (sequential — he vacated
 * lightweight in June 2025 first). Anderson Silva is NOT a two-division champ
 * (the "Pride welterweight" belt in some data scrapes is a myth). Interim titles
 * (McGregor '15, GSP '07, Jones '16, Adesanya '19, Couture '03) and Holloway's
 * symbolic "BMF" belt are noted here but never counted.
 */
type TD = { year: number; count: number };
const AT = (type: string, years: number[] = []): Achievement[] => years.map((year) => ({ type, year }));
// Title defenses: one bulk-count entry per reign/division at the reign's start year.
const DEF = (reigns: TD[]): Achievement[] =>
  reigns.map(({ year, count }) => ({ type: "title_defense", year, count }));

type Raw = {
  id: string; name: string; nation: string; league: string; g: "M" | "W"; active: boolean; debut: number; blurb: string;
  titles: number[]; def: TD[]; dbl?: number;
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "ufc", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...AT("ufc_title", r.titles),
    ...DEF(r.def),
    ...(r.dbl ? [{ type: "double_champ", year: r.dbl }] : []),
  ],
});

export const UFC_PLAYERS: Player[] = [
  mk({ id: "jon-jones", name: "Jon Jones", nation: "United States", league: "USA", g: "M", active: false, debut: 2008, titles: [2011, 2023], def: [{ year: 2011, count: 11 }, { year: 2023, count: 1 }], dbl: 2023, blurb: "Undisputed light heavyweight then heavyweight champion, with a record 12 title defenses; the most complete fighter the sport has produced." }),
  mk({ id: "georges-st-pierre", name: "Georges St-Pierre", nation: "Canada", league: "CAN", g: "M", active: false, debut: 2004, titles: [2006, 2017], def: [{ year: 2008, count: 9 }], dbl: 2017, blurb: "Nine welterweight defenses across a five-year reign, then jumped up to take the middleweight belt; the model of two-division dominance." }),
  mk({ id: "anderson-silva", name: "Anderson Silva", nation: "Brazil", league: "BRA", g: "M", active: false, debut: 2006, titles: [2006], def: [{ year: 2006, count: 10 }], blurb: "Ten straight middleweight defenses over the longest title reign in UFC history; a striking virtuoso in his prime." }),
  mk({ id: "khabib-nurmagomedov", name: "Khabib Nurmagomedov", nation: "Russia", league: "RUS", g: "M", active: false, debut: 2012, titles: [2018], def: [{ year: 2018, count: 3 }], blurb: "Undefeated 29–0 lightweight champion who defended three times before retiring on top; a suffocating, untouchable grappler." }),
  mk({ id: "demetrious-johnson", name: "Demetrious Johnson", nation: "United States", league: "USA", g: "M", active: false, debut: 2011, titles: [2012], def: [{ year: 2012, count: 11 }], blurb: "Inaugural flyweight champion with a record 11 consecutive defenses; pound-for-pound the most technically flawless fighter of his era." }),
  mk({ id: "kamaru-usman", name: "Kamaru Usman", nation: "United States", league: "USA", g: "M", active: true, debut: 2015, titles: [2019], def: [{ year: 2019, count: 5 }], blurb: "Welterweight kingpin with five defenses and a 15-fight UFC win streak; the 'Nigerian Nightmare' who ruled the division at its peak." }),
  mk({ id: "israel-adesanya", name: "Israel Adesanya", nation: "New Zealand", league: "NZL", g: "M", active: true, debut: 2018, titles: [2019], def: [{ year: 2019, count: 5 }], blurb: "Two-time middleweight champion and elite counter-striker with five defenses in his first reign; came up short in a light heavyweight bid." }),
  mk({ id: "daniel-cormier", name: "Daniel Cormier", nation: "United States", league: "USA", g: "M", active: false, debut: 2013, titles: [2015, 2018], def: [{ year: 2015, count: 3 }, { year: 2018, count: 1 }], dbl: 2018, blurb: "Simultaneous light heavyweight and heavyweight champion, the first to defend belts in two divisions; an Olympic-level wrestler and all-time great." }),
  mk({ id: "stipe-miocic", name: "Stipe Miocic", nation: "United States", league: "USA", g: "M", active: false, debut: 2011, titles: [2016], def: [{ year: 2016, count: 3 }, { year: 2019, count: 1 }], blurb: "Two-time heavyweight champion whose three straight defenses set the division record; widely rated the greatest UFC heavyweight." }),
  mk({ id: "max-holloway", name: "Max Holloway", nation: "United States", league: "USA", g: "M", active: true, debut: 2012, titles: [2017], def: [{ year: 2017, count: 3 }], blurb: "Featherweight champion with three defenses and a record for significant strikes landed; the relentless 'Blessed' and holder of the BMF belt." }),
  mk({ id: "alexander-volkanovski", name: "Alexander Volkanovski", nation: "Australia", league: "AUS", g: "M", active: true, debut: 2016, titles: [2019], def: [{ year: 2019, count: 5 }, { year: 2025, count: 1 }], blurb: "Two-reign featherweight champion — five defenses in his first title run and another in his second; a pressure-fighting standout who twice challenged at lightweight." }),
  mk({ id: "conor-mcgregor", name: "Conor McGregor", nation: "Ireland", league: "IRL", g: "M", active: true, debut: 2013, titles: [2015, 2016], def: [], dbl: 2016, blurb: "The first fighter to hold two UFC belts at once — featherweight and lightweight — and the sport's biggest-ever draw; conquest over longevity." }),
  mk({ id: "jose-aldo", name: "José Aldo", nation: "Brazil", league: "BRA", g: "M", active: false, debut: 2010, titles: [2011], def: [{ year: 2011, count: 7 }], blurb: "Inaugural UFC featherweight champion with a division-record seven defenses; a devastating leg-kicker who ruled the weight for years." }),
  mk({ id: "henry-cejudo", name: "Henry Cejudo", nation: "United States", league: "USA", g: "M", active: false, debut: 2014, titles: [2018, 2019], def: [{ year: 2018, count: 1 }, { year: 2019, count: 1 }], dbl: 2019, blurb: "Simultaneous flyweight and bantamweight champion and an Olympic wrestling gold medalist; 'Triple C' fused elite wrestling with fight IQ." }),
  mk({ id: "tj-dillashaw", name: "TJ Dillashaw", nation: "United States", league: "USA", g: "M", active: false, debut: 2011, titles: [2014], def: [{ year: 2014, count: 2 }, { year: 2017, count: 1 }], blurb: "Two-time bantamweight champion whose footwork and power redefined the division; a dominant reign later shadowed by a doping ban." }),
  mk({ id: "dominick-cruz", name: "Dominick Cruz", nation: "United States", league: "USA", g: "M", active: false, debut: 2010, titles: [2010], def: [{ year: 2010, count: 2 }, { year: 2016, count: 1 }], blurb: "Inaugural UFC bantamweight champion who reclaimed the belt after years of injury; the most elusive movement and footwork of his generation." }),
  mk({ id: "amanda-nunes", name: "Amanda Nunes", nation: "Brazil", league: "BRA", g: "W", active: false, debut: 2013, titles: [2016, 2018], def: [{ year: 2016, count: 6 }, { year: 2018, count: 2 }], dbl: 2018, blurb: "Simultaneous bantamweight and featherweight champion — the 'Lioness' — with eight combined defenses; the greatest female fighter in MMA history." }),
  mk({ id: "valentina-shevchenko", name: "Valentina Shevchenko", nation: "Kyrgyzstan", league: "KGZ", g: "W", active: true, debut: 2015, titles: [2018], def: [{ year: 2018, count: 7 }, { year: 2024, count: 2 }], blurb: "Two-reign women's flyweight champion with nine total defenses; a precision striker who dominated the division across two eras." }),
  mk({ id: "ronda-rousey", name: "Ronda Rousey", nation: "United States", league: "USA", g: "W", active: false, debut: 2013, titles: [2013], def: [{ year: 2013, count: 6 }], blurb: "The inaugural women's bantamweight champion with six defenses; the armbar phenom who transformed women's MMA into a headline act." }),
  mk({ id: "charles-oliveira", name: "Charles Oliveira", nation: "Brazil", league: "BRA", g: "M", active: true, debut: 2010, titles: [2021], def: [{ year: 2021, count: 1 }], blurb: "Lightweight champion and the UFC's all-time submission leader; 'do Bronx' rose from journeyman to finisher of the highest order." }),
  mk({ id: "islam-makhachev", name: "Islam Makhachev", nation: "Russia", league: "RUS", g: "M", active: true, debut: 2015, titles: [2022, 2025], def: [{ year: 2022, count: 4 }], dbl: 2025, blurb: "Lightweight champion with four defenses who moved up to take welterweight in 2025; a two-division champion and the reigning pound-for-pound No. 1." }),
  mk({ id: "randy-couture", name: "Randy Couture", nation: "United States", league: "USA", g: "M", active: false, debut: 1997, titles: [1997, 2003], def: [{ year: 2000, count: 2 }, { year: 2007, count: 1 }], dbl: 2003, blurb: "A five-time champion across heavyweight and light heavyweight and the first two-division titlist; 'The Natural' defined the sport's founding era." }),
];
