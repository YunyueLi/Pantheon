import type { Achievement, Player } from "../types";

/**
 * VALORANT roster — 64 players of the VCT era (2021–), verified vs Liquipedia
 * and capped June 2025. Every honor is recorded at its REAL YEAR as an individual
 * dated entry (no bulk counts), so the career timeline shows the true distribution.
 * "masters" = official VCT Masters titles only (the one-off Lock//In is not a Masters).
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; nation: string; league: string; role: string;
  active: boolean; debut: number; blurb: string;
  ch?: number[]; cm?: number[]; mt?: number[]; mm?: number[]; cf?: number[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "valorant", league: r.league, position: r.role,
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...A("champions_title", r.ch ?? []), ...A("champions_mvp", r.cm ?? []),
    ...A("masters_title", r.mt ?? []), ...A("masters_mvp", r.mm ?? []),
    ...A("champions_finalist", r.cf ?? []),
  ],
});

export const VALORANT_PLAYERS: Player[] = [
  mk({ id: "aspas", name: "aspas", nation: "Brazil", league: "Americas", role: "duelist", active: true, debut: 2021, ch: [2022], cm: [2022], blurb: "Erick Santos: Champions 2022 winner and MVP with LOUD; the widest-consensus pick as VALORANT's GOAT." }),
  mk({ id: "tenz", name: "TenZ", nation: "Canada", league: "Americas", role: "duelist", active: false, debut: 2020, mt: [2021, 2024], mm: [2021], blurb: "Tyson Ngo: Sentinels' Masters Reykjavik 2021 (MVP) and Madrid 2024 winner; the sport's first superstar." }),
  mk({ id: "demon1", name: "Demon1", nation: "United States", league: "Americas", role: "duelist", active: true, debut: 2021, ch: [2023], cm: [2023], blurb: "Max Mazanov: carried Evil Geniuses to the Champions 2023 title with a historic MVP playoff run." }),
  mk({ id: "less", name: "Less", nation: "Brazil", league: "Americas", role: "sentinel", active: true, debut: 2021, ch: [2022], blurb: "Felipe de Loyola: elite sentinel anchor of Champions-2022 LOUD, rated the best lockdown player of his era." }),
  mk({ id: "derke", name: "Derke", nation: "Finland", league: "EMEA", role: "duelist", active: true, debut: 2020, mt: [2023], blurb: "Nikita Sirmitev: Fnatic's star duelist; the Masters Tokyo 2023 winner and a back-to-back-LAN icon." }),
  mk({ id: "chronicle", name: "Chronicle", nation: "Russia", league: "EMEA", role: "flex", active: true, debut: 2021, mt: [2021, 2023], mm: [2021], cf: [2021], blurb: "Timofey Khromov: Masters Berlin 2021 (Gambit) then Tokyo 2023 (Fnatic); a Champions 2021 finalist." }),
  mk({ id: "alfajer", name: "Alfajer", nation: "Türkiye", league: "EMEA", role: "sentinel", active: true, debut: 2021, mt: [2023], mm: [2023], blurb: "Emir Beder: Fnatic's prodigy sentinel and Masters Tokyo 2023 MVP." }),
  mk({ id: "boaster", name: "Boaster", nation: "United Kingdom", league: "EMEA", role: "igl", active: true, debut: 2020, mt: [2023], blurb: "Jake Howlett: the long-tenured Fnatic in-game leader behind their 2023 international dominance." }),
  mk({ id: "leo", name: "Leo", nation: "Sweden", league: "EMEA", role: "initiator", active: true, debut: 2021, mt: [2023], blurb: "Leo Jannesson: Fnatic initiator and the first-ever VCT LAN MVP award winner (Lock//In 2023)." }),
  mk({ id: "cned", name: "cNed", nation: "Türkiye", league: "EMEA", role: "duelist", active: true, debut: 2020, ch: [2021], blurb: "Mehmet Yağız İpek: Acend's Jett ace and the face of the first-ever VALORANT Champions title in 2021." }),
  mk({ id: "nats", name: "nAts", nation: "Russia", league: "EMEA", role: "sentinel", active: true, debut: 2020, mt: [2021], cf: [2021], blurb: "Ayaz Akhmetshin: Gambit's genre-defining sentinel; Masters Berlin 2021 winner and Champions 2021 runner-up." }),
  mk({ id: "yay", name: "yay", nation: "United States", league: "Americas", role: "duelist", active: true, debut: 2020, mt: [2022], cf: [2022], blurb: "Jaccob Whiteaker: 'El Diablo'; OpTic's lethal Masters Reykjavik 2022 winner and Champions 2022 finalist." }),
  mk({ id: "zekken", name: "Zekken", nation: "United States", league: "Americas", role: "duelist", active: true, debut: 2021, mt: [2024], mm: [2024], blurb: "Zachary Patrone: Sentinels' star duelist and MVP of the Masters Madrid 2024 title run." }),
  mk({ id: "f0rsaken", name: "f0rsakeN", nation: "Indonesia", league: "Pacific", role: "flex", active: true, debut: 2021, cf: [2023], blurb: "Jason Susanto: Paper Rex's versatile star and a Champions 2023 finalist anchoring a Pacific powerhouse." }),
  mk({ id: "jinggg", name: "Jinggg", nation: "Singapore", league: "Pacific", role: "duelist", active: true, debut: 2021, cf: [2023], blurb: "Wang Jing Jie: Paper Rex's explosive entry duelist and a Champions 2023 finalist." }),
  mk({ id: "something", name: "something", nation: "Russia", league: "Pacific", role: "duelist", active: true, debut: 2022, cf: [2023], blurb: "Ilya Petrov: Paper Rex's aggressive duelist and a Champions 2023 finalist with a famously chaotic style." }),
  mk({ id: "sacy", name: "Sacy", nation: "Brazil", league: "Americas", role: "initiator", active: true, debut: 2020, ch: [2022], mt: [2024], blurb: "Gustavo Rossi: Champions 2022 with LOUD then Masters Madrid 2024 with Sentinels — the first to win both." }),
  mk({ id: "pancada", name: "pANcada", nation: "Brazil", league: "Americas", role: "controller", active: true, debut: 2021, ch: [2022], blurb: "Bryan Luna: LOUD's controller in the Champions 2022 title run, a smokes specialist." }),
  mk({ id: "saadhak", name: "Saadhak", nation: "Argentina", league: "Americas", role: "igl", active: true, debut: 2020, ch: [2022], blurb: "Matias Delipetro: the Argentine in-game leader who captained LOUD to the Champions 2022 crown." }),
  mk({ id: "t3xture", name: "t3xture", nation: "South Korea", league: "Pacific", role: "duelist", active: true, debut: 2022, mt: [2024], mm: [2024], blurb: "Kim Na-ra: Gen.G's star duelist and MVP of Masters Shanghai 2024, the first LAN won by a Pacific team." }),
  mk({ id: "stax", name: "stax", nation: "South Korea", league: "Pacific", role: "igl", active: true, debut: 2020, blurb: "Kim Gu-taek: DRX's veteran in-game leader and a perennial Pacific contender, top-3 at Champions 2022." }),
  mk({ id: "buzz", name: "BuZz", nation: "South Korea", league: "Pacific", role: "duelist", active: true, debut: 2020, blurb: "Yu Byung-chul: DRX's star duelist and one of the Pacific region's most consistent contenders." }),
  mk({ id: "mako", name: "MaKo", nation: "South Korea", league: "Pacific", role: "controller", active: true, debut: 2020, blurb: "Kim Myeong-kwan: DRX's elite controller, regarded among the very best smokes players in the world." }),
  mk({ id: "scream", name: "ScreaM", nation: "Belgium", league: "EMEA", role: "duelist", active: false, debut: 2020, blurb: "Adil Benrlitom: the Belgian-Moroccan headshot legend whose aim defined VALORANT's early competitive era." }),
  mk({ id: "zmjjkk", name: "ZmjjKK", nation: "China", league: "China", role: "duelist", active: true, debut: 2022, ch: [2024], cm: [2024], blurb: "Zheng Yongkang: EDward Gaming's Operator ace and MVP of China's historic Champions 2024 title." }),
  mk({ id: "chichoo", name: "CHICHOO", nation: "China", league: "China", role: "sentinel", active: true, debut: 2022, ch: [2024], blurb: "Wan Shunzhi: EDward Gaming's sentinel anchor on the first Chinese VCT Champions winner (2024)." }),
  mk({ id: "nobody", name: "nobody", nation: "China", league: "China", role: "igl", active: true, debut: 2021, ch: [2024], blurb: "Wang Senxu: EDward Gaming's in-game leader who guided China to the Champions 2024 crown." }),
  mk({ id: "smoggy", name: "Smoggy", nation: "China", league: "China", role: "controller", active: true, debut: 2022, ch: [2024], blurb: "Zhang Zhao: EDward Gaming's controller on the historic Champions 2024 roster, China's first world title." }),
  mk({ id: "s1mon", name: "S1Mon", nation: "China", league: "China", role: "initiator", active: true, debut: 2024, ch: [2024], blurb: "Xie Mengxun: rookie initiator who replaced Haodong in mid-2024 and won Champions 2024 with EDward Gaming." }),
  mk({ id: "haodong", name: "Haodong", nation: "China", league: "China", role: "initiator", active: true, debut: 2021, blurb: "Guo Haodong: EDward Gaming's longtime IGL, benched for S1Mon just before the 2024 Champions title run." }),
  mk({ id: "marved", name: "Marved", nation: "Canada", league: "Americas", role: "controller", active: true, debut: 2020, mt: [2022], mm: [2022], cf: [2022], blurb: "Jimmy Nguyen: OpTic's controller; Masters Reykjavik 2022 winner and MVP, plus a Champions 2022 finalist." }),
  mk({ id: "crashies", name: "crashies", nation: "United States", league: "Americas", role: "initiator", active: true, debut: 2020, mt: [2022], cf: [2022], blurb: "Austin Roberts: OpTic/NRG initiator; Masters Reykjavik 2022 winner and a Champions 2022 finalist." }),
  mk({ id: "victor", name: "Victor", nation: "United States", league: "Americas", role: "duelist", active: true, debut: 2020, mt: [2022], cf: [2022], blurb: "Victor Wong: OpTic's duelist; Masters Reykjavik 2022 winner and Champions 2022 grand finalist." }),
  mk({ id: "fns", name: "FNS", nation: "Canada", league: "Americas", role: "igl", active: false, debut: 2020, mt: [2022], cf: [2022], blurb: "Pujan Mehta: legendary IGL of the ENVY/OpTic/NRG core; Masters Reykjavik 2022 winner and Champions 2022 finalist." }),
  mk({ id: "zellsis", name: "Zellsis", nation: "United States", league: "Americas", role: "flex", active: true, debut: 2020, mt: [2024], blurb: "Jordan Montemurro: versatile flex who won Masters Madrid 2024 with Sentinels." }),
  mk({ id: "johnqt", name: "johnqt", nation: "Morocco", league: "Americas", role: "igl", active: true, debut: 2021, mt: [2024], blurb: "Amine Ouarid: Sentinels' IGL and the first African to win a VCT global event, Masters Madrid 2024." }),
  mk({ id: "suygetsu", name: "SUYGETSU", nation: "Russia", league: "EMEA", role: "sentinel", active: true, debut: 2021, mt: [2022], mm: [2022], blurb: "Dmitry Ilyushin: FPX/NAVI sentinel; Masters Copenhagen 2022 winner and MVP, a top EMEA lockdown player." }),
  mk({ id: "ardiis", name: "ardiis", nation: "Latvia", league: "EMEA", role: "flex", active: true, debut: 2020, mt: [2022], blurb: "Ardis Svarenieks: Latvian flex/duelist; a Masters Copenhagen 2022 winner with FPX who later joined NAVI." }),
  mk({ id: "shao", name: "Shao", nation: "Russia", league: "EMEA", role: "initiator", active: true, debut: 2021, mt: [2022], blurb: "Andrey Kiprsky: FPX/NAVI initiator and elite flex; a Masters Copenhagen 2022 winner and EMEA mainstay." }),
  mk({ id: "zyppan", name: "Zyppan", nation: "Sweden", league: "EMEA", role: "duelist", active: true, debut: 2021, mt: [2022], blurb: "Pontus Eek: Swedish duelist/initiator; a Masters Copenhagen 2022 winner with FunPlus Phoenix." }),
  mk({ id: "ange1", name: "ANGE1", nation: "Ukraine", league: "EMEA", role: "igl", active: true, debut: 2020, mt: [2022], blurb: "Kyrylo Karasov: veteran Ukrainian IGL who led FunPlus Phoenix to Masters Copenhagen 2022, later NAVI." }),
  mk({ id: "redgar", name: "Redgar", nation: "Russia", league: "EMEA", role: "igl", active: true, debut: 2020, mt: [2021], cf: [2021], blurb: "Igor Vlasov: Gambit's IGL behind Masters Berlin 2021 and the Champions 2021 grand-final run." }),
  mk({ id: "purp0", name: "purp0", nation: "Russia", league: "EMEA", role: "duelist", active: true, debut: 2022, blurb: "Semyon Borchev: Russian duelist rated among EMEA's sharpest young entry fraggers." }),
  mk({ id: "jamppi", name: "Jamppi", nation: "Finland", league: "EMEA", role: "flex", active: true, debut: 2020, blurb: "Elias Olkkonen: Team Liquid's long-tenured Finnish star who won the 2023 VCT EMEA regional title." }),
  mk({ id: "kaajak", name: "kaajak", nation: "Poland", league: "EMEA", role: "duelist", active: true, debut: 2022, blurb: "Kajetan Haremski: Polish duelist for Fnatic, a promising EMEA talent." }),
  mk({ id: "koldamenta", name: "koldamenta", nation: "Spain", league: "EMEA", role: "igl", active: true, debut: 2021, blurb: "José Luis Aranguren: Spanish IGL (KOI) known as a sharp EMEA in-game leader." }),
  mk({ id: "cloud", name: "Cloud", nation: "Russia", league: "EMEA", role: "igl", active: true, debut: 2022, blurb: "Kirill Nekhozhin: Russian IGL for GIANTX, an emerging EMEA leader." }),
  mk({ id: "mrfalin", name: "MrFaliN", nation: "Türkiye", league: "EMEA", role: "igl", active: true, debut: 2021, blurb: "Furkan Yegen: Turkish IGL for FUT Esports, a steady EMEA leader." }),
  mk({ id: "mindfreak", name: "mindfreak", nation: "Indonesia", league: "Pacific", role: "controller", active: true, debut: 2021, cf: [2023], blurb: "Aaron Leonhart: Paper Rex's controller and a Champions 2023 grand finalist in the Pacific powerhouse." }),
  mk({ id: "d4v41", name: "d4v41", nation: "Malaysia", league: "Pacific", role: "flex", active: true, debut: 2021, cf: [2023], blurb: "Khalish Rusyaidee: Malaysian flex/IGL for Paper Rex and a Champions 2023 grand finalist." }),
  mk({ id: "benkai", name: "Benkai", nation: "Singapore", league: "Pacific", role: "igl", active: true, debut: 2020, blurb: "Benedict Tan: Paper Rex's founding IGL and a respected Pacific veteran." }),
  mk({ id: "mazino", name: "Mazino", nation: "Chile", league: "Americas", role: "initiator", active: true, debut: 2021, blurb: "Roberto Rivas: Chilean initiator/flex for Leviatán; a Champions 2024 semifinalist." }),
  mk({ id: "sayf", name: "Sayf", nation: "Sweden", league: "EMEA", role: "duelist", active: true, debut: 2021, blurb: "Saif Jibraeel: Swedish duelist for Team Vitality who reached Champions 2024." }),
  mk({ id: "benjyfishy", name: "benjyfishy", nation: "United Kingdom", league: "EMEA", role: "sentinel", active: true, debut: 2023, cf: [2024], blurb: "Benjy Fish: ex-Fortnite prodigy turned Team Heretics sentinel and a Champions 2024 grand finalist." }),
  mk({ id: "boo", name: "Boo", nation: "Lithuania", league: "EMEA", role: "igl", active: true, debut: 2021, cf: [2024], blurb: "Ričardas Lukaševičius: Lithuanian IGL who led Team Heretics to the Champions 2024 grand final." }),
  mk({ id: "miniboo", name: "MiniBoo", nation: "Lithuania", league: "EMEA", role: "duelist", active: true, debut: 2023, cf: [2024], blurb: "Dominykas Lukaševičius: Team Heretics' young duelist (Boo's brother) and a Champions 2024 grand finalist." }),
  mk({ id: "riens", name: "RieNs", nation: "Türkiye", league: "EMEA", role: "initiator", active: true, debut: 2021, cf: [2024], blurb: "Enes Ecirli: Turkish initiator for Team Heretics and a standout in their Champions 2024 grand-final run." }),
  mk({ id: "wo0t", name: "Wo0t", nation: "Türkiye", league: "EMEA", role: "flex", active: true, debut: 2021, cf: [2024], blurb: "Mert Alkan: Turkish flex player for Team Heretics and a Champions 2024 grand finalist." }),
  mk({ id: "asuna", name: "Asuna", nation: "United States", league: "Americas", role: "duelist", active: true, debut: 2020, blurb: "Peter Mazuryk: 100 Thieves' long-tenured American duelist and a Masters Berlin 2021 semifinalist." }),
  mk({ id: "xeppaa", name: "Xeppaa", nation: "United States", league: "Americas", role: "flex", active: true, debut: 2021, blurb: "Erick Bach: Cloud9's versatile flex/initiator and a consistent Americas presence." }),
  mk({ id: "valyn", name: "valyn", nation: "United States", league: "Americas", role: "igl", active: true, debut: 2021, blurb: "Jacob Batio: G2 Esports' American IGL, a sharp tactical leader in the Americas league." }),
  mk({ id: "runi", name: "runi", nation: "Canada", league: "Americas", role: "controller", active: true, debut: 2022, blurb: "Cloud9 controller/flex who broke in during the 2024 Americas season." }),
  mk({ id: "jonahp", name: "JonahP", nation: "Canada", league: "Americas", role: "sentinel", active: true, debut: 2022, blurb: "Jonah Pulice: Canadian-Italian sentinel/flex for Sentinels who joined after the Madrid run." }),
  mk({ id: "trexx", name: "trexx", nation: "Russia", league: "EMEA", role: "initiator", active: true, debut: 2021, blurb: "Nikita Cherednichenko: Russian initiator (KOI/Team Liquid) competing in EMEA." }),
];
