import type { Achievement, Player } from "../types";

/**
 * Go roster — 54 of the greatest players across Korea, China, Japan and the
 * pre-title golden age. International titles are broken out BY TOURNAMENT and
 * recorded at their REAL YEAR; domestic majors are recorded per year by country.
 * Verified against English Wikipedia's per-tournament champions tables and reputable
 * Go results sources; current through 2026-07-06 (H2-2025 and 2026 world finals
 * included — e.g. Shin Jin-seo's 9th world title at the 2025 World's Top Player
 * Championship; the two 2026 LG Cup entries are the 30th edition, won by Shin
 * Min-jun in Jan 2026, and the 31st, won by Wang Xinghao in Jun 2026).
 *
 * The `world_title` / `domestic_title` entries are base-0 display aggregates that
 * power the headline tiles only; the per-tournament and per-year entries below do
 * all the scoring, so nothing is double counted.
 */
type Raw = {
  id: string; name: string; nation: string; league: string; active: boolean; debut: number;
  blurb: string; world: [string, number][]; dom: Record<string, number>;
};

const mk = (r: Raw): Player => {
  const domType = r.league === "JPN" ? "jp_title" : r.league === "KOR" ? "kr_title" : "cn_title";
  const intl: Achievement[] = r.world.map(([t, year]) => ({ type: t === "other" ? "other_intl" : t, year }));
  const dom: Achievement[] = Object.entries(r.dom).map(([y, c]) => ({ type: domType, year: Number(y), count: c }));
  const domTotal = Object.values(r.dom).reduce((s, c) => s + c, 0);
  const lastWorld = intl.length ? Math.max(...intl.map((a) => a.year)) : r.debut;
  const lastDom = dom.length ? Math.max(...dom.map((a) => a.year)) : r.debut;
  return {
    id: r.id, name: r.name, sport: "go", league: r.league, position: "",
    team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
    achievements: [
      ...(intl.length ? [{ type: "world_title", year: lastWorld, count: intl.length }] : []),
      ...(domTotal > 0 ? [{ type: "domestic_title", year: lastDom, count: domTotal }] : []),
      ...intl,
      ...dom,
    ],
  };
};

