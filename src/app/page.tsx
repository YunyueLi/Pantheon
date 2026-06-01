"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Gauge, SlidersHorizontal, Swords, Trophy } from "lucide-react";
import { listSports } from "@/lib/sport/registry";
import { ranked, countType } from "@/lib/sport/honor";
import { localizeTeam } from "@/lib/sport/football/clubs";
import { TrophyIcon } from "@/components/trophy-icon";
import { Button } from "@/components/ui/button";
import { PlayerAvatar } from "@/components/player-avatar";
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
  const { t, locale } = useI18n();
  const name = (e: { name: string; i18n?: Record<string, string> }) => e.i18n?.[locale] ?? e.name;
  const sports = listSports();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {t("nav.lol")}
            <span className="text-fg-subtle/70">· {t("nav.football")}</span>
            <span className="text-fg-subtle/70">· {t("nav.basketball")}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">{t("home.heroDesc")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/lol/leaderboard">
                {t("nav.lol")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/football/leaderboard">
                {t("nav.football")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* GOAT spotlight — each sport's all-time #1 by Honor Index. */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sports.map((s) => {
              const goat = ranked(s.players, s.model)[0];
              if (!goat) return null;
              const p = goat.player;
              const marquee = s.headlineTypes[0];
              const n = countType(p, marquee);
              return (
                <Link
                  key={s.id}
                  href={`${s.basePath}/players/${p.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/80 p-4 shadow-card backdrop-blur transition-colors hover:border-border-strong"
                >
                  <PlayerAvatar id={p.id} name={p.name} photo={p.photo} size={60} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                      {t(`nav.${s.id}`)} · GOAT
                    </div>
                    <div className="truncate text-lg font-semibold tracking-tight group-hover:text-accent">
                      {name(p)}
                    </div>
                    <div className="tnum mt-0.5 text-sm font-semibold text-accent">{formatNumber(goat.score)}</div>
                  </div>
                  {n > 0 && (
                    <div className="flex shrink-0 items-center gap-1 text-[color:var(--medal-gold)]">
                      <TrophyIcon type={marquee} size={18} />
                      <span className="tnum text-sm font-semibold">{n}</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-lg font-semibold tracking-tight">{t("home.topTitle")}</h2>
        <p className="mt-1 text-sm text-fg-muted">{t("home.topDesc")}</p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sports.map((s) => {
            const top = ranked(s.players, s.model).slice(0, 5);
            const maxScore = top[0]?.score ?? 1;
            return (
              <div key={s.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <span className="text-sm font-semibold tracking-tight">{t(`nav.${s.id}`)}</span>
                  <Link
                    href={`${s.basePath}/leaderboard`}
                    className="inline-flex items-center gap-1 text-xs text-fg-subtle transition-colors hover:text-fg"
                  >
                    {t("common.viewAll")} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {top.map((row, i) => (
                  <Link
                    key={row.player.id}
                    href={`${s.basePath}/players/${row.player.id}`}
                    className="flex items-center gap-4 border-b border-border/70 px-5 py-3 transition-colors last:border-0 hover:bg-surface-2"
                  >
                    <span className="tnum w-5 text-right text-sm text-fg-subtle">{i + 1}</span>
                    <PlayerAvatar id={row.player.id} name={row.player.name} photo={row.player.photo} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-fg">{name(row.player)}</div>
                      <div className="truncate text-xs text-fg-subtle">{localizeTeam(row.player.team, locale)}</div>
                    </div>
                    <div className="w-28 shrink-0">
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
            );
          })}
        </div>
      </div>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-16">
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
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t("home.ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted">{t("home.ctaDesc")}</p>
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
