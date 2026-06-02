import type { Achievement, Player } from "../types";

/**
 * Go roster — 34 of the greatest players across Korea, China, Japan and the
 * pre-title golden age. International titles are broken out BY TOURNAMENT and
 * domestic majors are credited (Japan's Kisei/Meijin/Honinbo split out, Korean
 * & Chinese majors as totals). All verified against English Wikipedia and the
 * per-tournament champions tables, capped June 2025 (Shin Jin-seo's Sept-2025
 * 9th world title excluded). `famous` is the well-known career world-title tally
 * (incl. continental events for Lee Chang-ho 21 / Lee Sedol 18 / Cho Hunhyun 11)
 * shown as the marquee; the per-tournament types do the scoring.
 */
const C = (type: string, count: number, year: number): Achievement[] =>
  count > 0 ? [{ type, year, count }] : [];

type Intl = Partial<Record<
  "ing" | "fujitsu" | "tong_yang" | "lg" | "samsung" | "chunlan" | "bailing" | "mlily" | "world_oza" | "quzhou_lanke" | "nanyang",
  number
>>;
type Dom = { kisei?: number; meijin?: number; honinbo?: number; jp?: number; kr?: number; cn?: number };

type Raw = {
  id: string; name: string; nation: string; league: string; active: boolean; debut: number;
  blurb: string; famous: number; intl: Intl; dom: Dom;
};

const mk = (r: Raw): Player => {
  const iy = r.debut + 15;
  const dy = r.debut + 18;
  const namedSum = Object.values(r.intl).reduce((s, v) => s + (v ?? 0), 0);
  const other = Math.max(0, r.famous - namedSum);
  const d = r.dom;
  const big3 = (d.kisei ?? 0) + (d.meijin ?? 0) + (d.honinbo ?? 0);
  const jpOther = Math.max(0, (d.jp ?? 0) - big3);
  return {
    id: r.id, name: r.name, sport: "go", league: r.league, position: "",
    team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
    achievements: [
      ...C("world_title", r.famous, iy),
      ...Object.entries(r.intl).flatMap(([k, v]) => C(k, v ?? 0, iy)),
      ...C("other_intl", other, iy),
      ...C("kisei", d.kisei ?? 0, dy), ...C("meijin", d.meijin ?? 0, dy), ...C("honinbo", d.honinbo ?? 0, dy),
      ...C("jp_other", jpOther, dy), ...C("kr_major", d.kr ?? 0, dy), ...C("cn_major", d.cn ?? 0, dy),
    ],
  };
};

