import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * UFC / MMA honor model. Unlike a league sport, MMA has no season table — the
 * belt IS the achievement. So the pinnacle is winning a UFC UNDISPUTED
 * championship, and the sport's central GOAT debate turns on what you did with
 * it once you had it: how long you defended it (the dominance camp — Demetrious
 * Johnson, Anderson Silva, GSP, Jon Jones) versus how many divisions you
 * conquered (the two-division camp — McGregor, Cejudo, Nunes, Cormier).
 *
 * The buckets encode that debate as a weighting tier (the same trick Tennis uses
 * for slams-vs-No.1). Winning a belt sits in `individual`; a title DEFENSE sits
 * in `placement` — it is the "held the throne" metric, not a fresh honor. So the
 * "Titles" preset rewards raw belts + two-division conquests, while the
 * "Dominance" preset rewards long, unbroken reigns. Because the pound-for-pound
 * GOAT is argued ACROSS weight classes AND genders, everyone — the top women
 * included — is ranked in ONE mixed pool (no position split).
 *
 * COUNTING (all figures WEB-VERIFIED against UFC official records + Wikipedia,
 * FROZEN end-2025):
 *   • `ufc_title`     = each UFC UNDISPUTED championship WON. A title win is
 *                       counted once PER DIVISION (win lightweight AND
 *                       featherweight undisputed → 2). Regaining a belt after
 *                       losing it in the SAME division is NOT a second title
 *                       here (that is captured by peak/longevity, not a re-count).
 *                       Interim titles are NOT counted (noted in blurbs only).
 *   • `title_defense` = successful UNDISPUTED title defenses — the dominance
 *                       metric. Recorded as one entry carrying `count` at the
 *                       year the reign began (F1's bulk-count pattern), so the
 *                       timeline stays truthful without one row per defense.
 *                       Interim-title and non-divisional (e.g. "BMF") defenses
 *                       are excluded.
 *   • `double_champ`  = a bonus credited ONCE to fighters who held UNDISPUTED
 *                       belts in TWO different divisions (simultaneously or
 *                       across a career). Challenging for a second belt and
 *                       losing does NOT qualify (e.g. Adesanya, Holloway,
 *                       Volkanovski challenged up and lost — not counted).
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  ufc_title: { label: "UFC Champion", short: "Belt", bucket: "individual", tier: "S", base: 150 },
  title_defense: { label: "Title Defense", short: "Def", bucket: "placement", tier: "S", base: 80 },
  double_champ: { label: "Two-Division Champion", short: "2-Div", bucket: "individual", tier: "A", base: 120 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1, individual: 1.4, placement: 0.6 } },
  { key: "dominance", label: "Dominance", weights: { team: 1, individual: 0.85, placement: 1.6 } },
];

const AXES: Axis[] = [
  { id: "UFCBelts", label: "Titles", kind: "sum", types: ["ufc_title", "double_champ"] },
  { id: "TitleDefenses", label: "Title Defenses", kind: "sum", types: ["title_defense"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["ufc_title", "double_champ", "title_defense"];

export const UFC_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

// Leagues = nationalities. Dagestani fighters (Khabib, Islam) map to Russia.
export const UFC_LEAGUES: LeagueMeta[] = [
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "BRA", label: "Brazil", country: "Brazil", flag: "🇧🇷" },
  { id: "RUS", label: "Russia", country: "Russia", flag: "🇷🇺" },
  { id: "NGA", label: "Nigeria", country: "Nigeria", flag: "🇳🇬" },
  { id: "IRL", label: "Ireland", country: "Ireland", flag: "🇮🇪" },
  { id: "CAN", label: "Canada", country: "Canada", flag: "🇨🇦" },
  { id: "NZL", label: "New Zealand", country: "New Zealand", flag: "🇳🇿" },
  { id: "AUS", label: "Australia", country: "Australia", flag: "🇦🇺" },
  { id: "CMR", label: "Cameroon", country: "Cameroon", flag: "🇨🇲" },
  { id: "POL", label: "Poland", country: "Poland", flag: "🇵🇱" },
  { id: "KGZ", label: "Kyrgyzstan", country: "Kyrgyzstan", flag: "🇰🇬" },
];

// UFC ranks one mixed pound-for-pound pool across all divisions and genders.
export const UFC_POSITIONS: PositionMeta[] = [];
