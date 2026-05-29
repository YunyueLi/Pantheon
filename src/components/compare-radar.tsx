"use client";

import { ParentSize } from "@visx/responsive";
import { AXES } from "@/lib/honor";
import { useI18n } from "@/lib/i18n/provider";

export type RadarSeries = { label: string; values: number[] };

export function CompareRadar({ a, b }: { a: RadarSeries; b: RadarSeries }) {
  return (
    <div className="mx-auto h-[360px] w-full max-w-[460px]">
      <ParentSize>{({ width }) => <Radar width={width} height={360} a={a} b={b} />}</ParentSize>
    </div>
  );
}

function Radar({ width, height, a, b }: { width: number; height: number; a: RadarSeries; b: RadarSeries }) {
  const { t } = useI18n();
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 58;
  const n = AXES.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const at = (i: number, vPct: number): [number, number] => [
    cx + Math.cos(angle(i)) * radius * (vPct / 100),
    cy + Math.sin(angle(i)) * radius * (vPct / 100),
  ];
  const poly = (vals: number[]) => vals.map((v, i) => at(i, v).join(",")).join(" ");
  const rings = [25, 50, 75, 100];

  return (
    <svg width={width} height={height}>
      {rings.map((r) => (
        <polygon
          key={r}
          points={AXES.map((_, i) => at(i, r).join(",")).join(" ")}
          fill="none"
          stroke="var(--border)"
          opacity={r === 100 ? 1 : 0.55}
        />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = at(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" opacity={0.55} />;
      })}

      <polygon points={poly(b.values)} fill="var(--fg)" fillOpacity={0.05} stroke="var(--fg-3)" strokeWidth={1.5} />
      {b.values.map((v, i) => {
        const [x, y] = at(i, v);
        return <circle key={i} cx={x} cy={y} r={2.5} fill="var(--fg-3)" />;
      })}
      <polygon points={poly(a.values)} fill="var(--accent)" fillOpacity={0.16} stroke="var(--accent)" strokeWidth={1.75} />
      {a.values.map((v, i) => {
        const [x, y] = at(i, v);
        return <circle key={i} cx={x} cy={y} r={3} fill="var(--accent)" />;
      })}

      {AXES.map((ax, i) => {
        const lx = cx + Math.cos(angle(i)) * (radius + 26);
        const ly = cy + Math.sin(angle(i)) * (radius + 26);
        const c = Math.cos(angle(i));
        const anchor = c > 0.3 ? "start" : c < -0.3 ? "end" : "middle";
        return (
          <text
            key={ax}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize={11}
            fill="var(--fg-2)"
          >
            {t(`axis.${ax}`)}
          </text>
        );
      })}
    </svg>
  );
}
