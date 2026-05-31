"use client";

import Link from "next/link";
import { clubHonor, clubPlayers, getClub, rankedClubs } from "@/lib/sport/football/clubs";
import { FOOTBALL_LEAGUES } from "@/lib/sport/football/model";
import { BackButton } from "@/components/back-button";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge } from "@/components/badges";
import { TrophyIcon } from "@/components/trophy-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

function labels(locale: string) {
  return locale === "zh"
    ? {
        title: "顶尖俱乐部",
        desc: "按洲际与国内冠军衡量最具荣誉的俱乐部。",
        league: "联赛冠军",
        continental: "洲际冠军",
        inter: "洲际杯赛",
        roster: "代表球员",
        honor: "荣誉指数",
      }
    : {
        title: "Top clubs",
        desc: "The most decorated clubs by continental and domestic honors.",
        league: "League titles",
        continental: "Continental",
        inter: "Intercontinental",
        roster: "Notable players",
        honor: "Honor Index",
      };
}

const CLUB_ZH: Record<string, string> = {
  "real-madrid": "皇家马德里", barcelona: "巴塞罗那", "atletico-madrid": "马德里竞技",
  bayern: "拜仁慕尼黑", dortmund: "多特蒙德", "ac-milan": "AC米兰", inter: "国际米兰",
  juventus: "尤文图斯", liverpool: "利物浦", "man-united": "曼联", "man-city": "曼城",
  arsenal: "阿森纳", chelsea: "切尔西", benfica: "本菲卡", porto: "波尔图", ajax: "阿贾克斯",
  "boca-juniors": "博卡青年", "river-plate": "河床",
};

export function FootballClubsList() {
  const { t, locale } = useI18n();
  const L = labels(locale);
  const clubName = (c: { id: string; name: string }) => (locale === "zh" && CLUB_ZH[c.id]) || c.name;
  const leagueLabel = (id: string) => {
    const v = t(`league.${id}`);
    return v !== `league.${id}` ? v : FOOTBALL_LEAGUES.find((l) => l.id === id)?.label ?? id;
  };
  const clubs = rankedClubs();
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{L.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{L.desc}</p>
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map(({ club, honor, rank }) => (
          <Link
            key={club.id}
            href={`/football/clubs/${club.id}`}
            className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-border-strong"
          >
            <div className="flex items-center gap-3">
              <span className="tnum w-5 shrink-0 text-right text-sm text-fg-subtle">{rank}</span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 font-mono text-sm font-semibold text-fg-muted">
                {club.code}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold tracking-tight group-hover:text-accent">{clubName(club)}</div>
                <div className="mt-1">
                  <RegionBadge region={leagueLabel(club.league)} />
                </div>
              </div>
              <div className="tnum shrink-0 text-right text-sm font-semibold text-accent">{formatNumber(honor)}</div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-fg-muted">
              {club.continental > 0 && (
                <span className="inline-flex items-center gap-1">
                  <TrophyIcon type="champions_league" size={16} className="text-[color:var(--medal-gold)]" />
                  <span className="tnum text-xs">{club.continental}</span>
                </span>
              )}
              {club.leagueTitles > 0 && (
                <span className="inline-flex items-center gap-1">
                  <TrophyIcon type="league_title" size={16} className="text-[color:var(--medal-gold)]" />
                  <span className="tnum text-xs">{club.leagueTitles}</span>
                </span>
              )}
              {club.intercontinental > 0 && (
                <span className="inline-flex items-center gap-1">
                  <TrophyIcon type="club_world_cup" size={16} className="text-[color:var(--medal-gold)]" />
                  <span className="tnum text-xs">{club.intercontinental}</span>
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FootballClubProfile({ id }: { id: string }) {
  const { t, locale } = useI18n();
  const L = labels(locale);
  const clubName = (c: { id: string; name: string }) => (locale === "zh" && CLUB_ZH[c.id]) || c.name;
  const leagueLabel = (lid: string) => {
    const v = t(`league.${lid}`);
    return v !== `league.${lid}` ? v : FOOTBALL_LEAGUES.find((l) => l.id === lid)?.label ?? lid;
  };
  const name = (e: { name: string; i18n?: Record<string, string> }) => e.i18n?.[locale] ?? e.name;
  const club = getClub(id);
  if (!club) return null;
  const honor = clubHonor(club);
  const players = clubPlayers(club);
  const groups = [
    { type: "champions_league" as const, label: L.continental, n: club.continental },
    { type: "league_title" as const, label: L.league, n: club.leagueTitles },
    { type: "club_world_cup" as const, label: L.inter, n: club.intercontinental },
  ].filter((g) => g.n > 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <BackButton fallback="/football/clubs" />

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surface-2 font-mono text-xl font-semibold text-fg-muted">
              {club.code}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight">{clubName(club)}</h1>
                <RegionBadge region={leagueLabel(club.league)} />
              </div>
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">{L.honor}</div>
            <div className="tnum text-4xl font-semibold leading-none text-accent">{formatNumber(honor)}</div>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {groups.map((g) => (
          <div key={g.type} className="rounded-xl border border-transparent bg-[color:var(--gold-soft)] p-3.5">
            <div className="flex items-center justify-between">
              <TrophyIcon type={g.type} size={30} className="text-[color:var(--medal-gold)]" />
              <span className="tnum text-2xl font-semibold leading-none text-[color:var(--medal-gold)]">{g.n}</span>
            </div>
            <div className="mt-2.5 text-[13px] font-medium leading-tight text-fg">{g.label}</div>
          </div>
        ))}
      </div>

      {players.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{L.roster}</CardTitle>
            <span className="tnum text-[11px] text-fg-subtle">{players.length}</span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {players.map((p) => (
                <Link
                  key={p.id}
                  href={`/football/players/${p.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2 transition-colors hover:border-border-strong"
                  )}
                >
                  <PlayerAvatar id={p.id} name={p.name} photo={p.photo} size={32} />
                  <span className="truncate text-sm font-medium text-fg">{name(p)}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
