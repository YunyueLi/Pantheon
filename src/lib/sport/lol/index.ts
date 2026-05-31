import type { Achievement, AchievementMeta, Axis, HonorModel, Player, Preset, SportConfig } from "../types";
import { PLAYERS as LOL_RAW } from "@/lib/data";
import { ACHIEVEMENT_META, PRESETS } from "@/lib/honor";
import { REGIONS, ROLES, REGION_META, ROLE_META } from "@/lib/types";

// Stature / influence (0-100), keyed by lowercased handle. Sourced from all-time
// player rankings (ESPN, Sheep Esports, Dot Esports, etc.) + All-Star fan-vote /
// popularity signals. Distinct from the Honor Index: popularity is weighted, so
// Uzi (no Worlds title) sits in the all-time-great band, and Faker tops it.
const STATURE: Record<string, number> = {
  faker: 100, uzi: 92, bengi: 84, beryl: 84, mata: 83, showmaker: 83, chovy: 83,
  canyon: 82, theshy: 82, deft: 81, rookie: 81, keria: 80, caps: 79, ruler: 79,
  bang: 72, doublelift: 72, bjergsen: 72, smeb: 71, rekkles: 70, perkz: 70, xiaohu: 69,
  bin: 68, knight: 68, ming: 67, jackeylove: 67, zeus: 67, madlife: 66, pray: 65,
  scout: 64, clearlove: 64, oner: 63, viper: 62, tian: 60, doinb: 60, marin: 58, khan: 58,
  gorilla: 57, score: 57, meiko: 57, gumayusi: 57, bdd: 55, kanavi: 55, peanut: 55,
  nuguri: 54, wolf: 53, karsa: 52, tarzan: 52, ambition: 52, crisp: 50, zeka: 50, kiin: 50,
  duke: 49, xpeke: 49, pawn: 48, gala: 48, mlxg: 47, crown: 46, cuvee: 45, peyz: 45,
  froggen: 44, soaz: 43, elk: 43, on: 43, lehends: 42, ning: 42, jankos: 42, mikyx: 40,
  hylissang: 39, wei: 38, jiejie: 38, sneaky: 38, aphromoo: 36, impact: 36, corejj: 36,
  wunder: 33, pyosik: 32, clid: 32, teddy: 32, cuzz: 30, kingen: 30, duro: 30, gimgoon: 29,
  lwx: 29, baolan: 28, jensen: 28, doran: 27, kiaya: 24, canna: 24, brokenblade: 23,
  berserker: 23, bwipo: 23, elyoya: 23, humanoid: 22, xun: 22, swordart: 22, "369": 22,
  inspired: 22, sofm: 20, stixxay: 18, hauntzer: 18, toyz: 18, maple: 18, svenskeren: 17,
  wildturtle: 17, westdoor: 17, levi: 17, light: 16, bebe: 16, flandre: 16, yagao: 16,
  cryin: 15, kuro: 15, effort: 15, missing: 14, rascal: 14, ziv: 14, stanley: 13, brtt: 13,
  betty: 13, doggo: 13, yutapon: 12, josedeodo: 12, tinowns: 12, seiya: 11, mistake: 11,
  optimus: 11, robo: 11, revolta: 11, evi: 11, lilballz: 11, ceros: 10, steal: 10, paz: 10,
  kami: 10, micao: 10, whitelotus: 10, oddie: 10,
};

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
  stature: STATURE[p.name.toLowerCase()],
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
