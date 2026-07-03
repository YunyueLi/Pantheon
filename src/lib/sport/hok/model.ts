import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Honor of Kings (王者荣耀 / KPL) honor model. A China-centric MOBA esport run by
 * Tencent since 2016. The annual international apex — the World Champion Cup
 * (世界冠军杯), whose banner has evolved (KCC 2016–18 → World Champion Cup 2019–21 →
 * International Championship / KIC 2022–23 → World Cup 2025) — is the pinnacle and
 * is credited as a single `world_champ` type. KPL split titles (Spring/Summer/Fall
 * seasons, plus the year-end Grand Finals added in 2024) sit one tier below. The
 * two individual awards are the Finals MVP (FMVP) and the regular-season MVP.
 *
 * Buckets encode the scene's core debate as a weighting tier: every TITLE (world or
 * league) sits in `team`, while the MVP awards sit in `individual`. So the "Titles"
 * preset rewards raw silverware and the "Individual" preset rewards MVP hardware.
 * Counts verified against Liquipedia (Honor of Kings) and KPL records, frozen 2026-06.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  world_champ: { label: "World Champion (世冠杯)", short: "World", bucket: "team", tier: "S", base: 150 },
  kpl_title: { label: "KPL Split Title", short: "KPL", bucket: "team", tier: "A", base: 55 },
  kpl_fmvp: { label: "KPL Finals MVP (FMVP)", short: "FMVP", bucket: "individual", tier: "A", base: 75 },
  kpl_mvp: { label: "KPL Regular-Season MVP", short: "MVP", bucket: "individual", tier: "A", base: 60 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1.5, individual: 0.8, placement: 1 } },
  { key: "individual", label: "Individual", weights: { team: 0.7, individual: 1.5, placement: 1 } },
];

const AXES: Axis[] = [
  { id: "HOKWorld", label: "World Titles", kind: "sum", types: ["world_champ"] },
  { id: "HOKKpl", label: "KPL Titles", kind: "sum", types: ["kpl_title"] },
  { id: "HOKFmvp", label: "Finals MVP", kind: "sum", types: ["kpl_fmvp", "kpl_mvp"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["world_champ", "kpl_title", "kpl_fmvp", "kpl_mvp"];

export const HOK_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

// KPL is a China-only league; players are grouped under the single Chinese league.
export const HOK_LEAGUES: LeagueMeta[] = [
  { id: "CHN", label: "China", country: "China", flag: "🇨🇳" },
];

export const HOK_POSITIONS: PositionMeta[] = [];
