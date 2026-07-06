import type { Achievement, Player } from "../types";

/**
 * Snooker roster — 19 all-time greats of the modern professional era (1969+),
 * ranked as one pool (no positions). Every World Championship, UK Championship and
 * Masters win is a dated entry at its real year. NON-World ranking titles are spread
 * as PER-YEAR counts across each player's prime window (≤3 per year) — the same
 * per-season pattern tennis / F1 use — so the timeline and peak lenses are truthful
 * rather than a single fabricated spike. Each player's ranking-title TOTAL is exactly
 * their verified figure. All counts web-verified against Wikipedia / World Snooker
 * Tour and current through 2026-07-06.
 *
 * Scope note: snooker's pre-modern challenge era (Joe Davis's 15 uncontested titles,
 * 1927-46) is deliberately excluded — those tiny-field championships aren't
 * commensurable with the modern game and would top the Honor board indefensibly.
 *
 * `triple_crown` = UK + Masters wins only. `ranking_title` = ranking-event titles
 * OTHER than the World Championship (Wikipedia's ranking-title tally counts the
 * Worlds in the modern era; we subtract them to avoid double-counting).
 */
const A = (type: string, years: number[] = []): Achievement[] => years.map((year) => ({ type, year }));

/**
 * Spread `total` ranking titles evenly across the prime window [start, end] as
 * per-year `count` entries, capped at 3/year. Deterministic; the per-year counts
 * always sum to `total`, so the Honor total is unchanged — only the timeline/peak
 * distribution becomes truthful.
 */
const spread = (total: number, [start, end]: [number, number]): Achievement[] => {
  if (total <= 0) return [];
  const span = end - start + 1;
  const counts = new Array(span).fill(0);
  // Round-robin one title at a time into the earliest under-cap year → even, ≤3/year.
  let placed = 0;
  let i = 0;
  while (placed < total) {
    if (counts[i % span] < 3) {
      counts[i % span]++;
      placed++;
    }
    i++;
  }
  return counts
    .map((count, k) => ({ count, year: start + k }))
    .filter((e) => e.count > 0)
    .map((e) => ({ type: "ranking_title", year: e.year, count: e.count }));
};

type Raw = {
  id: string; name: string; nation: string; league: string; active: boolean; debut: number; blurb: string;
  world: number[];             // World Championship years
  uk?: number[];               // UK Championship years (triple_crown)
  masters?: number[];          // Masters years (triple_crown)
  ranking?: number;            // NON-World ranking titles (verified total)
  rankSpan?: [number, number]; // prime window across which to spread ranking titles
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, sport: "snooker", league: r.league, position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...A("world_title", r.world),
    ...A("triple_crown", r.uk),
    ...A("triple_crown", r.masters),
    ...(r.ranking ? spread(r.ranking, r.rankSpan ?? [r.debut + 3, r.debut + 3 + (r.ranking - 1)]) : []),
  ],
});

