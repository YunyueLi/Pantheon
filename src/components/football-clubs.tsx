"use client";

import { useState } from "react";
import Link from "next/link";
import { clubHonor, clubPlayers, getClub, rankedClubs, type Club, type Confederation } from "@/lib/sport/football/clubs";
import { FOOTBALL_LEAGUES } from "@/lib/sport/football/model";
import { BackButton } from "@/components/back-button";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge } from "@/components/badges";
import { Pills } from "@/components/pills";
import { TrophyIcon } from "@/components/trophy-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { getSport } from "@/lib/sport/registry";

function labels(locale: string) {
  return locale === "zh"
    ? {
        title: "顶尖俱乐部",
        desc: "按欧冠/解放者杯、洲际杯赛与联赛冠军综合加权衡量的最具荣誉俱乐部。",
        ucl: "欧冠",
        libertadores: "解放者杯",
        league: "联赛冠军",
        inter: "洲际/世俱杯",
        europa: "欧联杯",
        roster: "代表球员",
        honor: "荣誉指数",
        all: "全部",
        europe: "欧洲",
        southAm: "南美",
        method: "排名方法",
        methodBody:
          "欧冠 ×100、解放者杯 ×32、洲际杯/世俱杯 ×30、欧联杯 ×18；联赛冠军 ×10 并按联赛强度加权（英超/西甲/意甲/德甲 1.0，法甲 0.85，葡超/荷甲 0.55，巴西 0.50，阿根廷 0.45，其余弱势联赛 0.12）。每家俱乐部数据均逐一核对维基百科，截至 2025 年 8 月 1 日（含 2024-25 赛季与 2025 年世俱杯）。",
      }
    : {
        title: "Top clubs",
        desc: "The most decorated clubs, weighted across continental, intercontinental and league honors.",
        ucl: "Champions League",
        libertadores: "Libertadores",
        league: "League titles",
        inter: "Intercontinental",
        europa: "Europa League",
        roster: "Notable players",
        honor: "Honor Index",
        all: "All",
        europe: "Europe",
        southAm: "South America",
        method: "How we rank",
        methodBody:
          "Champions League ×100, Copa Libertadores ×32, Intercontinental / Club World Cup ×30, Europa League ×18; league titles ×10 scaled by league strength (PL / LaLiga / Serie A / Bundesliga 1.0, Ligue 1 0.85, Primeira / Eredivisie 0.55, Brazil 0.50, Argentina 0.45, other weaker leagues 0.12). Every club verified against Wikipedia, as of 1 August 2025 (incl. the 2024-25 season and the 2025 Club World Cup).",
      };
}

const CLUB_ZH: Record<string, string> = {
  "real-madrid": "皇家马德里", barcelona: "巴塞罗那", "atletico-madrid": "马德里竞技",
  sevilla: "塞维利亚", valencia: "瓦伦西亚",
  bayern: "拜仁慕尼黑", dortmund: "多特蒙德", hamburg: "汉堡",
  psg: "巴黎圣日耳曼", marseille: "马赛",
  "ac-milan": "AC米兰", inter: "国际米兰", juventus: "尤文图斯", napoli: "那不勒斯",
  liverpool: "利物浦", "man-united": "曼联", "man-city": "曼城", arsenal: "阿森纳",
  chelsea: "切尔西", tottenham: "托特纳姆热刺", "nottingham-forest": "诺丁汉森林",
  "aston-villa": "阿斯顿维拉",
  benfica: "本菲卡", porto: "波尔图", ajax: "阿贾克斯", feyenoord: "费耶诺德", psv: "埃因霍温",
  celtic: "凯尔特人", "red-star": "贝尔格莱德红星", steaua: "布加勒斯特星",
  "boca-juniors": "博卡青年", "river-plate": "河床", independiente: "独立队", estudiantes: "拉普拉塔大学生",
  "sao-paulo": "圣保罗", santos: "桑托斯", palmeiras: "帕尔梅拉斯", corinthians: "科林蒂安",
  flamengo: "弗拉门戈", gremio: "格雷米奥", internacional: "巴西国际", cruzeiro: "克鲁塞罗",
  penarol: "佩纳罗尔", "nacional-uru": "民族队", olimpia: "奥林匹亚", "atletico-nacional": "国民竞技",
};

