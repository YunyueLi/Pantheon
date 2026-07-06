import type { Achievement, Player } from "../types";

/**
 * CS:GO / CS2 roster — 24 all-time greats of the Valve Major era, ranked as one
 * pool. Every honor is a dated entry recorded at its REAL YEAR so the timeline and
 * peak lenses are truthful. `major` = a Valve Major won as a player on the winning
 * five; `hltv_top1` = a calendar year finished ranked HLTV No. 1 (2010–2025, no
 * award in 2012); `major_mvp` = the HLTV MVP of a Major; `big_title` = a marquee
 * premier LAN title (flagship IEM Katowice/Cologne, ESL Pro League finals, BLAST
 * world/global finals, DreamHack Masters, Grand-Slam-tier runs) — counted per year
 * and kept deliberately conservative, never every S-tier trophy. Majors, HLTV No. 1
 * finishes and Major MVPs verified against HLTV and Liquipedia; current through 2026-07-06.
 * Note the design intent: NiKo, m0NESY, GuardiaN, f0rest and EliGE are peerless
 * players who never won a Major before 2026 — carried by dominance, not silverware.
 */
const AT = (type: string, years: number[] = []): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; nation: string; league: string; active: boolean; debut: number; blurb: string;
  maj?: number[]; no1?: number[]; mvp?: number[]; lan?: number[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "csgo", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...AT("major", r.maj),
    ...AT("hltv_top1", r.no1),
    ...AT("major_mvp", r.mvp),
    ...AT("big_title", r.lan),
  ],
});

