import type { Achievement, Player } from "../types";

/**
 * Go roster — 22 consensus all-time greats across Korea, China and Japan and
 * the pre-title golden age. International title totals follow the strict
 * "open world championship" count verified against English Wikipedia (capped
 * June 2025; e.g. Shin Jin-seo's Sept-2025 9th title is excluded). Domestic
 * totals are given where Wikipedia documents them. Go Seigen predates world
 * titles entirely — his standing lives in the Stature lens, not this index.
 */
const C = (type: string, count: number, year: number): Achievement[] =>
  count > 0 ? [{ type, year, count }] : [];

type Raw = {
  id: string; name: string; nation: string; league: string;
  active: boolean; debut: number; blurb: string; world: number; worldYear: number; domestic: number; domYear: number;
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "go", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [...C("world_title", r.world, r.worldYear), ...C("domestic_title", r.domestic, r.domYear)],
});

export const GO_PLAYERS: Player[] = [
  mk({ id: "go-seigen", name: "Go Seigen", nation: "China/Japan", league: "JPN", active: false, debut: 1929, world: 0, worldYear: 1945, domestic: 0, domYear: 1945,
    blurb: "The 20th century's consensus greatest, who crushed every rival in a series of jubango ten-game matches." }),
  mk({ id: "lee-chang-ho", name: "Lee Chang-ho", nation: "South Korea", league: "KOR", active: false, debut: 1986, world: 21, worldYear: 2001, domestic: 117, domYear: 1998,
    blurb: "The 'Stone Buddha' whose record 21 world titles and flawless endgame defined 1990s–2000s Go." }),
  mk({ id: "lee-sedol", name: "Lee Sedol", nation: "South Korea", league: "KOR", active: false, debut: 1995, world: 18, worldYear: 2008, domestic: 30, domYear: 2008,
    blurb: "Aggressive genius with 18 world titles, second all-time, and the only human to beat AlphaGo." }),
  mk({ id: "cho-hunhyun", name: "Cho Hunhyun", nation: "South Korea", league: "KOR", active: false, debut: 1962, world: 11, worldYear: 1994, domestic: 139, domYear: 1990,
    blurb: "Korea's foundational champion; his 1989 Ing Cup win ignited the nation's Go golden age." }),
  mk({ id: "ke-jie", name: "Ke Jie", nation: "China", league: "CHN", active: true, debut: 2008, world: 8, worldYear: 2018, domestic: 0, domYear: 2018,
    blurb: "China's dominant modern No. 1, holder of eight world titles and the last human to face AlphaGo." }),
  mk({ id: "gu-li", name: "Gu Li", nation: "China", league: "CHN", active: false, debut: 1995, world: 8, worldYear: 2009, domestic: 0, domYear: 2009,
    blurb: "Fearless attacker and Ke Jie's predecessor as China's best; eight world titles in a storied rivalry with Lee Sedol." }),
  mk({ id: "shin-jinseo", name: "Shin Jin-seo", nation: "South Korea", league: "KOR", active: true, debut: 2012, world: 8, worldYear: 2024, domestic: 0, domYear: 2024,
    blurb: "The 'Shin God,' a generationally dominant world No. 1 with eight world titles by mid-2025." }),
  mk({ id: "park-junghwan", name: "Park Jung-hwan", nation: "South Korea", league: "KOR", active: true, debut: 2006, world: 6, worldYear: 2016, domestic: 0, domYear: 2016,
    blurb: "Long-time Korean No. 1 and six-time world champion, Shin Jin-seo's chief domestic rival." }),
  mk({ id: "iyama-yuta", name: "Iyama Yuta", nation: "Japan", league: "JPN", active: true, debut: 2002, world: 0, worldYear: 2016, domestic: 82, domYear: 2016,
    blurb: "Japan's modern colossus and first to hold all seven domestic titles at once, though no world crown." }),
  mk({ id: "cho-chikun", name: "Cho Chikun", nation: "Japan", league: "JPN", active: true, debut: 1968, world: 1, worldYear: 1991, domestic: 75, domYear: 1990,
    blurb: "Korean-born Japanese great with a record 75 domestic titles and the only Grand Slam of all seven." }),
  mk({ id: "kobayashi-koichi", name: "Kobayashi Koichi", nation: "Japan", league: "JPN", active: false, debut: 1967, world: 1, worldYear: 1997, domestic: 59, domYear: 1990,
    blurb: "Dominated Japan's domestic scene in the late 1980s–90s with 59 titles and a lone Fujitsu Cup." }),
  mk({ id: "sakata-eio", name: "Sakata Eio", nation: "Japan", league: "JPN", active: false, debut: 1935, world: 0, worldYear: 1964, domestic: 64, domYear: 1964,
    blurb: "Postwar Japan's sharpest blade, a seven-time Honinbo who once held all seven major titles in 1964." }),
  mk({ id: "nie-weiping", name: "Nie Weiping", nation: "China", league: "CHN", active: false, debut: 1982, world: 2, worldYear: 1990, domestic: 0, domYear: 1990,
    blurb: "China's first hero, the 'Go Saint' whose China–Japan Supermatch heroics built the Chinese game." }),
  mk({ id: "ma-xiaochun", name: "Ma Xiaochun", nation: "China", league: "CHN", active: false, debut: 1982, world: 5, worldYear: 1998, domestic: 47, domYear: 1995,
    blurb: "China's premier player of the 1990s, the first to win all four major world titles of his era." }),
  mk({ id: "chang-hao", name: "Chang Hao", nation: "China", league: "CHN", active: false, debut: 1986, world: 3, worldYear: 2007, domestic: 0, domYear: 2007,
    blurb: "China's bridge generation between Ma Xiaochun and Gu Li; finally broke through with the 2005 Ing Cup." }),
  mk({ id: "kong-jie", name: "Kong Jie", nation: "China", league: "CHN", active: false, debut: 1994, world: 3, worldYear: 2010, domestic: 0, domYear: 2010,
    blurb: "Briefly China's best around 2010, sweeping the Fujitsu and LG Cups in a single breakout year." }),
  mk({ id: "choi-cheol-han", name: "Choi Cheol-han", nation: "South Korea", league: "KOR", active: true, debut: 1997, world: 2, worldYear: 2009, domestic: 0, domYear: 2009,
    blurb: "'The Viper,' a fierce Korean top-tenner of the 2000s with Fujitsu and Ing Cup world titles." }),
  mk({ id: "fan-tingyu", name: "Fan Tingyu", nation: "China", league: "CHN", active: true, debut: 2009, world: 1, worldYear: 2013, domestic: 0, domYear: 2013,
    blurb: "Became the youngest Ing Cup champion in history at 16, beating Park Jung-hwan in the 2013 final." }),
  mk({ id: "mi-yuting", name: "Mi Yuting", nation: "China", league: "CHN", active: true, debut: 2007, world: 2, worldYear: 2021, domestic: 0, domYear: 2021,
    blurb: "Steady Chinese top player who won the very first MLily Cup over Gu Li and a second in 2021." }),
  mk({ id: "tang-weixing", name: "Tang Weixing", nation: "China", league: "CHN", active: true, debut: 2006, world: 3, worldYear: 2019, domestic: 0, domYear: 2019,
    blurb: "Chinese world champion who twice won the Samsung Cup and took the 2016 Ing Cup." }),
  mk({ id: "takemiya-masaki", name: "Takemiya Masaki", nation: "Japan", league: "JPN", active: false, debut: 1965, world: 2, worldYear: 1989, domestic: 18, domYear: 1988,
    blurb: "Inventor of the influence-first 'Cosmic Style' and winner of the first two Fujitsu Cups." }),
  mk({ id: "rin-kaiho", name: "Rin Kaiho", nation: "Japan", league: "JPN", active: false, debut: 1955, world: 2, worldYear: 1992, domestic: 34, domYear: 1980,
    blurb: "Taiwan-born pillar of Japan's 'Six Supers,' an eight-time Meijin with over 1,300 career wins." }),
];
