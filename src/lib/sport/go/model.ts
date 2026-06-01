import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Go (Weiqi / Baduk) honor model. International world-championship titles are
 * the one clean cross-era, cross-country GOAT metric, so they dominate; major
 * domestic titles (Korean / Japanese / Chinese) are a secondary volume measure.
 * Title COUNT is the headline figure (like F1 wins), so honors are carried as a
 * single bulk entry per type with `count`, scored linearly (no diminishing
 * returns) — 21 world titles is meant to tower over 8.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  world_title: { label: "International Title", short: "World", bucket: "individual", tier: "S", base: 100 },
  domestic_title: { label: "Major Domestic Title", short: "Domestic", bucket: "individual", tier: "B", base: 3 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "world", label: "World stage", weights: { team: 1, individual: 1.4, placement: 1 } },
];

const AXES: Axis[] = [
  { id: "World", label: "World Titles", kind: "sum", types: ["world_title"] },
  { id: "Domestic", label: "Domestic", kind: "sum", types: ["domestic_title"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["world_title", "domestic_title"];

export const GO_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

export const GO_LEAGUES: LeagueMeta[] = [
  { id: "KOR", label: "South Korea", country: "South Korea", flag: "🇰🇷" },
  { id: "CHN", label: "China", country: "China", flag: "🇨🇳" },
  { id: "JPN", label: "Japan", country: "Japan", flag: "🇯🇵" },
];

// Go has no positions — players are ranked as one pool.
export const GO_POSITIONS: PositionMeta[] = [];
