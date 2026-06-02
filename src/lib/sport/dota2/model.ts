import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Dota 2 honor model. The International (TI) — the annual world championship and
 * its Aegis — is the towering pinnacle (very few players have ever won two), with
 * Valve Majors (incl. the DPC Majors) second. Deep TI runs (runner-up / top-3)
 * are credited so longevity icons without an Aegis still rank. Every TI win,
 * TI podium and Valve Major is recorded at its real year.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  ti_title: { label: "The International (Champion)", short: "TI", bucket: "team", tier: "S", base: 480 },
  ti_runner_up: { label: "The International (Top finish)", short: "TI top", bucket: "placement", tier: "A", base: 90 },
  valve_major_title: { label: "Valve Major (Champion)", short: "Major", bucket: "team", tier: "A", base: 110 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "aegis", label: "Aegis", weights: { team: 1.4, individual: 0.7, placement: 0.9 } },
  { key: "individual", label: "Individual", weights: { team: 0.8, individual: 1.6, placement: 0.8 } },
];

const AXES: Axis[] = [
  { id: "TI", label: "The International", kind: "sum", types: ["ti_title", "ti_runner_up"] },
  { id: "Majors", label: "Valve Majors", kind: "sum", types: ["valve_major_title"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["ti_title", "ti_runner_up", "valve_major_title"];

export const DOTA2_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

export const DOTA2_LEAGUES: LeagueMeta[] = [
  { id: "DEN", label: "Denmark", country: "Denmark", flag: "🇩🇰" },
  { id: "FIN", label: "Finland", country: "Finland", flag: "🇫🇮" },
  { id: "UKR", label: "Ukraine", country: "Ukraine", flag: "🇺🇦" },
  { id: "RUS", label: "Russia", country: "Russia", flag: "🇷🇺" },
  { id: "CHN", label: "China", country: "China", flag: "🇨🇳" },
  { id: "EST", label: "Estonia", country: "Estonia", flag: "🇪🇪" },
  { id: "GER", label: "Germany", country: "Germany", flag: "🇩🇪" },
  { id: "JOR", label: "Jordan", country: "Jordan", flag: "🇯🇴" },
  { id: "LBN", label: "Lebanon", country: "Lebanon", flag: "🇱🇧" },
  { id: "PAK", label: "Pakistan", country: "Pakistan", flag: "🇵🇰" },
  { id: "SWE", label: "Sweden", country: "Sweden", flag: "🇸🇪" },
  { id: "ISR", label: "Israel", country: "Israel", flag: "🇮🇱" },
  { id: "POL", label: "Poland", country: "Poland", flag: "🇵🇱" },
  { id: "AUS", label: "Australia", country: "Australia", flag: "🇦🇺" },
  { id: "FRA", label: "France", country: "France", flag: "🇫🇷" },
  { id: "CAN", label: "Canada", country: "Canada", flag: "🇨🇦" },
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "MAS", label: "Malaysia", country: "Malaysia", flag: "🇲🇾" },
  { id: "SGP", label: "Singapore", country: "Singapore", flag: "🇸🇬" },
  { id: "BUL", label: "Bulgaria", country: "Bulgaria", flag: "🇧🇬" },
  { id: "BLR", label: "Belarus", country: "Belarus", flag: "🇧🇾" },
  { id: "ROU", label: "Romania", country: "Romania", flag: "🇷🇴" },
  { id: "MKD", label: "North Macedonia", country: "North Macedonia", flag: "🇲🇰" },
  { id: "SVK", label: "Slovakia", country: "Slovakia", flag: "🇸🇰" },
];

export const DOTA2_POSITIONS: PositionMeta[] = [
  { id: "carry", label: "Carry (1)", abbr: "1" },
  { id: "mid", label: "Mid (2)", abbr: "2" },
  { id: "offlane", label: "Offlane (3)", abbr: "3" },
  { id: "soft-support", label: "Soft Support (4)", abbr: "4" },
  { id: "hard-support", label: "Hard Support (5)", abbr: "5" },
];
