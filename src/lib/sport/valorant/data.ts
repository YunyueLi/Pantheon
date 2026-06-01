import type { Achievement, Player } from "../types";

/**
 * VALORANT roster — 24 of the best players of the VCT era (2021–), verified
 * against Liquipedia/Wikipedia and capped at June 2025 (Champions 2021–2024 and
 * Masters through Shanghai 2024 included; Champions 2025 excluded).
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));
const C = (type: string, count: number, year: number): Achievement[] =>
  count > 0 ? [{ type, year, count }] : [];

type Raw = {
  id: string; name: string; nation: string; league: string; role: string;
  active: boolean; debut: number; blurb: string;
  champions: number[]; champMvp: number[]; masters: number[]; mastersMvp: number[]; finalist: number;
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "valorant", league: r.league, position: r.role,
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...A("champions_title", r.champions),
    ...A("champions_mvp", r.champMvp),
    ...A("masters_title", r.masters),
    ...A("masters_mvp", r.mastersMvp),
    ...C("champions_finalist", r.finalist, r.debut + 2),
  ],
});

export const VALORANT_PLAYERS: Player[] = [
  mk({ id: "aspas", name: "aspas", nation: "Brazil", league: "BRA", role: "duelist", active: true, debut: 2021, champions: [2022], champMvp: [2022], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Erick Santos: Champions 2022 winner and MVP with LOUD; the widest-consensus pick as VALORANT's GOAT." }),
  mk({ id: "tenz", name: "TenZ", nation: "Canada", league: "CAN", role: "duelist", active: false, debut: 2020, champions: [], champMvp: [], masters: [2021, 2024], mastersMvp: [2021], finalist: 0,
    blurb: "Tyson Ngo: Sentinels' Masters Reykjavik 2021 (MVP) and Madrid 2024 winner; the sport's first superstar." }),
  mk({ id: "demon1", name: "Demon1", nation: "United States", league: "USA", role: "duelist", active: true, debut: 2021, champions: [2023], champMvp: [2023], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Max Mazanov: carried Evil Geniuses to the Champions 2023 title with a historic MVP playoff run." }),
  mk({ id: "less", name: "Less", nation: "Brazil", league: "BRA", role: "sentinel", active: true, debut: 2021, champions: [2022], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Felipe de Loyola: elite sentinel anchor of Champions-2022 LOUD, rated the best lockdown player of his era." }),
  mk({ id: "derke", name: "Derke", nation: "Finland", league: "FIN", role: "duelist", active: true, debut: 2020, champions: [], champMvp: [], masters: [2023, 2023], mastersMvp: [], finalist: 0,
    blurb: "Nikita Sirmitev: Fnatic's star duelist; the first to win two international LANs back-to-back in 2023." }),
  mk({ id: "chronicle", name: "Chronicle", nation: "Russia", league: "RUS", role: "flex", active: true, debut: 2021, champions: [], champMvp: [], masters: [2021, 2023, 2023], mastersMvp: [2023], finalist: 1,
    blurb: "Timofey Khromov: Masters Berlin 2021 (Gambit) then Lock//In + Tokyo 2023 (Fnatic); a Champions 2021 finalist." }),
  mk({ id: "alfajer", name: "Alfajer", nation: "Türkiye", league: "TUR", role: "sentinel", active: true, debut: 2021, champions: [], champMvp: [], masters: [2023, 2023], mastersMvp: [2023], finalist: 0,
    blurb: "Emir Beder: Fnatic's prodigy sentinel; a 2023 double-Masters winner and Masters Tokyo MVP." }),
  mk({ id: "boaster", name: "Boaster", nation: "United Kingdom", league: "GBR", role: "igl", active: true, debut: 2020, champions: [], champMvp: [], masters: [2023, 2023], mastersMvp: [], finalist: 0,
    blurb: "Jake Howlett: the long-tenured Fnatic in-game leader behind the back-to-back 2023 LAN titles." }),
  mk({ id: "leo", name: "Leo", nation: "Sweden", league: "SWE", role: "initiator", active: true, debut: 2021, champions: [], champMvp: [], masters: [2023, 2023], mastersMvp: [2023], finalist: 0,
    blurb: "Leo Jannesson: Fnatic initiator and the first-ever VLR MVP award winner (Lock//In 2023)." }),
  mk({ id: "cned", name: "cNed", nation: "Türkiye", league: "TUR", role: "duelist", active: true, debut: 2020, champions: [2021], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Mehmet Ipek: Acend's Jett ace and the face of the first-ever VALORANT Champions title in 2021." }),
  mk({ id: "nats", name: "nAts", nation: "Russia", league: "RUS", role: "sentinel", active: true, debut: 2020, champions: [], champMvp: [], masters: [2021], mastersMvp: [], finalist: 1,
    blurb: "Ayaz Akhmetshin: Gambit's genre-defining sentinel; Masters Berlin 2021 winner and Champions 2021 runner-up." }),
  mk({ id: "yay", name: "yay", nation: "United States", league: "USA", role: "duelist", active: true, debut: 2020, champions: [], champMvp: [], masters: [2022], mastersMvp: [], finalist: 1,
    blurb: "Jaccob Whiteaker: 'El Diablo'; OpTic's lethal Masters Reykjavik 2022 winner and Champions 2022 finalist." }),
  mk({ id: "zekken", name: "Zekken", nation: "United States", league: "USA", role: "duelist", active: true, debut: 2021, champions: [], champMvp: [], masters: [2024], mastersMvp: [], finalist: 0,
    blurb: "Zachary Patrone: Sentinels' star duelist and the standout of the Masters Madrid 2024 title run." }),
  mk({ id: "f0rsaken", name: "f0rsakeN", nation: "Indonesia", league: "IDN", role: "flex", active: true, debut: 2021, champions: [], champMvp: [], masters: [], mastersMvp: [], finalist: 1,
    blurb: "Jason Susanto: Paper Rex's versatile star and a Champions 2023 finalist anchoring a Pacific powerhouse." }),
  mk({ id: "jinggg", name: "Jinggg", nation: "Singapore", league: "SGP", role: "duelist", active: true, debut: 2021, champions: [], champMvp: [], masters: [], mastersMvp: [], finalist: 1,
    blurb: "Wang Jing Jie: Paper Rex's explosive entry duelist and a Champions 2023 finalist." }),
  mk({ id: "something", name: "something", nation: "Indonesia", league: "IDN", role: "duelist", active: true, debut: 2022, champions: [], champMvp: [], masters: [], mastersMvp: [], finalist: 1,
    blurb: "Ilya Petrov: Paper Rex's aggressive duelist and a Champions 2023 finalist with a famously chaotic style." }),
  mk({ id: "sacy", name: "Sacy", nation: "Brazil", league: "BRA", role: "initiator", active: true, debut: 2020, champions: [2022], champMvp: [], masters: [2024], mastersMvp: [], finalist: 0,
    blurb: "Gustavo Rossi: Champions 2022 with LOUD then Masters Madrid 2024 with Sentinels — across two dynasties." }),
  mk({ id: "pancada", name: "pANcada", nation: "Brazil", league: "BRA", role: "controller", active: true, debut: 2021, champions: [2022], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Bryan Luna: LOUD's controller in the Champions 2022 title run, a smokes specialist." }),
  mk({ id: "saadhak", name: "Saadhak", nation: "Brazil", league: "BRA", role: "igl", active: true, debut: 2020, champions: [2022], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Matias Delipetro: the Argentine-Brazilian in-game leader who captained LOUD to the Champions 2022 crown." }),
  mk({ id: "t3xture", name: "t3xture", nation: "South Korea", league: "KOR", role: "duelist", active: true, debut: 2022, champions: [], champMvp: [], masters: [2024], mastersMvp: [2024], finalist: 0,
    blurb: "Kim Na-ra: Gen.G's star duelist and MVP of Masters Shanghai 2024, the first LAN won by a Pacific team." }),
  mk({ id: "stax", name: "stax", nation: "South Korea", league: "KOR", role: "igl", active: true, debut: 2020, champions: [], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Kim Gu-taek: DRX's veteran in-game leader and a perennial Pacific contender, top-3 at Champions 2022." }),
  mk({ id: "buzz", name: "BuZz", nation: "South Korea", league: "KOR", role: "duelist", active: true, debut: 2020, champions: [], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Yu Byung-chul: DRX's star duelist and one of the Pacific region's most consistent contenders." }),
  mk({ id: "mako", name: "MaKo", nation: "South Korea", league: "KOR", role: "controller", active: true, debut: 2020, champions: [], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Kim Myeong-kwan: DRX's elite controller, regarded among the very best smokes players in the world." }),
  mk({ id: "scream", name: "ScreaM", nation: "Belgium", league: "BEL", role: "duelist", active: false, debut: 2020, champions: [], champMvp: [], masters: [], mastersMvp: [], finalist: 0,
    blurb: "Adil Benrlitom: the Belgian-Moroccan headshot legend whose aim defined VALORANT's early competitive era." }),
];
