import type { Achievement, Player } from "../types";

/**
 * Table tennis roster — 55 of the greatest players (31 men, 24 women), verified
 * against English Wikipedia and capped June 2025 (incl. May-2025 Doha Worlds &
 * Apr-2025 Macao World Cup). Each honor is a verified career COUNT (shown ×N).
 * Exactly 11 players hold the career Grand Slam (Olympic + Worlds + World Cup
 * singles): 6 men, 5 women.
 */
const C = (type: string, count: number, year: number): Achievement[] =>
  count > 0 ? [{ type, year, count }] : [];

type Raw = {
  id: string; name: string; nation: string; league: string; gender: "M" | "W";
  active: boolean; debut: number; blurb: string;
  os: number; ws: number; wcs: number; ot: number; wt: number; od: number; wd: number; tf: number; gs: boolean;
};
const mk = (r: Raw): Player => {
  const y = r.debut + 8;
  return {
    id: r.id, name: r.name, sport: "table-tennis", league: r.league, position: r.gender,
    team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
    achievements: [
      ...C("olympic_singles_gold", r.os, y), ...C("world_singles_gold", r.ws, y), ...C("world_cup_singles_gold", r.wcs, y),
      ...(r.gs ? C("career_grand_slam", 1, y) : []),
      ...C("olympic_team_gold", r.ot, y), ...C("world_team_gold", r.wt, y),
      ...C("olympic_doubles_gold", r.od, y), ...C("world_doubles_gold", r.wd, y), ...C("tour_finals_gold", r.tf, y),
    ],
  };
};

