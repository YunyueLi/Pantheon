import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Go (Weiqi / Baduk) honor model — detailed edition. Each international world
 * championship is its own type so a player's cabinet distinguishes (e.g.) four
 * LG Cups from three Samsung Cups; the major domestic titles (Japan's Kisei /
 * Meijin / Honinbo, plus aggregate Korean & Chinese majors) are credited too.
 *
 * `world_title` is a DISPLAY-ONLY aggregate (base 0): it carries the famous
 * career world-title tally (e.g. Lee Chang-ho 21, incl. continental events) for
 * the leaderboard marquee, but scores nothing — the per-tournament types below
 * do the scoring, so there's no double counting.
 */
const W = 100; // each strict open-world championship
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  world_title: { label: "World Titles", short: "World", bucket: "individual", tier: "S", base: 0 },
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
  // ---- major domestic titles ----
  kisei: { label: "Kisei (Japan)", short: "Kisei", bucket: "team", tier: "A", base: 13 },
  meijin: { label: "Meijin (Japan)", short: "Meijin", bucket: "team", tier: "A", base: 13 },
  honinbo: { label: "Honinbo (Japan)", short: "Honinbo", bucket: "team", tier: "A", base: 13 },
  jp_other: { label: "Other Japanese Title", short: "JP title", bucket: "team", tier: "B", base: 3 },
  kr_major: { label: "Korean Major Title", short: "KR title", bucket: "team", tier: "B", base: 3 },
  cn_major: { label: "Chinese Major Title", short: "CN title", bucket: "team", tier: "B", base: 3 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "world", label: "World stage", weights: { team: 0.6, individual: 1.4, placement: 1 } },
  { key: "domestic", label: "Domestic", weights: { team: 1.6, individual: 0.8, placement: 1 } },
];

const INTL_TYPES = ["ing", "fujitsu", "tong_yang", "lg", "samsung", "chunlan", "bailing", "mlily", "world_oza", "quzhou_lanke", "nanyang", "other_intl"];
const AXES: Axis[] = [
  { id: "World", label: "World Titles", kind: "sum", types: INTL_TYPES },
  { id: "Japan", label: "Japan", kind: "sum", types: ["kisei", "meijin", "honinbo", "jp_other"] },
  { id: "Korea", label: "Korea", kind: "sum", types: ["kr_major"] },
  { id: "China", label: "China", kind: "sum", types: ["cn_major"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = [
  "ing", "fujitsu", "lg", "samsung", "chunlan", "bailing", "mlily", "world_oza", "tong_yang", "quzhou_lanke", "nanyang", "other_intl",
  "kisei", "meijin", "honinbo", "jp_other", "kr_major", "cn_major",
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
