import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Basketball honor model. NBA-centric — that is where the sport's pinnacle club
 * competition and its GOAT pool live — with international honors (Olympic / FIBA
 * gold) and a separate, era-gated ABA tier so pre-1976 greats (Dr. J, Moses
 * Malone) are credited without inflating ABA silverware to NBA value.
 *
 * Scale anchored so the NBA MVP (individual pinnacle, repeatable but rare) = 600
 * and the NBA championship (team pinnacle, repeated by dynasties) = 480 before the
 * diminishing-returns curve. The marquee honors (title, MVP, Finals MVP, DPOY,
 * Olympic gold) keep full value; high-volume selections (All-NBA / All-Star /
 * All-Defensive / scoring & stat titles) decay so a 19-time All-Star's longevity
 * can't bury a higher-peak career.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  // ---- team ----
  nba_title: { label: "NBA Championship", short: "Title", bucket: "team", tier: "S", base: 480 },
  olympic_gold: { label: "Olympic Gold", short: "Olympic", bucket: "team", tier: "A", base: 180 },
  fiba_gold: { label: "FIBA World Cup", short: "FIBA", bucket: "team", tier: "A", base: 130 },
  eurobasket_gold: { label: "EuroBasket Gold", short: "EuroBasket", bucket: "team", tier: "B", base: 110 },
  euroleague: { label: "EuroLeague", short: "EuroLeague", bucket: "team", tier: "A", base: 220 },
  aba_title: { label: "ABA Championship", short: "ABA Title", bucket: "team", tier: "A", base: 240 },

  // ---- individual ----
  mvp: { label: "NBA Most Valuable Player", short: "MVP", bucket: "individual", tier: "S", base: 600 },
  nba_finals_mvp: { label: "Finals MVP", short: "Finals MVP", bucket: "individual", tier: "S", base: 360 },
  aba_mvp: { label: "ABA Most Valuable Player", short: "ABA MVP", bucket: "individual", tier: "A", base: 300 },
  euroleague_mvp: { label: "EuroLeague MVP", short: "EL MVP", bucket: "individual", tier: "A", base: 250 },
  dpoy: { label: "Defensive Player of the Year", short: "DPOY", bucket: "individual", tier: "A", base: 160 },
  scoring_title: { label: "Scoring Title", short: "Scoring", bucket: "individual", tier: "A", base: 110 },
  all_nba_first: { label: "All-NBA First Team", short: "All-NBA 1st", bucket: "individual", tier: "A", base: 150 },
  all_nba_second: { label: "All-NBA Second Team", short: "All-NBA 2nd", bucket: "individual", tier: "B", base: 75 },
  all_nba_third: { label: "All-NBA Third Team", short: "All-NBA 3rd", bucket: "individual", tier: "B", base: 40 },
  all_defensive_first: { label: "All-Defensive First Team", short: "All-Def 1st", bucket: "individual", tier: "B", base: 55 },
  all_star: { label: "NBA All-Star", short: "All-Star", bucket: "individual", tier: "B", base: 42 },
  stat_title: { label: "Statistical Title (ast/reb/stl/blk)", short: "Stat title", bucket: "individual", tier: "B", base: 35 },
  roy: { label: "Rookie of the Year", short: "ROY", bucket: "individual", tier: "B", base: 70 },

  // ---- placement ----
  finals_loss: { label: "NBA Finals (runner-up)", short: "Finals", bucket: "placement", tier: "B", base: 90 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "rings", label: "Rings", weights: { team: 1.5, individual: 0.6, placement: 0.8 } },
  { key: "individual", label: "Individual brilliance", weights: { team: 0.7, individual: 1.6, placement: 0.5 } },
];

const TITLE_TYPES = ["nba_title", "aba_title", "euroleague", "finals_loss"];
const INTERNATIONAL_TYPES = ["olympic_gold", "fiba_gold", "eurobasket_gold"];
const INDIVIDUAL_TYPES = ["mvp", "nba_finals_mvp", "aba_mvp", "euroleague_mvp", "dpoy", "scoring_title", "roy"];
const HONORS_TYPES = [
  "all_nba_first", "all_nba_second", "all_nba_third", "all_defensive_first", "all_star", "stat_title",
];

const AXES: Axis[] = [
  { id: "Titles", label: "Titles", kind: "sum", types: TITLE_TYPES },
  { id: "International", label: "International", kind: "sum", types: INTERNATIONAL_TYPES },
  { id: "Individual", label: "Individual", kind: "sum", types: INDIVIDUAL_TYPES },
  { id: "Honors", label: "Selections", kind: "sum", types: HONORS_TYPES },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = [
  "nba_title", "aba_title", "olympic_gold", "fiba_gold", "eurobasket_gold", "euroleague",
  "mvp", "nba_finals_mvp", "aba_mvp", "euroleague_mvp", "dpoy", "roy", "scoring_title",
  "all_nba_first", "all_nba_second", "all_nba_third", "all_defensive_first", "all_star", "stat_title",
  "finals_loss",
];

export const BASKETBALL_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

export const BASKETBALL_LEAGUES: LeagueMeta[] = [
  { id: "NBA", label: "NBA", country: "USA", flag: "🇺🇸" },
  { id: "INTL", label: "International", country: "FIBA", flag: "🌍" },
];

export const BASKETBALL_POSITIONS: PositionMeta[] = [
  { id: "PG", label: "Point Guard", abbr: "PG" },
  { id: "SG", label: "Shooting Guard", abbr: "SG" },
  { id: "SF", label: "Small Forward", abbr: "SF" },
  { id: "PF", label: "Power Forward", abbr: "PF" },
  { id: "C", label: "Center", abbr: "C" },
];
