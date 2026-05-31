"use client";

import { cabinet } from "@/lib/sport/honor";
import type { Achievement, Player } from "@/lib/sport/types";
import { useSport, useHonorLabel } from "@/lib/sport/provider";
import { cn } from "@/lib/utils";
import { TrophyIcon, trophyTone } from "@/components/trophy-icon";

/** Group a type's wins by the club they were won with, earliest club first. */
function byTeam(items: Achievement[]): { team: string | null; years: number[] }[] {
  const map = new Map<string | null, number[]>();
  for (const a of items) {
    const key = a.team ?? null;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a.year);
  }
  return [...map.entries()]
    .map(([team, years]) => ({ team, years: years.sort((x, y) => x - y) }))
    .sort((a, b) => a.years[0] - b.years[0]);
}

export function TrophyCabinet({ player }: { player: Player }) {
  const { config } = useSport();
  const honorLabel = useHonorLabel();
  const marquee = config.headlineTypes[0];
  const groups = cabinet(player, config.model);
  if (groups.length === 0) {
    return <p className="text-sm text-fg-subtle">—</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {groups.map((g) => {
        const isMarquee = g.type === marquee;
        const tone = trophyTone(g.type);
        const teams = byTeam(g.items);
        return (
          <div
            key={g.type}
            className={cn(
              "rounded-xl border p-3.5",
              isMarquee ? "border-transparent bg-[color:var(--gold-soft)]" : "border-border bg-surface-2"
            )}
          >
            <div className="flex items-center justify-between">
              <TrophyIcon type={g.type} size={32} className={tone} />
              <span
                className={cn(
                  "tnum text-2xl font-semibold leading-none",
                  isMarquee ? "text-[color:var(--medal-gold)]" : "text-fg"
                )}
              >
                {g.items.length}
              </span>
            </div>
            <div className="mt-2.5 text-[13px] font-medium leading-tight text-fg">{honorLabel(g.type)}</div>
            <div className="mt-2 space-y-1.5">
              {teams.map((grp, gi) => (
                <div key={gi}>
                  {grp.team && (
                    <div className="truncate text-[11px] font-medium leading-tight text-fg-muted">{grp.team}</div>
                  )}
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {grp.years.map((y, i) => (
                      <span key={i} className="tnum rounded bg-surface px-1 py-0.5 text-[10px] text-fg-subtle">
                        {`'${String(y).slice(2)}`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
