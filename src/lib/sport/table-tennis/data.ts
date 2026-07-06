import type { Achievement, Player } from "../types";

/**
 * Table tennis roster — 55 players (men & women). Every gold is recorded at its
 * REAL YEAR as an individual dated entry (verified vs English Wikipedia, cutoff
 * June 2025), so the timeline shows the true career distribution — no bulk ×N.
 * The Career Grand Slam is placed at the year the player completed all three
 * singles legs. (A few deep-roster players' secondary team/doubles years that
 * Wikipedia doesn't cleanly tabulate are omitted rather than guessed.)
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; nation: string; league: string; gender: "M" | "W";
  active: boolean; debut: number; blurb: string;
  os?: number[]; ws?: number[]; wcs?: number[]; ot?: number[]; wt?: number[]; db?: number[]; tf?: number[]; gs?: boolean;
};
const mk = (r: Raw): Player => {
  const os = r.os ?? [], ws = r.ws ?? [], wcs = r.wcs ?? [];
  // Grand Slam completion = the year the third (last) singles leg was first achieved.
  const gsYear = r.gs && os.length && ws.length && wcs.length
    ? Math.max(Math.min(...os), Math.min(...ws), Math.min(...wcs))
    : null;
  return {
    id: r.id, name: r.name, sport: "table-tennis", league: r.league, position: r.gender,
    team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
    achievements: [
      ...A("olympic_singles_gold", os), ...A("world_singles_gold", ws), ...A("world_cup_singles_gold", wcs),
      ...(gsYear ? A("career_grand_slam", [gsYear]) : []),
      ...A("olympic_team_gold", r.ot ?? []), ...A("world_team_gold", r.wt ?? []),
      ...A("doubles_gold", r.db ?? []), ...A("tour_finals_gold", r.tf ?? []),
    ],
  };
};

export const TABLE_TENNIS_PLAYERS: Player[] = [
  // ── Men ──
  mk({ id: "ma-long", name: "Ma Long", nation: "China", league: "CHN", gender: "M", active: true, debut: 2006, os: [2016, 2020], ws: [2015, 2017, 2019], wcs: [2012, 2015, 2024], ot: [2012, 2016, 2020, 2024], wt: [2006, 2008, 2010, 2012, 2014, 2016, 2018, 2022, 2024], db: [2011, 2019], tf: [2008, 2009, 2011, 2015, 2016, 2020], gs: true, blurb: "The GOAT: the only man with a double career Grand Slam and the most Olympic table tennis golds ever." }),
  mk({ id: "fan-zhendong", name: "Fan Zhendong", nation: "China", league: "CHN", gender: "M", active: true, debut: 2012, os: [2024], ws: [2021, 2023], wcs: [2016, 2018, 2019, 2020], ot: [2020, 2024], wt: [2014, 2016, 2018, 2022, 2024], db: [2017, 2023], tf: [2017, 2019, 2021], gs: true, blurb: "Sealed the Grand Slam with 2024 Olympic singles gold; the sixth man ever to complete it." }),
  mk({ id: "zhang-jike", name: "Zhang Jike", nation: "China", league: "CHN", gender: "M", active: false, debut: 2007, os: [2012], ws: [2011, 2013], wcs: [2011, 2014], ot: [2012, 2016], wt: [2010, 2012, 2014, 2016], db: [2015], gs: true, blurb: "Completed the career Grand Slam in a record 445 days — the fastest the feat has ever been achieved." }),
  mk({ id: "wang-hao", name: "Wang Hao", nation: "China", league: "CHN", gender: "M", active: false, debut: 1998, ws: [2009], wcs: [2007, 2008, 2010], ot: [2008, 2012], wt: [2004, 2006, 2008, 2010, 2012, 2014], db: [2005, 2009], tf: [2003, 2006], blurb: "Lost three straight Olympic singles finals; a world and four-time World Cup champion who never struck Olympic gold." }),
  mk({ id: "wang-liqin", name: "Wang Liqin", nation: "China", league: "CHN", gender: "M", active: false, debut: 1993, ws: [2001, 2005, 2007], ot: [2008], wt: [2001, 2004, 2006, 2008], db: [2000, 2001, 2003, 2005, 2007], tf: [1998, 2000, 2004], blurb: "Three-time world singles champion whose only gap was the elusive Olympic singles title." }),
  mk({ id: "ma-lin", name: "Ma Lin", nation: "China", league: "CHN", gender: "M", active: false, debut: 1994, os: [2008], wcs: [2000, 2003, 2004, 2006], ot: [2008], wt: [2001, 2004, 2006, 2008, 2010, 2012], db: [1999, 2003, 2004, 2007], tf: [2001, 2007], blurb: "Won Olympic singles, doubles and team gold — yet, remarkably, never a World Championship singles title." }),
  mk({ id: "kong-linghui", name: "Kong Linghui", nation: "China", league: "CHN", gender: "M", active: false, debut: 1993, os: [2000], ws: [1995], wcs: [1995], wt: [1995, 1997, 2001, 2004], db: [1996, 1997, 1999, 2005], tf: [1996], gs: true, blurb: "Third man to win the career Grand Slam, sealing it with Olympic singles gold in 2000." }),
  mk({ id: "liu-guoliang", name: "Liu Guoliang", nation: "China", league: "CHN", gender: "M", active: false, debut: 1991, os: [1996], ws: [1999], wcs: [1996], wt: [1995, 1997, 2001], db: [1996, 1997, 1999], gs: true, blurb: "First Chinese man to complete the career Grand Slam; his Olympic team golds came later as head coach." }),
  mk({ id: "xu-xin", name: "Xu Xin", nation: "China", league: "CHN", gender: "M", active: false, debut: 2009, wcs: [2013], ot: [2016, 2020], wt: [2010, 2012, 2014, 2016, 2018], db: [2011, 2015, 2017, 2019], tf: [2012, 2013], blurb: "The greatest penholder of his era and a doubles master, but never an Olympic or Worlds singles gold." }),
  mk({ id: "wang-chuqin", name: "Wang Chuqin", nation: "China", league: "CHN", gender: "M", active: true, debut: 2015, ws: [2025], wcs: [2026], ot: [2024], wt: [2018, 2022, 2024, 2026], db: [2019, 2021, 2023, 2023, 2024, 2025], tf: [2022, 2023, 2024], blurb: "2025 world champion and Olympic mixed/team gold medallist; the first left-handed Chinese world champ." }),
  mk({ id: "liang-jingkun", name: "Liang Jingkun", nation: "China", league: "CHN", gender: "M", active: true, debut: 2016, wt: [2022, 2026], blurb: "Hard-hitting four-time Worlds singles bronze medallist and two-time world team gold winner for China." }),
  mk({ id: "lin-gaoyuan", name: "Lin Gaoyuan", nation: "China", league: "CHN", gender: "M", active: true, debut: 2014, wt: [2018, 2022], blurb: "Two-time world team gold medallist (2018, 2022) and former World Cup runner-up for China." }),
  mk({ id: "jiang-jialiang", name: "Jiang Jialiang", nation: "China", league: "CHN", gender: "M", active: false, debut: 1982, ws: [1985, 1987], wcs: [1984], wt: [1985, 1987], blurb: "Two-time world champion (1985, 1987) who dominated the mid-1980s before the Olympic era began." }),
  mk({ id: "guo-yuehua", name: "Guo Yuehua", nation: "China", league: "CHN", gender: "M", active: false, debut: 1977, ws: [1981, 1983], wcs: [1980, 1982], wt: [1981, 1983], blurb: "Two-time world and two-time World Cup champion who led China's early-1980s rise to dominance." }),
  mk({ id: "jan-ove-waldner", name: "Jan-Ove Waldner", nation: "Sweden", league: "SWE", gender: "M", active: false, debut: 1982, os: [1992], ws: [1989, 1997], wcs: [1990], wt: [1989, 1991, 2000], gs: true, blurb: "The Mozart of table tennis: the greatest non-Asian ever and first man to complete the Grand Slam." }),
  mk({ id: "jorgen-persson", name: "Jörgen Persson", nation: "Sweden", league: "SWE", gender: "M", active: false, debut: 1984, ws: [1991], wcs: [1991], wt: [1989, 1991, 2000], blurb: "1991 world and World Cup champion and pillar of Sweden's golden generation that toppled China." }),
  mk({ id: "mikael-appelgren", name: "Mikael Appelgren", nation: "Sweden", league: "SWE", gender: "M", active: false, debut: 1980, wcs: [1983], wt: [1989, 1991], blurb: "1983 World Cup winner and World Team champion in Sweden's dominant era." }),
  mk({ id: "jean-philippe-gatien", name: "Jean-Philippe Gatien", nation: "France", league: "FRA", gender: "M", active: false, debut: 1986, ws: [1993], wcs: [1994], blurb: "The only Frenchman to win the World Championship singles (1993); also 1994 World Cup champion." }),
  mk({ id: "werner-schlager", name: "Werner Schlager", nation: "Austria", league: "AUT", gender: "M", active: false, debut: 1991, ws: [2003], blurb: "2003 world champion — the last non-Asian man to win the World Championships singles title." }),
  mk({ id: "vladimir-samsonov", name: "Vladimir Samsonov", nation: "Belarus", league: "BLR", gender: "M", active: false, debut: 1994, wcs: [1999, 2001, 2009], blurb: "Three-time World Cup winner and four-time Olympian; the finest European of the post-Waldner era." }),
  mk({ id: "timo-boll", name: "Timo Boll", nation: "Germany", league: "GER", gender: "M", active: false, debut: 1995, wcs: [2002, 2005], blurb: "Europe's greatest modern player and a record eight-time European champion, twice a World Cup winner." }),
  mk({ id: "dimitrij-ovtcharov", name: "Dimitrij Ovtcharov", nation: "Germany", league: "GER", gender: "M", active: true, debut: 2007, wcs: [2017], blurb: "2017 World Cup champion and three-time Olympic singles bronze medallist; a German mainstay." }),
  mk({ id: "zoran-primorac", name: "Zoran Primorac", nation: "Croatia", league: "CRO", gender: "M", active: false, debut: 1986, wcs: [1993, 1997], blurb: "Two-time World Cup winner and seven-time Olympian who carried Croatian table tennis for decades." }),
  mk({ id: "jorg-rosskopf", name: "Jörg Roßkopf", nation: "Germany", league: "GER", gender: "M", active: false, debut: 1986, wcs: [1998], db: [1989], blurb: "1998 World Cup winner and 1989 world doubles champion; later coach of Germany's national team." }),
  mk({ id: "ryu-seung-min", name: "Ryu Seung-min", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 2001, os: [2004], blurb: "Penhold attacker whose 2004 Athens gold remains South Korea's only Olympic singles title." }),
  mk({ id: "yoo-nam-kyu", name: "Yoo Nam-kyu", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 1986, os: [1988], db: [1988], blurb: "Won the first-ever Olympic men's singles gold at Seoul 1988 on home soil for South Korea." }),
  mk({ id: "kim-taek-soo", name: "Kim Taek-soo", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 1988, blurb: "Top-10 penholder for over a decade and three-time Olympian; later coached Ryu Seung-min to gold." }),
  mk({ id: "joo-sae-hyuk", name: "Joo Sae-hyuk", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 1999, blurb: "The finest modern defender, reaching world No. 1 chopper status and the 2003 Worlds singles final." }),
  mk({ id: "chuang-chih-yuan", name: "Chuang Chih-yuan", nation: "Chinese Taipei", league: "TPE", gender: "M", active: false, debut: 1998, tf: [2002], blurb: "2002 World Tour Grand Finals winner and six-time Olympian; a symbol of Taiwanese longevity." }),
  mk({ id: "tomokazu-harimoto", name: "Tomokazu Harimoto", nation: "Japan", league: "JPN", gender: "M", active: true, debut: 2016, tf: [2018, 2025], blurb: "Two-time WTT Finals winner and Japan's spearhead against Chinese dominance; the first non-Chinese men's WTT Finals champion." }),
  mk({ id: "hugo-calderano", name: "Hugo Calderano", nation: "Brazil", league: "BRA", gender: "M", active: true, debut: 2012, wcs: [2025], blurb: "First non-Asian, non-European to reach a Worlds final; won the 2025 World Cup as a Brazilian first." }),
  // ── Women ──
  mk({ id: "zhang-yining", name: "Zhang Yining", nation: "China", league: "CHN", gender: "W", active: false, debut: 2000, os: [2004, 2008], ws: [2005, 2009], wcs: [2001, 2002, 2004, 2005], ot: [2008], wt: [2000, 2001, 2004, 2006, 2008], db: [2003, 2004, 2005, 2007], tf: [2000, 2002, 2005, 2006], gs: true, blurb: "First-ever double Grand Slam winner and the most dominant women's player of the 2000s." }),
  mk({ id: "deng-yaping", name: "Deng Yaping", nation: "China", league: "CHN", gender: "W", active: false, debut: 1988, os: [1992, 1996], ws: [1991, 1995, 1997], wcs: [1996], wt: [1991, 1993, 1995, 1997], db: [1989, 1992, 1995, 1996, 1997], tf: [1996], gs: true, blurb: "Dominated the 1990s with four Olympic golds and ranked world No. 1 for eight straight years." }),
  mk({ id: "wang-nan", name: "Wang Nan", nation: "China", league: "CHN", gender: "W", active: false, debut: 1995, os: [2000], ws: [1999, 2001, 2003], wcs: [1997, 1998, 2003, 2007], ot: [2008], wt: [1997, 2000, 2001, 2004, 2006, 2008], db: [1999, 2000, 2001, 2003, 2003, 2005, 2007], tf: [1998, 2001], gs: true, blurb: "Grand Slam champion who won 24 world titles and bridged the Deng and Zhang eras." }),
  mk({ id: "ding-ning", name: "Ding Ning", nation: "China", league: "CHN", gender: "W", active: false, debut: 2005, os: [2016], ws: [2011, 2015, 2017], wcs: [2011, 2014, 2018], ot: [2012, 2016], wt: [2012, 2014, 2016, 2018], db: [2017], tf: [2015], gs: true, blurb: "Grand Slam champion and one of the most decorated women's players of the 2010s." }),
  mk({ id: "li-xiaoxia", name: "Li Xiaoxia", nation: "China", league: "CHN", gender: "W", active: false, debut: 2004, os: [2012], ws: [2013], wcs: [2008], ot: [2012, 2016], wt: [2006, 2008, 2012, 2014, 2016], db: [2009, 2011, 2013], tf: [2007], gs: true, blurb: "London 2012 champion who completed the career Grand Slam with her 2013 world title." }),
  mk({ id: "chen-meng", name: "Chen Meng", nation: "China", league: "CHN", gender: "W", active: true, debut: 2007, os: [2020, 2024], wcs: [2020], ot: [2020, 2024], wt: [2014, 2016, 2018, 2022, 2024], db: [2023], tf: [2017, 2018, 2019, 2020], blurb: "Back-to-back Olympic singles champion (2020, 2024) who never won a World Championships singles title." }),
  mk({ id: "sun-yingsha", name: "Sun Yingsha", nation: "China", league: "CHN", gender: "W", active: true, debut: 2017, ws: [2023, 2025], wcs: [2024, 2025, 2026], ot: [2020, 2024], wt: [2022, 2024, 2026], db: [2019, 2021, 2021, 2023, 2024, 2025], tf: [2021, 2022, 2023], blurb: "World No. 1 with two world and two World Cup singles titles, still chasing elusive Olympic singles gold." }),
  mk({ id: "liu-shiwen", name: "Liu Shiwen", nation: "China", league: "CHN", gender: "W", active: false, debut: 2007, ws: [2019], wcs: [2009, 2012, 2013, 2015, 2019], ot: [2016], wt: [2012, 2014, 2016, 2018], db: [2015, 2017, 2019], tf: [2011, 2012, 2013], blurb: "Record five-time World Cup singles champion who finally won her Worlds singles title in 2019." }),
  mk({ id: "guo-yue", name: "Guo Yue", nation: "China", league: "CHN", gender: "W", active: false, debut: 2003, ws: [2007], ot: [2008, 2012], wt: [2004, 2006, 2008], db: [2005, 2007, 2009, 2011, 2013], tf: [2004], blurb: "2007 world singles champion and prolific doubles winner across two Olympic team golds." }),
  mk({ id: "wang-manyu", name: "Wang Manyu", nation: "China", league: "CHN", gender: "W", active: true, debut: 2015, ws: [2021], ot: [2020, 2024], wt: [2018, 2022, 2024, 2026], db: [2019, 2021, 2025], tf: [2024, 2025], blurb: "2021 world singles champion and two-time Olympic team gold medallist for China." }),
  mk({ id: "chen-xingtong", name: "Chen Xingtong", nation: "China", league: "CHN", gender: "W", active: true, debut: 2016, wt: [2022, 2024, 2026], blurb: "Top-three world-ranked attacker and three-time world team gold medallist, chasing her first major singles title." }),
  mk({ id: "qiao-hong", name: "Qiao Hong", nation: "China", league: "CHN", gender: "W", active: false, debut: 1989, ws: [1989], wt: [1993, 1995], db: [1989, 1992, 1995, 1996], blurb: "1989 world singles champion and Deng Yaping's two-time Olympic doubles gold partner." }),
  mk({ id: "li-ju", name: "Li Ju", nation: "China", league: "CHN", gender: "W", active: false, debut: 1995, wcs: [2000], wt: [1997, 2000, 2001], db: [1999, 2000, 2001, 2003], tf: [1997], blurb: "2000 World Cup winner and Sydney Olympic doubles champion alongside Wang Nan." }),
  mk({ id: "chen-jing", name: "Chen Jing", nation: "China", league: "CHN", gender: "W", active: false, debut: 1986, os: [1988], wt: [1987, 1989], blurb: "Won the first-ever Olympic women's singles gold in 1988, then later represented Chinese Taipei." }),
  mk({ id: "jiao-zhimin", name: "Jiao Zhimin", nation: "China", league: "CHN", gender: "W", active: false, debut: 1983, blurb: "1988 Olympic singles bronze and doubles silver medallist and 1987 world team champion for China." }),
  mk({ id: "geng-lijuan", name: "Geng Lijuan", nation: "Canada", league: "CAN", gender: "W", active: false, debut: 1981, blurb: "Four-time world champion and former No. 1 for China who later competed at two Olympics for Canada." }),
  mk({ id: "zhang-deying", name: "Zhang Deying", nation: "China", league: "CHN", gender: "W", active: false, debut: 1977, blurb: "Late-1970s world team and doubles champion from China's first wave of women's dominance." }),
  mk({ id: "hyun-jung-hwa", name: "Hyun Jung-hwa", nation: "South Korea", league: "KOR", gender: "W", active: false, debut: 1986, ws: [1993], db: [1988], blurb: "1993 world singles champion and 1988 Olympic doubles gold medallist; South Korea's finest woman." }),
  mk({ id: "mima-ito", name: "Mima Ito", nation: "Japan", league: "JPN", gender: "W", active: true, debut: 2014, db: [2021], blurb: "Won Olympic mixed doubles gold over China in 2021; the greatest active threat to Chinese women." }),
  mk({ id: "kasumi-ishikawa", name: "Kasumi Ishikawa", nation: "Japan", league: "JPN", gender: "W", active: false, debut: 2007, blurb: "Three-time Olympic team medallist and 2017 world mixed doubles champion; a long-time Japanese No. 1." }),
  mk({ id: "miu-hirano", name: "Miu Hirano", nation: "Japan", league: "JPN", gender: "W", active: true, debut: 2014, wcs: [2016], blurb: "Youngest-ever Women's World Cup winner (2016) and first non-Chinese woman to take that title." }),
  mk({ id: "feng-tianwei", name: "Feng Tianwei", nation: "Singapore", league: "SGP", gender: "W", active: false, debut: 2007, wt: [2010], blurb: "Led Singapore to a stunning 2010 world team gold over China and won three Olympic medals." }),
  mk({ id: "tie-yana", name: "Tie Yana", nation: "Hong Kong", league: "HKG", gender: "W", active: false, debut: 1995, blurb: "Long-time Hong Kong No. 1 and Asian medallist, narrowly missing the Olympic medal that eluded her." }),
  mk({ id: "gao-jun", name: "Gao Jun", nation: "United States", league: "USA", gender: "W", active: false, debut: 1989, db: [1991], blurb: "1991 world doubles champion and Olympic doubles silver for China who later starred for the USA." }),
];
