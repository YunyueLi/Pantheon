import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Formula 1 honor model. The World Drivers' Championship is the pinnacle
 * (repeatable, lightly decayed so a 7-title great still towers without erasing
 * the field), with race wins / poles / podiums as the volume metrics of
 * sustained excellence. Counts are career-final, capped at the end of 2024.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  wdc: { label: "World Drivers' Championship", short: "WDC", bucket: "individual", tier: "S", base: 520 },
  race_win: { label: "Grand Prix Win", short: "Win", bucket: "team", tier: "A", base: 14 },
  pole: { label: "Pole Position", short: "Pole", bucket: "placement", tier: "B", base: 6 },
  podium: { label: "Podium", short: "Podium", bucket: "placement", tier: "B", base: 3 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 0.7, individual: 1.6, placement: 0.6 } },
  { key: "volume", label: "Race craft", weights: { team: 1.35, individual: 0.8, placement: 1.2 } },
];

const AXES: Axis[] = [
  { id: "Titles", label: "Titles", kind: "sum", types: ["wdc"] },
  { id: "Wins", label: "Wins", kind: "sum", types: ["race_win"] },
  { id: "Poles", label: "Poles", kind: "sum", types: ["pole"] },
  { id: "Podiums", label: "Podiums", kind: "sum", types: ["podium"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["wdc", "race_win", "pole", "podium"];

// WDC sees mild diminishing returns; volume stats (wins/poles/podiums) do NOT
// decay — in F1 the raw career counts are the headline measure of greatness.
const REPEAT_DECAY_TYPES = ["wdc"];

export const F1_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
  repeatDecay: { factor: 0.85, types: REPEAT_DECAY_TYPES },
};

export const F1_LEAGUES: LeagueMeta[] = [
  { id: "GBR", label: "United Kingdom", country: "United Kingdom", flag: "🇬🇧" },
  { id: "GER", label: "Germany", country: "Germany", flag: "🇩🇪" },
  { id: "NED", label: "Netherlands", country: "Netherlands", flag: "🇳🇱" },
  { id: "ARG", label: "Argentina", country: "Argentina", flag: "🇦🇷" },
  { id: "BRA", label: "Brazil", country: "Brazil", flag: "🇧🇷" },
  { id: "FRA", label: "France", country: "France", flag: "🇫🇷" },
  { id: "AUT", label: "Austria", country: "Austria", flag: "🇦🇹" },
  { id: "FIN", label: "Finland", country: "Finland", flag: "🇫🇮" },
  { id: "ITA", label: "Italy", country: "Italy", flag: "🇮🇹" },
  { id: "ESP", label: "Spain", country: "Spain", flag: "🇪🇸" },
  { id: "AUS", label: "Australia", country: "Australia", flag: "🇦🇺" },
  { id: "CAN", label: "Canada", country: "Canada", flag: "🇨🇦" },
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
];

// Formula 1 has no positions — drivers are ranked as one pool.
export const F1_POSITIONS: PositionMeta[] = [];
