import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * CS:GO / CS2 honor model. Counter-Strike has two competing pinnacles, so the
 * buckets encode the sport's GOAT debate as a weighting tier (the same trick Go
 * uses for world-vs-domestic). Winning a Valve Major — the once- or twice-a-year
 * world championship — is a TEAM honor. Finishing the calendar year ranked HLTV
 * No. 1 — the single most authoritative measure of individual dominance, awarded
 * every year since 2010 — sits in `individual`, alongside the per-event Major MVP.
 * So the "Titles" preset rewards silverware (the trophy-count camp) and the
 * "Individual" preset rewards raw personal dominance (the s1mple/ZywOo camp), which
 * cleanly separates a peerless individual with no Major (NiKo, m0NESY) from a
 * Major-laden role player. Premier LAN titles are the placement makeweight. No
 * gender split; players are ranked as one pool. All counts frozen at end of 2025.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  major: { label: "Valve Major Champion", short: "Major", bucket: "team", tier: "S", base: 150 },
  hltv_top1: { label: "HLTV #1 (Year-End)", short: "#1", bucket: "individual", tier: "S", base: 200 },
  major_mvp: { label: "Major MVP", short: "Maj MVP", bucket: "individual", tier: "A", base: 70 },
  big_title: { label: "Premier LAN Title", short: "LAN", bucket: "placement", tier: "B", base: 12 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1.5, individual: 0.8, placement: 0.9 } },
  { key: "individual", label: "Individual", weights: { team: 0.7, individual: 1.5, placement: 1 } },
];

const AXES: Axis[] = [
  { id: "CSMajors", label: "Majors", kind: "sum", types: ["major"] },
  { id: "HLTVNo1", label: "HLTV #1", kind: "sum", types: ["hltv_top1"] },
  { id: "MajorMVP", label: "Major MVP", kind: "sum", types: ["major_mvp"] },
  { id: "LANTitles", label: "LAN Titles", kind: "sum", types: ["big_title"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["major", "hltv_top1", "major_mvp", "big_title"];

export const CSGO_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

export const CSGO_LEAGUES: LeagueMeta[] = [
  { id: "DEN", label: "Denmark", country: "Denmark", flag: "🇩🇰" },
  { id: "FRA", label: "France", country: "France", flag: "🇫🇷" },
  { id: "SWE", label: "Sweden", country: "Sweden", flag: "🇸🇪" },
  { id: "UKR", label: "Ukraine", country: "Ukraine", flag: "🇺🇦" },
  { id: "RUS", label: "Russia", country: "Russia", flag: "🇷🇺" },
  { id: "BRA", label: "Brazil", country: "Brazil", flag: "🇧🇷" },
  { id: "BIH", label: "Bosnia", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "SVK", label: "Slovakia", country: "Slovakia", flag: "🇸🇰" },
  { id: "CAN", label: "Canada", country: "Canada", flag: "🇨🇦" },
  { id: "EST", label: "Estonia", country: "Estonia", flag: "🇪🇪" },
  { id: "NOR", label: "Norway", country: "Norway", flag: "🇳🇴" },
  { id: "LAT", label: "Latvia", country: "Latvia", flag: "🇱🇻" },
];

// Counter-Strike has no positions — players are ranked as one pool.
export const CSGO_POSITIONS: PositionMeta[] = [];
