export const REGIONS = ["LCK", "LPL", "LEC", "LCS", "PCS", "VCS", "LJL", "CBLOL", "LLA"] as const;
export type Region = (typeof REGIONS)[number];

export const ROLES = ["Top", "Jungle", "Mid", "Bot", "Support"] as const;
export type Role = (typeof ROLES)[number];

export const REGION_META: Record<Region, { label: string; country: string; flag: string }> = {
  LCK: { label: "LCK", country: "Korea", flag: "🇰🇷" },
  LPL: { label: "LPL", country: "China", flag: "🇨🇳" },
  LEC: { label: "LEC", country: "EMEA", flag: "🇪🇺" },
  LCS: { label: "LCS", country: "N. America", flag: "🇺🇸" },
  PCS: { label: "PCS", country: "Pacific", flag: "🇹🇼" },
  VCS: { label: "VCS", country: "Vietnam", flag: "🇻🇳" },
  LJL: { label: "LJL", country: "Japan", flag: "🇯🇵" },
  CBLOL: { label: "CBLOL", country: "Brazil", flag: "🇧🇷" },
  LLA: { label: "LLA", country: "Latin America", flag: "🌎" },
};

export const ROLE_META: Record<Role, { label: string; abbr: string }> = {
  Top: { label: "Top", abbr: "TOP" },
  Jungle: { label: "Jungle", abbr: "JNG" },
  Mid: { label: "Mid", abbr: "MID" },
  Bot: { label: "Bot", abbr: "BOT" },
  Support: { label: "Support", abbr: "SUP" },
};

export type AchievementType =
  | "worlds_title"
  | "msi_title"
  | "first_stand_title"
  | "ewc_title"
  | "asian_games_gold"
  | "msc_title"
  | "regional_title"
  | "worlds_mvp"
  | "msi_mvp"
  | "season_mvp"
  | "finals_mvp"
  | "all_pro_1"
  | "all_pro_2"
  | "all_pro_3"
  | "worlds_runnerup"
  | "regional_runnerup";

export type Bucket = "team" | "individual" | "placement";

export type Achievement = {
  type: AchievementType;
  year: number;
  /** Display label for the event, e.g. "Worlds 2023" */
  event?: string;
  /** Team the player represented at the time */
  team?: string;
  /** 0..1 vote share for voted awards (drives individual-award weighting) */
  share?: number;
  /** 0..1 participation factor for a title won with a limited/rotational role; defaults to 1. */
  part?: number;
};

export type Player = {
  id: string;
  name: string;
  realName?: string;
  region: Region;
  role: Role;
  team: string;
  country: string;
  active: boolean;
  debutYear: number;
  blurb?: string;
  /** Optional licensed headshot, e.g. "/players/faker.jpg" placed in /public. Falls back to a unified generated avatar. */
  photo?: string;
  achievements: Achievement[];
};
