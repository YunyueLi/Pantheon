"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Gauge, SlidersHorizontal, Swords, Trophy } from "lucide-react";
import { PLAYERS, filterPlayers, ranked } from "@/lib/data";
import { REGIONS, ROLES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, RoleBadge } from "@/components/badges";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

const GITHUB_URL = "https://github.com/YunyueLi/Pantheon";

const FEATURES = [
  { icon: Gauge, t: "home.f1t", d: "home.f1d" },
  { icon: SlidersHorizontal, t: "home.f2t", d: "home.f2d" },
  { icon: Trophy, t: "home.f3t", d: "home.f3d" },
  { icon: Swords, t: "home.f4t", d: "home.f4d" },
] as const;

export default function Home() {
  const { t } = useI18n();
  const top = ranked(PLAYERS).slice(0, 6);
  const maxScore = top[0].score;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {t("home.eyebrow")}
            <span className="text-fg-subtle/70">· {t("home.moreSoon")}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">{t("home.heroDesc")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/lol/leaderboard">
                {t("home.exploreCta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/compare">{t("home.compareCta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <h2 className="text-lg font-semibold tracking-tight">{t("home.whyTitle")}</h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <f.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-sm font-semibold text-fg">{t(f.t)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{t(f.d)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t("home.topTitle")}</h2>
            <p className="mt-1 text-sm text-fg-muted">{t("home.topDesc")}</p>
          </div>
          <Link
            href="/lol/leaderboard"
            className="inline-flex items-center gap-1 text-sm text-fg-subtle transition-colors hover:text-fg"
          >
            {t("common.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          {top.map((row, i) => (
            <Link
              key={row.player.id}
              href={`/lol/players/${row.player.id}`}
              className="flex items-center gap-4 border-b border-border/70 px-4 py-3 transition-colors last:border-0 hover:bg-surface-2"
            >
              <span className="tnum w-5 text-right text-sm text-fg-subtle">{i + 1}</span>
              <PlayerAvatar id={row.player.id} name={row.player.name} photo={row.player.photo} size={36} />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-fg">{row.player.name}</div>
                <div className="text-xs text-fg-subtle">{row.player.team}</div>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <RegionBadge region={row.player.region} />
                <RoleBadge role={row.player.role} />
              </div>
              <div className="w-36 shrink-0">
                <div className="tnum text-right text-sm font-semibold text-fg">{formatNumber(row.score)}</div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(row.score / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 text-lg font-semibold tracking-tight">{t("home.browseRegion")}</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {REGIONS.map((r) => {
            const pool = filterPlayers({ region: r });
            const leader = ranked(pool)[0]?.player;
            return (
              <Link
                key={r}
                href={`/lol/leaderboard?region=${r}`}
                className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-border-strong"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-semibold tracking-tight">{r}</span>
                  <span className="tnum text-xs text-fg-subtle">{t("common.players", { n: pool.length })}</span>
                </div>
                <div className="mt-1 text-xs text-fg-subtle">{t(`regionCountry.${r}`)}</div>
                {leader && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
                    <PlayerAvatar id={leader.id} name={leader.name} photo={leader.photo} size={24} />
                    <span className="truncate group-hover:text-fg">{leader.name}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <h2 className="mt-12 text-lg font-semibold tracking-tight">{t("home.browseRole")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <Link
              key={role}
              href={`/lol/leaderboard?role=${role}`}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-fg-muted shadow-card transition-colors hover:border-border-strong hover:text-fg"
            >
              {t(`role.${role}`)}
            </Link>
          ))}
        </div>
      </div>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t("home.ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
            {t("home.ctaDesc")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/lol/leaderboard">
                {t("home.exploreCta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                {t("home.github")} <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
