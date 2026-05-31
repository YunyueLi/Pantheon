import type { AchievementMeta, Axis, LeagueMeta, Preset, PositionMeta } from "../types";

/**
 * Football honor model. Built on football's own honor structure — not a re-skin
 * of the LoL model. Two editorial decisions worth flagging:
 *
 * 1. Olympic gold is ERA-GATED into three distinct types. The men's tournament
 *    was the de-facto world title pre-1932, an amateur-diluted event 1936–1988,
 *    and a U-23 development competition since 1992 — so one flat weight would be
 *    wrong. The data tags the era-appropriate type by year.
 * 2. Pre-1995 non-European greats (Pelé, Maradona, Garrincha…) were ineligible
 *    for the Ballon d'Or. To avoid systematically under-rating them, we include
 *    `ballon_dor_retro` — France Football's own 2016 retroactive palmarès — as a
 *    separate, clearly-labeled type weighted just below a real win.
 *
 * Scale is anchored so the World Cup (team pinnacle) = 1000 and the Ballon d'Or
 * (individual pinnacle, repeatable) = 600.
 */
const ACHIEVEMENTS: Record<string, AchievementMeta> = {
  // ---- team: collective trophies (club + national team) ----
  world_cup: { label: "World Cup", short: "World Cup", bucket: "team", tier: "S", base: 1000 },
  champions_league: { label: "Champions League", short: "UCL", bucket: "team", tier: "S", base: 450 },
  continental_nt: { label: "Continental Championship", short: "Continental", bucket: "team", tier: "S", base: 350 },
  copa_libertadores: { label: "Copa Libertadores", short: "Libertadores", bucket: "team", tier: "A", base: 300 },
  club_world_cup: { label: "Club World Cup", short: "CWC", bucket: "team", tier: "A", base: 130 },
  league_title: { label: "League Title", short: "League", bucket: "team", tier: "A", base: 110 },
  europa_league: { label: "Europa League", short: "Europa", bucket: "team", tier: "B", base: 90 },
  copa_sudamericana: { label: "Copa Sudamericana", short: "Sudamericana", bucket: "team", tier: "B", base: 80 },
  continental_club: { label: "Continental Club Title", short: "Cont. club", bucket: "team", tier: "B", base: 70 },
  nations_league: { label: "Nations League", short: "Nations Lg", bucket: "team", tier: "B", base: 60 },
  domestic_cup: { label: "Domestic Cup", short: "Cup", bucket: "team", tier: "B", base: 45 },
  recopa: { label: "Recopa Sudamericana", short: "Recopa", bucket: "team", tier: "B", base: 25 },
  confederations_cup: { label: "Confederations Cup", short: "Confed", bucket: "team", tier: "B", base: 30 },
  super_cup: { label: "UEFA Super Cup", short: "Super Cup", bucket: "team", tier: "B", base: 20 },
  olympic_gold_early: { label: "Olympic Gold (pre-1932)", short: "Olympic", bucket: "team", tier: "A", base: 300 },
  olympic_gold_amateur: { label: "Olympic Gold (1936–88)", short: "Olympic", bucket: "team", tier: "B", base: 90 },
  olympic_gold_u23: { label: "Olympic Gold (U-23)", short: "Olympic", bucket: "team", tier: "B", base: 40 },

  // ---- individual: awards ----
  ballon_dor: { label: "Ballon d'Or", short: "Ballon d'Or", bucket: "individual", tier: "S", base: 600 },
  ballon_dor_retro: { label: "Ballon d'Or (retroactive)", short: "Ballon d'Or*", bucket: "individual", tier: "S", base: 500 },
  fifa_best: { label: "FIFA World Player / The Best", short: "The Best", bucket: "individual", tier: "A", base: 220 },
  wc_golden_ball: { label: "World Cup Golden Ball", short: "Golden Ball", bucket: "individual", tier: "A", base: 160 },
  golden_shoe: { label: "European Golden Shoe", short: "Golden Shoe", bucket: "individual", tier: "A", base: 130 },
  wc_golden_boot: { label: "World Cup Golden Boot", short: "Golden Boot", bucket: "individual", tier: "A", base: 120 },
  uefa_poty: { label: "UEFA Player of the Year", short: "UEFA POTY", bucket: "individual", tier: "A", base: 120 },
  yashin_trophy: { label: "Yashin Trophy", short: "Yashin", bucket: "individual", tier: "A", base: 110 },
  league_poty: { label: "League Player of the Season", short: "League POTS", bucket: "individual", tier: "B", base: 60 },
  league_top_scorer: { label: "League Top Scorer", short: "Top Scorer", bucket: "individual", tier: "B", base: 45 },
  world_xi: { label: "FIFA/FIFPRO World XI", short: "World XI", bucket: "individual", tier: "B", base: 30 },

  // ---- placement: near-misses ----
  ballon_dor_2nd: { label: "Ballon d'Or Runner-up", short: "Ballon 2nd", bucket: "placement", tier: "A", base: 200 },
  wc_runnerup: { label: "World Cup Final", short: "WC Final", bucket: "placement", tier: "A", base: 220 },
  ballon_dor_3rd: { label: "Ballon d'Or Third", short: "Ballon 3rd", bucket: "placement", tier: "A", base: 120 },
  ucl_runnerup: { label: "Champions League Final", short: "UCL Final", bucket: "placement", tier: "B", base: 110 },
  continental_nt_runnerup: { label: "Continental Final", short: "Cont. Final", bucket: "placement", tier: "B", base: 90 },

  // ---- Jiangsu City League (苏超) — China's viral amateur city league (est. 2025) ----
  // Small weights by design: a grassroots league sits far below world football, so
  // these players rank at the foot of the global board but form their own ladder when filtered.
  jsl_title: { label: "Jiangsu League Title", short: "苏超 Champ", bucket: "team", tier: "B", base: 40 },
  jsl_best_player: { label: "Jiangsu Best Player", short: "苏超 MVP", bucket: "individual", tier: "B", base: 38 },
  jsl_golden_boot: { label: "Jiangsu Golden Boot", short: "苏超 Boot", bucket: "individual", tier: "B", base: 30 },
  jsl_best_gk: { label: "Jiangsu Best Goalkeeper", short: "苏超 GK", bucket: "individual", tier: "B", base: 28 },
  jsl_runnerup: { label: "Jiangsu League Runner-up", short: "苏超 2nd", bucket: "placement", tier: "B", base: 18 },
};

