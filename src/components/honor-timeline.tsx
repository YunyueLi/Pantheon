"use client";

import { useEffect, useRef, useState } from "react";
import { timeline } from "@/lib/sport/honor";
import type { Achievement, HonorModel, Player } from "@/lib/sport/types";
import { useSport, useHonorLabel } from "@/lib/sport/provider";
import { formatNumber } from "@/lib/utils";

type YearBar = { year: number; points: number; items: Achievement[]; hasMarquee: boolean };

function buildYears(player: Player, model: HonorModel, marquee: string): YearBar[] {
  const t = timeline(player, model);
  if (t.length === 0) return [];
  const last = Math.max(...t.map((d) => d.year));
  const start = Math.min(player.debutYear, t[0].year);
  const map = new Map(t.map((d) => [d.year, d]));
  const years: YearBar[] = [];
  for (let y = start; y <= last; y++) {
    const d = map.get(y);
    years.push({
      year: y,
      points: d?.points ?? 0,
      items: d?.items ?? [],
      hasMarquee: (d?.items ?? []).some((a) => a.type === marquee),
    });
  }
  return years;
}

export function HonorTimeline({ player }: { player: Player }) {
  const { config } = useSport();
  const marquee = config.headlineTypes[0];
  const data = buildYears(player, config.model, marquee);

  // Measure the full-width container with a ResizeObserver (mirrors compare-radar).
  // The timeline is full-width, so a 0 initial width self-corrects on first paint —
  // but we still start non-zero to avoid a flash of collapsed geometry.
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (data.length === 0) return null;
  return (
    <div ref={ref} className="h-[210px] w-full">
      <Chart width={width} height={210} data={data} marquee={marquee} />
    </div>
  );
}

function Chart({
  width,
  height,
  data,
  marquee,
}: {
  width: number;
  height: number;
  data: YearBar[];
  marquee: string;
}) {
  const honorLabel = useHonorLabel();
  const margin = { top: 22, right: 6, bottom: 28, left: 6 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);
  const [hover, setHover] = useState<number | null>(null);

  // Manual band scale (index → x), equivalent to visx scaleBand with padding 0.34.
  // d3: step = range / (n + padding) when inner == outer; band = step * (1 - inner);
  // x(i) = paddingOuter*step + i*step.
  const n = data.length;
  const padding = 0.34;
  const step = iw / (n + padding);
  const band = step * (1 - padding);
  const bandX = (i: number) => step * padding + i * step;

  // Manual linear scale (value → px), equivalent to scaleLinear([0,maxP],[ih,0]).
  const maxP = Math.max(1, ...data.map((d) => d.points));
  const yScale = (v: number) => ih - (v / maxP) * ih;

  // Cap the visual bar width (a 1–2 year career would otherwise render one huge
  // slab) and centre each bar within its band.
  const bw = Math.min(band, 54);
  const inset = (band - bw) / 2;
  const showEvery = data.length > 11 ? 2 : 1;

  const hovered = hover != null ? data.find((d) => d.year === hover) : null;
  const hoveredIdx = hover != null ? data.findIndex((d) => d.year === hover) : -1;
  const tipLeft = hoveredIdx >= 0 ? margin.left + bandX(hoveredIdx) + bw / 2 : 0;

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <line x1={0} x2={iw} y1={ih} y2={ih} stroke="var(--border)" strokeWidth={1} />
          {data.map((d, i) => {
            const bx = bandX(i);
            const barH = d.points > 0 ? ih - yScale(d.points) : 0;
            const dim = hover != null && hover !== d.year;
            return (
              <g
                key={d.year}
                onMouseEnter={() => setHover(d.year)}
                onMouseLeave={() => setHover(null)}
              >
                <rect x={bx} y={0} width={band} height={ih} fill="transparent" />
                {d.points > 0 && (
                  <rect
                    x={bx + inset}
                    y={yScale(d.points)}
                    width={bw}
                    height={barH}
                    rx={3}
                    fill={d.hasMarquee ? "var(--accent)" : "var(--chart-3)"}
                    opacity={dim ? 0.35 : 1}
                    style={{ transition: "opacity 150ms" }}
                  />
                )}
                {d.hasMarquee && d.points > 0 && (
                  <circle cx={bx + band / 2} cy={yScale(d.points) - 7} r={2.5} fill="var(--accent)" />
                )}
                {i % showEvery === 0 && (
                  <text
                    x={bx + band / 2}
                    y={ih + 16}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--fg-3)"
                    className="tnum"
                  >
                    {`'${String(d.year).slice(2)}`}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      {hovered && hovered.items.length > 0 && (
        <div
          className="pointer-events-none absolute z-10 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-border bg-raised px-3 py-2 shadow-pop"
          style={{ left: tipLeft, top: 0 }}
        >
          <div className="tnum text-xs font-semibold text-fg">
            {hovered.year} · {formatNumber(hovered.points)} pts
          </div>
          <ul className="mt-1 space-y-0.5">
            {hovered.items.map((a, i) => (
              <li key={i} className="flex items-center gap-1.5 text-[11px] text-fg-muted">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: a.type === marquee ? "var(--accent)" : "var(--fg-3)" }}
                />
                {honorLabel(a.type)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
