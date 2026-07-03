import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Mobile Legends: Bang Bang honor model. A SEA-centric mobile MOBA whose apex is
 * the annual M-Series World Championship (M1 2019 → M6 2024): a single global crown
 * that outweighs everything. Below it sit the two "big" titles — the domestic MPL
 * league (MPL-PH, MPL-ID, …) and the international MLBB Southeast Asia Cup (MSC) —
 * plus the individual grand-final MVP (FMVP). Team silverware dominates the sport,
 * so the buckets tilt heavily toward `team`, with FMVP the one individual honor.
 * All counts verified against Liquipedia and frozen at 2026-06.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  m_world: { label: "M-Series World Champion", short: "M-Cup", bucket: "team", tier: "S", base: 150 },
  msc_title: { label: "MSC Champion", short: "MSC", bucket: "team", tier: "A", base: 55 },
  mpl_title: { label: "MPL Title", short: "MPL", bucket: "team", tier: "A", base: 48 },
  finals_mvp: { label: "Finals MVP", short: "FMVP", bucket: "individual", tier: "A", base: 75 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1.5, individual: 0.8, placement: 1 } },
  { key: "individual", label: "Individual", weights: { team: 0.7, individual: 1.5, placement: 1 } },
];

const AXES: Axis[] = [
  { id: "MLBBWorld", label: "World Titles", kind: "sum", types: ["m_world"] },
  { id: "MLBBLeague", label: "MPL / MSC", kind: "sum", types: ["mpl_title", "msc_title"] },
  { id: "MLBBFmvp", label: "Finals MVP", kind: "sum", types: ["finals_mvp"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["m_world", "msc_title", "mpl_title", "finals_mvp"];

export const MLBB_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

// MLBB is organized by nationality — the M-Series is a nation-vs-nation rivalry
// dominated by the Philippines and Indonesia, with the wider SEA scene behind them.
export const MLBB_LEAGUES: LeagueMeta[] = [
  { id: "PHL", label: "Philippines", country: "Philippines", flag: "🇵🇭" },
  { id: "IDN", label: "Indonesia", country: "Indonesia", flag: "🇮🇩" },
  { id: "MYS", label: "Malaysia", country: "Malaysia", flag: "🇲🇾" },
  { id: "MMR", label: "Myanmar", country: "Myanmar", flag: "🇲🇲" },
  { id: "KHM", label: "Cambodia", country: "Cambodia", flag: "🇰🇭" },
  { id: "SGP", label: "Singapore", country: "Singapore", flag: "🇸🇬" },
];

export const MLBB_POSITIONS: PositionMeta[] = [];
