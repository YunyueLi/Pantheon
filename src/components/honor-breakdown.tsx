"use client";

import { bucketTotals, honorScore } from "@/lib/sport/honor";
import type { Bucket, Player } from "@/lib/sport/types";
import { useSport } from "@/lib/sport/provider";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

const COLORS: Record<Bucket, string> = {
  team: "var(--accent)",
  individual: "var(--chart-2)",
  placement: "var(--chart-4)",
};

const ORDER: Bucket[] = ["team", "individual", "placement"];

const CX = 64;
const CY = 64;
const INNER = 46;
const OUTER = 64;

// Annular-sector path from a0→a1 (radians), matching a recharts donut slice. A
// full 360° sweep would collapse (start point == end point), so nudge it just
// shy of a full turn — the seam is imperceptible and the ring stays closed.
function arc(a0: number, a1raw: number): string {
  const full = a1raw - a0 >= Math.PI * 2 - 1e-6;
  const a1 = full ? a1raw - 1e-3 : a1raw;
  const x = (r: number, a: number) => CX + r * Math.cos(a);
  const y = (r: number, a: number) => CY + r * Math.sin(a);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  // sweep=1 (clockwise in SVG's y-down space) for the outer arc, sweep=0 back on the inner.
  return [
    `M ${x(OUTER, a0)} ${y(OUTER, a0)}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${x(OUTER, a1)} ${y(OUTER, a1)}`,
    `L ${x(INNER, a1)} ${y(INNER, a1)}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${x(INNER, a0)} ${y(INNER, a0)}`,
    "Z",
  ].join(" ");
}

export function HonorBreakdown({ player }: { player: Player }) {
  const { t } = useI18n();
  const { config } = useSport();
  const totals = bucketTotals(player, config.model);
  const total = honorScore(player, config.model);
  const data = ORDER.map((b) => ({ key: b, label: t(`bucket.${b}`), value: Math.round(totals[b]) }));

  // Mirror recharts: startAngle 90°, endAngle -270° (a full clockwise turn from
  // 12 o'clock); a 2° pad between slices only when more than one is non-zero.
  const slices = data.filter((d) => d.value > 0);
  const sum = slices.reduce((s, d) => s + d.value, 0);
  const padDeg = slices.length > 1 ? 2 : 0;
  const sweep = 360 - padDeg * slices.length; // total drawable degrees after gaps
  // SVG angles: 0 = 3 o'clock, +y is down. Recharts' 90° start = 12 o'clock = -90° here,
  // and its negative (clockwise) sweep is +ve in SVG's y-down space.
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  let cursor = 0;
  const arcs = slices.map((d) => {
    const span = (d.value / sum) * sweep;
    const a0 = toRad(cursor);
    const a1 = toRad(cursor + span);
    cursor += span + padDeg;
    return { key: d.key as Bucket, d: arc(a0, a1) };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-[136px] w-[136px] shrink-0">
        <svg width={136} height={136}>
          {arcs.map((a) => (
            <path key={a.key} d={a.d} fill={COLORS[a.key]} stroke="none" />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="tnum text-xl font-semibold text-fg">{formatNumber(total)}</div>
            <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{t("common.index")}</div>
          </div>
        </div>
      </div>
      <ul className="flex-1 space-y-2.5">
        {data.filter((d) => d.value > 0).map((d) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <li key={d.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: COLORS[d.key] }} />
                <span className="text-fg-muted">{d.label}</span>
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="tnum text-sm font-medium text-fg">{formatNumber(d.value)}</span>
                <span className="tnum w-8 text-right text-xs text-fg-subtle">{pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
