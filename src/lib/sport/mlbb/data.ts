import type { Achievement, Player } from "../types";

/**
 * Mobile Legends: Bang Bang roster — the most-decorated players of the M-Series era
 * (M1 2019 → M6 2024), verified against Liquipedia and capped 2026-06. Every honor is
 * recorded at its REAL YEAR as an individual dated entry (no bulk counts), so the
 * career timeline shows the true distribution.
 *
 * Field key:
 *   mw = M-Series World Championship titles won (years)
 *   ms = MLBB Southeast Asia Cup (MSC) titles won (years)
 *   mp = MPL split titles won — MPL-PH or MPL-ID (years)
 *   fm = grand-final MVP awards — M-Series / MSC / MPL finals (years)
 *
 * NOTE ON MPL COUNTS: a player's `mp` years count distinct MPL grand-final wins across
 * their career (the four-peat ONIC-ID core each have 7). "finals_mvp" credits any
 * grand-final decider MVP, not only the M-Series FMVP — hence multiple years for
 * players like Kelra (M6 + MSC + MPL) and the ONIC-ID stars (repeat MPL FMVPs).
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; realName: string; nation: string; league: string;
  active: boolean; debut: number; blurb: string;
  mw?: number[]; ms?: number[]; mp?: number[]; fm?: number[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, realName: r.realName, sport: "mlbb", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...A("m_world", r.mw ?? []), ...A("msc_title", r.ms ?? []),
    ...A("mpl_title", r.mp ?? []), ...A("finals_mvp", r.fm ?? []),
  ],
});

export const MLBB_PLAYERS: Player[] = [
  mk({ id: "karltzy", name: "KarlTzy", realName: "Karl Gabriel Nepomuceno", nation: "Philippines", league: "PHL", active: true, debut: 2019,
    mw: [2021, 2023], ms: [2025], mp: [2020, 2023, 2024, 2025, 2025, 2026], fm: [2021, 2020],
    blurb: "Two-time M-Series world champion (M2 with Bren, M4 with ECHO) and M2 Finals MVP; a prodigy jungler and the sport's highest-earning player." }),
  mk({ id: "flaptzy", name: "FlapTzy", realName: "David Charles Canon", nation: "Philippines", league: "PHL", active: true, debut: 2019,
    mw: [2021, 2023], mp: [2020, 2023], fm: [2023, 2023],
    blurb: "Rare two-time M-Series world champion (M2 with Bren, M5 with AP.Bren) and the M5 Finals MVP; an elite marksman known for split-push pressure." }),
  mk({ id: "oheb", name: "OHEB", realName: "Kiel Calvin Soriano", nation: "Philippines", league: "PHL", active: true, debut: 2020,
    mw: [2021], ms: [2025], mp: [2021, 2021, 2022, 2025, 2025], fm: [2021],
    blurb: "'The Filipino Sniper': M3 world champion and Finals MVP with Blacklist, an MSC 2025 winner and a five-time MPL-PH champion." }),
  mk({ id: "kelra", name: "Kelra", realName: "Grant Duane Pillas", nation: "Philippines", league: "PHL", active: true, debut: 2021,
    mw: [2024], ms: [2021], mp: [2024], fm: [2024, 2021, 2024],
    blurb: "M6 world champion and Finals MVP; the first player to win Finals MVP in all three majors (M-Series, MSC, MPL)." }),
  mk({ id: "bennyqt", name: "Bennyqt", realName: "Frederic Benedict Gonzales", nation: "Philippines", league: "PHL", active: true, debut: 2021,
    mw: [2023], mp: [2023, 2024], fm: [2023],
    blurb: "M4 world champion and Finals MVP with ECHO; a marksman star who later anchored Team Liquid PH." }),
  mk({ id: "wise", name: "Wise", realName: "Danerie James Del Rosario", nation: "Philippines", league: "PHL", active: true, debut: 2020,
    mw: [2021], mp: [2021, 2021, 2022],
    blurb: "M3 world champion jungler of Blacklist International and half of the 'VEEWISE' core; a three-time MPL-PH champion and Hall of Legends inductee." }),
  mk({ id: "ohmyv33nus", name: "OhMyV33nus", realName: "Jonmar Villaluna", nation: "Philippines", league: "PHL", active: true, debut: 2019,
    mw: [2021], mp: [2021, 2021, 2022],
    blurb: "M3 world champion and legendary support captain of Blacklist; the other half of 'VEEWISE' and a three-time MPL-PH champion." }),
  mk({ id: "sanford", name: "Sanford", realName: "Sanford Marin Vinuya", nation: "Philippines", league: "PHL", active: true, debut: 2022,
    mw: [2023], ms: [2025], mp: [2023, 2024, 2025, 2025, 2026], fm: [2023, 2024, 2026],
    blurb: "M4 world champion with ECHO and MSC 2025 MVP; a five-time MPL-PH champion and repeat league Finals MVP." }),
  mk({ id: "kairi", name: "Kairi", realName: "Kairi Rayosdelsol", nation: "Philippines", league: "PHL", active: true, debut: 2021,
    ms: [2023], mp: [2022, 2023, 2023, 2024, 2025, 2025], fm: [2022, 2025],
    blurb: "ONIC Indonesia's Filipino jungle star and MSC 2023 champion; a six-time MPL-ID titlist who led the record four-peat (S10–S13)." }),
  mk({ id: "cw", name: "CW", realName: "Calvin Winata", nation: "Indonesia", league: "IDN", active: true, debut: 2021,
    ms: [2023], mp: [2021, 2022, 2023, 2023, 2024, 2025, 2025], fm: [2021, 2024],
    blurb: "ONIC Indonesia's seven-time MPL-ID champion gold laner and MSC 2023 winner; a cornerstone of the game's most dominant league dynasty." }),
  mk({ id: "kiboy", name: "Kiboy", realName: "Nicky Fernando Pontonuwu", nation: "Indonesia", league: "IDN", active: true, debut: 2021,
    ms: [2023], mp: [2021, 2022, 2023, 2023, 2024, 2025, 2025], fm: [2023, 2023],
    blurb: "ONIC Indonesia roamer, MSC 2023 champion and Tournament MVP; a seven-time MPL-ID titlist from the record four-peat core." }),
  mk({ id: "sanz", name: "Sanz", realName: "Gilang", nation: "Indonesia", league: "IDN", active: true, debut: 2021,
    ms: [2023], mp: [2021, 2022, 2023, 2023, 2024, 2025, 2025], fm: [2023, 2025],
    blurb: "ONIC Indonesia's seven-time MPL-ID champion and MSC 2023 winner; a repeat league Finals MVP in the dynasty's four-peat run." }),
  mk({ id: "ribo", name: "Ribo", realName: "Carlito Ribo Jr.", nation: "Philippines", league: "PHL", active: false, debut: 2018,
    mw: [2021], ms: [2018], mp: [2018, 2020],
    blurb: "M2 world champion with Bren Esports and an MSC 2018 winner; a pioneering roamer and Hall of Legends inductee." }),
  mk({ id: "lusty", name: "Lusty", realName: "Allan Castromayor Jr.", nation: "Philippines", league: "PHL", active: true, debut: 2019,
    mw: [2021], mp: [2019, 2020],
    blurb: "M2 world champion roamer with Bren Esports and a two-time MPL-PH titlist, known for signature Chou and Khufra play." }),
  mk({ id: "oura", name: "Oura", realName: "Eko Julianto", nation: "Indonesia", league: "IDN", active: false, debut: 2018,
    mw: [2019], mp: [2019], fm: [2019],
    blurb: "M1 world champion and the first-ever M-Series Finals MVP with EVOS Legends; later honored as 'Greatest Player' at the M World Championship." }),
  mk({ id: "kirk", name: "Kirk", realName: "Jann Kirk Gutierrez", nation: "Philippines", league: "PHL", active: true, debut: 2022,
    mw: [2024], mp: [2024],
    blurb: "M6 world champion EXP laner with Fnatic ONIC PH, going a perfect 6-0 on Edith during the title run." }),
  mk({ id: "k1ngkong", name: "K1NGKONG", realName: "King Cyric Perez", nation: "Philippines", league: "PHL", active: true, debut: 2022,
    mw: [2024], mp: [2024],
    blurb: "M6 world champion jungler with Fnatic ONIC PH and MPL-PH Season 14 Regular Season MVP." }),
  mk({ id: "super-frince", name: "Super Frince", realName: "Frince Miguel Ramirez", nation: "Philippines", league: "PHL", active: true, debut: 2021,
    mw: [2024], mp: [2022, 2024],
    blurb: "M6 world champion mid laner with Fnatic ONIC PH and a two-time MPL-PH champion." }),
];
