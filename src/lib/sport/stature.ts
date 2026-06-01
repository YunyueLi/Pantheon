import type { HonorModel, Player } from "./types";
import { careerSpan, honorScore } from "./honor";

/**
 * Era-strength → Stature engine (sport-neutral, one-pass, NON-circular).
 *
 * The user's idea: a title/career is "harder" when the era was stacked with
 * elite, honor-bearing rivals. We realize it WITHOUT the circular eigenvector
 * model — Honor Index scores are a FIXED input here and are never fed back:
 *
 *   honorScore (fixed) ── prime windows ──▶ era density ──▶ era strength
 *                                                              │
 *                              base stature ──────────────────┴──▶ display stature
 *
 * 1. prime window  = careerSpan (debut → last decorated year), min width 5y.
 * 2. era density   = Σ over OTHER players whose window overlaps yours, of
 *                    (overlap fraction of YOUR window) × (their honorScore / max).
 *                    i.e. "how much decorated talent shared your prime".
 * 3. era strength  = percentile rank (0..100) of that density across the roster,
 *                    so the median player sits at 50 (no systemic inflation).
 * 4. display       = base × (1 ± 12%), base = curated `stature` if authored,
 *                    else derived from Honor-Index percentile. The Honor Index
 *                    itself is untouched — this only colors the Stature lens.
 */

export type StatureInfo = { base: number; eraStrength: number; display: number };

const ERA_SWING = 0.12; // ±12% max nudge

function windowOf(p: Player): { lo: number; hi: number } {
  const { start, end } = careerSpan(p);
  let lo = start;
  let hi = Math.max(end, start);
  if (hi - lo < 4) {
    const mid = (lo + hi) / 2;
    lo = Math.floor(mid - 2);
    hi = Math.ceil(mid + 2);
  }
  return { lo, hi };
}

export function computeStature(players: Player[], model: HonorModel): Map<string, StatureInfo> {
  const n = players.length;
  const out = new Map<string, StatureInfo>();
  if (n === 0) return out;

  // Fixed inputs: honor scores + prime windows.
  const score = new Map<string, number>();
  const win = new Map<string, { lo: number; hi: number }>();
  for (const p of players) {
    score.set(p.id, honorScore(p, model));
    win.set(p.id, windowOf(p));
  }
  const maxScore = Math.max(1, ...players.map((p) => score.get(p.id)!));

  // Era density (honor-weighted overlapping-window mass).
  const density = new Map<string, number>();
  for (const p of players) {
    const wp = win.get(p.id)!;
    const myLen = wp.hi - wp.lo + 1;
    let dens = 0;
    for (const q of players) {
      if (q.id === p.id) continue;
      const wq = win.get(q.id)!;
      const overlap = Math.min(wp.hi, wq.hi) - Math.max(wp.lo, wq.lo) + 1;
      if (overlap <= 0) continue;
      const frac = Math.min(1, overlap / myLen);
      dens += frac * (score.get(q.id)! / maxScore);
    }
    density.set(p.id, dens);
  }

  // Era strength = percentile rank of density (median → 50).
  const densVals = players.map((p) => density.get(p.id)!);
  const eraStrengthOf = (v: number) => {
    if (n <= 1) return 50;
    const below = densVals.filter((d) => d < v).length;
    return Math.round((below / (n - 1)) * 100);
  };

  // Derived base for sports without authored stature: Honor-Index percentile → [45, 92].
  const scoreVals = players.map((p) => score.get(p.id)!);
  const deriveBase = (v: number) => {
    if (n <= 1) return 80;
    const below = scoreVals.filter((s) => s < v).length;
    return Math.round(45 + 47 * (below / (n - 1)));
  };

  for (const p of players) {
    const base = p.stature != null ? p.stature : deriveBase(score.get(p.id)!);
    const eraStrength = eraStrengthOf(density.get(p.id)!);
    const factor = 1 + ERA_SWING * ((eraStrength - 50) / 50);
    const display = Math.max(0, Math.min(100, Math.round(base * factor)));
    out.set(p.id, { base, eraStrength, display });
  }
  return out;
}

/** Attach era-adjusted stature to every player in a roster (used by the registry). */
export function withEraStature(players: Player[], model: HonorModel): Player[] {
  const info = computeStature(players, model);
  return players.map((p) => {
    const si = info.get(p.id);
    if (!si) return p;
    return { ...p, stature: si.display, statureBase: si.base, eraStrength: si.eraStrength };
  });
}
