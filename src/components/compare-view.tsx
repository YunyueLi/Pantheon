"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PLAYERS, getPlayer } from "@/lib/data";
import { AXES, honorScore, normalizedAxes, titleCounts } from "@/lib/honor";
import { REGIONS } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, RoleBadge } from "@/components/badges";
import { CompareRadar } from "@/components/compare-radar";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";

export function CompareView() {
  const { t } = useI18n();
  const sp = useSearchParams();
  const [aId, setAId] = useState(() => (getPlayer(sp.get("a") ?? "") ? (sp.get("a") as string) : "faker"));
  const [bId, setBId] = useState(() => (getPlayer(sp.get("b") ?? "") ? (sp.get("b") as string) : "chovy"));
  const a = getPlayer(aId)!;
  const b = getPlayer(bId)!;

  const aAxes = useMemo(() => normalizedAxes(a, PLAYERS).map((d) => d.value), [aId]); // eslint-disable-line react-hooks/exhaustive-deps
  const bAxes = useMemo(() => normalizedAxes(b, PLAYERS).map((d) => d.value), [bId]); // eslint-disable-line react-hooks/exhaustive-deps

  const aCounts = titleCounts(a);
  const bCounts = titleCounts(b);

  const metrics: { label: string; av: number; bv: number; fmt?: (n: number) => string }[] = [
    { label: t("player.honorIndex"), av: honorScore(a), bv: honorScore(b), fmt: formatNumber },
    { label: t("player.statWorld"), av: aCounts.worlds, bv: bCounts.worlds },
    { label: t("player.statMsi"), av: aCounts.msi, bv: bCounts.msi },
    { label: t("player.statRegional"), av: aCounts.regional, bv: bCounts.regional },
    ...AXES.map((axis, i) => ({ label: t(`axis.${axis}`), av: aAxes[i], bv: bAxes[i] })),
  ];

  return (
    <div className="space-y-4">
      <header className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{t("compare.eyebrow")}</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">{t("compare.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{t("compare.desc")}</p>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <PlayerCard player={a} dotClass="bg-accent" selectValue={aId} onSelect={setAId} exclude={bId} />
        <PlayerCard player={b} dotClass="bg-[var(--fg-3)]" selectValue={bId} onSelect={setBId} exclude={aId} align="right" />
      </div>

      <Card className="p-2">
        <CompareRadar a={{ label: a.name, values: aAxes }} b={{ label: b.name, values: bAxes }} />
      </Card>

      <Card className="divide-y divide-border">
        {metrics.map((m) => {
          const aWin = m.av > m.bv;
          const bWin = m.bv > m.av;
          const fmt = m.fmt ?? ((n: number) => String(n));
          return (
            <div key={m.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-2.5">
              <div
                className={cn(
                  "tnum text-right text-sm",
                  aWin ? "font-semibold text-accent" : "text-fg-muted"
                )}
              >
                {fmt(m.av)}
              </div>
              <div className="w-28 text-center text-xs text-fg-subtle">{m.label}</div>
              <div
                className={cn(
                  "tnum text-left text-sm",
                  bWin ? "font-semibold text-fg" : "text-fg-muted"
                )}
              >
                {fmt(m.bv)}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function PlayerCard({
  player,
  dotClass,
  selectValue,
  onSelect,
  exclude,
  align = "left",
}: {
  player: ReturnType<typeof getPlayer>;
  dotClass: string;
  selectValue: string;
  onSelect: (v: string) => void;
  exclude: string;
  align?: "left" | "right";
}) {
  if (!player) return null;
  return (
    <Card className="p-4">
      <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse text-right")}>
        <PlayerAvatar id={player.id} name={player.name} photo={player.photo} size={44} />
        <div className={cn("min-w-0 flex-1", align === "right" && "flex flex-col items-end")}>
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", dotClass)} />
            <span className="truncate font-medium text-fg">{player.name}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <RegionBadge region={player.region} />
            <RoleBadge role={player.role} />
          </div>
        </div>
      </div>
      <div className="relative mt-3">
        <select
          value={selectValue}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none rounded-lg border border-border bg-surface-2 px-3 py-2 pr-9 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
        >
          {REGIONS.map((r) => (
            <optgroup key={r} label={r}>
              {PLAYERS.filter((p) => p.region === r).map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === exclude}>
                  {p.name} · {p.team}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
      </div>
    </Card>
  );
}
