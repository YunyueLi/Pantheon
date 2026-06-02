import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Go (Weiqi / Baduk) honor model — detailed edition. Each international world
 * championship is its own type so a player's cabinet distinguishes (e.g.) four
 * LG Cups from three Samsung Cups, and EVERY title is recorded at its real year.
 * Major domestic titles are credited per country (Japan / Korea / China) and
 * weighted well below a world crown so domestic volume can't flood the picture.
 */
const W = 100; // each strict open-world championship
const D = 8; // each major domestic title
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  // ---- display-only aggregates (base 0): power the headline tiles only; they
  //      score nothing and are hidden from the honor list, timeline and cabinet,
  //      so the per-tournament / per-year entries below do all the real work ----
  world_title: { label: "World Titles", short: "World", bucket: "individual", tier: "S", base: 0 },
  domestic_title: { label: "Domestic Titles", short: "Domestic", bucket: "team", tier: "A", base: 0 },
  // ---- international open-world championships ----
  ing: { label: "Ing Cup", short: "Ing", bucket: "individual", tier: "S", base: W },
  fujitsu: { label: "Fujitsu Cup", short: "Fujitsu", bucket: "individual", tier: "S", base: W },
  tong_yang: { label: "Tong Yang Cup", short: "Tong Yang", bucket: "individual", tier: "A", base: W },
  lg: { label: "LG Cup", short: "LG", bucket: "individual", tier: "S", base: W },
  samsung: { label: "Samsung Cup", short: "Samsung", bucket: "individual", tier: "S", base: W },
  chunlan: { label: "Chunlan Cup", short: "Chunlan", bucket: "individual", tier: "A", base: W },
  bailing: { label: "Bailing Cup", short: "Bailing", bucket: "individual", tier: "A", base: W },
  mlily: { label: "MLily Cup", short: "MLily", bucket: "individual", tier: "A", base: W },
  world_oza: { label: "Toyota & Denso (World Oza)", short: "World Oza", bucket: "individual", tier: "A", base: W },
  quzhou_lanke: { label: "Quzhou-Lanke Cup", short: "Lanke", bucket: "individual", tier: "A", base: W },
  nanyang: { label: "Nanyang Cup", short: "Nanyang", bucket: "individual", tier: "A", base: W },
  other_intl: { label: "Other World/Continental Title", short: "Other", bucket: "individual", tier: "B", base: 45 },
  // ---- major domestic titles (recorded per real year) ----
  jp_title: { label: "Japanese Major Title", short: "JP title", bucket: "team", tier: "A", base: D },
  kr_title: { label: "Korean Major Title", short: "KR title", bucket: "team", tier: "A", base: D },
  cn_title: { label: "Chinese Major Title", short: "CN title", bucket: "team", tier: "A", base: D },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "world", label: "World stage", weights: { team: 0.6, individual: 1.4, placement: 1 } },
  { key: "domestic", label: "Domestic", weights: { team: 1.6, individual: 0.8, placement: 1 } },
];

const INTL_TYPES = ["ing", "fujitsu", "tong_yang", "lg", "samsung", "chunlan", "bailing", "mlily", "world_oza", "quzhou_lanke", "nanyang", "other_intl"];
const AXES: Axis[] = [
  { id: "World", label: "World Titles", kind: "sum", types: INTL_TYPES },
  { id: "Japan", label: "Japan", kind: "sum", types: ["jp_title"] },
  { id: "Korea", label: "Korea", kind: "sum", types: ["kr_title"] },
  { id: "China", label: "China", kind: "sum", types: ["cn_title"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = [
  "ing", "fujitsu", "lg", "samsung", "chunlan", "bailing", "mlily", "world_oza", "tong_yang", "quzhou_lanke", "nanyang", "other_intl",
  "jp_title", "kr_title", "cn_title",
];

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