const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "silverware", label: "Silverware", weights: { team: 1.5, individual: 0.5, placement: 0.7 } },
  { key: "individual", label: "Individual brilliance", weights: { team: 0.7, individual: 1.7, placement: 0.5 } },
];

// National-team honors (incl. tournament individual awards won there).
const COUNTRY_TYPES = [
  "world_cup", "continental_nt", "nations_league", "confederations_cup",
  "olympic_gold_early", "olympic_gold_amateur", "olympic_gold_u23",
  "wc_golden_ball", "wc_golden_boot", "wc_runnerup", "continental_nt_runnerup",
];
// Club honors.
const CLUB_TYPES = [
  "champions_league", "copa_libertadores", "league_title", "club_world_cup",
  "europa_league", "copa_sudamericana", "continental_club", "domestic_cup",
  "recopa", "super_cup", "ucl_runnerup", "jsl_title", "jsl_runnerup",
];
// Individual awards.
const INDIVIDUAL_TYPES = [
  "ballon_dor", "ballon_dor_retro", "fifa_best", "wc_golden_ball", "golden_shoe",
  "wc_golden_boot", "uefa_poty", "yashin_trophy", "league_poty", "league_top_scorer",
  "world_xi", "ballon_dor_2nd", "ballon_dor_3rd",
  "jsl_best_player", "jsl_golden_boot", "jsl_best_gk",
];

const AXES: Axis[] = [
  { id: "country", label: "Country", kind: "sum", types: COUNTRY_TYPES },
  { id: "club", label: "Club", kind: "sum", types: CLUB_TYPES },
  { id: "individual", label: "Individual", kind: "sum", types: INDIVIDUAL_TYPES },
  { id: "peak", label: "Peak", kind: "peak" },
  { id: "longevity", label: "Longevity", kind: "longevity" },
];

const CABINET_ORDER = [
  "world_cup", "champions_league", "continental_nt", "copa_libertadores", "league_title",
  "club_world_cup", "olympic_gold_early", "olympic_gold_amateur", "olympic_gold_u23",
  "nations_league", "europa_league", "copa_sudamericana", "continental_club", "recopa",
  "confederations_cup", "domestic_cup", "super_cup",
  "ballon_dor", "ballon_dor_retro", "fifa_best", "uefa_poty", "yashin_trophy",
  "wc_golden_ball", "wc_golden_boot", "golden_shoe", "league_poty", "league_top_scorer", "world_xi",
  "ballon_dor_2nd", "ballon_dor_3rd", "wc_runnerup", "ucl_runnerup", "continental_nt_runnerup",
  "jsl_title", "jsl_best_player", "jsl_golden_boot", "jsl_best_gk", "jsl_runnerup",
];

export const FOOTBALL_MODEL = {
  achievementMeta: ACHIEVEMENTS,
  presets: PRESETS,
  axes: AXES,
  cabinetOrder: CABINET_ORDER,
};

export const FOOTBALL_LEAGUES: LeagueMeta[] = [
  { id: "PL", label: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "LALIGA", label: "La Liga", country: "Spain", flag: "🇪🇸" },
  { id: "SERIEA", label: "Serie A", country: "Italy", flag: "🇮🇹" },
  { id: "BUNDESLIGA", label: "Bundesliga", country: "Germany", flag: "🇩🇪" },
  { id: "LIGUE1", label: "Ligue 1", country: "France", flag: "🇫🇷" },
  { id: "PRIMEIRA", label: "Primeira Liga", country: "Portugal", flag: "🇵🇹" },
  { id: "EREDIVISIE", label: "Eredivisie", country: "Netherlands", flag: "🇳🇱" },
  { id: "SOUTHAM", label: "South America", country: "CONMEBOL", flag: "🌎" },
  { id: "JSL", label: "Jiangsu City League (苏超)", country: "China", flag: "🇨🇳" },
];

export const FOOTBALL_POSITIONS: PositionMeta[] = [
  { id: "GK", label: "Goalkeeper", abbr: "GK" },
  { id: "DEF", label: "Defender", abbr: "DEF" },
  { id: "MID", label: "Midfielder", abbr: "MID" },
  { id: "FWD", label: "Forward", abbr: "FWD" },
];
