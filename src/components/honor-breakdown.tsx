"use client";

import { Cell, Pie, PieChart } from "recharts";
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

export function HonorBreakdown({ player }: { player: Player }) {
  const { t } = useI18n();
  const { config } = useSport();
  const totals = bucketTotals(player, config.model);
  const total = honorScore(player, config.model);
  const data = ORDER.map((b) => ({ key: b, label: t(`bucket.${b}`), value: Math.round(totals[b]) }));

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-[136px] w-[136px] shrink-0">
        <PieChart width={136} height={136}>
          <Pie
            data={data}
            dataKey="value"
            cx={64}
            cy={64}
            innerRadius={46}
            outerRadius={64}
            paddingAngle={data.filter((d) => d.value > 0).length > 1 ? 2 : 0}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.key} fill={COLORS[d.key]} />
            ))}
          </Pie>
        </PieChart>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="tnum text-xl font-semibold text-fg">{formatNumber(total)}</div>
            <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{t("common.index")}</div>
          </div>
        </div>
      </div>
      <ul className="flex-1 space-y-2.5">
        {data.map((d) => {
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
