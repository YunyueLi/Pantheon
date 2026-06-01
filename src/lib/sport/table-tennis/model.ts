import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Table tennis honor model. Singles supremacy is the pinnacle — Olympic singles
 * gold (rarest), then World Championships and World Cup singles — with a Career
 * Grand Slam capstone. Team/doubles golds are credited but weighted low so
 * China's team dominance can't flood the individual GOAT picture.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  olympic_singles_gold: { label: "Olympic Singles Gold", short: "Olympic", bucket: "individual", tier: "S", base: 320 },
  world_singles_gold: { label: "World Championship (Singles)", short: "Worlds", bucket: "individual", tier: "S", base: 240 },
  world_cup_singles_gold: { label: "World Cup (Singles)", short: "World Cup", bucket: "individual", tier: "A", base: 150 },
  career_grand_slam: { label: "Career Grand Slam", short: "Grand Slam", bucket: "individual", tier: "S", base: 220 },
  tour_finals_gold: { label: "World Tour / WTT Finals", short: "Finals", bucket: "individual", tier: "B", base: 65 },
  olympic_team_gold: { label: "Olympic Team Gold", short: "Oly Team", bucket: "team", tier: "B", base: 90 },
  world_team_gold: { label: "World Team Championship", short: "Team", bucket: "team", tier: "B", base: 52 },
  olympic_doubles_gold: { label: "Olympic Doubles Gold", short: "Oly Dbl", bucket: "team", tier: "B", base: 80 },
  world_doubles_gold: { label: "World Doubles Gold", short: "Dbl", bucket: "team", tier: "B", base: 38 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "singles", label: "Singles", weights: { team: 0.5, individual: 1.5, placement: 1 } },
  { key: "allround", label: "All-round", weights: { team: 1.4, individual: 0.9, placement: 1 } },
];

const AXES: Axis[] = [
  { id: "Singles", label: "Singles", kind: "sum", types: ["olympic_singles_gold", "world_singles_gold", "world_cup_singles_gold", "career_grand_slam"] },
  { id: "Team", label: "Team", kind: "sum", types: ["olympic_team_gold", "world_team_gold"] },
  { id: "Doubles", label: "Doubles", kind: "sum", types: ["olympic_doubles_gold", "world_doubles_gold"] },
  { id: "Tour", label: "Tour", kind: "sum", types: ["tour_finals_gold"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = [
  "olympic_singles_gold", "world_singles_gold", "world_cup_singles_gold", "career_grand_slam",
  "tour_finals_gold", "olympic_team_gold", "world_team_gold", "olympic_doubles_gold", "world_doubles_gold",
];

// Olympic singles gold (max 2 ever) and the Grand Slam keep full value; the
// repeatable, higher-volume titles decay.
const REPEAT_DECAY_TYPES = [
  "world_singles_gold", "world_cup_singles_gold", "tour_finals_gold",
  "olympic_team_gold", "world_team_gold", "olympic_doubles_gold", "world_doubles_gold",
];

export const TABLE_TENNIS_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
  repeatDecay: { factor: 0.8, types: REPEAT_DECAY_TYPES },
};

export const TABLE_TENNIS_LEAGUES: LeagueMeta[] = [
  { id: "CHN", label: "China", country: "China", flag: "🇨🇳" },
  { id: "SWE", label: "Sweden", country: "Sweden", flag: "🇸🇪" },
  { id: "KOR", label: "South Korea", country: "South Korea", flag: "🇰🇷" },
  { id: "GER", label: "Germany", country: "Germany", flag: "🇩🇪" },
  { id: "AUT", label: "Austria", country: "Austria", flag: "🇦🇹" },
];

export const TABLE_TENNIS_POSITIONS: PositionMeta[] = [
  { id: "M", label: "Men's", abbr: "M" },
  { id: "W", label: "Women's", abbr: "W" },
];
