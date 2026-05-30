"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Clock, GitCompareArrows } from "lucide-react";
import { PLAYERS, filterPlayers, getPlayer, percentile, ranked } from "@/lib/data";
import { BackButton } from "@/components/back-button";
import { teamIdFromName } from "@/lib/teams";
import { ACHIEVEMENT_META, achievementPoints, honorScore, titleCounts } from "@/lib/honor";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, RoleBadge } from "@/components/badges";
import { TrophyCabinet } from "@/components/trophy-cabinet";
import { TrophyIcon, trophyTone } from "@/components/trophy-icon";
import { HonorTimeline } from "@/components/honor-timeline";
import { HonorBreakdown } from "@/components/honor-breakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export function PlayerProfile({ id }: { id: string }) {
  const { t, locale } = useI18n();
  const player = getPlayer(id);
  if (!player) return null;

  const teamId = teamIdFromName(player.team);
  const score = honorScore(player);
  const overall = ranked(PLAYERS).find((r) => r.player.id === player.id)!;
  const roleRank = ranked(filterPlayers({ role: player.role })).find((r) => r.player.id === player.id)!;
  const regionRank = ranked(filterPlayers({ region: player.region })).find((r) => r.player.id === player.id)!;
  const pct = percentile(player, filterPlayers({ role: player.role }));
  const counts = titleCounts(player);

  const honors = player.achievements
    .map((a) => ({ a, pts: achievementPoints(a) }))
    .sort((x, y) => y.a.year - x.a.year || y.pts - x.pts);

  const lastYear = Math.max(...player.achievements.map((a) => a.year));

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <BackButton fallback="/lol/leaderboard" />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <PlayerAvatar id={player.id} name={player.name} photo={player.photo} size={64} />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight">{player.name}</h1>
                <RegionBadge region={player.region} />
                <RoleBadge role={player.role} />
                {!player.active && (
                  <span className="text-[10px] uppercase tracking-wide text-fg-subtle">{t("common.retired")}</span>
                )}
              </div>
              {player.realName && <p className="mt-0.5 text-sm text-fg-subtle">{player.realName}</p>}
              <p className="mt-2 text-sm text-fg-muted">
                {teamId ? (
                  <Link href={`/lol/teams/${teamId}`} className="transition-colors hover:text-fg">
                    {player.team}
                  </Link>
                ) : (
                  player.team
                )}{" "}
                · {t(`regionCountry.${player.region}`)} · {t("common.debut", { y: player.debutYear })}
              </p>
              {locale === "en" && player.blurb && (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">{player.blurb}</p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            <div className="md:text-right">
              <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                {t("player.honorIndex")}
              </div>
              <div className="tnum text-4xl font-semibold leading-none text-accent">{formatNumber(score)}</div>
              <div className="mt-1.5 text-xs text-fg-muted">
                {t("player.topPct", { p: Math.max(1, 100 - pct), role: t(`role.${player.role}`) })}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <RankChip label={t("player.rankOverall")} value={overall.rank} />
              <RankChip label={t(`role.${player.role}`)} value={roleRank.rank} />
              <RankChip label={player.region} value={regionRank.rank} />
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/compare?a=${player.id}`}>
                <GitCompareArrows className="h-3.5 w-3.5" /> {t("player.compare")}
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label={t("player.statWorld")}
          value={counts.worlds}
          gold
          icon={<TrophyIcon type="worlds_title" size={22} className="text-[color:var(--medal-gold)]" />}
        />
        <StatTile
          label={t("player.statMsi")}
          value={counts.msi}
          icon={<TrophyIcon type="msi_title" size={22} className="text-[color:var(--medal-gold)]" />}
        />
        <StatTile
          label={t("player.statRegional")}
          value={counts.regional}
          icon={<TrophyIcon type="regional_title" size={22} className="text-[color:var(--medal-gold)]" />}
        />
        <StatTile
          label={t("player.statSeasons")}
          value={lastYear - player.debutYear + 1}
          icon={<Clock className="h-[22px] w-[22px] text-fg-subtle" />}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("player.careerTimeline")}</CardTitle>
            <span className="text-[11px] text-fg-subtle">{t("player.timelineHint")}</span>
          </CardHeader>
          <CardContent>
            <HonorTimeline player={player} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("player.indexComposition")}</CardTitle>
          </CardHeader>
          <CardContent>
            <HonorBreakdown player={player} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t("player.trophyCabinet")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TrophyCabinet player={player} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t("player.allHonors")}</CardTitle>
          <span className="tnum text-[11px] text-fg-subtle">{t("common.entries", { n: honors.length })}</span>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <table className="w-full">
            <thead>
              <tr className="border-y border-border text-[11px] uppercase tracking-wide text-fg-subtle">
                <th className="px-5 py-2 text-left font-medium">{t("player.colYear")}</th>
                <th className="px-2 py-2 text-left font-medium">{t("player.colHonor")}</th>
                <th className="px-2 py-2 text-left font-medium">{t("player.colTeam")}</th>
                <th className="px-2 py-2 text-center font-medium">{t("player.colTier")}</th>
                <th className="px-5 py-2 text-right font-medium">{t("player.colPoints")}</th>
              </tr>
            </thead>
            <tbody>
              {honors.map(({ a, pts }, i) => {
                const meta = ACHIEVEMENT_META[a.type];
                return (
                  <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-surface-2">
                    <td className="tnum px-5 py-2.5 text-sm text-fg-muted">{a.year}</td>
                    <td className="px-2 py-2.5">
                      <span className="flex items-center gap-2">
                        <TrophyIcon type={a.type} size={18} className={trophyTone(a.type)} />
                        <span className="text-sm text-fg">{t(`honorType.${a.type}`)}</span>
                        {typeof a.share === "number" && (
                          <span className="tnum text-[11px] text-fg-subtle">
                            {a.share.toFixed(2)} {t("common.share")}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-sm text-fg-subtle">{a.team ?? "—"}</td>
                    <td className="px-2 py-2.5 text-center">
                      <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle">
                        {meta.tier}
                      </span>
                    </td>
                    <td className="tnum px-5 py-2.5 text-right text-sm font-medium text-fg">{formatNumber(pts)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function RankChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs">
      <span className="tnum font-semibold text-fg">#{value}</span>
      <span className="text-fg-subtle">{label}</span>
    </span>
  );
}

function StatTile({
  label,
  value,
  icon,
  gold,
}: {
  label: string;
  value: number;
  icon?: ReactNode;
  gold?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
      {icon && <div className="mb-2">{icon}</div>}
      <div
        className={`tnum text-2xl font-semibold ${gold && value > 0 ? "text-[color:var(--medal-gold)]" : "text-fg"}`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-fg-subtle">{label}</div>
    </div>
  );
}
