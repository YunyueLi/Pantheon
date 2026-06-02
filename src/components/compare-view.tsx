"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { honorScore, normalizedAxes, countType, ranked } from "@/lib/sport/honor";
import type { Player } from "@/lib/sport/types";
import { useSport, useHonorLabel, useAxisLabel, useName, useLeagueLabel } from "@/lib/sport/provider";
import { cn, formatNumber } from "@/lib/utils";
import { PlayerAvatar } from "@/components/player-avatar";
import { PlayerPicker } from "@/components/player-picker";
import { RegionBadge, PositionBadge } from "@/components/badges";
import { CompareRadar } from "@/components/compare-radar";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";

export function CompareView() {
  const { t } = useI18n();
  const { config } = useSport();
  const { players, model, headlineTypes } = config;
  const honorLabel = useHonorLabel();
  const axisLabel = useAxisLabel();
  const name = useName();
  const sp = useSearchParams();
  const has = (id: string) => players.some((p) => p.id === id);
  const rankedRows = useMemo(() => ranked(players, model), [players, model]);
  const [aId, setAId] = useState(() => (has(sp.get("a") ?? "") ? (sp.get("a") as string) : rankedRows[0]?.player.id));
  const [bId, setBId] = useState(() => (has(sp.get("b") ?? "") ? (sp.get("b") as string) : rankedRows[1]?.player.id));
  const a = players.find((p) => p.id === aId)!;
  const b = players.find((p) => p.id === bId)!;

  const aAxes = useMemo(() => normalizedAxes(a, players, model).map((d) => d.value), [aId]); // eslint-disable-line react-hooks/exhaustive-deps
  const bAxes = useMemo(() => normalizedAxes(b, players, model).map((d) => d.value), [bId]); // eslint-disable-line react-hooks/exhaustive-deps

  const metrics: { label: string; av: number; bv: number; fmt?: (n: number) => string }[] = [
    { label: t("player.honorIndex"), av: honorScore(a, model), bv: honorScore(b, model), fmt: formatNumber },
    ...headlineTypes.map((type) => ({ label: honorLabel(type), av: countType(a, type), bv: countType(b, type) })),
    ...model.axes.map((ax, i) => ({ label: axisLabel(ax.id, ax.label), av: aAxes[i], bv: bAxes[i] })),
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

      <Card className="grid place-items-center p-2">
        <CompareRadar a={{ label: name(a), values: aAxes }} b={{ label: name(b), values: bAxes }} axes={model.axes} />
      </Card>

      <Card className="divide-y divide-border">
        <div className="flex items-center justify-between px-5 py-3 text-sm font-medium">
          <span className="flex items-center gap-1.5 text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {name(a)}
          </span>
          <span className="flex items-center gap-1.5 text-fg">
            {name(b)}
            <span className="h-2 w-2 rounded-full bg-[var(--fg-3)]" />
          </span>
        </div>
        {metrics.map((m) => {
          const aWin = m.av > m.bv;
          const bWin = m.bv > m.av;
          const fmt = m.fmt ?? ((n: number) => String(n));
          const max = Math.max(m.av, m.bv, 1);
          return (
            <div key={m.label} className="px-5 py-3">
              <div className="mb-1.5 text-center text-[11px] uppercase tracking-wide text-fg-subtle">{m.label}</div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "tnum w-14 shrink-0 text-right text-sm sm:w-16",
                    aWin ? "font-semibold text-accent" : "text-fg-muted"
                  )}
                >
                  {fmt(m.av)}
                </span>
                <div className="flex flex-1 items-center gap-1" aria-hidden>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-l-full bg-surface-2">
                    <div
                      className="absolute inset-y-0 right-0 rounded-l-full bg-accent transition-[width]"
                      style={{ width: `${(m.av / max) * 100}%` }}
                    />
                  </div>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-r-full bg-surface-2">
                    <div
                      className="absolute inset-y-0 left-0 rounded-r-full bg-[var(--fg-3)] transition-[width]"
                      style={{ width: `${(m.bv / max) * 100}%` }}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    "tnum w-14 shrink-0 text-left text-sm sm:w-16",
                    bWin ? "font-semibold text-fg" : "text-fg-muted"
                  )}
                >
                  {fmt(m.bv)}
                </span>
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
  player: Player;
  dotClass: string;
  selectValue: string;
  onSelect: (v: string) => void;
  exclude: string;
  align?: "left" | "right";
}) {
  const { positionMeta } = useSport();
  const name = useName();
  const leagueLabel = useLeagueLabel();
  if (!player) return null;
  return (
    <Card className="p-4">
      <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse text-right")}>
        <PlayerAvatar id={player.id} name={player.name} photo={player.photo} size={44} />
        <div className={cn("min-w-0 flex-1", align === "right" && "flex flex-col items-end")}>
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", dotClass)} />
            <span className="truncate font-medium text-fg">{name(player)}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <RegionBadge region={leagueLabel(player.league)} />
            <PositionBadge abbr={positionMeta(player.position)?.abbr ?? player.position} />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <PlayerPicker value={selectValue} onSelect={onSelect} exclude={exclude} />
      </div>
    </Card>
  );
}