export const CSGO_PLAYERS: Player[] = [
  mk({ id: "s1mple", name: "s1mple", nation: "Ukraine", league: "UKR", active: true, debut: 2013, maj: [2021], no1: [2018, 2021, 2022], mvp: [2021], lan: [2020, 2021, 2021, 2021, 2022], blurb: "Oleksandr Kostyliev: three-time HLTV No. 1 and the widest-consensus GOAT; a Major and Grand Slam with NAVI." }),
  mk({ id: "zywoo", name: "ZywOo", nation: "France", league: "FRA", active: true, debut: 2018, maj: [2023, 2025, 2025], no1: [2019, 2020, 2023, 2025], mvp: [2023, 2025, 2025], lan: [2024, 2025, 2025, 2025, 2026], blurb: "Mathieu Herbaut: record four-time HLTV No. 1 and three-time Major MVP; Vitality's untouchable AWP prodigy." }),
  mk({ id: "device", name: "device", nation: "Denmark", league: "DEN", active: true, debut: 2013, maj: [2017, 2018, 2019, 2019], mvp: [2018, 2019], lan: [2018, 2018, 2019, 2019, 2019, 2021], blurb: "Nicolai Reedtz: four Majors and two Major MVPs anchoring the Astralis dynasty; the most decorated AWPer of his age." }),
  mk({ id: "coldzera", name: "coldzera", nation: "Brazil", league: "BRA", active: false, debut: 2014, maj: [2016, 2016], no1: [2016, 2017], mvp: [2016, 2016], lan: [2016, 2016, 2017, 2017], blurb: "Marcelo David: back-to-back HLTV No. 1 and two Major MVPs in one year; the standard-setter of the SK era." }),
  mk({ id: "niko", name: "NiKo", nation: "Bosnia and Herzegovina", league: "BIH", active: true, debut: 2013, maj: [2026], no1: [], mvp: [], lan: [2017, 2017, 2023, 2024, 2024], blurb: "Nikola Kovač: widely called the finest pure rifler ever, who won his long-awaited first Major at IEM Cologne 2026 with Team Falcons." }),
  mk({ id: "dupreeh", name: "dupreeh", nation: "Denmark", league: "DEN", active: true, debut: 2013, maj: [2017, 2018, 2019, 2019, 2023], lan: [2018, 2018, 2019, 2019, 2023], blurb: "Peter Rasmussen: a record five Majors and every Major attended; the most decorated player in Counter-Strike history." }),
  mk({ id: "getright", name: "GeT_RiGhT", nation: "Sweden", league: "SWE", active: false, debut: 2007, maj: [2014], no1: [2013, 2014], lan: [2013, 2013, 2014, 2014], blurb: "Christopher Alesund: back-to-back HLTV No. 1 in 2013–14 and the beating heart of the historic NiP lineup." }),
  mk({ id: "olofmeister", name: "olofmeister", nation: "Sweden", league: "SWE", active: false, debut: 2012, maj: [2015, 2015], no1: [2015], mvp: [2015], lan: [2014, 2014, 2015, 2015], blurb: "Olof Kajbjer: HLTV No. 1 of 2015 with two Majors and a Major MVP; fnatic's clutch-defining superstar." }),
  mk({ id: "electronic", name: "electronic", nation: "Russia", league: "RUS", active: true, debut: 2016, maj: [2021], lan: [2020, 2021, 2021, 2022], blurb: "Denis Sharipov: NAVI's relentless second star behind s1mple, a Major champion and perennial HLTV top-five rifler." }),
  mk({ id: "xyp9x", name: "Xyp9x", nation: "Denmark", league: "DEN", active: true, debut: 2012, maj: [2017, 2018, 2019, 2019], lan: [2018, 2018, 2019, 2019], blurb: "Andreas Højsleth: four Majors and the 'Clutch Minister' of the Astralis dynasty; the definitive support player." }),
  mk({ id: "magisk", name: "Magisk", nation: "Denmark", league: "DEN", active: true, debut: 2014, maj: [2018, 2019, 2019, 2023], mvp: [2019], lan: [2018, 2019, 2019, 2023], blurb: "Emil Reif: four Majors across two dynasties — three with Astralis, a fifth-slot fourth with Vitality in 2023." }),
  mk({ id: "gla1ve", name: "gla1ve", nation: "Denmark", league: "DEN", active: true, debut: 2013, maj: [2017, 2018, 2019, 2019], lan: [2018, 2018, 2019, 2019], blurb: "Lukas Rossander: four Majors and the tactical mastermind behind Astralis; a leading candidate for greatest IGL ever." }),
  mk({ id: "fallen", name: "FalleN", nation: "Brazil", league: "BRA", active: true, debut: 2013, maj: [2016, 2016], lan: [2016, 2016, 2017], blurb: "Gabriel Toledo: 'The Professor'; two Majors and an era-defining AWP/IGL who built Brazilian Counter-Strike." }),
  mk({ id: "fer", name: "fer", nation: "Brazil", league: "BRA", active: true, debut: 2013, maj: [2016, 2016], lan: [2016, 2016, 2017], blurb: "Fernando Alvarenga: two Majors and the explosive aggressor of the Luminosity/SK core that ruled 2016–17." }),
  mk({ id: "kennys", name: "kennyS", nation: "France", league: "FRA", active: false, debut: 2013, maj: [2015], mvp: [2015], lan: [2015, 2016], blurb: "Kenny Schrub: the flashy AWP virtuoso whose 2015 Cluj Major MVP defined early Global Offensive sniping." }),
  mk({ id: "guardian", name: "GuardiaN", nation: "Slovakia", league: "SVK", active: false, debut: 2012, no1: [], lan: [2015, 2017, 2017], blurb: "Ladislav Kovács: an elite AWPer of the NAVI and FaZe eras — three Major finals reached, none ever won." }),
  mk({ id: "nbk", name: "NBK-", nation: "France", league: "FRA", active: false, debut: 2011, maj: [2014, 2015], lan: [2015, 2018], blurb: "Nathan Schmitt: two early Majors with LDLC and EnVyUs; a versatile support and leader across the French scene." }),
  mk({ id: "twistzz", name: "Twistzz", nation: "Canada", league: "CAN", active: true, debut: 2016, maj: [2022], lan: [2019, 2022, 2023], blurb: "Russel Van Dulken: the first Canadian Major champion, a lethal rifler and two-time Grand Slam winner." }),
  mk({ id: "rain", name: "rain", nation: "Norway", league: "NOR", active: true, debut: 2013, maj: [2022], mvp: [2022], lan: [2017, 2022], blurb: "Håvard Nygaard: FaZe's long-serving entry fragger; a Major champion and Major MVP after years of near-misses." }),
  mk({ id: "ropz", name: "ropz", nation: "Estonia", league: "EST", active: true, debut: 2016, maj: [2022, 2025, 2025], lan: [2022, 2025, 2025, 2026], blurb: "Robin Kool: three Majors — one with FaZe, two with Vitality — and one of the most consistent riflers alive." }),
  mk({ id: "sh1ro", name: "sh1ro", nation: "Russia", league: "RUS", active: true, debut: 2020, maj: [2024], lan: [2021, 2024], blurb: "Dmitry Sokolov: an ice-cold AWPer, top-ten every year since his debut; a Shanghai 2024 Major champion with Spirit." }),
  mk({ id: "m0nesy", name: "m0NESY", nation: "Russia", league: "RUS", active: true, debut: 2021, maj: [2026], no1: [], mvp: [2026], lan: [2023, 2024, 2024], blurb: "Ilya Osipov: the prodigy AWPer and 2024 HLTV runner-up who won the 2026 IEM Cologne Major and its MVP with Team Falcons." }),
  mk({ id: "b1t", name: "b1t", nation: "Ukraine", league: "UKR", active: true, debut: 2020, maj: [2021], lan: [2021, 2021, 2022], blurb: "Valerii Vakhovskyi: won the Stockholm 2021 Major on debut beside s1mple; NAVI's dependable young rifling star." }),
  mk({ id: "elige", name: "EliGE", nation: "United States", league: "USA", active: true, debut: 2015, no1: [], lan: [2019, 2019], blurb: "Jonathan Jablonowski: Team Liquid's mechanical engine and Grand Slam winner — the most Majors played without a win." }),
];
