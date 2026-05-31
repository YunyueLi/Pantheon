"use client";

import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
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
  if (data.length === 0) return null;
  return (
    <div className="h-[210px] w-full">
      <ParentSize>{({ width }) => <Chart width={width} height={210} data={data} marquee={marquee} />}</ParentSize>
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

  const x = scaleBand<number>({ domain: data.map((d) => d.year), range: [0, iw], padding: 0.34 });
  const maxP = Math.max(1, ...data.map((d) => d.points));
  const y = scaleLinear<number>({ domain: [0, maxP], range: [ih, 0] });
  const bw = x.bandwidth();
  const showEvery = data.length > 11 ? 2 : 1;

  const hovered = hover != null ? data.find((d) => d.year === hover) : null;
  const tipLeft = hover != null ? margin.left + (x(hover) ?? 0) + bw / 2 : 0;

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <line x1={0} x2={iw} y1={ih} y2={ih} stroke="var(--border)" strokeWidth={1} />
          {data.map((d, i) => {
            const bx = x(d.year) ?? 0;
            const barH = d.points > 0 ? ih - y(d.points) : 0;
            const dim = hover != null && hover !== d.year;
            return (
              <g
                key={d.year}
                onMouseEnter={() => setHover(d.year)}
                onMouseLeave={() => setHover(null)}
              >
                <rect x={bx} y={0} width={bw} height={ih} fill="transparent" />
                {d.points > 0 && (
                  <rect
                    x={bx}
                    y={y(d.points)}
                    width={bw}
                    height={barH}
                    rx={3}
                    fill={d.hasMarquee ? "var(--accent)" : "var(--chart-3)"}
                    opacity={dim ? 0.35 : 1}
                    style={{ transition: "opacity 150ms" }}
                  />
                )}
                {d.hasMarquee && d.points > 0 && (
                  <circle cx={bx + bw / 2} cy={y(d.points) - 7} r={2.5} fill="var(--accent)" />
                )}
                {i % showEvery === 0 && (
                  <text
                    x={bx + bw / 2}
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
        </Group>
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
