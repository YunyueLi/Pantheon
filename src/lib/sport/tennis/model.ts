import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Tennis honor model. The Grand Slam singles title is the pinnacle; the two
 * historic capstones — the Calendar-Year Grand Slam (all four in one season) and
 * the Career Grand Slam (all four over a career) — are credited as bonuses on top
 * of the individual majors, mirroring table tennis's career-slam treatment.
 *
 * The buckets encode the sport's central GOAT debate as a weighting tier (the
 * same trick Go uses for world-vs-domestic): every TITLE you win sits in the
 * `individual` tier, while finishing the season as world No. 1 — a season-long
 * RANKING standing, not a title — sits in `placement`. So the "Titles" preset
 * rewards raw silverware (the slam-count camp) and the "Dominance" preset rewards
 * years spent atop the rankings (the weeks-at-No.1 camp). Men's and women's draws
 * are ranked as separate boards. All counts frozen at the end of the 2025 season.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  slam: { label: "Grand Slam Singles Title", short: "Slam", bucket: "individual", tier: "S", base: 400 },
  calendar_slam: { label: "Calendar-Year Grand Slam", short: "Calendar Slam", bucket: "individual", tier: "S", base: 250 },
  career_slam: { label: "Career Grand Slam", short: "Career Slam", bucket: "individual", tier: "A", base: 120 },
  ye_no1: { label: "Year-End World No. 1", short: "#1", bucket: "placement", tier: "S", base: 180 },
  finals: { label: "Year-End Tour Finals", short: "Finals", bucket: "individual", tier: "A", base: 90 },
  olympic: { label: "Olympic Singles Gold", short: "Olympic", bucket: "individual", tier: "A", base: 150 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1, individual: 1.35, placement: 0.55 } },
  { key: "dominance", label: "Dominance", weights: { team: 1, individual: 0.8, placement: 1.75 } },
];

const AXES: Axis[] = [
  { id: "Slams", label: "Slams", kind: "sum", types: ["slam", "calendar_slam", "career_slam"] },
  { id: "YearEndNo1", label: "Year-End #1", kind: "sum", types: ["ye_no1"] },
  { id: "TourFinals", label: "Tour Finals", kind: "sum", types: ["finals"] },
  { id: "OlympicGold", label: "Olympic Gold", kind: "sum", types: ["olympic"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["slam", "calendar_slam", "career_slam", "ye_no1", "finals", "olympic"];

export const TENNIS_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

export const TENNIS_LEAGUES: LeagueMeta[] = [
  { id: "SRB", label: "Serbia", country: "Serbia", flag: "🇷🇸" },
  { id: "ESP", label: "Spain", country: "Spain", flag: "🇪🇸" },
  { id: "SUI", label: "Switzerland", country: "Switzerland", flag: "🇨🇭" },
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "AUS", label: "Australia", country: "Australia", flag: "🇦🇺" },
  { id: "SWE", label: "Sweden", country: "Sweden", flag: "🇸🇪" },
  { id: "GER", label: "Germany", country: "Germany", flag: "🇩🇪" },
  { id: "ITA", label: "Italy", country: "Italy", flag: "🇮🇹" },
  { id: "GBR", label: "United Kingdom", country: "United Kingdom", flag: "🇬🇧" },
  { id: "ROU", label: "Romania", country: "Romania", flag: "🇷🇴" },
  { id: "CZE", label: "Czechia", country: "Czechia", flag: "🇨🇿" },
  { id: "BEL", label: "Belgium", country: "Belgium", flag: "🇧🇪" },
  { id: "POL", label: "Poland", country: "Poland", flag: "🇵🇱" },
  { id: "RUS", label: "Russia", country: "Russia", flag: "🇷🇺" },
  { id: "JPN", label: "Japan", country: "Japan", flag: "🇯🇵" },
  { id: "BLR", label: "Belarus", country: "Belarus", flag: "🇧🇾" },
];

export const TENNIS_POSITIONS: PositionMeta[] = [
  { id: "M", label: "Men's", abbr: "M" },
  { id: "W", label: "Women's", abbr: "W" },
];
