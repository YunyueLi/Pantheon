import type { Achievement, AchievementMeta, Axis, HonorModel, Player, Preset, SportConfig } from "../types";
import { PLAYERS as LOL_RAW } from "@/lib/data";
import { ACHIEVEMENT_META, PRESETS } from "@/lib/honor";
import { REGIONS, ROLES, REGION_META, ROLE_META } from "@/lib/types";

// Adapt the existing LoL roster (region/role/country) to the neutral shape
// (league/position/nation). Same data, same numbers — no behavior change.
const players: Player[] = LOL_RAW.map((p) => ({
  id: p.id,
  name: p.name,
  realName: p.realName,
  sport: "lol",
  league: p.region,
  position: p.role,
  team: p.team,
  nation: p.country,
  active: p.active,
  debutYear: p.debutYear,
  blurb: p.blurb,
  photo: p.photo,
  achievements: p.achievements as Achievement[],
}));

const axes: Axis[] = [
  {
    id: "International",
    label: "International",
    kind: "sum",
    types: ["worlds_title", "msi_title", "worlds_mvp", "msi_mvp", "worlds_runnerup"],
  },
  {
    id: "Domestic",
    label: "Domestic",
    kind: "sum",
    types: ["regional_title", "regional_runnerup", "finals_mvp"],
  },
  {
    id: "Individual",
    label: "Individual",
    kind: "sum",
    types: ["worlds_mvp", "msi_mvp", "season_mvp", "finals_mvp", "all_pro_1", "all_pro_2", "all_pro_3"],
  },
  { id: "Peak", label: "Peak", kind: "peak" },
  { id: "Longevity", label: "Longevity", kind: "longevity" },
];

const model: HonorModel = {
  achievementMeta: ACHIEVEMENT_META as unknown as Record<string, AchievementMeta>,
  presets: PRESETS as Preset[],
  axes,
  cabinetOrder: [
    "worlds_title", "msi_title", "first_stand_title", "ewc_title", "asian_games_gold", "msc_title",
    "regional_title", "worlds_mvp", "msi_mvp", "season_mvp", "finals_mvp",
    "all_pro_1", "all_pro_2", "all_pro_3", "worlds_runnerup", "regional_runnerup",
  ],
};

export const LOL: SportConfig = {
  id: "lol",
  label: "League of Legends",
  basePath: "/lol",
  leagues: REGIONS.map((r) => ({ id: r, ...REGION_META[r] })),
  positions: ROLES.map((r) => ({ id: r, ...ROLE_META[r] })),
  headlineTypes: ["worlds_title", "msi_title", "regional_title"],
  model,
  players,
};