export const GO_PLAYERS: Player[] = [
  // ---------- Historic / classical era ----------
  mk({ id: "go-seigen", name: "Go Seigen", nation: "China/Japan", league: "JPN", active: false, debut: 1929, world: [], dom: {},
    blurb: "The 20th century's consensus greatest, who crushed every rival in long jubango ten-game matches." }),
  mk({ id: "honinbo-shusaku", name: "Honinbo Shusaku", nation: "Japan", league: "JPN", active: false, debut: 1840, world: [], dom: {},
    blurb: "The Edo-era 'Invincible Shusaku,' 19-0 in the castle games and a posthumously venerated Go Sage." }),
  mk({ id: "kitani-minoru", name: "Kitani Minoru", nation: "Japan", league: "JPN", active: false, debut: 1924, world: [], dom: {},
    blurb: "Co-father of the New Fuseki with Go Seigen, whose dojo trained a whole generation of champions." }),
  mk({ id: "fujisawa-hideyuki", name: "Fujisawa Hideyuki", nation: "Japan", league: "JPN", active: false, debut: 1940, world: [], dom: { 1962: 1, 1967: 1, 1968: 1, 1969: 1, 1970: 1, 1976: 1, 1977: 1, 1978: 1, 1979: 1, 1980: 1, 1981: 1, 1982: 1, 1991: 1, 1992: 1 },
    blurb: "Won the first six Kisei titles and mentored Chinese Go; a revered, larger-than-life strategist." }),
  mk({ id: "sakata-eio", name: "Sakata Eio", nation: "Japan", league: "JPN", active: false, debut: 1935, world: [], dom: { 1961: 2, 1962: 1, 1963: 3, 1964: 3, 1965: 1, 1966: 3, 1967: 2, 1968: 1, 1970: 1, 1971: 1, 1972: 2, 1973: 1 },
    blurb: "Postwar Japan's sharpest blade, a seven-time Honinbo who once held every major title of his era at once." }),

  // ---------- Japan: modern-title era ----------
  mk({ id: "rin-kaiho", name: "Rin Kaiho", nation: "Japan", league: "JPN", active: false, debut: 1955, world: [["fujitsu", 1990]], dom: { 1965: 1, 1966: 1, 1967: 1, 1968: 1, 1969: 2, 1970: 1, 1971: 1, 1972: 1, 1973: 2, 1975: 1, 1977: 1, 1983: 1, 1984: 1, 1989: 1, 1990: 1, 1991: 1, 1992: 1, 1993: 1, 1994: 1 },
    blurb: "Taiwan-born pillar of Japan's 'Six Supers,' an eight-time Meijin who won the 1990 Fujitsu Cup." }),
  mk({ id: "takemiya-masaki", name: "Takemiya Masaki", nation: "Japan", league: "JPN", active: false, debut: 1965, world: [["fujitsu", 1988], ["fujitsu", 1989]], dom: { 1976: 1, 1980: 1, 1985: 1, 1986: 1, 1987: 1, 1988: 1, 1990: 1, 1991: 1, 1992: 1, 1995: 1 },
    blurb: "Inventor of the influence-first 'Cosmic Style' and winner of the first two Fujitsu Cups." }),
  mk({ id: "otake-hideo", name: "Otake Hideo", nation: "Japan", league: "JPN", active: false, debut: 1956, world: [["fujitsu", 1992]], dom: { 1969: 1, 1975: 2, 1976: 1, 1978: 2, 1979: 1, 1980: 2, 1981: 2, 1982: 1, 1983: 1, 1984: 1, 1985: 1, 1993: 1, 1994: 1 },
    blurb: "Elegant 'Beauty of Go' stylist and four-time Meijin who took the 1992 Fujitsu Cup over Nie Weiping." }),
  mk({ id: "kato-masao", name: "Kato Masao", nation: "Japan", league: "JPN", active: false, debut: 1964, world: [], dom: { 1976: 2, 1977: 3, 1978: 3, 1979: 4, 1980: 2, 1981: 1, 1982: 1, 1983: 2, 1984: 1, 1985: 1, 1986: 2, 1987: 4, 1988: 1, 1989: 1, 1993: 1, 1997: 1, 2002: 1 },
    blurb: "The fearsome 'Killer of the Go world,' a Kitani-dojo great with eleven Oza titles but no world crown." }),
  mk({ id: "kobayashi-koichi", name: "Kobayashi Koichi", nation: "Japan", league: "JPN", active: false, debut: 1967, world: [["fujitsu", 1997]], dom: { 1976: 1, 1984: 2, 1985: 3, 1986: 3, 1987: 1, 1988: 3, 1989: 3, 1990: 3, 1991: 3, 1992: 3, 1993: 3, 1994: 1, 1998: 1, 1999: 3, 2000: 1, 2001: 1, 2002: 1 },
    blurb: "Dominated Japan's domestic scene in the late 1980s–90s with dozens of titles and a lone Fujitsu Cup." }),
  mk({ id: "cho-chikun", name: "Cho Chikun", nation: "Japan", league: "JPN", active: true, debut: 1968, world: [["fujitsu", 1991], ["samsung", 2003]], dom: { 1979: 1, 1980: 1, 1981: 2, 1982: 3, 1983: 2, 1984: 2, 1985: 1, 1986: 1, 1987: 1, 1988: 2, 1989: 2, 1990: 1, 1991: 1, 1992: 1, 1993: 1, 1994: 3, 1995: 1, 1996: 3, 1997: 3, 1998: 3, 1999: 2, 2001: 1, 2005: 1, 2006: 1, 2007: 1 },
    blurb: "Korean-born Japanese great with a record number of domestic titles, twelve Honinbo crowns and two world titles." }),
  mk({ id: "yoda-norimoto", name: "Yoda Norimoto", nation: "Japan", league: "JPN", active: true, debut: 1980, world: [["samsung", 1996]], dom: { 1995: 1, 1996: 2, 1997: 1, 1998: 1, 2000: 1, 2001: 1, 2002: 1, 2003: 2, 2004: 1, 2005: 1 },
    blurb: "Four-time Meijin and the 'Hikaru no Go' model who won the first Samsung Cup back in 1996." }),
  mk({ id: "o-meien", name: "O Meien", nation: "Taiwan/Japan", league: "JPN", active: true, debut: 1977, world: [], dom: { 2000: 1, 2001: 1, 2002: 1 },
    blurb: "Taiwan-born Nihon Ki-in fighter of quirky genius, a two-time Honinbo in the early 2000s." }),
  mk({ id: "cho-u", name: "Cho U", nation: "Taiwan/Japan", league: "JPN", active: true, debut: 1994, world: [["lg", 2005]], dom: { 2003: 2, 2004: 3, 2005: 2, 2006: 1, 2007: 2, 2008: 4, 2009: 3, 2010: 3, 2011: 2, 2012: 1, 2018: 1 },
    blurb: "Taiwan-born Japanese No. 1 of the 2000s, a five-time Meijin who won the 2005 LG Cup abroad." }),
  mk({ id: "yamashita-keigo", name: "Yamashita Keigo", nation: "Japan", league: "JPN", active: true, debut: 1993, world: [], dom: { 2000: 1, 2003: 1, 2004: 1, 2006: 2, 2007: 2, 2008: 1, 2009: 2, 2010: 1, 2011: 2, 2012: 1 },
    blurb: "Bold attacking stylist and five-time Kisei, a leading Japanese No. 1 of the 2000s with no world crown." }),
  mk({ id: "iyama-yuta", name: "Iyama Yuta", nation: "Japan", league: "JPN", active: true, debut: 2002, world: [], dom: { 2009: 1, 2010: 1, 2011: 2, 2012: 5, 2013: 6, 2014: 4, 2015: 6, 2016: 6, 2017: 7, 2018: 5, 2019: 3, 2020: 3, 2021: 5, 2022: 3, 2023: 2, 2024: 3 },
    blurb: "Japan's modern colossus and first to hold all seven domestic titles at once, though no world crown." }),
  mk({ id: "ichiriki-ryo", name: "Ichiriki Ryo", nation: "Japan", league: "JPN", active: true, debut: 2010, world: [["ing", 2024]], dom: { 2020: 2, 2022: 1, 2023: 3, 2024: 4, 2025: 1 },
    blurb: "Japan's modern No. 1 who broke a long drought by winning the 2024 Ing Cup, beating Xie Ke 3-0." }),

  // ---------- Korea ----------
  mk({ id: "cho-hunhyun", name: "Cho Hunhyun", nation: "South Korea", league: "KOR", active: false, debut: 1962, world: [["ing", 1989], ["fujitsu", 1994], ["tong_yang", 1994], ["tong_yang", 1997], ["chunlan", 1999], ["fujitsu", 2000], ["fujitsu", 2001], ["samsung", 2001], ["samsung", 2003]], dom: { 1973: 1, 1974: 1, 1975: 1, 1976: 4, 1977: 6, 1978: 5, 1979: 7, 1980: 4, 1981: 8, 1982: 6, 1983: 8, 1984: 9, 1985: 10, 1986: 9, 1987: 10, 1988: 6, 1989: 9, 1990: 7, 1991: 3, 1992: 6, 1993: 1, 1994: 2, 1995: 3, 1996: 2, 1997: 3, 1998: 2, 1999: 2, 2000: 2, 2002: 1, 2010: 1 },
    blurb: "Korea's foundational champion; his 1989 Ing Cup win ignited the nation's Go golden age." }),
  mk({ id: "seo-bongsoo", name: "Seo Bong-soo", nation: "South Korea", league: "KOR", active: true, debut: 1970, world: [["ing", 1993]], dom: { 1971: 1, 1972: 1, 1973: 1, 1974: 1, 1975: 1, 1976: 1, 1978: 1, 1980: 3, 1983: 3, 1986: 1, 1987: 1, 1988: 2, 1992: 1, 1999: 1 },
    blurb: "Korea's 'Wild Fox,' Cho Hunhyun's lifelong rival, who won the 2nd Ing Cup in 1993." }),
  mk({ id: "yoo-changhyuk", name: "Yoo Changhyuk", nation: "South Korea", league: "KOR", active: false, debut: 1984, world: [["fujitsu", 1993], ["ing", 1996], ["fujitsu", 1999], ["samsung", 2000], ["chunlan", 2001], ["lg", 2002]], dom: { 1984: 1, 1988: 2, 1991: 2, 1992: 1, 1993: 2, 1994: 1, 1995: 1, 1996: 2, 1998: 1, 1999: 1, 2001: 1, 2002: 1, 2003: 2 },
    blurb: "Attacking 'Speedy' star of Korea's first golden generation with six world titles across five events." }),
  mk({ id: "lee-chang-ho", name: "Lee Chang-ho", nation: "South Korea", league: "KOR", active: false, debut: 1986, world: [["tong_yang", 1992], ["tong_yang", 1993], ["fujitsu", 1996], ["tong_yang", 1996], ["lg", 1997], ["samsung", 1997], ["fujitsu", 1998], ["tong_yang", 1998], ["lg", 1999], ["samsung", 1999], ["samsung", 1999], ["ing", 2001], ["lg", 2001], ["chunlan", 2003], ["world_oza", 2003], ["lg", 2004], ["chunlan", 2005]], dom: { 1988: 1, 1989: 1, 1990: 5, 1991: 7, 1992: 5, 1993: 11, 1994: 11, 1995: 9, 1996: 8, 1997: 10, 1998: 6, 1999: 4, 2000: 3, 2001: 7, 2002: 6, 2003: 4, 2004: 3, 2005: 6, 2006: 2, 2007: 3, 2008: 2, 2009: 3 },
    blurb: "The 'Stone Buddha' whose record world-title haul and flawless endgame defined an entire era." }),
  mk({ id: "lee-sedol", name: "Lee Sedol", nation: "South Korea", league: "KOR", active: false, debut: 1995, world: [["fujitsu", 2002], ["fujitsu", 2003], ["lg", 2003], ["samsung", 2004], ["fujitsu", 2005], ["world_oza", 2005], ["world_oza", 2007], ["lg", 2008], ["samsung", 2008], ["samsung", 2009], ["other", 2010], ["chunlan", 2011], ["other", 2011], ["samsung", 2012]], dom: { 2000: 3, 2002: 5, 2005: 1, 2006: 4, 2007: 4, 2008: 1, 2009: 1, 2010: 2, 2011: 1, 2012: 2, 2014: 2, 2016: 3 },
    blurb: "Aggressive genius with a celebrated world-title haul and the only human ever to beat AlphaGo in a match." }),
  mk({ id: "mok-jinseok", name: "Mok Jin-seok", nation: "South Korea", league: "KOR", active: true, debut: 1994, world: [], dom: { 1998: 1, 1999: 1, 2000: 1, 2015: 1 },
    blurb: "Steady Korean veteran and national-team head coach; an LG Cup finalist who never lifted a world title." }),
  mk({ id: "won-seongjin", name: "Won Seong-jin", nation: "South Korea", league: "KOR", active: true, debut: 1998, world: [["samsung", 2011]], dom: { 2007: 3, 2010: 1 },
    blurb: "Korean pro who stunned Gu Li to win the 2011 Samsung Cup for his lone world title." }),
  mk({ id: "park-yeonghun", name: "Park Yeong-hun", nation: "South Korea", league: "KOR", active: true, debut: 1999, world: [["fujitsu", 2004], ["fujitsu", 2007]], dom: { 2001: 1, 2005: 5, 2006: 1, 2007: 2, 2008: 3, 2010: 2, 2011: 1 },
    blurb: "Once Korea's youngest 9-dan, a two-time Fujitsu Cup winner in 2004 and 2007." }),
  mk({ id: "choi-cheol-han", name: "Choi Cheol-han", nation: "South Korea", league: "KOR", active: true, debut: 1997, world: [["ing", 2009]], dom: { 2003: 1, 2004: 3, 2005: 2, 2009: 1, 2010: 2, 2011: 2, 2012: 1, 2013: 1, 2015: 1 },
    blurb: "'The Viper,' a fierce Korean top-tenner of the 2000s who won the 2009 Ing Cup." }),
  mk({ id: "kang-dongyun", name: "Kang Dong-yun", nation: "South Korea", league: "KOR", active: true, debut: 2002, world: [["fujitsu", 2009], ["lg", 2016]], dom: { 2005: 2, 2007: 2, 2008: 1 },
    blurb: "Korean top-tenner who won the 2009 Fujitsu Cup over Lee Chang-ho and the 2016 LG Cup." }),
  mk({ id: "kim-jiseok", name: "Kim Ji-seok", nation: "South Korea", league: "KOR", active: true, debut: 2003, world: [["samsung", 2014]], dom: { 2009: 1 },
    blurb: "Hard-hitting Korean pro whose career peak was the 2014 Samsung Cup world title." }),
  mk({ id: "park-junghwan", name: "Park Jung-hwan", nation: "South Korea", league: "KOR", active: true, debut: 2006, world: [["fujitsu", 2011], ["lg", 2015], ["mlily", 2018], ["chunlan", 2019], ["samsung", 2021], ["other", 2026]], dom: { 2007: 1, 2009: 2, 2010: 1, 2011: 2, 2012: 2, 2013: 2, 2014: 2, 2016: 1, 2017: 1, 2018: 2, 2019: 2 },
    blurb: "Long-time Korean No. 1 and a six-time world champion — his sixth the inaugural 2026 World Kiseong — Shin Jin-seo's chief domestic rival." }),
  mk({ id: "shin-jinseo", name: "Shin Jin-seo", nation: "South Korea", league: "KOR", active: true, debut: 2012, world: [["lg", 2020], ["chunlan", 2021], ["lg", 2022], ["samsung", 2022], ["ing", 2023], ["lg", 2024], ["quzhou_lanke", 2024], ["nanyang", 2025], ["other", 2025]], dom: { 2026: 1 },
    blurb: "The 'Shin God,' a generationally dominant world No. 1 with nine world titles — the ninth at the 2025 World's Top Player Championship." }),
  mk({ id: "shin-minjun", name: "Shin Min-jun", nation: "South Korea", league: "KOR", active: true, debut: 2012, world: [["lg", 2021], ["lg", 2026]], dom: {},
    blurb: "Solid Korean top-tenner who beat Ke Jie to win the 2021 LG Cup, his maiden world title." }),
  mk({ id: "byun-sang-il", name: "Byun Sang-il", nation: "South Korea", league: "KOR", active: true, debut: 2013, world: [["chunlan", 2023], ["lg", 2025]], dom: { 2026: 1 },
    blurb: "Korea's clear No. 2 behind Shin, taking the 2023 Chunlan and a dramatic 2025 LG Cup." }),
  mk({ id: "choi-jeong", name: "Choi Jeong", nation: "South Korea", league: "KOR", active: true, debut: 2010, world: [], dom: {},
    blurb: "The greatest female player ever — multiple women's world titles and the first woman in a major world final." }),

  // ---------- China ----------
  mk({ id: "nie-weiping", name: "Nie Weiping", nation: "China", league: "CHN", active: false, debut: 1965, world: [], dom: { 1975: 1, 1977: 1, 1978: 1, 1979: 2, 1980: 1, 1981: 3, 1982: 1, 1983: 2, 1987: 2, 1988: 2, 1989: 2, 1990: 2, 1991: 3, 1992: 2, 1993: 2, 1994: 2, 1995: 1, 1997: 1, 1998: 1, 2003: 1, 2016: 1, 2018: 1 },
    blurb: "China's first hero, the 'Go Saint' of the China–Japan Supermatches, though never a world champion." }),
  mk({ id: "ma-xiaochun", name: "Ma Xiaochun", nation: "China", league: "CHN", active: false, debut: 1982, world: [["fujitsu", 1995], ["tong_yang", 1995]], dom: { 1982: 2, 1984: 2, 1985: 2, 1986: 1, 1987: 2, 1989: 2, 1990: 2, 1991: 4, 1992: 3, 1993: 3, 1994: 5, 1995: 6, 1996: 4, 1997: 2, 1998: 2, 1999: 2, 2000: 1, 2001: 1, 2002: 1 },
    blurb: "China's premier player of the 1990s, a thirteen-time Mingren who swept the 1995 Fujitsu and Tong Yang Cups." }),
  mk({ id: "chang-hao", name: "Chang Hao", nation: "China", league: "CHN", active: false, debut: 1986, world: [["ing", 2005], ["samsung", 2007], ["chunlan", 2009]], dom: { 1995: 1, 1996: 1, 1997: 1, 1998: 3, 1999: 4, 2000: 2, 2001: 3, 2002: 3, 2004: 1, 2005: 1 },
    blurb: "China's bridge generation between Ma Xiaochun and Gu Li; broke through with the 2005 Ing Cup." }),
  mk({ id: "luo-xihe", name: "Luo Xihe", nation: "China", league: "CHN", active: true, debut: 1989, world: [["samsung", 2006]], dom: { 2000: 1, 2001: 1, 2006: 1 },
    blurb: "Cerebral Chinese veteran nicknamed 'Cosmic Flow' who won the 2006 Samsung Cup over Lee Chang-ho." }),
  mk({ id: "kong-jie", name: "Kong Jie", nation: "China", league: "CHN", active: false, debut: 1994, world: [["samsung", 2009], ["fujitsu", 2010], ["lg", 2010]], dom: { 2000: 1, 2001: 1, 2003: 3, 2004: 2, 2006: 1, 2009: 2, 2010: 1 },
    blurb: "Briefly China's best around 2010, sweeping the Fujitsu, LG and Samsung Cups in a breakout stretch." }),
  mk({ id: "gu-li", name: "Gu Li", nation: "China", league: "CHN", active: false, debut: 1995, world: [["lg", 2006], ["chunlan", 2007], ["fujitsu", 2008], ["lg", 2009], ["other", 2009], ["world_oza", 2009], ["samsung", 2010], ["chunlan", 2015]], dom: { 2001: 2, 2002: 1, 2003: 3, 2004: 4, 2005: 4, 2006: 3, 2007: 3, 2008: 6, 2009: 2, 2010: 1, 2011: 1, 2012: 1, 2014: 1 },
    blurb: "Fearless attacker and China's best of his era; eight world titles in a storied Lee Sedol rivalry." }),
  mk({ id: "chen-yaoye", name: "Chen Yaoye", nation: "China", league: "CHN", active: true, debut: 2004, world: [["chunlan", 2013], ["bailing", 2016], ["other", 2018]], dom: { 2005: 1, 2009: 1, 2010: 2, 2011: 1, 2012: 2, 2013: 2, 2014: 2, 2015: 1, 2016: 1 },
    blurb: "Consistent Chinese top player with three world titles, beating Lee Sedol for the 2013 Chunlan Cup." }),
  mk({ id: "shi-yue", name: "Shi Yue", nation: "China", league: "CHN", active: true, debut: 2003, world: [["lg", 2013]], dom: { 2009: 1, 2013: 1, 2014: 1 },
    blurb: "Once China's No. 1, a positional master who won the 2013 LG Cup over Won Seong-jin." }),
  mk({ id: "zhou-ruiyang", name: "Zhou Ruiyang", nation: "China", league: "CHN", active: true, debut: 2002, world: [["bailing", 2013]], dom: { 2005: 1, 2006: 1, 2007: 1, 2008: 2, 2013: 2, 2014: 1 },
    blurb: "Chinese top player who won the inaugural 2013 Bailing Cup over countryman Chen Yaoye." }),
  mk({ id: "jiang-weijie", name: "Jiang Weijie", nation: "China", league: "CHN", active: true, debut: 2005, world: [["lg", 2012]], dom: { 2008: 1, 2009: 1, 2010: 1, 2011: 1, 2012: 1 },
    blurb: "Shanghai-born Chinese pro who won the 2012 LG Cup and ended Gu Li's long Mingren reign." }),
  mk({ id: "tuo-jiaxi", name: "Tuo Jiaxi", nation: "China", league: "CHN", active: true, debut: 2002, world: [["lg", 2014]], dom: { 2009: 1, 2010: 1, 2012: 1, 2015: 1, 2016: 1 },
    blurb: "Chinese top player whose career highlight was the 2014 LG Cup world title." }),
  mk({ id: "fan-tingyu", name: "Fan Tingyu", nation: "China", league: "CHN", active: true, debut: 2009, world: [["ing", 2013]], dom: { 2010: 1, 2011: 1, 2012: 1, 2014: 1, 2018: 1 },
    blurb: "Became the youngest Ing Cup champion in history at 16, beating Park Jung-hwan in the 2013 final." }),
  mk({ id: "mi-yuting", name: "Mi Yuting", nation: "China", league: "CHN", active: true, debut: 2007, world: [["mlily", 2013], ["mlily", 2021]], dom: { 2009: 1, 2012: 1, 2016: 3, 2018: 3 },
    blurb: "Steady Chinese top player who won the very first MLily Cup over Gu Li and a second in 2021." }),
  mk({ id: "tan-xiao", name: "Tan Xiao", nation: "China", league: "CHN", active: true, debut: 2004, world: [["chunlan", 2017]], dom: { 2011: 2, 2012: 1 },
    blurb: "Chinese pro who beat Park Yeong-hun to capture the 2017 Chunlan Cup, his sole world title." }),
  mk({ id: "tang-weixing", name: "Tang Weixing", nation: "China", league: "CHN", active: true, debut: 2006, world: [["samsung", 2013], ["ing", 2016], ["samsung", 2019]], dom: { 2014: 1, 2015: 1, 2016: 1 },
    blurb: "Chinese world champion who twice won the Samsung Cup and took the 2016 Ing Cup over Park Jung-hwan." }),
  mk({ id: "yang-dingxin", name: "Yang Dingxin", nation: "China", league: "CHN", active: true, debut: 2008, world: [["lg", 2019]], dom: { 2012: 1, 2013: 1, 2014: 1, 2016: 1, 2017: 1, 2020: 1, 2021: 1, 2023: 1, 2024: 1 },
    blurb: "Once the youngest pro ever in China, a No. 1 who won the 2019 LG Cup over Shi Yue." }),
  mk({ id: "gu-zihao", name: "Gu Zihao", nation: "China", league: "CHN", active: true, debut: 2011, world: [["samsung", 2017], ["quzhou_lanke", 2023]], dom: { 2015: 1, 2018: 2, 2020: 1, 2021: 3, 2025: 1 },
    blurb: "Chinese top-ranked player who won the 2017 Samsung Cup and the 2023 Quzhou-Lanke Cup." }),
  mk({ id: "ke-jie", name: "Ke Jie", nation: "China", league: "CHN", active: true, debut: 2008, world: [["bailing", 2015], ["samsung", 2015], ["mlily", 2016], ["samsung", 2016], ["other", 2017], ["samsung", 2018], ["bailing", 2019], ["samsung", 2020]], dom: { 2014: 1, 2015: 3, 2016: 1, 2017: 3, 2018: 2, 2019: 3, 2020: 1 },
    blurb: "China's dominant modern No. 1, holder of eight world titles and the last human to face AlphaGo." }),
  mk({ id: "li-xuanhao", name: "Li Xuanhao", nation: "China", league: "CHN", active: true, debut: 2008, world: [["mlily", 2024]], dom: { 2014: 1, 2022: 2, 2024: 1 },
    blurb: "Briefly China's No. 1, who won the 2024 MLily Cup for his first world title." }),
  mk({ id: "ding-hao", name: "Ding Hao", nation: "China", league: "CHN", active: true, debut: 2015, world: [["lg", 2023], ["samsung", 2023], ["samsung", 2024]], dom: { 2019: 1, 2021: 3, 2022: 2, 2023: 1, 2025: 1, 2026: 1 },
    blurb: "China's new No. 1, who won the 2023 LG Cup and back-to-back Samsung Cups in 2023–24." }),
  mk({ id: "wang-xinghao", name: "Wang Xinghao", nation: "China", league: "CHN", active: true, debut: 2016, world: [["other", 2025], ["lg", 2026]], dom: { 2026: 2 },
    blurb: "China's new No. 1, who followed the 2025 Beihai Xinyi Cup with the 2026 LG Cup, adding the 2026 Tianyuan and King titles at home." }),
];
