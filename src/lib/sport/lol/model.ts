import type { AchievementMeta, Preset } from "../types";

/**
 * League of Legends honor model. Every achievement carries a tier-weighted base
 * value, grouped into three buckets (team / individual / placement). Individual
 * awards are additionally scaled by vote share at scoring time. The score is
 * fully transparent: HonorScore = Σ base × bucketWeight × share.
 *
 * Lives here (not in the legacy @/lib/honor) so LoL is a self-contained sport
 * plugin like every other vertical — meta, presets and roster under sport/lol.
 */
export const ACHIEVEMENT_META: Record<string, AchievementMeta> = {
  worlds_title: { label: "World Champion", short: "Worlds", bucket: "team", tier: "S", base: 1000 },
  msi_title: { label: "MSI Champion", short: "MSI", bucket: "team", tier: "S", base: 300 },
  worlds_runnerup: { label: "Worlds Finalist", short: "Finalist", bucket: "placement", tier: "S", base: 300 },
  first_stand_title: { label: "First Stand Champion", short: "First Stand", bucket: "team", tier: "A", base: 200 },
  ewc_title: { label: "EWC Champion", short: "EWC", bucket: "team", tier: "A", base: 250 },
  asian_games_gold: { label: "Asian Games Gold", short: "Asian Games", bucket: "team", tier: "A", base: 250 },
  msc_title: { label: "Mid-Season Cup", short: "MSC", bucket: "team", tier: "A", base: 120 },
  worlds_mvp: { label: "Worlds Finals MVP", short: "Worlds MVP", bucket: "individual", tier: "S", base: 220 },
  regional_title: { label: "Regional Champion", short: "League", bucket: "team", tier: "A", base: 130 },
  msi_mvp: { label: "MSI MVP", short: "MSI MVP", bucket: "individual", tier: "S", base: 120 },
  regional_runnerup: { label: "Regional Finalist", short: "Finalist", bucket: "placement", tier: "A", base: 45 },
  all_pro_1: { label: "All-Pro First Team", short: "1st Team", bucket: "individual", tier: "A", base: 40 },
  season_mvp: { label: "Regular Season MVP", short: "MVP", bucket: "individual", tier: "A", base: 38 },
  finals_mvp: { label: "Regional Finals MVP", short: "Finals MVP", bucket: "individual", tier: "A", base: 35 },
  all_pro_2: { label: "All-Pro Second Team", short: "2nd Team", bucket: "individual", tier: "B", base: 18 },
  all_pro_3: { label: "All-Pro Third Team", short: "3rd Team", bucket: "individual", tier: "B", base: 8 },
};

export const PRESETS: Preset[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles purist", weights: { team: 1.5, individual: 0.45, placement: 0.7 } },
  { key: "individual", label: "Individual brilliance", weights: { team: 0.7, individual: 1.7, placement: 0.5 } },
];
