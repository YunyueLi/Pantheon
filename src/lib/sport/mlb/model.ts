import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * MLB honor model. Baseball is a deeply stat-driven sport, but this index — like
 * every other in Pantheon — is built purely on TITLES and AWARDS, never raw
 * counting stats (home runs, wins, WAR). Hitters and pitchers share ONE pool; the
 * two career-defining individual awards, the League MVP (position players' pinnacle,
 * awarded in each league) and the Cy Young (the pitcher's pinnacle), sit side by
 * side in the `individual` tier so a great starter and a great slugger can be
 * weighed on the same board. The Triple Crown — leading a league in BA/HR/RBI in
 * one season — is a rare historic capstone credited as a bonus. The World Series
 * is the sport's team pinnacle (`team`), and All-Star selections are the
 * high-volume placement honor (`placement`), counted per season.
 *
 * The `stat_title` honor closes the era gap below. Leading your league in a major
 * category — a "home-run title", "batting title", "ERA title", "strikeout title" —
 * is a real, named honor baseball has tracked league-by-league since 1876, long
 * before any of the awards above existed. Each SEASON a player led the AL or NL in
 * a counted category is one title (a Triple-Crown-caliber season = several). This
 * is the honor that lets the dead-ball and early-live-ball legends earn their place
 * on a trophy index without abandoning the trophy principle: it rewards documented,
 * league-leading dominance rather than raw counting-stat totals.
 *
 * ERA CAVEAT — READ BEFORE JUDGING THE BOARD. Three of the anchor awards did not
 * exist for most of baseball history:
 *   - League MVP: the modern BBWAA award dates to 1931; earlier Chalmers (1911–14)
 *     and League Award (1922–29) variants existed. Each player's count follows what
 *     their Wikipedia infobox labels "MVP" (so Cobb's 1911 Chalmers and Walter
 *     Johnson's 1913/24 League Awards count, as Ruth's 1923 League Award does).
 *   - Cy Young Award: first given in 1956 (one award for both leagues until 1967,
 *     then one per league).
 *   - All-Star Game: first played in 1933.
 * Consequently the pre-award, dead-ball / early-live-ball legends — Ty Cobb, Honus
 * Wagner, Cy Young himself, Walter Johnson — carry FEW OR ZERO of THOSE honors BY
 * DESIGN, not by omission. `stat_title` and the Triple Crown are what keep them
 * competitive on the board; the Stature lens (curated all-time standing) captures
 * whatever remains, and is deliberately kept separate from this Honor Index.
 *
 * Counting model: `all_star` is recorded PER YEAR (one entry per selection) so the
 * timeline and longevity lens are truthful; `mvp`, `cy_young`, `triple_crown` and
 * `ws_title` are dated entries at their real award/championship years. All counts
 * verified against Baseball-Reference / Wikipedia and FROZEN at the end of the
 * 2025 MLB season.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  mvp: { label: "League MVP", short: "MVP", bucket: "individual", tier: "S", base: 130 },
  cy_young: { label: "Cy Young Award", short: "Cy Young", bucket: "individual", tier: "S", base: 110 },
  triple_crown: { label: "Triple Crown", short: "Triple Crown", bucket: "individual", tier: "A", base: 120 },
  stat_title: { label: "League-Leading Title", short: "Led League", bucket: "individual", tier: "A", base: 30 },
  ws_title: { label: "World Series", short: "WS", bucket: "team", tier: "B", base: 40 },
  all_star: { label: "All-Star Selection", short: "All-Star", bucket: "placement", tier: "B", base: 6 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "individual", label: "Individual brilliance", weights: { team: 0.7, individual: 1.5, placement: 0.9 } },
  { key: "silverware", label: "Silverware", weights: { team: 1.5, individual: 0.85, placement: 1 } },
];

const AXES: Axis[] = [
  { id: "MLBAwards", label: "MVP / Cy Young", kind: "sum", types: ["mvp", "cy_young", "triple_crown"] },
  { id: "MLBStatTitles", label: "League Titles", kind: "sum", types: ["stat_title"] },
  { id: "WorldSeries", label: "World Series", kind: "sum", types: ["ws_title"] },
  { id: "AllStar", label: "All-Star", kind: "sum", types: ["all_star"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["mvp", "cy_young", "triple_crown", "stat_title", "ws_title", "all_star"];

export const MLB_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

// Leagues are nationalities. Only nationalities present in the roster are listed
// (the region filter renders every entry, so empty chips would dead-end); the
// broader baseball diaspora — Puerto Rico 🇵🇷, Venezuela 🇻🇪, Cuba 🇨🇺 and others —
// slots in here as those players are added.
export const MLB_LEAGUES: LeagueMeta[] = [
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "DOM", label: "Dominican Republic", country: "Dominican Republic", flag: "🇩🇴" },
  { id: "VEN", label: "Venezuela", country: "Venezuela", flag: "🇻🇪" },
  { id: "PUR", label: "Puerto Rico", country: "Puerto Rico", flag: "🇵🇷" },
  { id: "JPN", label: "Japan", country: "Japan", flag: "🇯🇵" },
];

// No on-field position split — hitters and pitchers are ranked in one pool.
export const MLB_POSITIONS: PositionMeta[] = [];
