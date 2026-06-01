import type { Achievement, Player } from "../types";

/**
 * Table tennis roster — 24 consensus all-time greats (men & women). Singles
 * golds and the Grand Slam are exact; team/doubles golds carry their verified
 * years. All counts verified against English Wikipedia, capped at June 2025
 * (incl. the May-2025 Doha Worlds; later events excluded).
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; nation: string; league: string; gender: "M" | "W";
  active: boolean; debut: number; blurb: string; honors: Achievement[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "table-tennis", league: r.league, position: r.gender,
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb, achievements: r.honors,
});

export const TABLE_TENNIS_PLAYERS: Player[] = [
  mk({ id: "ma-long", name: "Ma Long", nation: "China", league: "CHN", gender: "M", active: true, debut: 2006,
    blurb: "The GOAT: the only man with a double career Grand Slam and the most Olympic table tennis golds ever.",
    honors: [...A("olympic_singles_gold", [2016, 2020]), ...A("world_singles_gold", [2015, 2017, 2019]), ...A("world_cup_singles_gold", [2012, 2015, 2024]), ...A("career_grand_slam", [2016]), ...A("olympic_team_gold", [2012, 2016, 2020, 2024]), ...A("world_team_gold", [2006, 2008, 2010, 2012, 2014, 2016, 2018, 2022, 2024])] }),
  mk({ id: "zhang-yining", name: "Zhang Yining", nation: "China", league: "CHN", gender: "W", active: false, debut: 2000,
    blurb: "First-ever double Grand Slam winner and the most dominant women's player of the 2000s.",
    honors: [...A("olympic_singles_gold", [2004, 2008]), ...A("world_singles_gold", [2005, 2009]), ...A("world_cup_singles_gold", [2001, 2002, 2004, 2005]), ...A("career_grand_slam", [2004]), ...A("olympic_team_gold", [2008]), ...A("world_team_gold", [2000, 2001, 2004, 2006, 2008])] }),
  mk({ id: "deng-yaping", name: "Deng Yaping", nation: "China", league: "CHN", gender: "W", active: false, debut: 1988,
    blurb: "Dominated the 1990s with four Olympic golds and ranked world No. 1 for eight straight years.",
    honors: [...A("olympic_singles_gold", [1992, 1996]), ...A("world_singles_gold", [1991, 1995, 1997]), ...A("world_cup_singles_gold", [1996]), ...A("career_grand_slam", [1996]), ...A("olympic_doubles_gold", [1992, 1996]), ...A("world_doubles_gold", [1989, 1995, 1997]), ...A("world_team_gold", [1993, 1995, 1997])] }),
  mk({ id: "jan-ove-waldner", name: "Jan-Ove Waldner", nation: "Sweden", league: "SWE", gender: "M", active: false, debut: 1982,
    blurb: "The Mozart of table tennis: the greatest non-Asian ever and first man to complete the Grand Slam.",
    honors: [...A("olympic_singles_gold", [1992]), ...A("world_singles_gold", [1989, 1997]), ...A("world_cup_singles_gold", [1990]), ...A("career_grand_slam", [1992]), ...A("world_team_gold", [1989, 1991, 1993, 2000])] }),
  mk({ id: "wang-nan", name: "Wang Nan", nation: "China", league: "CHN", gender: "W", active: false, debut: 1995,
    blurb: "Grand Slam champion who won 24 world titles and bridged the Deng and Zhang eras.",
    honors: [...A("olympic_singles_gold", [2000]), ...A("world_singles_gold", [1999, 2001, 2003]), ...A("world_cup_singles_gold", [1997, 1998, 2003, 2007]), ...A("career_grand_slam", [2000]), ...A("olympic_doubles_gold", [2000, 2004]), ...A("olympic_team_gold", [2008]), ...A("world_team_gold", [1997, 2000, 2001, 2004, 2006, 2008])] }),
  mk({ id: "zhang-jike", name: "Zhang Jike", nation: "China", league: "CHN", gender: "M", active: false, debut: 2007,
    blurb: "Completed the career Grand Slam in a record 445 days — the fastest the feat has ever been achieved.",
    honors: [...A("olympic_singles_gold", [2012]), ...A("world_singles_gold", [2011, 2013]), ...A("world_cup_singles_gold", [2011, 2014]), ...A("career_grand_slam", [2012]), ...A("olympic_team_gold", [2012, 2016]), ...A("world_team_gold", [2010, 2012, 2014, 2016])] }),
  mk({ id: "fan-zhendong", name: "Fan Zhendong", nation: "China", league: "CHN", gender: "M", active: true, debut: 2012,
    blurb: "Sealed the Grand Slam with 2024 Olympic singles gold; the sixth man ever to complete it.",
    honors: [...A("olympic_singles_gold", [2024]), ...A("world_singles_gold", [2021, 2023]), ...A("world_cup_singles_gold", [2016, 2018, 2019, 2020]), ...A("career_grand_slam", [2024]), ...A("tour_finals_gold", [2021]), ...A("olympic_team_gold", [2020, 2024]), ...A("world_team_gold", [2014, 2016, 2018, 2022, 2024])] }),
  mk({ id: "ding-ning", name: "Ding Ning", nation: "China", league: "CHN", gender: "W", active: false, debut: 2005,
    blurb: "Grand Slam champion and one of the most decorated women's players of the 2010s.",
    honors: [...A("olympic_singles_gold", [2016]), ...A("world_singles_gold", [2011, 2015, 2017]), ...A("world_cup_singles_gold", [2011, 2014, 2018]), ...A("career_grand_slam", [2016]), ...A("olympic_team_gold", [2012, 2016]), ...A("world_team_gold", [2012, 2014, 2016, 2018])] }),
  mk({ id: "li-xiaoxia", name: "Li Xiaoxia", nation: "China", league: "CHN", gender: "W", active: false, debut: 2004,
    blurb: "London 2012 champion who completed the career Grand Slam with her 2013 world title.",
    honors: [...A("olympic_singles_gold", [2012]), ...A("world_singles_gold", [2013]), ...A("world_cup_singles_gold", [2008]), ...A("career_grand_slam", [2013]), ...A("olympic_team_gold", [2012, 2016]), ...A("world_team_gold", [2006, 2008, 2012, 2014, 2016])] }),
  mk({ id: "chen-meng", name: "Chen Meng", nation: "China", league: "CHN", gender: "W", active: true, debut: 2007,
    blurb: "Back-to-back Olympic singles champion (2020, 2024) who never won a Worlds singles title.",
    honors: [...A("olympic_singles_gold", [2020, 2024]), ...A("world_cup_singles_gold", [2020]), ...A("tour_finals_gold", [2017, 2018, 2019, 2020]), ...A("olympic_team_gold", [2020, 2024]), ...A("world_team_gold", [2014, 2016, 2018, 2022, 2024])] }),
  mk({ id: "kong-linghui", name: "Kong Linghui", nation: "China", league: "CHN", gender: "M", active: false, debut: 1993,
    blurb: "Third man to win the career Grand Slam, sealing it with Olympic singles gold in 2000.",
    honors: [...A("olympic_singles_gold", [2000]), ...A("world_singles_gold", [1995]), ...A("world_cup_singles_gold", [1995]), ...A("career_grand_slam", [2000]), ...A("olympic_doubles_gold", [1996]), ...A("world_doubles_gold", [1997, 1999, 2005]), ...A("world_team_gold", [1995, 1997, 2001, 2004, 2005])] }),
  mk({ id: "liu-guoliang", name: "Liu Guoliang", nation: "China", league: "CHN", gender: "M", active: false, debut: 1991,
    blurb: "First Chinese man to complete the career Grand Slam; later a legendary national-team coach.",
    honors: [...A("olympic_singles_gold", [1996]), ...A("world_singles_gold", [1999]), ...A("world_cup_singles_gold", [1996]), ...A("career_grand_slam", [1999]), ...A("olympic_doubles_gold", [1996]), ...A("world_doubles_gold", [1997, 1997, 1999]), ...A("world_team_gold", [1995, 1997, 2001])] }),
  mk({ id: "wang-liqin", name: "Wang Liqin", nation: "China", league: "CHN", gender: "M", active: false, debut: 1993,
    blurb: "Three-time world singles champion whose only gap was the elusive Olympic singles title.",
    honors: [...A("world_singles_gold", [2001, 2005, 2007]), ...A("olympic_doubles_gold", [2000]), ...A("olympic_team_gold", [2008]), ...A("world_team_gold", [2001, 2004, 2006, 2008])] }),
  mk({ id: "ma-lin", name: "Ma Lin", nation: "China", league: "CHN", gender: "M", active: false, debut: 1994,
    blurb: "Only man to win Olympic singles, doubles and team gold — yet never a Worlds singles title.",
    honors: [...A("olympic_singles_gold", [2008]), ...A("world_cup_singles_gold", [2000, 2003, 2004, 2006]), ...A("olympic_doubles_gold", [2004]), ...A("olympic_team_gold", [2008]), ...A("world_doubles_gold", [1999, 2003, 2007]), ...A("world_team_gold", [2001, 2004, 2006, 2008, 2010, 2012])] }),
  mk({ id: "wang-hao", name: "Wang Hao", nation: "China", league: "CHN", gender: "M", active: false, debut: 1998,
    blurb: "Won three straight Olympic singles silvers; a world and four-time World Cup champion who never struck gold there.",
    honors: [...A("world_singles_gold", [2009]), ...A("world_cup_singles_gold", [2007, 2008, 2010, 2013]), ...A("olympic_team_gold", [2008, 2012]), ...A("world_team_gold", [2004, 2006, 2008, 2010, 2012, 2014])] }),
  mk({ id: "xu-xin", name: "Xu Xin", nation: "China", league: "CHN", gender: "M", active: false, debut: 2009,
    blurb: "The greatest penholder of his era and a doubles master, but never an Olympic or Worlds singles gold.",
    honors: [...A("world_cup_singles_gold", [2013]), ...A("olympic_team_gold", [2016, 2020]), ...A("world_doubles_gold", [2011, 2015, 2015, 2017, 2019]), ...A("world_team_gold", [2010, 2012, 2014, 2016, 2018])] }),
  mk({ id: "sun-yingsha", name: "Sun Yingsha", nation: "China", league: "CHN", gender: "W", active: true, debut: 2017,
    blurb: "World No. 1 with two world and World Cup singles titles, still chasing elusive Olympic singles gold.",
    honors: [...A("world_singles_gold", [2023, 2025]), ...A("world_cup_singles_gold", [2024, 2025]), ...A("olympic_doubles_gold", [2024]), ...A("olympic_team_gold", [2020, 2024]), ...A("world_doubles_gold", [2021, 2023, 2025]), ...A("world_team_gold", [2022, 2024]), ...A("tour_finals_gold", [2021, 2022, 2023])] }),
  mk({ id: "wang-chuqin", name: "Wang Chuqin", nation: "China", league: "CHN", gender: "M", active: true, debut: 2015,
    blurb: "2025 world champion and Olympic mixed/team gold medallist; the first left-handed Chinese world champ.",
    honors: [...A("world_singles_gold", [2025]), ...A("olympic_doubles_gold", [2024]), ...A("olympic_team_gold", [2024]), ...A("world_doubles_gold", [2019, 2021, 2023, 2023, 2025]), ...A("world_team_gold", [2018, 2022, 2024]), ...A("tour_finals_gold", [2022, 2023, 2024])] }),
  mk({ id: "liu-shiwen", name: "Liu Shiwen", nation: "China", league: "CHN", gender: "W", active: false, debut: 2007,
    blurb: "Record five-time World Cup singles champion who finally won her Worlds singles title in 2019.",
    honors: [...A("world_singles_gold", [2019]), ...A("world_cup_singles_gold", [2009, 2012, 2013, 2015, 2019]), ...A("olympic_team_gold", [2016]), ...A("world_team_gold", [2012, 2014, 2016, 2018])] }),
  mk({ id: "guo-yue", name: "Guo Yue", nation: "China", league: "CHN", gender: "W", active: false, debut: 2003,
    blurb: "2007 world singles champion and prolific doubles winner across two Olympic team golds.",
    honors: [...A("world_singles_gold", [2007]), ...A("olympic_team_gold", [2008, 2012]), ...A("world_doubles_gold", [2005, 2007, 2009, 2011, 2013]), ...A("world_team_gold", [2004, 2006, 2008, 2012])] }),
  mk({ id: "timo-boll", name: "Timo Boll", nation: "Germany", league: "GER", gender: "M", active: true, debut: 1995,
    blurb: "Europe's greatest modern player and an eight-time European champion, twice a World Cup singles winner.",
    honors: [...A("world_cup_singles_gold", [2002, 2005])] }),
  mk({ id: "werner-schlager", name: "Werner Schlager", nation: "Austria", league: "AUT", gender: "M", active: false, debut: 1995,
    blurb: "2003 world champion — the last non-Asian man to win the World Championships singles title.",
    honors: [...A("world_singles_gold", [2003])] }),
  mk({ id: "ryu-seung-min", name: "Ryu Seung-min", nation: "South Korea", league: "KOR", gender: "M", active: false, debut: 2001,
    blurb: "Penhold attacker whose 2004 Athens gold remains South Korea's only Olympic singles title.",
    honors: [...A("olympic_singles_gold", [2004])] }),
  mk({ id: "chen-jing", name: "Chen Jing", nation: "China", league: "CHN", gender: "W", active: false, debut: 1986,
    blurb: "Won the first-ever Olympic women's singles gold in 1988, then later represented Chinese Taipei.",
    honors: [...A("olympic_singles_gold", [1988]), ...A("world_team_gold", [1987, 1989])] }),
];
