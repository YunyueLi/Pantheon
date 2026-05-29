"use client";

import { cabinet } from "@/lib/honor";
import type { Player } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TrophyIcon, trophyTone } from "@/components/trophy-icon";
import { useI18n } from "@/lib/i18n/provider";

export function TrophyCabinet({ player }: { player: Player }) {
  const { t } = useI18n();
  const groups = cabinet(player);
  if (groups.length === 0) {
    return <p className="text-sm text-fg-subtle">—</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {groups.map((g) => {
        const isWorlds = g.type === "worlds_title";
        const tone = trophyTone(g.type);
        return (
          <div
            key={g.type}
            className={cn(
              "rounded-xl border p-3.5",
              isWorlds ? "border-transparent bg-[color:var(--gold-soft)]" : "border-border bg-surface-2"
            )}
          >
            <div className="flex items-center justify-between">
              <TrophyIcon type={g.type} size={32} className={tone} />
              <span
                className={cn(
                  "tnum text-2xl font-semibold leading-none",
                  isWorlds ? "text-[color:var(--medal-gold)]" : "text-fg"
                )}
              >
                {g.items.length}
              </span>
            </div>
            <div className="mt-2.5 text-[13px] font-medium leading-tight text-fg">
              {t(`honorType.${g.type}`)}
            </div>
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
