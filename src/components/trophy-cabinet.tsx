"use client";

import { cabinet } from "@/lib/sport/honor";
import type { Achievement, Player } from "@/lib/sport/types";
import { useSport, useHonorLabel } from "@/lib/sport/provider";
import { localizeTeam } from "@/lib/sport/football/clubs";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { TrophyIcon, trophyTone } from "@/components/trophy-icon";

/** Group a type's wins by the club they were won with, earliest club first.
 *  Each win keeps its real year and per-year count (e.g. an F1 season's 5 wins). */
function byTeam(items: Achievement[]): { team: string | null; wins: { year: number; count: number }[] }[] {
  const map = new Map<string | null, { year: number; count: number }[]>();
  for (const a of items) {
    const key = a.team ?? null;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push({ year: a.year, count: a.count ?? 1 });
  }
  return [...map.entries()]
    .map(([team, wins]) => ({ team, wins: wins.sort((x, y) => x.year - y.year) }))
    .sort((a, b) => a.wins[0].year - b.wins[0].year);
}

export function TrophyCabinet({ player }: { player: Player }) {
  const { config } = useSport();
  const honorLabel = useHonorLabel();
  const { locale } = useI18n();
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
        const total = g.items.reduce((s, a) => s + (a.count ?? 1), 0);
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
                {total}
              </span>
            </div>
            <div className="mt-2.5 text-[13px] font-medium leading-tight text-fg">{honorLabel(g.type)}</div>
            <div className="mt-2 space-y-1.5">
              {teams.map((grp, gi) => (
                <div key={gi}>
                  {grp.team && (
                    <div className="truncate text-[11px] font-medium leading-tight text-fg-muted">
                      {localizeTeam(grp.team, locale)}
                    </div>
                  )}
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {grp.wins.map((w, i) => (
                      <span key={i} className="tnum rounded bg-surface px-1 py-0.5 text-[10px] text-fg-subtle">
                        {`'${String(w.year).slice(2)}`}
                        {w.count > 1 && <span className="text-fg-muted">×{w.count}</span>}
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