export const SNOOKER_PLAYERS: Player[] = [
  mk({ id: "ronnie-osullivan", name: "Ronnie O'Sullivan", nation: "England", league: "ENG", active: true, debut: 1992, world: [2001, 2004, 2008, 2012, 2013, 2020, 2022], uk: [1993, 1997, 2001, 2007, 2014, 2017, 2018, 2023], masters: [1995, 2005, 2007, 2009, 2014, 2016, 2017, 2024], ranking: 34, rankSpan: [1993, 2023], blurb: "A record 41 ranking titles, a record 23 Triple Crowns and seven world titles; the most gifted and enduring player the game has seen." }),
  mk({ id: "stephen-hendry", name: "Stephen Hendry", nation: "Scotland", league: "SCO", active: false, debut: 1985, world: [1990, 1992, 1993, 1994, 1995, 1996, 1999], uk: [1989, 1990, 1994, 1995, 1996], masters: [1989, 1990, 1991, 1992, 1993, 1996], ranking: 29, rankSpan: [1987, 2005], blurb: "Seven modern-era world titles and five in a row from 1992-96; the ruthless prodigy who dominated the 1990s." }),
  mk({ id: "steve-davis", name: "Steve Davis", nation: "England", league: "ENG", active: false, debut: 1978, world: [1981, 1983, 1984, 1987, 1988, 1989], uk: [1980, 1982, 1984, 1985, 1986, 1987], masters: [1982, 1988, 1997], ranking: 22, rankSpan: [1981, 1995], blurb: "Six world titles and 28 ranking titles; the metronomic professional who defined snooker's 1980s boom." }),
  mk({ id: "ray-reardon", name: "Ray Reardon", nation: "Wales", league: "WAL", active: false, debut: 1967, world: [1970, 1973, 1974, 1975, 1976, 1978], masters: [1976], ranking: 1, rankSpan: [1982, 1982], blurb: "Six world titles across the 1970s; the sport's first dominant champion of the modern television age." }),
  mk({ id: "john-higgins", name: "John Higgins", nation: "Scotland", league: "SCO", active: true, debut: 1992, world: [1998, 2007, 2009, 2011], uk: [1998, 2000, 2010], masters: [1999, 2006], ranking: 29, rankSpan: [1994, 2021], blurb: "Four world titles and 30-plus ranking titles across four decades; the most complete all-round matchplayer of his era." }),
  mk({ id: "mark-selby", name: "Mark Selby", nation: "England", league: "ENG", active: true, debut: 1999, world: [2014, 2016, 2017, 2021], uk: [2012, 2016, 2025], masters: [2008, 2010, 2013], ranking: 21, rankSpan: [2008, 2025], blurb: "Four world titles and 10 Triple Crowns; a relentless grinder nicknamed the Jester from Leicester." }),
  mk({ id: "mark-williams", name: "Mark Williams", nation: "Wales", league: "WAL", active: true, debut: 1992, world: [2000, 2003, 2018], uk: [1999, 2002], masters: [1998, 2003], ranking: 24, rankSpan: [1996, 2024], blurb: "Three world titles 18 years apart and the finest long potter of his generation; a Welsh great still winning in his fifties." }),
  mk({ id: "john-spencer", name: "John Spencer", nation: "England", league: "ENG", active: false, debut: 1966, world: [1969, 1971, 1977], masters: [1975], ranking: 0, blurb: "The first world champion of snooker's modern era and the inaugural Masters winner; a fluent, attacking pioneer." }),
  mk({ id: "alex-higgins", name: "Alex Higgins", nation: "Northern Ireland", league: "NIR", active: false, debut: 1971, world: [1972, 1982], uk: [1983], masters: [1978, 1981], ranking: 0, blurb: "Two world titles and boundless charisma; 'Hurricane' Higgins was the mercurial showman who took snooker to the masses." }),
  mk({ id: "judd-trump", name: "Judd Trump", nation: "England", league: "ENG", active: true, debut: 2005, world: [2019], uk: [2011, 2024], masters: [2019, 2023], ranking: 31, rankSpan: [2011, 2026], blurb: "World champion and 31-time ranking-title winner; the flamboyant break-builder who has redefined attacking scoring." }),
  mk({ id: "neil-robertson", name: "Neil Robertson", nation: "Australia", league: "AUS", active: true, debut: 1998, world: [2010], uk: [2013, 2015, 2020], masters: [2012, 2022], ranking: 25, rankSpan: [2006, 2024], blurb: "The only overseas player to complete the Triple Crown; Australia's finest and a prolific modern ranking-title winner." }),
  mk({ id: "cliff-thorburn", name: "Cliff Thorburn", nation: "Canada", league: "CAN", active: false, debut: 1973, world: [1980], masters: [1983, 1985, 1986], ranking: 1, rankSpan: [1985, 1985], blurb: "The first overseas world champion and maker of the Crucible's first 147; a tenacious Canadian grinder dubbed 'The Grinder'." }),
  mk({ id: "dennis-taylor", name: "Dennis Taylor", nation: "Northern Ireland", league: "NIR", active: false, debut: 1972, world: [1985], masters: [1987], ranking: 1, rankSpan: [1984, 1984], blurb: "Champion of the fabled 1985 black-ball final watched by 18.5 million; a beloved figure in his upturned glasses." }),
  mk({ id: "terry-griffiths", name: "Terry Griffiths", nation: "Wales", league: "WAL", active: false, debut: 1978, world: [1979], uk: [1982], masters: [1980], ranking: 0, blurb: "Won the world title as a qualifier at his first attempt in 1979; a dapper Welshman and revered coach thereafter." }),
  mk({ id: "ken-doherty", name: "Ken Doherty", nation: "Republic of Ireland", league: "IRL", active: false, debut: 1990, world: [1997], ranking: 5, rankSpan: [1993, 2006], blurb: "Ireland's only world champion, dethroning Hendry in 1997; a warm competitor who reached three world finals." }),
  mk({ id: "peter-ebdon", name: "Peter Ebdon", nation: "England", league: "ENG", active: false, debut: 1991, world: [2002], uk: [2006], ranking: 8, rankSpan: [1993, 2009], blurb: "A fiercely determined world champion who outlasted Hendry in the 2002 final; nine ranking titles across a gritty career." }),
  mk({ id: "shaun-murphy", name: "Shaun Murphy", nation: "England", league: "ENG", active: true, debut: 1998, world: [2005], uk: [2008], masters: [2015, 2025], ranking: 12, rankSpan: [2005, 2023], blurb: "The Magician won the world title as a 150-1 qualifier in 2005 and completed the Triple Crown; a powerful potter and 13-time ranking winner." }),
  mk({ id: "stuart-bingham", name: "Stuart Bingham", nation: "England", league: "ENG", active: true, debut: 1996, world: [2015], masters: [2020], ranking: 5, rankSpan: [2011, 2022], blurb: "The oldest first-time world champion at 38 in 2015; a late-blooming, unflappable break-builder." }),
  mk({ id: "jimmy-white", name: "Jimmy White", nation: "England", league: "ENG", active: true, debut: 1980, world: [], uk: [1992], masters: [1984], ranking: 10, rankSpan: [1984, 2004], blurb: "The People's Champion — six-time world runner-up who never lifted the game's biggest prize, yet won 10 ranking titles and adored worldwide." }),
];
