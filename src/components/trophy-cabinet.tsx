"use client";

import { cabinet } from "@/lib/sport/honor";
import type { Player } from "@/lib/sport/types";
import { useSport, useHonorLabel } from "@/lib/sport/provider";
import { cn } from "@/lib/utils";
import { TrophyIcon, trophyTone } from "@/components/trophy-icon";

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
            <div className="mt-2 flex flex-wrap gap-1">
              {g.items.map((a, i) => (
                <span
                  key={i}
                  className="tnum rounded bg-surface px-1 py-0.5 text-[10px] text-fg-subtle"
                >
                  {`'${String(a.year).slice(2)}`}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