/** Display labels for the non-modeled leagues that only appear on the clubs page. */
const EXTRA_LEAGUE_LABEL: Record<string, { en: string; zh: string }> = {
  SCO: { en: "Scottish Premiership", zh: "苏格兰超级联赛" },
  SRB: { en: "Serbian SuperLiga", zh: "塞尔维亚超级联赛" },
  ROU: { en: "Liga I (Romania)", zh: "罗马尼亚甲级联赛" },
};

/** Trophies that actually apply to a club, gold-chip ordered, zero counts dropped. */
function trophyChips(c: Club) {
  return [
    { type: "champions_league", n: c.championsLeague },
    { type: "copa_libertadores", n: c.libertadores },
    { type: "league_title", n: c.leagueTitles },
    { type: "club_world_cup", n: c.intercontinental },
    { type: "europa_league", n: c.europa },
  ].filter((x) => x.n > 0);
}

export function FootballClubsList() {
  const { t, locale } = useI18n();
  const L = labels(locale);
  const [conf, setConf] = useState<"ALL" | Confederation>("ALL");
  const clubName = (c: { id: string; name: string }) => (locale === "zh" && CLUB_ZH[c.id]) || c.name;
  const leagueLabel = (id: string) => {
    const extra = EXTRA_LEAGUE_LABEL[id];
    if (extra) return locale === "zh" ? extra.zh : extra.en;
    const v = t(`league.${id}`);
    return v !== `league.${id}` ? v : FOOTBALL_LEAGUES.find((l) => l.id === id)?.label ?? id;
  };
  const regionName = (c: Club) => (c.confederation === "CONMEBOL" ? L.southAm : leagueLabel(c.league));
  const clubs = rankedClubs(conf === "ALL" ? undefined : conf);
  const confOpts = [
    { value: "ALL", label: L.all },
    { value: "UEFA", label: L.europe },
    { value: "CONMEBOL", label: L.southAm },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{L.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{L.desc}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Pills options={confOpts} value={conf} onChange={(v) => setConf(v as "ALL" | Confederation)} size="sm" />
        <details className="group max-w-xl text-sm text-fg-muted">
          <summary className="cursor-pointer select-none text-[13px] font-medium text-fg-subtle transition-colors hover:text-fg">
            {L.method}
          </summary>
          <p className="mt-2 leading-relaxed">{L.methodBody}</p>
        </details>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  <RegionBadge region={regionName(club)} />
                </div>
              </div>
              <div className="tnum shrink-0 text-right text-sm font-semibold text-accent">{formatNumber(honor)}</div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-fg-muted">
              {trophyChips(club).map((c) => (
                <span key={c.type} className="inline-flex items-center gap-1">
                  <TrophyIcon type={c.type} size={16} className="text-[color:var(--medal-gold)]" />
                  <span className="tnum text-xs">{c.n}</span>
                </span>
              ))}
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
    const extra = EXTRA_LEAGUE_LABEL[lid];
    if (extra) return locale === "zh" ? extra.zh : extra.en;
    const v = t(`league.${lid}`);
    return v !== `league.${lid}` ? v : FOOTBALL_LEAGUES.find((l) => l.id === lid)?.label ?? lid;
  };
  const mergedById = new Map(getSport("football")!.players.map((m) => [m.id, m] as const));
  const name = (e: { id: string; name: string; i18n?: Record<string, string> }) =>
    mergedById.get(e.id)?.i18n?.[locale] ?? e.i18n?.[locale] ?? e.name;
  const club = getClub(id);
  if (!club) return null;
  const honor = clubHonor(club);
  const players = clubPlayers(club);
  const regionName = club.confederation === "CONMEBOL" ? L.southAm : leagueLabel(club.league);
  const groups = [
    { type: "champions_league" as const, label: L.ucl, n: club.championsLeague },
    { type: "copa_libertadores" as const, label: L.libertadores, n: club.libertadores },
    { type: "league_title" as const, label: L.league, n: club.leagueTitles },
    { type: "club_world_cup" as const, label: L.inter, n: club.intercontinental },
    { type: "europa_league" as const, label: L.europa, n: club.europa },
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
                <RegionBadge region={regionName} />
              </div>
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">{L.honor}</div>
            <div className="tnum text-4xl font-semibold leading-none text-accent">{formatNumber(honor)}</div>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
