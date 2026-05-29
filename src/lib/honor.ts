import type { Achievement, AchievementType, Bucket, Player } from "./types";

/**
 * Honor model — every achievement carries a tier-weighted base value, grouped
 * into three buckets. Individual awards are additionally scaled by vote share.
 * The score is fully transparent: HonorScore = Σ base × bucketWeight × share.
 */
export const ACHIEVEMENT_META: Record<
  AchievementType,
  { label: string; short: string; bucket: Bucket; tier: "S" | "A" | "B"; base: number }
> = {
  worlds_title: { label: "World Champion", short: "Worlds", bucket: "team", tier: "S", base: 1000 },
  msi_title: { label: "MSI Champion", short: "MSI", bucket: "team", tier: "S", base: 300 },
  worlds_runnerup: { label: "Worlds Finalist", short: "Finalist", bucket: "placement", tier: "S", base: 300 },
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

export const BUCKET_META: Record<Bucket, { label: string; description: string }> = {
  team: { label: "Team titles", description: "Championships, weighted by event tier" },
  individual: { label: "Individual awards", description: "MVPs & All-Pro selections, scaled by vote share" },
  placement: { label: "Deep runs", description: "Finals appearances that fell short of the title" },
};

export type Weights = Record<Bucket, number>;
export const DEFAULT_WEIGHTS: Weights = { team: 1, individual: 1, placement: 1 };

export const PRESETS: { key: string; label: string; weights: Weights }[] = [
  { key: "balanced", label: "Balanced", weights: { team: 1, individual: 1, placement: 1 } },
  { key: "titles", label: "Titles purist", weights: { team: 1.5, individual: 0.45, placement: 0.7 } },
  { key: "individual", label: "Individual brilliance", weights: { team: 0.7, individual: 1.7, placement: 0.5 } },
];

export function achievementPoints(a: Achievement, w: Weights = DEFAULT_WEIGHTS): number {
  const meta = ACHIEVEMENT_META[a.type];
  const share = meta.bucket === "individual" && typeof a.share === "number" ? a.share : 1;
  return meta.base * w[meta.bucket] * share;
}

export function honorScore(p: Player, w: Weights = DEFAULT_WEIGHTS): number {
  return p.achievements.reduce((sum, a) => sum + achievementPoints(a, w), 0);
}

export function bucketTotals(p: Player, w: Weights = DEFAULT_WEIGHTS): Record<Bucket, number> {
  const totals: Record<Bucket, number> = { team: 0, individual: 0, placement: 0 };
  for (const a of p.achievements) totals[ACHIEVEMENT_META[a.type].bucket] += achievementPoints(a, w);
  return totals;
}

export function countType(p: Player, type: AchievementType): number {
  return p.achievements.filter((a) => a.type === type).length;
}

export function titleCounts(p: Player) {
  return {
    worlds: countType(p, "worlds_title"),
    msi: countType(p, "msi_title"),
    regional: countType(p, "regional_title"),
  };
}

/** Group a player's achievements by type for the trophy cabinet. */
export function cabinet(p: Player) {
  const order: AchievementType[] = [
    "worlds_title",
    "msi_title",
    "regional_title",
    "worlds_mvp",
    "msi_mvp",
    "season_mvp",
    "finals_mvp",
    "all_pro_1",
    "all_pro_2",
    "all_pro_3",
    "worlds_runnerup",
    "regional_runnerup",
  ];
  return order
    .map((type) => {
      const items = p.achievements.filter((a) => a.type === type).sort((a, b) => a.year - b.year);
      return { type, meta: ACHIEVEMENT_META[type], items };
    })
    .filter((g) => g.items.length > 0);
}

export type TimelineYear = { year: number; points: number; items: Achievement[] };
export function timeline(p: Player, w: Weights = DEFAULT_WEIGHTS): TimelineYear[] {
  const byYear = new Map<number, Achievement[]>();
  for (const a of p.achievements) {
    if (!byYear.has(a.year)) byYear.set(a.year, []);
    byYear.get(a.year)!.push(a);
  }
  return Array.from(byYear.entries())
    .map(([year, items]) => ({
      year,
      items,
      points: items.reduce((s, a) => s + achievementPoints(a, w), 0),
    }))
    .sort((a, b) => a.year - b.year);
}

export const AXES = ["International", "Domestic", "Individual", "Peak", "Longevity"] as const;
export type Axis = (typeof AXES)[number];

function rawAxes(p: Player): Record<Axis, number> {
  const sum = (types: AchievementType[]) =>
    p.achievements.filter((a) => types.includes(a.type)).reduce((s, a) => s + achievementPoints(a), 0);

  const international = sum(["worlds_title", "msi_title", "worlds_mvp", "msi_mvp", "worlds_runnerup"]);
  const domestic = sum(["regional_title", "regional_runnerup", "finals_mvp"]);
  const individual = sum(["worlds_mvp", "msi_mvp", "season_mvp", "finals_mvp", "all_pro_1", "all_pro_2", "all_pro_3"]);

  const byYear = new Map<number, number>();
  for (const a of p.achievements) byYear.set(a.year, (byYear.get(a.year) ?? 0) + achievementPoints(a));
  const peak = byYear.size ? Math.max(...Array.from(byYear.values())) : 0;

  const years = Array.from(new Set(p.achievements.map((a) => a.year)));
  const span = years.length ? Math.max(...years) - p.debutYear + 1 : 0;
  const longevity = span * 9 + years.length * 12;

  return { International: international, Domestic: domestic, Individual: individual, Peak: peak, Longevity: longevity };
}

/** Normalize each axis 0..100 against the strongest player in the pool. */
export function normalizedAxes(p: Player, pool: Player[]): { axis: Axis; value: number }[] {
  const all = pool.map(rawAxes);
  const self = rawAxes(p);
  return AXES.map((axis) => {
    const max = Math.max(1, ...all.map((r) => r[axis]));
    return { axis, value: Math.round((self[axis] / max) * 100) };
  });
}
