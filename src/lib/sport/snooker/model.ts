import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Snooker honor model. The World (Snooker) Championship is the pinnacle; the other
 * two legs of the Triple Crown — the UK Championship and The Masters — sit one tier
 * below as the sport's other blue-riband capstones, and a player's remaining
 * ranking-event titles form the career-volume metric of sustained excellence.
 * Snooker has no positions — players are ranked as one pool. All counts frozen at
 * the end of the 2025 calendar year.
 *
 * COUNTING RULES (web-verified against Wikipedia / World Snooker Tour):
 *  - `world_title`  = World Snooker Championship wins. This spans the modern
 *    Crucible/ranking era (1977+) AND earlier non-ranking eras. Joe Davis's 15
 *    (1927-46) and the 1970s titles predate the ranking system — recorded here as
 *    world titles all the same, and Joe Davis is flagged as a pre-modern figure.
 *  - `triple_crown` = wins of the OTHER two Triple Crown events only — the UK
 *    Championship plus The Masters (each counted, none of them the Worlds).
 *  - `ranking_title` = NON-World ranking-event titles. Wikipedia's headline
 *    "ranking titles" tally counts the World Championship as a ranking event in
 *    the modern era, so to avoid double-counting with `world_title` we subtract
 *    every ranking-era World win and record only the remaining ranking titles.
 *    (e.g. O'Sullivan 41 total − 7 Worlds = 34; Reardon 5 total − 4 ranking-era
 *    Worlds = 1; Alex Higgins 1 total = his 1972 World only → 0.)
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  world_title: { label: "World Championship", short: "World", bucket: "individual", tier: "S", base: 250 },
  triple_crown: { label: "UK / Masters Title", short: "TC", bucket: "individual", tier: "A", base: 90 },
  ranking_title: { label: "Ranking Title", short: "Ranking", bucket: "placement", tier: "B", base: 9 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1, individual: 1.4, placement: 0.6 } },
  { key: "silverware", label: "Silverware", weights: { team: 1, individual: 0.8, placement: 1.5 } },
];

const AXES: Axis[] = [
  { id: "SnkWorld", label: "World Titles", kind: "sum", types: ["world_title"] },
  { id: "SnkTC", label: "Triple Crown", kind: "sum", types: ["triple_crown"] },
  { id: "SnkRanking", label: "Ranking Titles", kind: "sum", types: ["ranking_title"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["world_title", "triple_crown", "ranking_title"];

export const SNOOKER_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

// Snooker leagues = nationalities. The Home Nations have no reliable cross-platform
// subdivision-flag emoji, so we use 🇬🇧 for England / Scotland / Wales / Northern
// Ireland and disambiguate in the label.
export const SNOOKER_LEAGUES: LeagueMeta[] = [
  { id: "ENG", label: "England", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "SCO", label: "Scotland", country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { id: "WAL", label: "Wales", country: "Wales", flag: "🇬🇧" },
  { id: "NIR", label: "Northern Ireland", country: "Northern Ireland", flag: "🇬🇧" },
  { id: "IRL", label: "Ireland", country: "Republic of Ireland", flag: "🇮🇪" },
  { id: "AUS", label: "Australia", country: "Australia", flag: "🇦🇺" },
  { id: "CAN", label: "Canada", country: "Canada", flag: "🇨🇦" },
  { id: "CHN", label: "China", country: "China", flag: "🇨🇳" },
  { id: "THA", label: "Thailand", country: "Thailand", flag: "🇹🇭" },
];

// Snooker has no positions — players are ranked as one pool.
export const SNOOKER_POSITIONS: PositionMeta[] = [];
