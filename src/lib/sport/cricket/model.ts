import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Cricket honor model. Cricketing greatness is overwhelmingly individual and
 * stat-driven, and — unlike football or tennis — its pinnacle recognition is NOT
 * a team World Cup but an era-spanning INDIVIDUAL honor. The model is built around
 * that fact, so a pre-limited-overs colossus (Bradman, Sobers, Hobbs) can be ranked
 * on the same board as a modern great (Tendulkar, Kohli).
 *
 * COUNTING RULES (all counts web-verified against Wisden / ESPNcricinfo / Wikipedia,
 * FROZEN end-2025):
 *
 * - `wisden_leading` — "Wisden Leading Cricketer in the World". The single best
 *   cricketer on Earth that year. Awarded annually since 2003, AND assigned
 *   RETROSPECTIVELY by a 2007 Wisden panel back to 1900 (no awards during the two
 *   World Wars). THIS is the era-spanning individual GOAT metric: it is the only
 *   honor that lets Bradman (10) and Sobers (8) be measured against Kohli (3) and
 *   Tendulkar (2). Recorded as per-year dated entries at the cricket year won.
 *
 * - `icc_award` — "ICC Cricketer of the Year" (the Sir Garfield Sobers Trophy),
 *   the sport's modern global player-of-the-year. Awarded 2004+ ONLY, so by design
 *   it credits modern players exclusively (2005 was shared — the shared winner still
 *   counts one). No award was made in 2020.
 *
 * - `wc_title` — an ICC World Cup won as a member of the winning SQUAD. Three
 *   competitions count: the ODI Cricket World Cup (1975+), the T20 World Cup (2007+),
 *   and the World Test Championship final (2021+). A team honor.
 *
 * - `wisden_coty` — "Wisden Cricketer of the Year", the Almanack's up-to-five annual
 *   selections since 1889. By convention a one-time, once-in-a-career honor, so it is
 *   a recognition/volume metric rather than a peak one; recorded as per-year counts.
 *
 * BUCKET / WEIGHTING logic: the two individual honors (Wisden LCW + ICC award) sit in
 * the `individual` tier; World Cups sit in `team`; the Wisden CoY selection — a
 * recognition list, not a title — sits in `placement`. The "Individual brilliance"
 * preset therefore rewards the peak-greatness camp, while "Silverware" rewards squad
 * World Cup hauls.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  wisden_leading: { label: "Wisden Leading Cricketer in the World", short: "Wisden LCW", bucket: "individual", tier: "S", base: 120 },
  icc_award: { label: "ICC Cricketer of the Year", short: "ICC CoY", bucket: "individual", tier: "S", base: 100 },
  wc_title: { label: "World Cup (ODI / T20 / WTC)", short: "World Cup", bucket: "team", tier: "A", base: 45 },
  wisden_coty: { label: "Wisden Cricketer of the Year", short: "Wisden CoY", bucket: "placement", tier: "B", base: 14 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "individual", label: "Individual brilliance", weights: { team: 0.7, individual: 1.5, placement: 1 } },
  { key: "silverware", label: "Silverware", weights: { team: 1.6, individual: 0.85, placement: 1 } },
];

const AXES: Axis[] = [
  { id: "WisdenLCW", label: "Wisden LCW", kind: "sum", types: ["wisden_leading"] },
  { id: "ICCAward", label: "ICC Awards", kind: "sum", types: ["icc_award"] },
  { id: "CricWorldCup", label: "World Cups", kind: "sum", types: ["wc_title"] },
  { id: "WisdenCoY", label: "Wisden CoY", kind: "sum", types: ["wisden_coty"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["wisden_leading", "icc_award", "wc_title", "wisden_coty"];

export const CRICKET_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

/**
 * Leagues are national teams. West Indies is a multi-nation regional side with no
 * single flag; it carries the Barbados flag (🇧🇧) purely as a visual chip token,
 * with the label making the true identity explicit.
 */
export const CRICKET_LEAGUES: LeagueMeta[] = [
  { id: "AUS", label: "Australia", country: "Australia", flag: "🇦🇺" },
  { id: "IND", label: "India", country: "India", flag: "🇮🇳" },
  { id: "WIN", label: "West Indies", country: "West Indies", flag: "🇧🇧" },
  { id: "ENG", label: "England", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "SL", label: "Sri Lanka", country: "Sri Lanka", flag: "🇱🇰" },
  { id: "PAK", label: "Pakistan", country: "Pakistan", flag: "🇵🇰" },
  { id: "RSA", label: "South Africa", country: "South Africa", flag: "🇿🇦" },
  { id: "NZL", label: "New Zealand", country: "New Zealand", flag: "🇳🇿" },
];

// Cricket has no positions — batsmen, bowlers and all-rounders are ranked as one pool.
export const CRICKET_POSITIONS: PositionMeta[] = [];
