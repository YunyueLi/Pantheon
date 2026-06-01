import type { Achievement, Player } from "../types";

/**
 * Dota 2 roster — 23 of the consensus greatest players, verified against
 * Liquipedia and capped at June 2025 (The International 2024 included; TI 2025
 * excluded). TI titles carry exact years; lower-tier honors are bulk counts.
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));
const C = (type: string, count: number, year: number): Achievement[] =>
  count > 0 ? [{ type, year, count }] : [];

type Raw = {
  id: string; name: string; nation: string; league: string; role: string;
  active: boolean; debut: number; blurb: string;
  ti: number[]; tiTop: number; major: number; premier: number; award: number;
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "dota2", league: r.league, position: r.role,
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...A("ti_title", r.ti),
    ...C("ti_runner_up", r.tiTop, r.debut + 4),
    ...C("valve_major_title", r.major, r.debut + 3),
    ...C("premier_title", r.premier, r.debut + 5),
    ...C("best_player_award", r.award, r.debut + 4),
  ],
});

export const DOTA2_PLAYERS: Player[] = [
  mk({ id: "n0tail", name: "N0tail", nation: "Denmark", league: "DEN", role: "hard-support", active: false, debut: 2012, ti: [2018, 2019], tiTop: 0, major: 4, premier: 5, award: 0,
    blurb: "Johan Sundstein: OG captain, the only back-to-back TI winner, and the highest-earning player in esports." }),
  mk({ id: "jerax", name: "JerAx", nation: "Finland", league: "FIN", role: "soft-support", active: false, debut: 2013, ti: [2018, 2019], tiTop: 0, major: 2, premier: 3, award: 0,
    blurb: "Jesse Vainikka: OG's roaming position-4 maestro and two-time TI champion." }),
  mk({ id: "ana", name: "ana", nation: "Australia", league: "AUS", role: "carry", active: false, debut: 2016, ti: [2018, 2019], tiTop: 0, major: 0, premier: 2, award: 0,
    blurb: "Anathan Pham: OG's enigmatic two-time-TI carry, famed for clutch performances in the TI8/TI9 runs." }),
  mk({ id: "topson", name: "Topson", nation: "Finland", league: "FIN", role: "mid", active: false, debut: 2017, ti: [2018, 2019], tiTop: 1, major: 0, premier: 0, award: 1,
    blurb: "Topias Taavitsainen: an unknown pubstar turned two-time-TI-winning midlaner for OG." }),
  mk({ id: "ceb", name: "Ceb", nation: "France", league: "FRA", role: "offlane", active: true, debut: 2011, ti: [2018, 2019], tiTop: 0, major: 0, premier: 2, award: 0,
    blurb: "Sébastien Debs: OG's offlaner and co-architect of the back-to-back Aegis dynasty." }),
  mk({ id: "puppey", name: "Puppey", nation: "Estonia", league: "EST", role: "hard-support", active: true, debut: 2011, ti: [2011], tiTop: 3, major: 2, premier: 4, award: 0,
    blurb: "Clement Ivanov: TI1 champion and longevity icon with the most TI grand-final appearances ever." }),
  mk({ id: "kuroky", name: "KuroKy", nation: "Germany", league: "GER", role: "hard-support", active: false, debut: 2011, ti: [2017], tiTop: 2, major: 1, premier: 4, award: 0,
    blurb: "Kuro Takhasomi: TI7-winning captain of Team Liquid's golden roster, with the most TIs ever attended." }),
  mk({ id: "miracle-", name: "Miracle-", nation: "Jordan", league: "JOR", role: "mid", active: true, debut: 2015, ti: [2017], tiTop: 0, major: 2, premier: 4, award: 2,
    blurb: "Amer Al-Barkawi: the first to 9000 then 10000 MMR, TI7 champion, long the gold standard for carries." }),
  mk({ id: "matumbaman", name: "MATUMBAMAN", nation: "Finland", league: "FIN", role: "carry", active: false, debut: 2013, ti: [2017], tiTop: 2, major: 1, premier: 3, award: 0,
    blurb: "Lasse Urpalainen: TI7-winning carry for Team Liquid and later a Team Secret/Liquid mainstay." }),
  mk({ id: "gh", name: "GH", nation: "Lebanon", league: "LBN", role: "soft-support", active: true, debut: 2013, ti: [2017], tiTop: 1, major: 1, premier: 3, award: 0,
    blurb: "Maroun Merhej: Lebanese position-4 wizard of Liquid's TI7 roster, renowned for game-defining plays." }),
  mk({ id: "sumail", name: "SumaiL", nation: "Pakistan", league: "PAK", role: "mid", active: true, debut: 2015, ti: [2015], tiTop: 0, major: 1, premier: 4, award: 0,
    blurb: "Sumail Hassan: the youngest-ever TI champion at 16 with Evil Geniuses, long the face of NA midlane." }),
  mk({ id: "dendi", name: "Dendi", nation: "Ukraine", league: "UKR", role: "mid", active: false, debut: 2011, ti: [2011], tiTop: 2, major: 0, premier: 3, award: 0,
    blurb: "Danil Ishutin: the original Dota 2 superstar and TI1-winning Na'Vi midlaner — the game's first icon." }),
  mk({ id: "s4", name: "s4", nation: "Sweden", league: "SWE", role: "offlane", active: false, debut: 2012, ti: [2013], tiTop: 0, major: 2, premier: 3, award: 0,
    blurb: "Gustav Magnusson: Alliance's TI3-winning playmaker, later a two-time Major winner with OG." }),
  mk({ id: "yatoro", name: "Yatoro", nation: "Ukraine", league: "UKR", role: "carry", active: true, debut: 2019, ti: [2021, 2023], tiTop: 0, major: 0, premier: 3, award: 0,
    blurb: "Illya Mulyarchuk: Team Spirit's two-time-TI carry, widely rated the best position-1 of his generation." }),
  mk({ id: "collapse", name: "Collapse", nation: "Russia", league: "RUS", role: "offlane", active: true, debut: 2018, ti: [2021, 2023], tiTop: 0, major: 0, premier: 3, award: 0,
    blurb: "Magomed Khalilov: Team Spirit's two-time-TI offlaner, famed for his signature Magnus space-creation." }),
  mk({ id: "mira", name: "Mira", nation: "Ukraine", league: "UKR", role: "soft-support", active: true, debut: 2019, ti: [2021, 2023], tiTop: 0, major: 0, premier: 3, award: 0,
    blurb: "Myroslav Kolpakov: Team Spirit's two-time-TI position-4 across both Aegis runs." }),
  mk({ id: "miposhka", name: "Miposhka", nation: "Russia", league: "RUS", role: "hard-support", active: true, debut: 2015, ti: [2021, 2023], tiTop: 0, major: 0, premier: 3, award: 0,
    blurb: "Yaroslav Naidenov: Team Spirit's two-time-TI-winning captain and drafting brain." }),
  mk({ id: "33", name: "33", nation: "Israel", league: "ISR", role: "offlane", active: true, debut: 2014, ti: [2022, 2024], tiTop: 0, major: 0, premier: 2, award: 0,
    blurb: "Neta Shapira: the first to win two TIs with two different teams (Tundra 2022, Liquid 2024)." }),
  mk({ id: "nisha", name: "Nisha", nation: "Poland", league: "POL", role: "mid", active: true, debut: 2015, ti: [2024], tiTop: 2, major: 2, premier: 3, award: 0,
    blurb: "Michał Jankowski: versatile mid who finally lifted the Aegis with Team Liquid at TI 2024." }),
  mk({ id: "ame", name: "Ame", nation: "China", league: "CHN", role: "carry", active: true, debut: 2015, ti: [], tiTop: 2, major: 1, premier: 3, award: 0,
    blurb: "Wang Chunyu: PSG.LGD's 'Uncrowned King' carry — the highest-earning player yet to win the Aegis." }),
  mk({ id: "maybe", name: "Maybe", nation: "China", league: "CHN", role: "mid", active: false, debut: 2013, ti: [], tiTop: 2, major: 1, premier: 2, award: 0,
    blurb: "Lu Yao: PSG.LGD's star midlaner and TI8 finalist, long one of China's premier mid players." }),
  mk({ id: "faith_bian", name: "Faith_bian", nation: "China", league: "CHN", role: "offlane", active: true, debut: 2014, ti: [2016], tiTop: 1, major: 1, premier: 2, award: 0,
    blurb: "Zhang Ruida: TI6 champion with Wings Gaming and later PSG.LGD's anchor offlaner." }),
  mk({ id: "arteezy", name: "Arteezy", nation: "Canada", league: "CAN", role: "carry", active: true, debut: 2013, ti: [], tiTop: 0, major: 1, premier: 5, award: 0,
    blurb: "Artour Babaev: NA's iconic farming carry and perennial favourite who never quite won the Aegis." }),
];