export const TABLE_TENNIS_PLAYERS: Player[] = [
  // ── Men ──
  mk({ id: "ma-long", name: "Ma Long", nation: "China", league: "CHN", gender: "M", active: true, debut: 2006, os: 2, ws: 3, wcs: 3, ot: 4, wt: 9, od: 0, wd: 2, tf: 0, gs: true, blurb: "The consensus GOAT: only man with a double career Grand Slam and the most Olympic table tennis golds ever." }),
  mk({ id: "fan-zhendong", name: "Fan Zhendong", nation: "China", league: "CHN", gender: "M", active: true, debut: 2012, os: 1, ws: 2, wcs: 4, ot: 2, wt: 5, od: 0, wd: 0, tf: 1, gs: true, blurb: "Sealed the Grand Slam with 2024 Olympic singles gold; the sixth man ever to complete it." }),
  mk({ id: "zhang-jike", name: "Zhang Jike", nation: "China", league: "CHN", gender: "M", active: false, debut: 2007, os: 1, ws: 2, wcs: 2, ot: 2, wt: 4, od: 0, wd: 1, tf: 0, gs: true, blurb: "Completed the career Grand Slam in a record 445 days — the fastest the feat has ever been achieved." }),
  mk({ id: "wang-hao", name: "Wang Hao", nation: "China", league: "CHN", gender: "M", active: false, debut: 1998, os: 0, ws: 1, wcs: 4, ot: 2, wt: 6, od: 0, wd: 0, tf: 0, gs: false, blurb: "Lost three straight Olympic singles finals; a world and four-time World Cup champion who never struck Olympic gold." }),
  mk({ id: "wang-liqin", name: "Wang Liqin", nation: "China", league: "CHN", gender: "M", active: false, debut: 1993, os: 0, ws: 3, wcs: 0, ot: 1, wt: 4, od: 1, wd: 1, tf: 0, gs: false, blurb: "Three-time world singles champion whose only gap was the elusive Olympic singles title." }),
  mk({ id: "ma-lin", name: "Ma Lin", nation: "China", league: "CHN", gender: "M", active: false, debut: 1994, os: 1, ws: 0, wcs: 4, ot: 1, wt: 6, od: 1, wd: 3, tf: 0, gs: false, blurb: "Won Olympic singles, doubles and team gold — yet, remarkably, never a World Championship singles title." }),
  mk({ id: "kong-linghui", name: "Kong Linghui", nation: "China", league: "CHN", gender: "M", active: false, debut: 1993, os: 1, ws: 1, wcs: 1, ot: 0, wt: 5, od: 1, wd: 3, tf: 0, gs: true, blurb: "Third man to win the career Grand Slam, sealing it with Olympic singles gold in 2000." }),
  mk({ id: "liu-guoliang", name: "Liu Guoliang", nation: "China", league: "CHN", gender: "M", active: false, debut: 1991, os: 1, ws: 1, wcs: 1, ot: 0, wt: 3, od: 1, wd: 2, tf: 0, gs: true, blurb: "First Chinese man to complete the career Grand Slam; later a legendary national-team coach." }),
  mk({ id: "xu-xin", name: "Xu Xin", nation: "China", league: "CHN", gender: "M", active: false, debut: 2009, os: 0, ws: 0, wcs: 1, ot: 2, wt: 5, od: 0, wd: 5, tf: 2, gs: false, blurb: "The greatest penholder of his era and a doubles master, but never an Olympic or Worlds singles gold." }),
  mk({ id: "wang-chuqin", name: "Wang Chuqin", nation: "China", league: "CHN", gender: "M", active: true, debut: 2015, os: 0, ws: 1, wcs: 0, ot: 1, wt: 3, od: 1, wd: 5, tf: 3, gs: false, blurb: "2025 world champion and Olympic mixed/team gold medallist; the first left-handed Chinese world champ." }),
  mk({ id: "liang-jingkun", name: "Liang Jingkun", nation: "China", league: "CHN", gender: "M", active: true, debut: 2016, os: 0, ws: 0, wcs: 0, ot: 0, wt: 1, od: 0, wd: 0, tf: 0, gs: false, blurb: "Hard-hitting four-time Worlds singles bronze medallist and 2022 world team gold winner for China." }),
  mk({ id: "lin-gaoyuan", name: "Lin Gaoyuan", nation: "China", league: "CHN", gender: "M", active: true, debut: 2014, os: 0, ws: 0, wcs: 0, ot: 0, wt: 2, od: 0, wd: 0, tf: 0, gs: false, blurb: "Two-time world team gold medallist (2018, 2022) and former World Cup runner-up for China." }),
  mk({ id: "jiang-jialiang", name: "Jiang Jialiang", nation: "China", league: "CHN", gender: "M", active: false, debut: 1982, os: 0, ws: 2, wcs: 1, ot: 0, wt: 3, od: 0, wd: 0, tf: 0, gs: false, blurb: "Two-time world champion (1985, 1987) who dominated the mid-1980s before the Olympic era began." }),
  mk({ id: "guo-yuehua", name: "Guo Yuehua", nation: "China", league: "CHN", gender: "M", active: false, debut: 1977, os: 0, ws: 2, wcs: 2, ot: 0, wt: 4, od: 0, wd: 1, tf: 0, gs: false, blurb: "Two-time world and two-time World Cup champion who led China's early-1980s rise to dominance." }),
  mk({ id: "jan-ove-waldner", name: "Jan-Ove Waldner", nation: "Sweden", league: "SWE", gender: "M", active: false, debut: 1982, os: 1, ws: 2, wcs: 1, ot: 0, wt: 4, od: 0, wd: 0, tf: 0, gs: true, blurb: "The Mozart of table tennis: the greatest non-Asian ever and first man to complete the Grand Slam." }),
  mk({ id: "jorgen-persson", name: "Jörgen Persson", nation: "Sweden", league: "SWE", gender: "M", active: false, debut: 1984, os: 0, ws: 1, wcs: 1, ot: 0, wt: 4, od: 0, wd: 0, tf: 0, gs: false, blurb: "1991 world and World Cup champion and pillar of Sweden's golden generation that toppled China." }),
  mk({ id: "mikael-appelgren", name: "Mikael Appelgren", nation: "Sweden", league: "SWE", gender: "M", active: false, debut: 1980, os: 0, ws: 0, wcs: 1, ot: 0, wt: 3, od: 0, wd: 1, tf: 0, gs: false, blurb: "1983 World Cup winner and three-time world team champion in Sweden's dominant era." }),
  mk({ id: "jean-philippe-gatien", name: "Jean-Philippe Gatien", nation: "France", league: "FRA", gender: "M", active: false, debut: 1986, os: 0, ws: 1, wcs: 1, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "The only Frenchman to win the World Championship singles (1993); also 1994 World Cup champion." }),
  mk({ id: "werner-schlager", name: "Werner Schlager", nation: "Austria", league: "AUT", gender: "M", active: false, debut: 1991, os: 0, ws: 1, wcs: 0, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "2003 world champion — the last non-Asian man to win the World Championships singles title." }),
  mk({ id: "vladimir-samsonov", name: "Vladimir Samsonov", nation: "Belarus", league: "BLR", gender: "M", active: false, debut: 1994, os: 0, ws: 0, wcs: 3, ot: 0, wt: 0, od: 0, wd: 0, tf: 1, gs: false, blurb: "Three-time World Cup winner and four-time Olympian; the finest European of the post-Waldner era." }),
  mk({ id: "timo-boll", name: "Timo Boll", nation: "Germany", league: "GER", gender: "M", active: false, debut: 1995, os: 0, ws: 0, wcs: 2, ot: 0, wt: 0, od: 0, wd: 0, tf: 1, gs: false, blurb: "Europe's greatest modern player and a record eight-time European champion, twice a World Cup winner." }),
  mk({ id: "dimitrij-ovtcharov", name: "Dimitrij Ovtcharov", nation: "Germany", league: "GER", gender: "M", active: true, debut: 2007, os: 0, ws: 0, wcs: 1, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "2017 World Cup champion and three-time Olympic singles bronze medallist; a German mainstay." }),
  mk({ id: "zoran-primorac", name: "Zoran Primorac", nation: "Croatia", league: "CRO", gender: "M", active: false, debut: 1986, os: 0, ws: 0, wcs: 2, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "Two-time World Cup winner and seven-time Olympian who carried Croatian table tennis for decades." }),
  mk({ id: "jorg-rosskopf", name: "Jörg Roßkopf", nation: "Germany", league: "GER", gender: "M", active: false, debut: 1986, os: 0, ws: 0, wcs: 1, ot: 0, wt: 0, od: 0, wd: 1, tf: 0, gs: false, blurb: "1998 World Cup winner and 1989 world doubles champion; later coach of Germany's national team." }),
  mk({ id: "ryu-seung-min", name: "Ryu Seung-min", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 2001, os: 1, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "Penhold attacker whose 2004 Athens gold remains South Korea's only Olympic singles title." }),
  mk({ id: "yoo-nam-kyu", name: "Yoo Nam-kyu", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 1986, os: 1, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 1, tf: 0, gs: false, blurb: "Won the first-ever Olympic men's singles gold at Seoul 1988 on home soil for South Korea." }),
  mk({ id: "kim-taek-soo", name: "Kim Taek-soo", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 1988, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "Top-10 penholder for over a decade and three-time Olympian; later coached Ryu Seung-min to gold." }),
  mk({ id: "joo-sae-hyuk", name: "Joo Sae-hyuk", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 1999, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "The finest modern defender, reaching world No. 1 chopper status and the 2003 Worlds singles final." }),
  mk({ id: "chuang-chih-yuan", name: "Chuang Chih-yuan", nation: "Chinese Taipei", league: "TPE", gender: "M", active: false, debut: 1998, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 1, tf: 1, gs: false, blurb: "2002 World Tour Grand Finals winner and six-time Olympian; a symbol of Taiwanese longevity." }),
  mk({ id: "tomokazu-harimoto", name: "Tomokazu Harimoto", nation: "Japan", league: "JPN", gender: "M", active: true, debut: 2016, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 0, tf: 1, gs: false, blurb: "Youngest-ever World Tour Grand Finals winner (2018) and Japan's spearhead against Chinese dominance." }),
  mk({ id: "hugo-calderano", name: "Hugo Calderano", nation: "Brazil", league: "BRA", gender: "M", active: true, debut: 2012, os: 0, ws: 0, wcs: 1, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "First non-Asian, non-European to reach a Worlds final; won the 2025 World Cup as a Brazilian first." }),
  // ── Women ──
  mk({ id: "zhang-yining", name: "Zhang Yining", nation: "China", league: "CHN", gender: "W", active: false, debut: 2000, os: 2, ws: 2, wcs: 4, ot: 1, wt: 5, od: 1, wd: 3, tf: 0, gs: true, blurb: "First-ever double Grand Slam winner and the most dominant women's player of the 2000s." }),
  mk({ id: "deng-yaping", name: "Deng Yaping", nation: "China", league: "CHN", gender: "W", active: false, debut: 1988, os: 2, ws: 3, wcs: 1, ot: 0, wt: 3, od: 2, wd: 3, tf: 0, gs: true, blurb: "Dominated the 1990s with four Olympic golds and ranked world No. 1 for eight straight years." }),
  mk({ id: "wang-nan", name: "Wang Nan", nation: "China", league: "CHN", gender: "W", active: false, debut: 1995, os: 1, ws: 3, wcs: 4, ot: 1, wt: 6, od: 2, wd: 5, tf: 0, gs: true, blurb: "Grand Slam champion who won 24 world titles and bridged the Deng and Zhang eras." }),
  mk({ id: "ding-ning", name: "Ding Ning", nation: "China", league: "CHN", gender: "W", active: false, debut: 2005, os: 1, ws: 3, wcs: 3, ot: 2, wt: 4, od: 0, wd: 1, tf: 0, gs: true, blurb: "Grand Slam champion and one of the most decorated women's players of the 2010s." }),
  mk({ id: "li-xiaoxia", name: "Li Xiaoxia", nation: "China", league: "CHN", gender: "W", active: false, debut: 2004, os: 1, ws: 1, wcs: 1, ot: 2, wt: 5, od: 0, wd: 0, tf: 0, gs: true, blurb: "London 2012 champion who completed the career Grand Slam with her 2013 world title." }),
  mk({ id: "chen-meng", name: "Chen Meng", nation: "China", league: "CHN", gender: "W", active: true, debut: 2007, os: 2, ws: 0, wcs: 1, ot: 2, wt: 5, od: 0, wd: 0, tf: 4, gs: false, blurb: "Back-to-back Olympic singles champion (2020, 2024) who never won a World Championships singles title." }),
  mk({ id: "sun-yingsha", name: "Sun Yingsha", nation: "China", league: "CHN", gender: "W", active: true, debut: 2017, os: 0, ws: 2, wcs: 2, ot: 2, wt: 2, od: 1, wd: 5, tf: 3, gs: false, blurb: "World No. 1 with two world and two World Cup singles titles, still chasing elusive Olympic singles gold." }),
  mk({ id: "liu-shiwen", name: "Liu Shiwen", nation: "China", league: "CHN", gender: "W", active: false, debut: 2007, os: 0, ws: 1, wcs: 5, ot: 1, wt: 4, od: 0, wd: 3, tf: 0, gs: false, blurb: "Record five-time World Cup singles champion who finally won her Worlds singles title in 2019." }),
  mk({ id: "guo-yue", name: "Guo Yue", nation: "China", league: "CHN", gender: "W", active: false, debut: 2003, os: 0, ws: 1, wcs: 0, ot: 2, wt: 2, od: 0, wd: 5, tf: 0, gs: false, blurb: "2007 world singles champion and prolific doubles winner across two Olympic team golds." }),
  mk({ id: "wang-manyu", name: "Wang Manyu", nation: "China", league: "CHN", gender: "W", active: true, debut: 2015, os: 0, ws: 1, wcs: 0, ot: 2, wt: 2, od: 0, wd: 3, tf: 0, gs: false, blurb: "2021 world singles champion and two-time Olympic team gold medallist for China." }),
  mk({ id: "chen-xingtong", name: "Chen Xingtong", nation: "China", league: "CHN", gender: "W", active: true, debut: 2016, os: 0, ws: 0, wcs: 0, ot: 0, wt: 2, od: 0, wd: 1, tf: 0, gs: false, blurb: "Top-three world-ranked attacker and two-time world team gold medallist, chasing her first major singles title." }),
  mk({ id: "qiao-hong", name: "Qiao Hong", nation: "China", league: "CHN", gender: "W", active: false, debut: 1989, os: 0, ws: 1, wcs: 0, ot: 0, wt: 2, od: 2, wd: 2, tf: 0, gs: false, blurb: "1991 world singles champion and Deng Yaping's two-time Olympic doubles gold partner." }),
  mk({ id: "li-ju", name: "Li Ju", nation: "China", league: "CHN", gender: "W", active: false, debut: 1995, os: 0, ws: 0, wcs: 1, ot: 0, wt: 1, od: 1, wd: 2, tf: 0, gs: false, blurb: "2000 World Cup winner and Sydney Olympic doubles champion alongside Wang Nan." }),
  mk({ id: "chen-jing", name: "Chen Jing", nation: "China", league: "CHN", gender: "W", active: false, debut: 1986, os: 1, ws: 0, wcs: 0, ot: 0, wt: 2, od: 0, wd: 0, tf: 0, gs: false, blurb: "Won the first-ever Olympic women's singles gold in 1988, then later represented Chinese Taipei." }),
  mk({ id: "jiao-zhimin", name: "Jiao Zhimin", nation: "China", league: "CHN", gender: "W", active: false, debut: 1983, os: 0, ws: 0, wcs: 0, ot: 0, wt: 1, od: 0, wd: 0, tf: 0, gs: false, blurb: "1988 Olympic singles bronze and doubles silver medallist and 1987 world team champion for China." }),
  mk({ id: "geng-lijuan", name: "Geng Lijuan", nation: "Canada", league: "CAN", gender: "W", active: false, debut: 1981, os: 0, ws: 0, wcs: 0, ot: 0, wt: 3, od: 0, wd: 1, tf: 0, gs: false, blurb: "Four-time world champion and former No. 1 for China who later competed at two Olympics for Canada." }),
  mk({ id: "zhang-deying", name: "Zhang Deying", nation: "China", league: "CHN", gender: "W", active: false, debut: 1977, os: 0, ws: 0, wcs: 0, ot: 0, wt: 3, od: 0, wd: 2, tf: 0, gs: false, blurb: "Late-1970s world team and doubles champion from China's first wave of women's dominance." }),
  mk({ id: "hyun-jung-hwa", name: "Hyun Jung-hwa", nation: "South Korea", league: "KOR", gender: "W", active: false, debut: 1986, os: 0, ws: 1, wcs: 0, ot: 0, wt: 1, od: 1, wd: 2, tf: 0, gs: false, blurb: "1993 world singles champion and 1988 Olympic doubles gold medallist; South Korea's finest woman." }),
  mk({ id: "mima-ito", name: "Mima Ito", nation: "Japan", league: "JPN", gender: "W", active: true, debut: 2014, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 1, wd: 1, tf: 0, gs: false, blurb: "Won Olympic mixed doubles gold over China in 2021; the greatest active threat to Chinese women." }),
  mk({ id: "kasumi-ishikawa", name: "Kasumi Ishikawa", nation: "Japan", league: "JPN", gender: "W", active: false, debut: 2007, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 1, tf: 0, gs: false, blurb: "Three-time Olympic team medallist and 2017 world mixed doubles champion; a long-time Japanese No. 1." }),
  mk({ id: "miu-hirano", name: "Miu Hirano", nation: "Japan", league: "JPN", gender: "W", active: true, debut: 2014, os: 0, ws: 0, wcs: 1, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "Youngest-ever Women's World Cup winner (2016) and first non-Chinese woman to take that title." }),
  mk({ id: "feng-tianwei", name: "Feng Tianwei", nation: "Singapore", league: "SGP", gender: "W", active: false, debut: 2007, os: 0, ws: 0, wcs: 0, ot: 0, wt: 1, od: 0, wd: 0, tf: 0, gs: false, blurb: "Led Singapore to a stunning 2010 world team gold over China and won three Olympic medals." }),
  mk({ id: "tie-yana", name: "Tie Yana", nation: "Hong Kong", league: "HKG", gender: "W", active: false, debut: 1995, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 0, tf: 0, gs: false, blurb: "Long-time Hong Kong No. 1 and Asian medallist, narrowly missing the Olympic medal that eluded her." }),
  mk({ id: "gao-jun", name: "Gao Jun", nation: "United States", league: "USA", gender: "W", active: false, debut: 1989, os: 0, ws: 0, wcs: 0, ot: 0, wt: 0, od: 0, wd: 1, tf: 0, gs: false, blurb: "1991 world doubles champion and Olympic doubles silver for China who later starred for the USA." }),
];
