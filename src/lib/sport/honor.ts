import type { Achievement, AchievementMeta, Axis, Bucket, HonorModel, Player, Weights } from "./types";

/**
 * Sport-neutral honor math. The score is fully transparent:
 *   HonorScore = Σ base × bucketWeight × share
 * Every sport-specific decision (which achievements exist, their weights, the
 * radar axes) lives in the HonorModel passed in — never here.
 */

export const DEFAULT_WEIGHTS: Weights = { team: 1, individual: 1, placement: 1 };

export function achievementPoints(a: Achievement, model: HonorModel, w: Weights = DEFAULT_WEIGHTS): number {
  const meta = model.achievementMeta[a.type];
  if (!meta) return 0;
  const share = meta.bucket === "individual" && typeof a.share === "number" ? a.share : 1;
  return meta.base * w[meta.bucket] * share;
}

export function honorScore(p: Player, model: HonorModel, w: Weights = DEFAULT_WEIGHTS): number {
  const decay = model.repeatDecay;
  if (!decay) {
    return p.achievements.reduce((sum, a) => sum + achievementPoints(a, model, w), 0);
  }
  const decayTypes = new Set(decay.types);
  const seen = new Map<string, number>();
  let sum = 0;
  for (const a of p.achievements) {
    let pts = achievementPoints(a, model, w);
    if (decayTypes.has(a.type)) {
      const k = seen.get(a.type) ?? 0;
      pts *= Math.pow(decay.factor, k);
      seen.set(a.type, k + 1);
    }
    sum += pts;
  }
  return sum;
}

export function bucketTotals(p: Player, model: HonorModel, w: Weights = DEFAULT_WEIGHTS): Record<Bucket, number> {
  const totals: Record<Bucket, number> = { team: 0, individual: 0, placement: 0 };
  const decay = model.repeatDecay;
  const decayTypes = decay ? new Set(decay.types) : null;
  const seen = new Map<string, number>();
  for (const a of p.achievements) {
    const meta = model.achievementMeta[a.type];
    if (!meta) continue;
    let pts = achievementPoints(a, model, w);
    if (decayTypes && decayTypes.has(a.type)) {
      const k = seen.get(a.type) ?? 0;
      pts *= Math.pow(decay!.factor, k);
      seen.set(a.type, k + 1);
    }
    totals[meta.bucket] += pts;
  }
  return totals;
}

export function countType(p: Player, type: string): number {
  return p.achievements.filter((a) => a.type === type).length;
}

export type CabinetGroup = { type: string; meta: AchievementMeta; items: Achievement[] };

/** Group a player's achievements by type, in the model's cabinet order. */
export function cabinet(p: Player, model: HonorModel): CabinetGroup[] {
  return model.cabinetOrder
    .map((type) => ({
      type,
      meta: model.achievementMeta[type],
      items: p.achievements.filter((a) => a.type === type).sort((a, b) => a.year - b.year),
    }))
    .filter((g): g is CabinetGroup => Boolean(g.meta) && g.items.length > 0);
}

export type TimelineYear = { year: number; points: number; items: Achievement[] };

export function timeline(p: Player, model: HonorModel, w: Weights = DEFAULT_WEIGHTS): TimelineYear[] {
  const byYear = new Map<number, Achievement[]>();
  for (const a of p.achievements) {
    if (!byYear.has(a.year)) byYear.set(a.year, []);
    byYear.get(a.year)!.push(a);
  }
  return Array.from(byYear.entries())
    .map(([year, items]) => ({
      year,
      items,
      points: items.reduce((s, a) => s + achievementPoints(a, model, w), 0),
    }))
    .sort((a, b) => a.year - b.year);
}

function axisValue(p: Player, axis: Axis, model: HonorModel): number {
  if (axis.kind === "sum") {
    return p.achievements
      .filter((a) => axis.types.includes(a.type))
      .reduce((s, a) => s + achievementPoints(a, model), 0);
  }
  if (axis.kind === "peak") {
    const byYear = new Map<number, number>();
    for (const a of p.achievements) byYear.set(a.year, (byYear.get(a.year) ?? 0) + achievementPoints(a, model));
    return byYear.size ? Math.max(...Array.from(byYear.values())) : 0;
  }
  // longevity
  const years = Array.from(new Set(p.achievements.map((a) => a.year)));
  const span = years.length ? Math.max(...years) - p.debutYear + 1 : 0;
  return span * 9 + years.length * 12;
}

/** Normalize each axis 0..100 against the strongest player in the pool. */
export function normalizedAxes(
  p: Player,
  pool: Player[],
  model: HonorModel
): { axis: string; label: string; value: number }[] {
  return model.axes.map((axis) => {
    const max = Math.max(1, ...pool.map((q) => axisValue(q, axis, model)));
    return { axis: axis.id, label: axis.label, value: Math.round((axisValue(p, axis, model) / max) * 100) };
  });
}

export type RankedRow = { player: Player; score: number; rank: number };

export function ranked(players: Player[], model: HonorModel, w: Weights = DEFAULT_WEIGHTS): RankedRow[] {
  return players
    .map((player) => ({ player, score: honorScore(player, model, w) }))
    .sort((a, b) => b.score - a.score)
    .map((row, i) => ({ ...row, rank: i + 1 }));
}

/** Percentile (0..100) of a player's score within a pool. */
export function percentile(player: Player, pool: Player[], model: HonorModel, w: Weights = DEFAULT_WEIGHTS): number {
  const s = honorScore(player, model, w);
  const below = pool.filter((p) => honorScore(p, model, w) < s).length;
  return Math.round((below / Math.max(1, pool.length - 1)) * 100);
}
