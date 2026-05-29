"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { AchievementType } from "@/lib/types";
import { getTeam, teamHonor, teamPlayers } from "@/lib/teams";
import { TrophyIcon, trophyTone } from "@/components/trophy-icon";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, RoleBadge } from "@/components/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export function TeamProfile({ id }: { id: string }) {
  const { t } = useI18n();
  const team = getTeam(id);
  if (!team) return null;

  const honor = teamHonor(team);
  const players = teamPlayers(team);

  const allGroups: { type: AchievementType; years: number[] }[] = [
    { type: "worlds_title", years: team.worlds },
    { type: "msi_title", years: team.msi },
    { type: "first_stand_title", years: team.firstStand ?? [] },
    { type: "worlds_runnerup", years: team.worldsRunnerup ?? [] },
  ];
  const titleGroups = allGroups.filter((g) => g.years.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-fg-subtle transition-colors hover:text-fg"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("nav.explore")}
      </Link>

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surface-2 font-mono text-xl font-semibold text-fg-muted">
              {team.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
                <RegionBadge region={team.region} />
              </div>
              {team.aka && team.aka.length > 0 && (
                <p className="mt-1 text-sm text-fg-subtle">{team.aka.join(" · ")}</p>
              )}
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
              {t("player.honorIndex")}
            </div>
            <div className="tnum text-4xl font-semibold leading-none text-accent">{formatNumber(honor)}</div>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t("home.teamTitles")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {titleGroups.map((g) => {
              const gold = g.type !== "worlds_runnerup";
              return (
                <div
                  key={g.type}
                  className={cn(
                    "rounded-xl border p-3.5",
                    gold ? "border-transparent bg-[color:var(--gold-soft)]" : "border-border bg-surface-2"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <TrophyIcon type={g.type} size={30} className={trophyTone(g.type)} />
                    <span className={cn("tnum text-2xl font-semibold leading-none", gold && "text-[color:var(--medal-gold)]")}>
                      {g.years.length}
                    </span>
                  </div>
                  <div className="mt-2.5 text-[13px] font-medium leading-tight text-fg">
                    {t(`honorType.${g.type}`)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {g.years.map((y) => (
                      <span key={y} className="tnum rounded bg-surface px-1 py-0.5 text-[10px] text-fg-subtle">
                        {`'${String(y).slice(2)}`}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t("home.teamRoster")}</CardTitle>
          <span className="tnum text-[11px] text-fg-subtle">{players.length}</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {players.map((p) => (
              <Link
                key={p.id}
                href={`/lol/players/${p.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2 transition-colors hover:border-border-strong"
              >
                <PlayerAvatar id={p.id} name={p.name} size={32} />
                <span className="flex-1 truncate text-sm font-medium text-fg">{p.name}</span>
                <RoleBadge role={p.role} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