export const GO_PLAYERS: Player[] = [
  mk({ id: "go-seigen", name: "Go Seigen", nation: "China/Japan", league: "JPN", active: false, debut: 1929, famous: 0, intl: {}, dom: {},
    blurb: "The 20th century's consensus greatest, who crushed every rival in long jubango ten-game matches." }),
  mk({ id: "honinbo-shusaku", name: "Honinbo Shusaku", nation: "Japan", league: "JPN", active: false, debut: 1840, famous: 0, intl: {}, dom: {},
    blurb: "The Edo-era 'Invincible Shusaku,' 19-0 in the castle games and a posthumously venerated Go Sage." }),
  mk({ id: "kitani-minoru", name: "Kitani Minoru", nation: "Japan", league: "JPN", active: false, debut: 1924, famous: 0, intl: {}, dom: {},
    blurb: "Co-father of the New Fuseki with Go Seigen, whose dojo trained a whole generation of champions." }),
  mk({ id: "fujisawa-hideyuki", name: "Fujisawa Hideyuki", nation: "Japan", league: "JPN", active: false, debut: 1940, famous: 0, intl: {}, dom: { kisei: 6, meijin: 2, honinbo: 2, jp: 20 },
    blurb: "Won the first six Kisei titles and mentored Chinese Go; a revered, larger-than-life strategist." }),
  mk({ id: "sakata-eio", name: "Sakata Eio", nation: "Japan", league: "JPN", active: false, debut: 1935, famous: 0, intl: {}, dom: { meijin: 2, honinbo: 7, jp: 64 },
    blurb: "Postwar Japan's sharpest blade, a seven-time Honinbo who once held every major title of his era at once." }),
  mk({ id: "rin-kaiho", name: "Rin Kaiho", nation: "Japan", league: "JPN", active: false, debut: 1955, famous: 2, intl: { fujitsu: 1, tong_yang: 1 }, dom: { kisei: 3, meijin: 8, honinbo: 5, jp: 34 },
    blurb: "Taiwan-born pillar of Japan's 'Six Supers,' an eight-time Meijin with over 1,300 career wins." }),
  mk({ id: "takemiya-masaki", name: "Takemiya Masaki", nation: "Japan", league: "JPN", active: false, debut: 1965, famous: 2, intl: { fujitsu: 2 }, dom: { kisei: 3, meijin: 1, honinbo: 6, jp: 18 },
    blurb: "Inventor of the influence-first 'Cosmic Style' and winner of the first two Fujitsu Cups." }),
  mk({ id: "otake-hideo", name: "Otake Hideo", nation: "Japan", league: "JPN", active: false, debut: 1956, famous: 1, intl: { fujitsu: 1 }, dom: { kisei: 2, meijin: 4, honinbo: 1, jp: 48 },
    blurb: "Elegant 'Beauty of Go' stylist and four-time Meijin who took the 1992 Fujitsu Cup over Nie Weiping." }),
  mk({ id: "kato-masao", name: "Kato Masao", nation: "Japan", league: "JPN", active: false, debut: 1964, famous: 0, intl: {}, dom: { kisei: 4, meijin: 2, honinbo: 4, jp: 46 },
    blurb: "The fearsome 'Killer of the Go world,' a Kitani-dojo great with eleven Oza titles but no world crown." }),
  mk({ id: "kobayashi-koichi", name: "Kobayashi Koichi", nation: "Japan", league: "JPN", active: false, debut: 1967, famous: 1, intl: { fujitsu: 1 }, dom: { kisei: 8, meijin: 8, honinbo: 4, jp: 59 },
    blurb: "Dominated Japan's domestic scene in the late 1980s–90s with 59 titles and a lone Fujitsu Cup." }),
  mk({ id: "cho-chikun", name: "Cho Chikun", nation: "Japan", league: "JPN", active: true, debut: 1968, famous: 1, intl: { fujitsu: 1 }, dom: { kisei: 8, meijin: 9, honinbo: 12, jp: 75 },
    blurb: "Korean-born Japanese great with a record 75 domestic titles and a record twelve Honinbo crowns." }),
  mk({ id: "cho-u", name: "Cho U", nation: "Japan", league: "JPN", active: true, debut: 1994, famous: 1, intl: { lg: 1 }, dom: { kisei: 3, meijin: 5, honinbo: 2, jp: 24 },
    blurb: "Taiwan-born Japanese No. 1 of the 2000s, a five-time Meijin who won the 2005 LG Cup abroad." }),
  mk({ id: "iyama-yuta", name: "Iyama Yuta", nation: "Japan", league: "JPN", active: true, debut: 2002, famous: 0, intl: {}, dom: { kisei: 9, meijin: 8, honinbo: 11, jp: 80 },
    blurb: "Japan's modern colossus and first to hold all seven domestic titles at once, though no world crown." }),
  mk({ id: "ichiriki-ryo", name: "Ichiriki Ryo", nation: "Japan", league: "JPN", active: true, debut: 2010, famous: 1, intl: { ing: 1 }, dom: { kisei: 1, meijin: 1, honinbo: 1, jp: 18 },
    blurb: "Japan's modern No. 1 who broke a long drought by winning the 2024 Ing Cup, beating Xie Ke 3-0." }),
  mk({ id: "cho-hunhyun", name: "Cho Hunhyun", nation: "South Korea", league: "KOR", active: false, debut: 1962, famous: 11, intl: { ing: 1, fujitsu: 2, tong_yang: 2, samsung: 1, chunlan: 1 }, dom: { kr: 139 },
    blurb: "Korea's foundational champion; his 1989 Ing Cup win ignited the nation's Go golden age." }),
  mk({ id: "yoo-changhyuk", name: "Yoo Changhyuk", nation: "South Korea", league: "KOR", active: false, debut: 1984, famous: 6, intl: { ing: 1, fujitsu: 2, lg: 1, samsung: 1, chunlan: 1 }, dom: { kr: 24 },
    blurb: "Attacking 'Speedy' star of Korea's first golden generation with six world titles across five events." }),
  mk({ id: "lee-chang-ho", name: "Lee Chang-ho", nation: "South Korea", league: "KOR", active: false, debut: 1986, famous: 21, intl: { ing: 1, fujitsu: 2, tong_yang: 4, lg: 4, samsung: 3, chunlan: 2, world_oza: 1 }, dom: { kr: 117 },
    blurb: "The 'Stone Buddha' whose record 21 world titles and flawless endgame defined an entire era." }),
  mk({ id: "lee-sedol", name: "Lee Sedol", nation: "South Korea", league: "KOR", active: false, debut: 1995, famous: 18, intl: { fujitsu: 3, lg: 2, samsung: 4, chunlan: 1, mlily: 1, world_oza: 2 }, dom: { kr: 30 },
    blurb: "Aggressive genius with 18 world titles and the only human ever to beat AlphaGo in a match." }),
  mk({ id: "choi-cheol-han", name: "Choi Cheol-han", nation: "South Korea", league: "KOR", active: true, debut: 1997, famous: 2, intl: { ing: 1, fujitsu: 1 }, dom: { kr: 14 },
    blurb: "'The Viper,' a fierce Korean top-tenner of the 2000s with Fujitsu and Ing Cup world titles." }),
  mk({ id: "park-junghwan", name: "Park Jung-hwan", nation: "South Korea", league: "KOR", active: true, debut: 2006, famous: 6, intl: { fujitsu: 1, lg: 1, samsung: 1, chunlan: 1, mlily: 1 }, dom: { kr: 20 },
    blurb: "Long-time Korean No. 1 and six-time world champion, Shin Jin-seo's chief domestic rival." }),
  mk({ id: "shin-jinseo", name: "Shin Jin-seo", nation: "South Korea", league: "KOR", active: true, debut: 2012, famous: 8, intl: { ing: 1, lg: 3, samsung: 1, chunlan: 1, quzhou_lanke: 1, nanyang: 1 }, dom: { kr: 30 },
    blurb: "The 'Shin God,' a generationally dominant world No. 1 with eight world titles by June 2025." }),
  mk({ id: "byun-sang-il", name: "Byun Sang-il", nation: "South Korea", league: "KOR", active: true, debut: 2013, famous: 2, intl: { lg: 1, chunlan: 1 }, dom: { kr: 5 },
    blurb: "Korea's clear No. 2 behind Shin, taking the 2023 Chunlan and a dramatic 2025 LG Cup." }),
  mk({ id: "choi-jeong", name: "Choi Jeong", nation: "South Korea", league: "KOR", active: true, debut: 2010, famous: 0, intl: {}, dom: { kr: 30 },
    blurb: "The greatest female player ever — seven women's world titles and the first woman in a major world final." }),
  mk({ id: "nie-weiping", name: "Nie Weiping", nation: "China", league: "CHN", active: false, debut: 1965, famous: 0, intl: {}, dom: { cn: 37 },
    blurb: "China's first hero, the 'Go Saint' of the China–Japan Supermatches, though never a world champion." }),
  mk({ id: "ma-xiaochun", name: "Ma Xiaochun", nation: "China", league: "CHN", active: false, debut: 1982, famous: 5, intl: { fujitsu: 1, tong_yang: 1, lg: 1, samsung: 1, chunlan: 1 }, dom: { cn: 47 },
    blurb: "China's premier player of the 1990s, the first to win all four major world titles of his era." }),
  mk({ id: "chang-hao", name: "Chang Hao", nation: "China", league: "CHN", active: false, debut: 1986, famous: 3, intl: { ing: 1, samsung: 1, chunlan: 1 }, dom: { cn: 20 },
    blurb: "China's bridge generation between Ma Xiaochun and Gu Li; broke through with the 2005 Ing Cup." }),
  mk({ id: "kong-jie", name: "Kong Jie", nation: "China", league: "CHN", active: false, debut: 1994, famous: 3, intl: { fujitsu: 1, lg: 1, samsung: 1 }, dom: { cn: 11 },
    blurb: "Briefly China's best around 2010, sweeping the Fujitsu and LG Cups in a single breakout year." }),
  mk({ id: "gu-li", name: "Gu Li", nation: "China", league: "CHN", active: false, debut: 1995, famous: 8, intl: { lg: 2, fujitsu: 1, world_oza: 1, samsung: 1, chunlan: 2 }, dom: { cn: 31 },
    blurb: "Fearless attacker and China's best of his era; eight world titles in a storied Lee Sedol rivalry." }),
  mk({ id: "fan-tingyu", name: "Fan Tingyu", nation: "China", league: "CHN", active: true, debut: 2009, famous: 1, intl: { ing: 1 }, dom: { cn: 6 },
    blurb: "Became the youngest Ing Cup champion in history at 16, beating Park Jung-hwan in the 2013 final." }),
  mk({ id: "mi-yuting", name: "Mi Yuting", nation: "China", league: "CHN", active: true, debut: 2007, famous: 2, intl: { mlily: 2 }, dom: { cn: 8 },
    blurb: "Steady Chinese top player who won the very first MLily Cup over Gu Li and a second in 2021." }),
  mk({ id: "tang-weixing", name: "Tang Weixing", nation: "China", league: "CHN", active: true, debut: 2006, famous: 3, intl: { samsung: 2, ing: 1 }, dom: { cn: 4 },
    blurb: "Chinese world champion who twice won the Samsung Cup and took the 2016 Ing Cup over Park Jung-hwan." }),
  mk({ id: "gu-zihao", name: "Gu Zihao", nation: "China", league: "CHN", active: true, debut: 2011, famous: 2, intl: { samsung: 1, quzhou_lanke: 1 }, dom: { cn: 7 },
    blurb: "Chinese top-ranked player who won the 2017 Samsung Cup and the 2023 Quzhou-Lanke Cup." }),
  mk({ id: "ke-jie", name: "Ke Jie", nation: "China", league: "CHN", active: true, debut: 2008, famous: 8, intl: { samsung: 4, bailing: 2, mlily: 1 }, dom: { cn: 14 },
    blurb: "China's dominant modern No. 1, holder of eight world titles and the last human to face AlphaGo." }),
  mk({ id: "ding-hao", name: "Ding Hao", nation: "China", league: "CHN", active: true, debut: 2015, famous: 3, intl: { lg: 1, samsung: 2 }, dom: { cn: 9 },
    blurb: "China's new No. 1, who won the 2023 LG Cup and back-to-back Samsung Cups in 2023–24." }),
];
