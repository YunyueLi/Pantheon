import type { Achievement, Player } from "../types";

/**
 * Go roster — 54 of the greatest players across Korea, China, Japan and the
 * pre-title golden age. International titles are broken out BY TOURNAMENT and
 * domestic majors are credited (Japan's Kisei/Meijin/Honinbo split out, Korean
 * & Chinese majors as totals). All verified against English Wikipedia's
 * "List of world Go champions" master table and the per-tournament champions
 * tables, capped June 2025 (Shin Jin-seo's Sept-2025 9th world title excluded).
 *
 * `famous` is the well-known career world-title tally (incl. continental events
 * for Lee Chang-ho 21 / Lee Sedol 18 / Cho Hunhyun 11) shown as the marquee; the
 * per-tournament `intl` types do the scoring. Strict open-world titles that have
 * no dedicated key here (the BC Card, Xinao/ENN, Tianfu and Beihai Xinyi cups,
 * plus Asian TV continental titles) flow through the `famous` gap into the
 * `other_intl` bucket, so nothing is double counted and nothing is lost.
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
  // ---------- Historic / classical era (pre-modern-title or Japanese golden age) ----------
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

  // ---------- Japan: modern-title era ----------
  mk({ id: "rin-kaiho", name: "Rin Kaiho", nation: "Japan", league: "JPN", active: false, debut: 1955, famous: 1, intl: { fujitsu: 1 }, dom: { kisei: 3, meijin: 8, honinbo: 5, jp: 34 },
    blurb: "Taiwan-born pillar of Japan's 'Six Supers,' an eight-time Meijin who won the 1990 Fujitsu Cup." }),
  mk({ id: "takemiya-masaki", name: "Takemiya Masaki", nation: "Japan", league: "JPN", active: false, debut: 1965, famous: 2, intl: { fujitsu: 2 }, dom: { kisei: 3, meijin: 1, honinbo: 6, jp: 18 },
    blurb: "Inventor of the influence-first 'Cosmic Style' and winner of the first two Fujitsu Cups." }),
  mk({ id: "otake-hideo", name: "Otake Hideo", nation: "Japan", league: "JPN", active: false, debut: 1956, famous: 1, intl: { fujitsu: 1 }, dom: { kisei: 2, meijin: 4, honinbo: 1, jp: 41 },
    blurb: "Elegant 'Beauty of Go' stylist and four-time Meijin who took the 1992 Fujitsu Cup over Nie Weiping." }),
  mk({ id: "kato-masao", name: "Kato Masao", nation: "Japan", league: "JPN", active: false, debut: 1964, famous: 0, intl: {}, dom: { kisei: 4, meijin: 2, honinbo: 4, jp: 46 },
    blurb: "The fearsome 'Killer of the Go world,' a Kitani-dojo great with eleven Oza titles but no world crown." }),
  mk({ id: "kobayashi-koichi", name: "Kobayashi Koichi", nation: "Japan", league: "JPN", active: false, debut: 1967, famous: 1, intl: { fujitsu: 1 }, dom: { kisei: 8, meijin: 8, honinbo: 4, jp: 59 },
    blurb: "Dominated Japan's domestic scene in the late 1980s–90s with 59 titles and a lone Fujitsu Cup." }),
  mk({ id: "cho-chikun", name: "Cho Chikun", nation: "Japan", league: "JPN", active: true, debut: 1968, famous: 2, intl: { fujitsu: 1, samsung: 1 }, dom: { kisei: 8, meijin: 9, honinbo: 12, jp: 75 },
    blurb: "Korean-born Japanese great with a record 75 domestic titles, twelve Honinbo crowns and two world titles." }),
  mk({ id: "yoda-norimoto", name: "Yoda Norimoto", nation: "Japan", league: "JPN", active: true, debut: 1980, famous: 1, intl: { samsung: 1 }, dom: { kisei: 2, meijin: 4, jp: 30 },
    blurb: "Four-time Meijin and the 'Hikaru no Go' model who won the first Samsung Cup back in 1996." }),
  mk({ id: "o-meien", name: "O Meien", nation: "Taiwan/Japan", league: "JPN", active: true, debut: 1977, famous: 0, intl: {}, dom: { honinbo: 2, jp: 7 },
    blurb: "Taiwan-born Nihon Ki-in fighter of quirky genius, a two-time Honinbo in the early 2000s." }),
  mk({ id: "cho-u", name: "Cho U", nation: "Taiwan/Japan", league: "JPN", active: true, debut: 1994, famous: 1, intl: { lg: 1 }, dom: { kisei: 3, meijin: 5, honinbo: 2, jp: 38 },
    blurb: "Taiwan-born Japanese No. 1 of the 2000s, a five-time Meijin who won the 2005 LG Cup abroad." }),
  mk({ id: "yamashita-keigo", name: "Yamashita Keigo", nation: "Japan", league: "JPN", active: true, debut: 1993, famous: 0, intl: {}, dom: { kisei: 5, meijin: 2, honinbo: 2, jp: 22 },
    blurb: "Bold attacking stylist and five-time Kisei, a leading Japanese No. 1 of the 2000s with no world crown." }),
  mk({ id: "iyama-yuta", name: "Iyama Yuta", nation: "Japan", league: "JPN", active: true, debut: 2002, famous: 0, intl: {}, dom: { kisei: 9, meijin: 8, honinbo: 11, jp: 80 },
    blurb: "Japan's modern colossus and first to hold all seven domestic titles at once, though no world crown." }),
  mk({ id: "ichiriki-ryo", name: "Ichiriki Ryo", nation: "Japan", league: "JPN", active: true, debut: 2010, famous: 1, intl: { ing: 1 }, dom: { kisei: 1, meijin: 1, honinbo: 1, jp: 18 },
    blurb: "Japan's modern No. 1 who broke a long drought by winning the 2024 Ing Cup, beating Xie Ke 3-0." }),

  // ---------- Korea ----------
  mk({ id: "cho-hunhyun", name: "Cho Hunhyun", nation: "South Korea", league: "KOR", active: false, debut: 1962, famous: 11, intl: { ing: 1, fujitsu: 3, tong_yang: 2, samsung: 2, chunlan: 1 }, dom: { kr: 139 },
    blurb: "Korea's foundational champion; his 1989 Ing Cup win ignited the nation's Go golden age." }),
  mk({ id: "seo-bongsoo", name: "Seo Bong-soo", nation: "South Korea", league: "KOR", active: true, debut: 1970, famous: 1, intl: { ing: 1 }, dom: { kr: 21 },
    blurb: "Korea's 'Wild Fox,' Cho Hunhyun's lifelong rival, who won the 2nd Ing Cup in 1993." }),
  mk({ id: "yoo-changhyuk", name: "Yoo Changhyuk", nation: "South Korea", league: "KOR", active: false, debut: 1984, famous: 6, intl: { ing: 1, fujitsu: 2, lg: 1, samsung: 1, chunlan: 1 }, dom: { kr: 24 },
    blurb: "Attacking 'Speedy' star of Korea's first golden generation with six world titles across five events." }),
  mk({ id: "lee-chang-ho", name: "Lee Chang-ho", nation: "South Korea", league: "KOR", active: false, debut: 1986, famous: 21, intl: { ing: 1, fujitsu: 2, tong_yang: 4, lg: 4, samsung: 3, chunlan: 2, world_oza: 1 }, dom: { kr: 117 },
    blurb: "The 'Stone Buddha' whose record 21 world titles and flawless endgame defined an entire era." }),
  mk({ id: "lee-sedol", name: "Lee Sedol", nation: "South Korea", league: "KOR", active: false, debut: 1995, famous: 18, intl: { fujitsu: 3, lg: 2, samsung: 4, chunlan: 1, world_oza: 2 }, dom: { kr: 30 },
    blurb: "Aggressive genius with 18 world titles and the only human ever to beat AlphaGo in a match." }),
  mk({ id: "mok-jinseok", name: "Mok Jin-seok", nation: "South Korea", league: "KOR", active: true, debut: 1994, famous: 0, intl: {}, dom: { kr: 5 },
    blurb: "Steady Korean veteran and national-team head coach; an LG Cup finalist who never lifted a world title." }),
  mk({ id: "won-seongjin", name: "Won Seong-jin", nation: "South Korea", league: "KOR", active: true, debut: 1998, famous: 1, intl: { samsung: 1 }, dom: { kr: 5 },
    blurb: "Korean pro who stunned Gu Li to win the 2011 Samsung Cup for his lone world title." }),
  mk({ id: "park-yeonghun", name: "Park Yeong-hun", nation: "South Korea", league: "KOR", active: true, debut: 1999, famous: 2, intl: { fujitsu: 2 }, dom: { kr: 15 },
    blurb: "Once Korea's youngest 9-dan, a two-time Fujitsu Cup winner in 2004 and 2007." }),
  mk({ id: "choi-cheol-han", name: "Choi Cheol-han", nation: "South Korea", league: "KOR", active: true, debut: 1997, famous: 1, intl: { ing: 1 }, dom: { kr: 14 },
    blurb: "'The Viper,' a fierce Korean top-tenner of the 2000s who won the 2009 Ing Cup." }),
  mk({ id: "kang-dongyun", name: "Kang Dong-yun", nation: "South Korea", league: "KOR", active: true, debut: 2002, famous: 2, intl: { fujitsu: 1, lg: 1 }, dom: { kr: 5 },
    blurb: "Korean top-tenner who won the 2009 Fujitsu Cup over Lee Chang-ho and the 2016 LG Cup." }),
  mk({ id: "kim-jiseok", name: "Kim Ji-seok", nation: "South Korea", league: "KOR", active: true, debut: 2003, famous: 1, intl: { samsung: 1 }, dom: { kr: 2 },
    blurb: "Hard-hitting Korean pro whose career peak was the 2014 Samsung Cup world title." }),
  mk({ id: "park-junghwan", name: "Park Jung-hwan", nation: "South Korea", league: "KOR", active: true, debut: 2006, famous: 6, intl: { fujitsu: 1, lg: 1, samsung: 1, chunlan: 1, mlily: 1 }, dom: { kr: 20 },
    blurb: "Long-time Korean No. 1 and six-time world champion, Shin Jin-seo's chief domestic rival." }),
  mk({ id: "shin-jinseo", name: "Shin Jin-seo", nation: "South Korea", league: "KOR", active: true, debut: 2012, famous: 8, intl: { ing: 1, lg: 3, samsung: 1, chunlan: 1, quzhou_lanke: 1, nanyang: 1 }, dom: { kr: 30 },
    blurb: "The 'Shin God,' a generationally dominant world No. 1 with eight world titles by June 2025." }),
  mk({ id: "shin-minjun", name: "Shin Min-jun", nation: "South Korea", league: "KOR", active: true, debut: 2012, famous: 1, intl: { lg: 1 }, dom: { kr: 4 },
    blurb: "Solid Korean top-tenner who beat Ke Jie to win the 2021 LG Cup, his maiden world title." }),
  mk({ id: "byun-sang-il", name: "Byun Sang-il", nation: "South Korea", league: "KOR", active: true, debut: 2013, famous: 2, intl: { lg: 1, chunlan: 1 }, dom: { kr: 5 },
    blurb: "Korea's clear No. 2 behind Shin, taking the 2023 Chunlan and a dramatic 2025 LG Cup." }),
  mk({ id: "choi-jeong", name: "Choi Jeong", nation: "South Korea", league: "KOR", active: true, debut: 2010, famous: 0, intl: {}, dom: { kr: 30 },
    blurb: "The greatest female player ever — seven women's world titles and the first woman in a major world final." }),

  // ---------- China ----------
  mk({ id: "nie-weiping", name: "Nie Weiping", nation: "China", league: "CHN", active: false, debut: 1965, famous: 0, intl: {}, dom: { cn: 37 },
    blurb: "China's first hero, the 'Go Saint' of the China–Japan Supermatches, though never a world champion." }),
  mk({ id: "ma-xiaochun", name: "Ma Xiaochun", nation: "China", league: "CHN", active: false, debut: 1982, famous: 2, intl: { fujitsu: 1, tong_yang: 1 }, dom: { cn: 47 },
    blurb: "China's premier player of the 1990s, a thirteen-time Mingren who swept the 1995 Fujitsu and Tong Yang Cups." }),
  mk({ id: "chang-hao", name: "Chang Hao", nation: "China", league: "CHN", active: false, debut: 1986, famous: 3, intl: { ing: 1, samsung: 1, chunlan: 1 }, dom: { cn: 20 },
    blurb: "China's bridge generation between Ma Xiaochun and Gu Li; broke through with the 2005 Ing Cup." }),
  mk({ id: "luo-xihe", name: "Luo Xihe", nation: "China", league: "CHN", active: true, debut: 1989, famous: 1, intl: { samsung: 1 }, dom: { cn: 3 },
    blurb: "Cerebral Chinese veteran nicknamed 'Cosmic Flow' who won the 2006 Samsung Cup over Lee Chang-ho." }),
  mk({ id: "kong-jie", name: "Kong Jie", nation: "China", league: "CHN", active: false, debut: 1994, famous: 3, intl: { fujitsu: 1, lg: 1, samsung: 1 }, dom: { cn: 11 },
    blurb: "Briefly China's best around 2010, sweeping the Fujitsu, LG and Samsung Cups in a breakout stretch." }),
  mk({ id: "gu-li", name: "Gu Li", nation: "China", league: "CHN", active: false, debut: 1995, famous: 8, intl: { lg: 2, fujitsu: 1, world_oza: 1, samsung: 1, chunlan: 2 }, dom: { cn: 31 },
    blurb: "Fearless attacker and China's best of his era; eight world titles in a storied Lee Sedol rivalry." }),
  mk({ id: "chen-yaoye", name: "Chen Yaoye", nation: "China", league: "CHN", active: true, debut: 2004, famous: 3, intl: { chunlan: 1, bailing: 1 }, dom: { cn: 13 },
    blurb: "Consistent Chinese top player with three world titles, beating Lee Sedol for the 2013 Chunlan Cup." }),
  mk({ id: "shi-yue", name: "Shi Yue", nation: "China", league: "CHN", active: true, debut: 2003, famous: 1, intl: { lg: 1 }, dom: { cn: 3 },
    blurb: "Once China's No. 1, a positional master who won the 2013 LG Cup over Won Seong-jin." }),
  mk({ id: "zhou-ruiyang", name: "Zhou Ruiyang", nation: "China", league: "CHN", active: true, debut: 2002, famous: 1, intl: { bailing: 1 }, dom: { cn: 8 },
    blurb: "Chinese top player who won the inaugural 2013 Bailing Cup over countryman Chen Yaoye." }),
  mk({ id: "jiang-weijie", name: "Jiang Weijie", nation: "China", league: "CHN", active: true, debut: 2005, famous: 1, intl: { lg: 1 }, dom: { cn: 7 },
    blurb: "Shanghai-born Chinese pro who won the 2012 LG Cup and ended Gu Li's long Mingren reign." }),
  mk({ id: "tuo-jiaxi", name: "Tuo Jiaxi", nation: "China", league: "CHN", active: true, debut: 2002, famous: 1, intl: { lg: 1 }, dom: { cn: 5 },
    blurb: "Chinese top player whose career highlight was the 2014 LG Cup world title." }),
  mk({ id: "fan-tingyu", name: "Fan Tingyu", nation: "China", league: "CHN", active: true, debut: 2009, famous: 1, intl: { ing: 1 }, dom: { cn: 6 },
    blurb: "Became the youngest Ing Cup champion in history at 16, beating Park Jung-hwan in the 2013 final." }),
  mk({ id: "mi-yuting", name: "Mi Yuting", nation: "China", league: "CHN", active: true, debut: 2007, famous: 2, intl: { mlily: 2 }, dom: { cn: 8 },
    blurb: "Steady Chinese top player who won the very first MLily Cup over Gu Li and a second in 2021." }),
  mk({ id: "tan-xiao", name: "Tan Xiao", nation: "China", league: "CHN", active: true, debut: 2004, famous: 1, intl: { chunlan: 1 }, dom: { cn: 3 },
    blurb: "Chinese pro who beat Park Yeong-hun to capture the 2017 Chunlan Cup, his sole world title." }),
  mk({ id: "tang-weixing", name: "Tang Weixing", nation: "China", league: "CHN", active: true, debut: 2006, famous: 3, intl: { samsung: 2, ing: 1 }, dom: { cn: 4 },
    blurb: "Chinese world champion who twice won the Samsung Cup and took the 2016 Ing Cup over Park Jung-hwan." }),
  mk({ id: "yang-dingxin", name: "Yang Dingxin", nation: "China", league: "CHN", active: true, debut: 2008, famous: 1, intl: { lg: 1 }, dom: { cn: 8 },
    blurb: "Once the youngest pro ever in China, a No. 1 who won the 2019 LG Cup over Shi Yue." }),
  mk({ id: "gu-zihao", name: "Gu Zihao", nation: "China", league: "CHN", active: true, debut: 2011, famous: 2, intl: { samsung: 1, quzhou_lanke: 1 }, dom: { cn: 7 },
    blurb: "Chinese top-ranked player who won the 2017 Samsung Cup and the 2023 Quzhou-Lanke Cup." }),
  mk({ id: "ke-jie", name: "Ke Jie", nation: "China", league: "CHN", active: true, debut: 2008, famous: 8, intl: { samsung: 4, bailing: 2, mlily: 1 }, dom: { cn: 14 },
    blurb: "China's dominant modern No. 1, holder of eight world titles and the last human to face AlphaGo." }),
  mk({ id: "li-xuanhao", name: "Li Xuanhao", nation: "China", league: "CHN", active: true, debut: 2008, famous: 1, intl: { mlily: 1 }, dom: { cn: 4 },
    blurb: "Briefly China's No. 1, who won the 2024 MLily Cup for his first world title." }),
  mk({ id: "ding-hao", name: "Ding Hao", nation: "China", league: "CHN", active: true, debut: 2015, famous: 3, intl: { lg: 1, samsung: 2 }, dom: { cn: 9 },
    blurb: "China's new No. 1, who won the 2023 LG Cup and back-to-back Samsung Cups in 2023–24." }),
  mk({ id: "wang-xinghao", name: "Wang Xinghao", nation: "China", league: "CHN", active: true, debut: 2016, famous: 1, intl: {}, dom: { cn: 3 },
    blurb: "China's rising No. 1, who won the inaugural 2025 Beihai Xinyi Cup for his maiden world title." }),
];
