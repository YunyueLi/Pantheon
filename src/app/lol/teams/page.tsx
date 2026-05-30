"use client";

import Link from "next/link";
import { rankedTeams } from "@/lib/teams";
import { TrophyIcon } from "@/components/trophy-icon";
import { RegionBadge } from "@/components/badges";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export default function TeamsPage() {
  const { t } = useI18n();
  const teams = rankedTeams();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{t("home.eyebrow")}</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("nav.teams")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{t("home.teamsDesc")}</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map(({ team, honor, rank }) => {
          const counts = [
            { type: "worlds_title" as const, n: team.worlds.length },
            { type: "msi_title" as const, n: team.msi.length },
            { type: "ewc_title" as const, n: team.ewc?.length ?? 0 },
            { type: "first_stand_title" as const, n: team.firstStand?.length ?? 0 },
            { type: "worlds_runnerup" as const, n: team.worldsRunnerup?.length ?? 0 },
          ].filter((c) => c.n > 0);
          return (
            <Link
              key={team.id}
              href={`/lol/teams/${team.id}`}
              className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-border-strong"
            >
              <div className="flex items-center gap-3">
                <span className="tnum w-5 shrink-0 text-right text-sm text-fg-subtle">{rank}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 font-mono text-sm font-semibold text-fg-muted">
                  {team.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold tracking-tight group-hover:text-accent">{team.name}</div>
                  <div className="mt-1">
                    <RegionBadge region={team.region} />
                  </div>
                </div>
                <div className="tnum shrink-0 text-right text-sm font-semibold text-accent">{formatNumber(honor)}</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-fg-muted">
                {counts.length > 0 ? (
                  counts.map((c) => (
                    <span key={c.type} className="inline-flex items-center gap-1">
                      <TrophyIcon
                        type={c.type}
                        size={16}
                        className={c.type === "worlds_runnerup" ? "text-fg-subtle" : "text-[color:var(--medal-gold)]"}
                      />
                      <span className="tnum text-xs">{c.n}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-fg-subtle">—</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
