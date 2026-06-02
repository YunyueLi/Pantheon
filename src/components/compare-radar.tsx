"use client";

import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { useAxisLabel } from "@/lib/sport/provider";

export type RadarSeries = { label: string; values: number[] };
export type RadarAxis = { id: string; label: string };

export function CompareRadar({ a, b, axes }: { a: RadarSeries; b: RadarSeries; axes: RadarAxis[] }) {
  return (
    <div className="mx-auto h-[360px] w-full max-w-[460px]">
      <ParentSize>{({ width }) => <Radar width={width} height={360} a={a} b={b} axes={axes} />}</ParentSize>
    </div>
  );
}

function Radar({
  width,
  height,
  a,
  b,
  axes,
}: {
  width: number;
  height: number;
  a: RadarSeries;
  b: RadarSeries;
  axes: RadarAxis[];
}) {
  const axisLabel = useAxisLabel();
  const [hover, setHover] = useState<number | null>(null);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 58;
  const n = axes.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const at = (i: number, vPct: number): [number, number] => [
    cx + Math.cos(angle(i)) * radius * (vPct / 100),
    cy + Math.sin(angle(i)) * radius * (vPct / 100),
  ];
  const poly = (vals: number[]) => vals.map((v, i) => at(i, v).join(",")).join(" ");
  const rings = [25, 50, 75, 100];

  // Invisible pie-slice hit area per axis, so hovering anywhere in a sector
  // selects that axis (far more forgiving than aiming at the vertex).
  const wedge = (i: number) => {
    const r = radius + 38;
    const a0 = angle(i) - Math.PI / n;
    const a1 = angle(i) + Math.PI / n;
    const p0 = [cx + Math.cos(a0) * r, cy + Math.sin(a0) * r];
    const p1 = [cx + Math.cos(a1) * r, cy + Math.sin(a1) * r];
    return `M ${cx} ${cy} L ${p0[0]} ${p0[1]} A ${r} ${r} 0 0 1 ${p1[0]} ${p1[1]} Z`;
  };

  const tip = hover != null ? at(hover, 100) : null;
  const tipBelow = tip != null && tip[1] < cy; // top-half vertex → place tip below it

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* rings */}
        {rings.map((r) => (
          <polygon
            key={r}
            points={axes.map((_, i) => at(i, r).join(",")).join(" ")}
            fill="none"
            stroke="var(--border)"
            opacity={r === 100 ? 1 : 0.55}
          />
        ))}
        {/* spokes (highlight the hovered axis) */}
        {axes.map((_, i) => {
          const [x, y] = at(i, 100);
          const active = hover === i;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={active ? "var(--accent)" : "var(--border)"}
              strokeWidth={active ? 1.5 : 1}
              opacity={active ? 0.85 : 0.55}
            />
          );
        })}

        {/* value shapes — grow in from centre (resting state stays visible) */}
        <g
          className="radar-reveal"
          style={{
            animation: "radar-reveal .6s cubic-bezier(.22,1,.36,1)",
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        >
          <polygon
            points={poly(b.values)}
            fill="var(--fg)"
            fillOpacity={0.05}
            stroke="var(--fg-3)"
            strokeWidth={1.5}
            className="transition-opacity"
          />
          <polygon
            points={poly(a.values)}
            fill="var(--accent)"
            fillOpacity={0.16}
            stroke="var(--accent)"
            strokeWidth={1.75}
            className="transition-opacity"
          />
          {b.values.map((v, i) => {
            const [x, y] = at(i, v);
            return <circle key={i} cx={x} cy={y} r={hover === i ? 4 : 2.5} fill="var(--fg-3)" className="transition-all" />;
          })}
          {a.values.map((v, i) => {
            const [x, y] = at(i, v);
            return <circle key={i} cx={x} cy={y} r={hover === i ? 5 : 3} fill="var(--accent)" className="transition-all" />;
          })}
        </g>

        {/* labels */}
        {axes.map((ax, i) => {
          const lx = cx + Math.cos(angle(i)) * (radius + 26);
          const ly = cy + Math.sin(angle(i)) * (radius + 26);
          const c = Math.cos(angle(i));
          const anchor = c > 0.3 ? "start" : c < -0.3 ? "end" : "middle";
          const active = hover === i;
          return (
            <text
              key={ax.id}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={active ? 600 : 400}
              fill={active ? "var(--fg)" : "var(--fg-2)"}
              className="transition-colors"
            >
              {axisLabel(ax.id, ax.label)}
            </text>
          );
        })}

        {/* invisible hover targets, on top */}
        {axes.map((_, i) => (
          <path
            key={i}
            d={wedge(i)}
            fill="transparent"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover((h) => (h === i ? null : h))}
          />
        ))}
      </svg>

      {tip && hover != null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 shadow-card"
          style={{
            left: tip[0],
            top: tipBelow ? tip[1] + 10 : tip[1] - 10,
            transform: `translate(-50%, ${tipBelow ? "0" : "-100%"})`,
          }}
        >
          <div className="mb-1 whitespace-nowrap text-xs font-medium text-fg">{axisLabel(axes[hover].id, axes[hover].label)}</div>
          <div className="flex items-center justify-between gap-4 whitespace-nowrap text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {a.label}
            </span>
            <span className="tnum font-semibold text-fg">{a.values[hover]}</span>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-4 whitespace-nowrap text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[var(--fg-3)]" />
              {b.label}
            </span>
            <span className="tnum font-semibold text-fg">{b.values[hover]}</span>
          </div>
        </div>
      )}
    </div>
  );
}
