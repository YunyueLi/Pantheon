import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Chess honor model. The undisputed World Championship match is the pinnacle;
 * finishing a year as the FIDE-rated world No. 1 is a season-long RANKING
 * standing (not a title), and winning the Candidates earns the title shot.
 * Played as one OPEN pool — no gender split (Judit Polgár, the strongest female
 * player in history, competed in the open field and is ranked alongside the men).
 *
 * The buckets encode the sport's central GOAT tension as a weighting tier (the
 * same trick Tennis/Go use): every match title sits in `individual`, the
 * Candidates win also sits in `individual`, while years spent atop the FIDE
 * rating list sit in `placement`. So the "Titles" preset rewards crowns won
 * (the match-record camp) and the "Dominance" preset rewards years as the
 * highest-rated player alive (the rating-supremacy camp).
 *
 * ── COUNTING RULES (verified vs. Wikipedia / FIDE; frozen end-2025) ──
 *
 * `wc_title` — each time a player WON the undisputed World Championship match
 *   OR successfully DEFENDED it (incl. drawn matches retained under the rules,
 *   and rematch regains). One dated entry per successful title match, at the
 *   match year. Tournament-format undisputed titles (Botvinnik 1948, Anand
 *   2007) count as the "win" entry. During the 1993–2006 split we credit the
 *   CLASSICAL / PCA lineage (Kasparov → Kramnik); FIDE-knockout titles in that
 *   window are NOT counted (so Anand's 2000 FIDE crown and Karpov's 1993/1996
 *   FIDE-line titles are excluded — they sit outside the classical line). Match
 *   totals: Lasker 6, Kasparov 6, Karpov 3 (classical), Carlsen 5, Botvinnik 5.
 *
 * `world_no1` — calendar years finished as the world No. 1 on FIDE's rating
 *   list (rating era begins Jan 1971). A player who topped only mid-year lists
 *   but not the year-end list does not get that year. Pre-1971 champions carry
 *   ZERO here BY DESIGN — the rating list did not yet exist — NOT an omission.
 *
 * `candidates` — won the Candidates Tournament / Candidates final, i.e. earned
 *   the right to challenge for the title, whether or not the title was then won.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  wc_title: { label: "World Championship", short: "WC", bucket: "individual", tier: "S", base: 250 },
  world_no1: { label: "Year-End World No. 1", short: "#1", bucket: "placement", tier: "S", base: 90 },
  candidates: { label: "Candidates / Challenger", short: "Cand", bucket: "individual", tier: "A", base: 45 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles", weights: { team: 1, individual: 1.4, placement: 0.6 } },
  { key: "dominance", label: "Dominance", weights: { team: 1, individual: 0.85, placement: 1.6 } },
];

const AXES: Axis[] = [
  { id: "ChessWC", label: "World Titles", kind: "sum", types: ["wc_title", "candidates"] },
  { id: "ChessNo1", label: "Year-End #1", kind: "sum", types: ["world_no1"] },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = ["wc_title", "candidates", "world_no1"];

export const CHESS_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

// Nationalities used as the primary grouping. USSR-era players carry the Russia
// flag (per project convention). Steinitz (Bohemian-Austrian, later a U.S.
// citizen) is filed under Austria — his origin and the flag he is most depicted
// under; Alekhine under France (a French citizen from 1927 who represented
// France); Polgár under Hungary.
export const CHESS_LEAGUES: LeagueMeta[] = [
  { id: "RUS", label: "Russia", country: "Russia", flag: "🇷🇺" },
  { id: "NOR", label: "Norway", country: "Norway", flag: "🇳🇴" },
  { id: "USA", label: "United States", country: "United States", flag: "🇺🇸" },
  { id: "IND", label: "India", country: "India", flag: "🇮🇳" },
  { id: "CUB", label: "Cuba", country: "Cuba", flag: "🇨🇺" },
  { id: "GER", label: "Germany", country: "Germany", flag: "🇩🇪" },
  { id: "FRA", label: "France", country: "France", flag: "🇫🇷" },
  { id: "NED", label: "Netherlands", country: "Netherlands", flag: "🇳🇱" },
  { id: "CHN", label: "China", country: "China", flag: "🇨🇳" },
  { id: "ARM", label: "Armenia", country: "Armenia", flag: "🇦🇲" },
  { id: "LAT", label: "Latvia", country: "Latvia", flag: "🇱🇻" },
  { id: "AUT", label: "Austria", country: "Austria", flag: "🇦🇹" },
  { id: "HUN", label: "Hungary", country: "Hungary", flag: "🇭🇺" },
  { id: "BUL", label: "Bulgaria", country: "Bulgaria", flag: "🇧🇬" },
];

export const CHESS_POSITIONS: PositionMeta[] = [];
