import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * VALORANT honor model. A young scene (VCT since 2021): the annual world
 * championship (Champions) is the pinnacle, with international Masters LANs
 * second, plus the individual MVP awards and grand-final runner-up runs.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  champions_title: { label: "VCT Champions (Title)", short: "Champions", bucket: "team", tier: "S", base: 460 },
  champions_mvp: { label: "Champions MVP", short: "Champ MVP", bucket: "individual", tier: "S", base: 240 },
  masters_title: { label: "VCT Masters (Title)", short: "Masters", bucket: "team", tier: "A", base: 200 },
  masters_mvp: { label: "Masters MVP", short: "Masters MVP", bucket: "individual", tier: "A", base: 120 },
  champions_finalist: { label: "Champions Finalist", short: "Finalist", bucket: "placement", tier: "B", base: 90 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1.4, individual: 0.8, placement: 0.9 } },
  { key: "individual", label: "Individual", weights: { team: 0.8, individual: 1.6, placement: 0.8 } },
];

const AXES: Axis[] = [
  { id: "Champions", label: "Champions", kind: "sum", types: ["champions_title", "champions_finalist"] },
  { id: "Masters", label: "Masters", kind: "sum", types: ["masters_title"] },
  { id: "MVPs", label: "MVPs", kind: "sum", types: ["champions_mvp", "masters_mvp"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["champions_title", "champions_mvp", "masters_title", "masters_mvp", "champions_finalist"];

const REPEAT_DECAY_TYPES = ["champions_title", "masters_title", "masters_mvp"];

export const VALORANT_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
  repeatDecay: { factor: 0.8, types: REPEAT_DECAY_TYPES },
};

export const VALORANT_LEAGUES: LeagueMeta[] = [
  { id: "BRA", label: "Brazil", country: "Brazil", flag: "🇧🇷" },
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "CAN", label: "Canada", country: "Canada", flag: "🇨🇦" },
  { id: "TUR", label: "Türkiye", country: "Türkiye", flag: "🇹🇷" },
  { id: "FIN", label: "Finland", country: "Finland", flag: "🇫🇮" },
  { id: "RUS", label: "Russia", country: "Russia", flag: "🇷🇺" },
  { id: "SWE", label: "Sweden", country: "Sweden", flag: "🇸🇪" },
  { id: "GBR", label: "United Kingdom", country: "United Kingdom", flag: "🇬🇧" },
  { id: "IDN", label: "Indonesia", country: "Indonesia", flag: "🇮🇩" },
  { id: "SGP", label: "Singapore", country: "Singapore", flag: "🇸🇬" },
  { id: "KOR", label: "South Korea", country: "South Korea", flag: "🇰🇷" },
  { id: "BEL", label: "Belgium", country: "Belgium", flag: "🇧🇪" },
];

export const VALORANT_POSITIONS: PositionMeta[] = [
  { id: "duelist", label: "Duelist", abbr: "DUE" },
  { id: "controller", label: "Controller", abbr: "CON" },
  { id: "initiator", label: "Initiator", abbr: "INI" },
  { id: "sentinel", label: "Sentinel", abbr: "SEN" },
  { id: "flex", label: "Flex", abbr: "FLX" },
  { id: "igl", label: "In-game Leader", abbr: "IGL" },
];
