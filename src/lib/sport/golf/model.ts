import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Golf honor model. The professional major championship is the pinnacle; the
 * Career Grand Slam (all four different majors over a career) is a historic
 * capstone credited as a bonus on top of the individual majors, mirroring the
 * career-slam treatment used by tennis and table tennis.
 *
 * The buckets encode the sport's central GOAT lens as a weighting tier: every
 * TITLE you win — a major or a regular tour win — sits in the `individual`/
 * `placement` tiers, while Player of the Year, a season-long standing voted by
 * peers, sits in `individual` alongside majors as a marker of dominance. Tour
 * wins are the highest-volume honor and sit in `placement` so a flood of regular
 * victories can be weighted separately from the majors. Men's and women's tours
 * are ranked as separate boards. All counts frozen at the end of the 2025 season.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  major: { label: "Major Championship", short: "Major", bucket: "individual", tier: "S", base: 250 },
  career_slam: { label: "Career Grand Slam", short: "Career Slam", bucket: "individual", tier: "A", base: 120 },
  poy: { label: "Player of the Year", short: "POY", bucket: "individual", tier: "A", base: 55 },
  tour_win: { label: "Tour Win", short: "Wins", bucket: "placement", tier: "B", base: 6 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1, individual: 1.4, placement: 0.6 } },
  { key: "silverware", label: "Silverware", weights: { team: 1, individual: 0.8, placement: 1.5 } },
];

const AXES: Axis[] = [
  { id: "GolfMajors", label: "Majors", kind: "sum", types: ["major", "career_slam"] },
  { id: "GolfPOY", label: "Player of Year", kind: "sum", types: ["poy"] },
  { id: "TourWins", label: "Tour Wins", kind: "sum", types: ["tour_win"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["major", "career_slam", "poy", "tour_win"];

export const GOLF_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

export const GOLF_LEAGUES: LeagueMeta[] = [
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "ESP", label: "Spain", country: "Spain", flag: "🇪🇸" },
  { id: "RSA", label: "South Africa", country: "South Africa", flag: "🇿🇦" },
  { id: "NIR", label: "Northern Ireland", country: "Northern Ireland", flag: "🇬🇧" },
  { id: "AUS", label: "Australia", country: "Australia", flag: "🇦🇺" },
  { id: "SWE", label: "Sweden", country: "Sweden", flag: "🇸🇪" },
  { id: "KOR", label: "South Korea", country: "South Korea", flag: "🇰🇷" },
  { id: "TPE", label: "Chinese Taipei", country: "Chinese Taipei", flag: "🇹🇼" },
];

export const GOLF_POSITIONS: PositionMeta[] = [
  { id: "M", label: "Men's", abbr: "M" },
  { id: "W", label: "Women's", abbr: "W" },
];
