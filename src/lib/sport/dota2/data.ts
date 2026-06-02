import type { Achievement, Player } from "../types";

/**
 * Dota 2 roster — 57 of the consensus greatest players, verified against
 * Liquipedia and capped at June 2025 (The International 2024 = Team Liquid
 * INCLUDED; TI 2025 EXCLUDED). EVERY honor is recorded at its real year: TI
 * titles (ti), TI grand-final / top-3 finishes without a win (top), and
 * Valve-sponsored Majors incl. the DPC Majors (maj). Third-party premier LANs
 * (Riyadh, non-Major DreamLeagues, EPICENTER, DAC) are not Valve Majors and are
 * intentionally excluded, so a few legacy premier-only stars score low.
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; nation: string; league: string; role: string;
  active: boolean; debut: number; blurb: string;
  ti: number[]; top: number[]; maj: number[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "dota2", league: r.league, position: r.role,
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [...A("ti_title", r.ti), ...A("ti_runner_up", r.top), ...A("valve_major_title", r.maj)],
});

export const DOTA2_PLAYERS: Player[] = [
  // ── OG: the only back-to-back TI dynasty (TI8 2018 + TI9 2019) ──────────────
  mk({ id: "n0tail", name: "N0tail", nation: "Denmark", league: "DEN", role: "hard-support", active: false, debut: 2012, ti: [2018, 2019], top: [], maj: [2015, 2016, 2016, 2017],
    blurb: "Johan Sundstein: OG captain, the only back-to-back TI winner, and the highest-earning player in esports." }),
  mk({ id: "jerax", name: "JerAx", nation: "Finland", league: "FIN", role: "soft-support", active: false, debut: 2013, ti: [2018, 2019], top: [], maj: [2016, 2017],
    blurb: "Jesse Vainikka: OG's roaming position-4 maestro and two-time TI champion." }),
  mk({ id: "ana", name: "ana", nation: "Australia", league: "AUS", role: "carry", active: false, debut: 2016, ti: [2018, 2019], top: [], maj: [2016, 2017],
    blurb: "Anathan Pham: OG's enigmatic two-time-TI carry, famed for clutch performances in the TI8/TI9 runs." }),
  mk({ id: "topson", name: "Topson", nation: "Finland", league: "FIN", role: "mid", active: false, debut: 2017, ti: [2018, 2019], top: [2024], maj: [],
    blurb: "Topias Taavitsainen: an unknown pubstar turned two-time-TI-winning midlaner for OG." }),
  mk({ id: "ceb", name: "Ceb", nation: "France", league: "FRA", role: "offlane", active: true, debut: 2011, ti: [2018, 2019], top: [], maj: [2016, 2016, 2017],
    blurb: "Sébastien Debs: OG's offlaner and co-architect of the back-to-back Aegis dynasty." }),

  // ── Team Liquid TI7 (2017) golden roster ────────────────────────────────────
  mk({ id: "kuroky", name: "KuroKy", nation: "Germany", league: "GER", role: "hard-support", active: false, debut: 2011, ti: [2017], top: [2013, 2019], maj: [2018],
    blurb: "Kuro Takhasomi: TI7-winning captain of Team Liquid's golden roster, with the most TIs ever attended." }),
  mk({ id: "miracle-", name: "Miracle-", nation: "Jordan", league: "JOR", role: "mid", active: true, debut: 2015, ti: [2017], top: [2019], maj: [2015, 2016, 2018],
    blurb: "Amer Al-Barkawi: the first to 9000 then 10000 MMR, TI7 champion, long the gold standard for carries." }),
  mk({ id: "matumbaman", name: "MATUMBAMAN", nation: "Finland", league: "FIN", role: "carry", active: false, debut: 2013, ti: [2017], top: [2021, 2022], maj: [2018, 2020],
    blurb: "Lasse Urpalainen: TI7-winning carry for Team Liquid and later a Team Secret/Liquid mainstay." }),
  mk({ id: "gh", name: "GH", nation: "Lebanon", league: "LBN", role: "soft-support", active: true, debut: 2013, ti: [2017], top: [2019], maj: [2018],
    blurb: "Maroun Merhej: Lebanese position-4 wizard of Liquid's TI7 roster, renowned for game-defining plays." }),
  mk({ id: "mind_control", name: "MinD_ContRoL", nation: "Bulgaria", league: "BUL", role: "offlane", active: true, debut: 2013, ti: [2017], top: [2019], maj: [2018],
    blurb: "Ivan Ivanov: Team Liquid's TI7-winning offlaner and TI9 finalist, a fixture of the Liquid era." }),

  // ── Team Spirit: TI10 (2021) + TI12 (2023) ─────────────────────────────────
  mk({ id: "yatoro", name: "Yatoro", nation: "Ukraine", league: "UKR", role: "carry", active: true, debut: 2019, ti: [2021, 2023], top: [], maj: [2022],
    blurb: "Illya Mulyarchuk: Team Spirit's two-time-TI carry, widely rated the best position-1 of his generation." }),
  mk({ id: "collapse", name: "Collapse", nation: "Russia", league: "RUS", role: "offlane", active: true, debut: 2018, ti: [2021, 2023], top: [], maj: [2022],
    blurb: "Magomed Khalilov: Team Spirit's two-time-TI offlaner, famed for his signature Magnus space-creation." }),
  mk({ id: "mira", name: "Mira", nation: "Ukraine", league: "UKR", role: "soft-support", active: true, debut: 2019, ti: [2021, 2023], top: [], maj: [2022],
    blurb: "Myroslav Kolpakov: Team Spirit's two-time-TI position-4 across both Aegis runs." }),
  mk({ id: "miposhka", name: "Miposhka", nation: "Russia", league: "RUS", role: "hard-support", active: true, debut: 2015, ti: [2021, 2023], top: [], maj: [2022],
    blurb: "Yaroslav Naidenov: Team Spirit's two-time-TI-winning captain and drafting brain." }),
  mk({ id: "torontotokyo", name: "TORONTOTOKYO", nation: "Russia", league: "RUS", role: "mid", active: true, debut: 2019, ti: [2021], top: [], maj: [2022],
    blurb: "Alexander Khertek: Team Spirit's TI10-winning midlaner and Arlington Major champion." }),
  mk({ id: "larl", name: "Larl", nation: "Russia", league: "RUS", role: "mid", active: true, debut: 2017, ti: [2023], top: [], maj: [],
    blurb: "Denis Sigitov: replaced TORONTOTOKYO to win TI12 (2023) as Team Spirit's star midlaner." }),

  // ── Multi-team & cross-era TI champions ─────────────────────────────────────
  mk({ id: "33", name: "33", nation: "Israel", league: "ISR", role: "offlane", active: true, debut: 2014, ti: [2022, 2024], top: [2021], maj: [],
    blurb: "Neta Shapira: the first to win two TIs with two different teams (Tundra 2022, Liquid 2024)." }),
  mk({ id: "nisha", name: "Nisha", nation: "Poland", league: "POL", role: "mid", active: true, debut: 2015, ti: [2024], top: [2021, 2022], maj: [2019, 2019, 2020],
    blurb: "Michał Jankowski: versatile mid who finally lifted the Aegis with Team Liquid at TI 2024." }),

  // ── Na'Vi: TI1 (2011) champions & the game's first icons ────────────────────
  mk({ id: "puppey", name: "Puppey", nation: "Estonia", league: "EST", role: "hard-support", active: true, debut: 2011, ti: [2011], top: [2012, 2013, 2021, 2022], maj: [2016, 2017, 2019, 2019, 2020],
    blurb: "Clement Ivanov: TI1 champion and longevity icon with the most TI grand-final appearances ever." }),
  mk({ id: "dendi", name: "Dendi", nation: "Ukraine", league: "UKR", role: "mid", active: false, debut: 2011, ti: [2011], top: [2012, 2013], maj: [],
    blurb: "Danil Ishutin: the original Dota 2 superstar and TI1-winning Na'Vi midlaner — the game's first icon." }),

  // ── Invictus Gaming: TI2 (2012) ─────────────────────────────────────────────
  mk({ id: "ferrari_430", name: "Ferrari_430", nation: "China", league: "CHN", role: "mid", active: false, debut: 2011, ti: [2012], top: [], maj: [],
    blurb: "Luo Feichi: Invictus Gaming's TI2-winning midlaner, long the definitive Templar Assassin player." }),
  mk({ id: "chuan", name: "ChuaN", nation: "Malaysia", league: "MAS", role: "soft-support", active: true, debut: 2011, ti: [2012], top: [], maj: [],
    blurb: "Wong Hock Chuan: iG's TI2-winning support and the first Southeast Asian player to win The International." }),

  // ── Alliance: TI3 (2013) ────────────────────────────────────────────────────
  mk({ id: "s4", name: "s4", nation: "Sweden", league: "SWE", role: "offlane", active: false, debut: 2012, ti: [2013], top: [2018], maj: [2015, 2016, 2017],
    blurb: "Gustav Magnusson: Alliance's TI3-winning playmaker, later a multiple Major winner with Secret and OG." }),

  // ── Newbee: TI4 (2014) ──────────────────────────────────────────────────────
  mk({ id: "xiao8", name: "xiao8", nation: "China", league: "CHN", role: "soft-support", active: true, debut: 2011, ti: [2014], top: [2012, 2015], maj: [],
    blurb: "Zhang Ning: Newbee's TI4-winning captain and two-time TI finalist with LGD, later a top coach." }),
  mk({ id: "hao", name: "Hao", nation: "China", league: "CHN", role: "carry", active: true, debut: 2011, ti: [2014], top: [], maj: [],
    blurb: "Chen Zhihao: Newbee's TI4-winning carry, one of China's most aggressive position-1 players." }),

  // ── Evil Geniuses: TI5 (2015) — North America's only Aegis ──────────────────
  mk({ id: "sumail", name: "SumaiL", nation: "Pakistan", league: "PAK", role: "mid", active: true, debut: 2015, ti: [2015], top: [2016, 2018], maj: [],
    blurb: "Sumail Hassan: the youngest-ever TI champion at 16 with Evil Geniuses, long the face of NA midlane." }),
  mk({ id: "universe", name: "UNiVeRsE", nation: "United States", league: "USA", role: "offlane", active: false, debut: 2012, ti: [2015], top: [2014, 2016], maj: [],
    blurb: "Saahil Arora: EG's TI5-winning offlaner, the West's premier position-3 and famed 'Six Million Dollar Echo'." }),
  mk({ id: "fear", name: "Fear", nation: "United States", league: "USA", role: "carry", active: false, debut: 2011, ti: [2015], top: [2012, 2014, 2016], maj: [],
    blurb: "Clinton Loomis: 'the Old Man', EG's TI5-winning carry and one of North American Dota's founding fathers." }),
  mk({ id: "ppd", name: "ppd", nation: "United States", league: "USA", role: "hard-support", active: false, debut: 2012, ti: [2015], top: [2014, 2016], maj: [],
    blurb: "Peter Dager: EG's TI5-winning drafting captain and later a prominent team owner and executive." }),
  mk({ id: "aui_2000", name: "Aui_2000", nation: "Canada", league: "CAN", role: "soft-support", active: true, debut: 2012, ti: [2015], top: [], maj: [],
    blurb: "Kurtis Ling: EG's TI5-winning support, later the only person to coach two different teams to a TI title." }),

  // ── Wings Gaming: TI6 (2016) ────────────────────────────────────────────────
  mk({ id: "faith_bian", name: "Faith_bian", nation: "China", league: "CHN", role: "offlane", active: true, debut: 2014, ti: [2016], top: [2021], maj: [2021],
    blurb: "Zhang Ruida: TI6 champion with Wings Gaming and later PSG.LGD's anchor offlaner." }),
  mk({ id: "y", name: "y`", nation: "China", league: "CHN", role: "soft-support", active: true, debut: 2014, ti: [2016], top: [2021, 2023], maj: [2021],
    blurb: "Zhang Yiping: Wings' TI6-winning support and later PSG.LGD's TI 2021 finalist captain." }),
  mk({ id: "iceice", name: "iceice", nation: "China", league: "CHN", role: "hard-support", active: false, debut: 2015, ti: [2016], top: [], maj: [],
    blurb: "Li Peng: Wings Gaming's TI6-winning hard support during their fearless underdog Cinderella run." }),

  // ── PSG.LGD: the 'uncrowned' Chinese powerhouse (multiple TI finals) ─────────
  mk({ id: "ame", name: "Ame", nation: "China", league: "CHN", role: "carry", active: true, debut: 2015, ti: [], top: [2018, 2019, 2021], maj: [2018, 2018, 2021],
    blurb: "Wang Chunyu: PSG.LGD's 'Uncrowned King' carry — the highest-earning player yet to win the Aegis." }),
  mk({ id: "maybe", name: "Maybe", nation: "China", league: "CHN", role: "mid", active: true, debut: 2012, ti: [], top: [2015, 2018, 2019], maj: [2018, 2018],
    blurb: "Lu Yao (Somnus): PSG.LGD's star midlaner, a TI8 finalist and one of China's premier mid players." }),
  mk({ id: "fy", name: "fy", nation: "China", league: "CHN", role: "soft-support", active: true, debut: 2013, ti: [], top: [2014, 2018, 2019], maj: [2018, 2018],
    blurb: "Xu Linsen: two-time TI finalist support with the most top-4 TI placements of anyone yet to win it." }),
  mk({ id: "xnova", name: "xNova", nation: "Malaysia", league: "MAS", role: "hard-support", active: true, debut: 2015, ti: [], top: [2018, 2019], maj: [2018, 2018],
    blurb: "Yap Jian Wei: PSG.LGD's TI8-finalist hard support, a durable Malaysian position-5 veteran." }),
  mk({ id: "nothingtosay", name: "NothingToSay", nation: "Malaysia", league: "MAS", role: "mid", active: true, debut: 2017, ti: [], top: [2021, 2023], maj: [2021],
    blurb: "Cheng Jin Xiang: PSG.LGD's TI 2021-finalist midlaner, one of SEA's strongest position-2 players." }),
  mk({ id: "xinq", name: "XinQ", nation: "China", league: "CHN", role: "soft-support", active: true, debut: 2014, ti: [], top: [2021], maj: [2021],
    blurb: "Zhao Zixing: PSG.LGD's TI 2021-finalist position-4, a creative roaming support." }),
  mk({ id: "sccc", name: "Sccc", nation: "China", league: "CHN", role: "carry", active: false, debut: 2015, ti: [], top: [2017], maj: [],
    blurb: "Song Chun: Newbee's explosive carry who pushed Team Liquid in the TI7 grand final." }),

  // ── Virtus.pro: the CIS Major dynasty (2017–18) ─────────────────────────────
  mk({ id: "ramzes666", name: "RAMZES666", nation: "Russia", league: "RUS", role: "offlane", active: true, debut: 2014, ti: [], top: [], maj: [2017, 2018, 2018, 2018, 2018],
    blurb: "Roman Kushnarev: Virtus.pro's prolific carry/offlaner of the 2017–18 five-Major dynasty." }),
  mk({ id: "noone", name: "No[o]ne", nation: "Ukraine", league: "UKR", role: "mid", active: true, debut: 2015, ti: [], top: [], maj: [2017, 2018, 2018, 2018, 2018],
    blurb: "Vladimir Minenko: Virtus.pro's flashy midlaner during their dominant 2017–18 five-Major run." }),
  mk({ id: "9pasha", name: "9pasha", nation: "Russia", league: "RUS", role: "offlane", active: false, debut: 2014, ti: [], top: [], maj: [2017, 2018, 2018, 2018, 2018],
    blurb: "Pavel Khvastunov: Virtus.pro's offlaner across their five Majors, retired in 2025." }),
  mk({ id: "solo", name: "Solo", nation: "Russia", league: "RUS", role: "hard-support", active: true, debut: 2012, ti: [], top: [], maj: [2017, 2018, 2018, 2018, 2018],
    blurb: "Alexey Berezin: Virtus.pro's captain through their five-Major dynasty and a long-tenured CIS leader." }),
  mk({ id: "fng", name: "fng", nation: "Belarus", league: "BLR", role: "hard-support", active: false, debut: 2012, ti: [], top: [], maj: [],
    blurb: "Artsiom Barshak: the first Belarusian at a TI and a respected veteran captain across the CIS scene." }),

  // ── Team Secret & the European Major circuit ────────────────────────────────
  mk({ id: "yapzor", name: "YapzOr", nation: "Jordan", league: "JOR", role: "soft-support", active: false, debut: 2012, ti: [], top: [2021], maj: [2017, 2019, 2019, 2020],
    blurb: "Yazied Jaradat: Team Secret's aggressive four-time-Major-winning position-4 of the 2019–21 era." }),
  mk({ id: "midone", name: "MidOne", nation: "Malaysia", league: "MAS", role: "mid", active: true, debut: 2016, ti: [], top: [], maj: [2017, 2019, 2019],
    blurb: "Yeik Nai Zheng: Team Secret's star Malaysian midlaner and three-time Major champion." }),
  mk({ id: "zai", name: "zai", nation: "Sweden", league: "SWE", role: "offlane", active: false, debut: 2013, ti: [], top: [2014, 2016, 2021, 2022], maj: [2019, 2019, 2020],
    blurb: "Ludwig Wåhlberg: prodigy offlaner with four TI top-3 finishes — among the most of anyone never to win it." }),
  mk({ id: "resolut1on", name: "Resolut1on", nation: "Ukraine", league: "UKR", role: "offlane", active: true, debut: 2012, ti: [], top: [2016, 2022], maj: [],
    blurb: "Roman Fomynok: a two-time TI finalist (Digital Chaos 2016, Secret 2022) and premier CIS carry/offlaner." }),
  mk({ id: "saksa", name: "Saksa", nation: "North Macedonia", league: "MKD", role: "soft-support", active: true, debut: 2014, ti: [2022], top: [2016], maj: [],
    blurb: "Martin Sazdov: Tundra's TI11-winning support and the first Macedonian ever to win The International." }),

  // ── OG's early Major dynasty (2015–17) ──────────────────────────────────────
  mk({ id: "fly", name: "Fly", nation: "Israel", league: "ISR", role: "hard-support", active: true, debut: 2012, ti: [], top: [2018], maj: [2015, 2016, 2016, 2017],
    blurb: "Tal Aizik: OG's founding captain across their record four pre-DPC Major wins (2015–17)." }),
  mk({ id: "cr1t-", name: "Cr1t-", nation: "Denmark", league: "DEN", role: "soft-support", active: true, debut: 2012, ti: [], top: [2018], maj: [2015, 2016],
    blurb: "Andreas Nielsen: OG/EG support, an early-Major winner and TI 2018 semifinalist (pre-2025 Aegis)." }),

  // ── Legacy DotA-era legends (Chinese & SEA) ─────────────────────────────────
  mk({ id: "burning", name: "BurNIng", nation: "China", league: "CHN", role: "carry", active: false, debut: 2011, ti: [], top: [], maj: [],
    blurb: "Xu Zhilei: the original Chinese carry god of the DotA/early-Dota-2 era and a DK/iG cornerstone." }),
  mk({ id: "sylar", name: "Sylar", nation: "China", league: "CHN", role: "carry", active: false, debut: 2011, ti: [], top: [2012, 2014, 2015], maj: [],
    blurb: "Liu Jiajun: Vici Gaming's TI4-finalist carry, one of China's most consistent farming position-1s." }),
  mk({ id: "mushi", name: "Mushi", nation: "Malaysia", league: "MAS", role: "mid", active: true, debut: 2011, ti: [], top: [2013], maj: [2018],
    blurb: "Chai Yee Fung: Team DK/Orange icon, long the face of Malaysian Dota and a revered solo-mid legend." }),
  mk({ id: "iceiceice", name: "iceiceice", nation: "Singapore", league: "SGP", role: "offlane", active: false, debut: 2011, ti: [], top: [2011], maj: [2018],
    blurb: "Daryl Koh: the flamboyant Singaporean offlaner widely regarded as one of SEA's greatest ever." }),

  // ── NA farming icon ─────────────────────────────────────────────────────────
  mk({ id: "arteezy", name: "Arteezy", nation: "Canada", league: "CAN", role: "carry", active: false, debut: 2013, ti: [], top: [2014, 2018], maj: [],
    blurb: "Artour Babaev: NA's iconic farming carry and perennial favourite who never quite won the Aegis." }),
];
