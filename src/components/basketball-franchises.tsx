"use client";

import { useState } from "react";
import Link from "next/link";
import {
  franchiseHonor, franchisePlayers, getFranchise, rankedFranchises,
  type Conference, type Franchise,
} from "@/lib/sport/basketball/franchises";
import { BackButton } from "@/components/back-button";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge } from "@/components/badges";
import { Pills } from "@/components/pills";
import { TrophyIcon } from "@/components/trophy-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { getSport } from "@/lib/sport/registry";

function labels(locale: string) {
  return locale === "zh"
    ? {
        title: "豪门球队",
        desc: "按 NBA 总冠军与总决赛次数综合加权衡量的最具荣誉球队。",
        titles: "总冠军",
        finals: "总决赛次数",
        roster: "代表球员",
        honor: "荣誉指数",
        all: "全部",
        east: "东部",
        west: "西部",
        method: "排名方法",
        methodBody:
          "总冠军 ×100、总决赛次数 ×8。冠军数为「球队延续」口径(含历史搬迁/改名,湖人含明尼阿波利斯、勇士含费城等;ABA 冠军不计)。数据截至 2024-25 赛季(2025 年总决赛);从未进入总决赛的球队不计入。",
      }
    : {
        title: "Top franchises",
        desc: "The most decorated franchises, weighted by NBA titles and Finals appearances.",
        titles: "Titles",
        finals: "Finals",
        roster: "Notable players",
        honor: "Honor Index",
        all: "All",
        east: "East",
        west: "West",
        method: "How we rank",
        methodBody:
          "Titles ×100, Finals appearances ×8. Counts are franchise-continuous (relocations/renames included; ABA titles excluded). As of the 2024-25 season (2025 Finals); franchises that never reached the Finals are omitted.",
      };
}

const FRANCHISE_ZH: Record<string, string> = {
  "boston-celtics": "波士顿凯尔特人", "los-angeles-lakers": "洛杉矶湖人", "golden-state-warriors": "金州勇士",
  "chicago-bulls": "芝加哥公牛", "san-antonio-spurs": "圣安东尼奥马刺", "philadelphia-76ers": "费城76人",
  "detroit-pistons": "底特律活塞", "miami-heat": "迈阿密热火", "new-york-knicks": "纽约尼克斯",
  "oklahoma-city-thunder": "俄克拉荷马城雷霆", "houston-rockets": "休斯顿火箭", "milwaukee-bucks": "密尔沃基雄鹿",
  "cleveland-cavaliers": "克利夫兰骑士", "atlanta-hawks": "亚特兰大老鹰", "washington-wizards": "华盛顿奇才",
  "dallas-mavericks": "达拉斯独行侠", "portland-trail-blazers": "波特兰开拓者", "denver-nuggets": "丹佛掘金",
  "sacramento-kings": "萨克拉门托国王", "toronto-raptors": "多伦多猛龙", "phoenix-suns": "菲尼克斯太阳",
  "utah-jazz": "犹他爵士", "orlando-magic": "奥兰多魔术", "indiana-pacers": "印第安纳步行者",
  "brooklyn-nets": "布鲁克林篮网",
};

/** Trophy chips: titles (gold cup) + Finals appearances (outline cup); zero counts dropped. */
function trophyChips(f: Franchise) {
  return [
    { type: "nba_title", n: f.titles },
    { type: "finals_loss", n: f.finals },
  ].filter((x) => x.n > 0);
}

export function BasketballFranchisesList() {
  const { locale } = useI18n();
  const L = labels(locale);
  const [conf, setConf] = useState<"ALL" | Conference>("ALL");
  const fName = (f: { id: string; name: string }) => (locale === "zh" && FRANCHISE_ZH[f.id]) || f.name;
  const confName = (f: Franchise) => (f.conference === "East" ? L.east : L.west);
  const rows = rankedFranchises(conf === "ALL" ? undefined : conf);
  const confOpts = [
    { value: "ALL", label: L.all },
    { value: "East", label: L.east },
    { value: "West", label: L.west },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{L.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{L.desc}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Pills options={confOpts} value={conf} onChange={(v) => setConf(v as "ALL" | Conference)} size="sm" />
        <details className="group max-w-xl text-sm text-fg-muted">
          <summary className="cursor-pointer select-none text-[13px] font-medium text-fg-subtle transition-colors hover:text-fg">
            {L.method}
          </summary>
          <p className="mt-2 leading-relaxed">{L.methodBody}</p>
        </details>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ franchise, honor, rank }) => (
          <Link
            key={franchise.id}
            href={`/basketball/clubs/${franchise.id}`}
            className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-border-strong"
          >
            <div className="flex items-center gap-3">
              <span className="tnum w-5 shrink-0 text-right text-sm text-fg-subtle">{rank}</span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 font-mono text-sm font-semibold text-fg-muted">
                {franchise.code}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold tracking-tight group-hover:text-accent">{fName(franchise)}</div>
                <div className="mt-1">
                  <RegionBadge region={confName(franchise)} />
                </div>
              </div>
              <div className="tnum shrink-0 text-right text-sm font-semibold text-accent">{formatNumber(honor)}</div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-fg-muted">
              {trophyChips(franchise).map((c) => (
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

export function BasketballFranchiseProfile({ id }: { id: string }) {
  const { locale } = useI18n();
  const L = labels(locale);
  const fName = (f: { id: string; name: string }) => (locale === "zh" && FRANCHISE_ZH[f.id]) || f.name;
  const mergedById = new Map(getSport("basketball")!.players.map((m) => [m.id, m] as const));
  const name = (e: { id: string; name: string; i18n?: Record<string, string> }) =>
    mergedById.get(e.id)?.i18n?.[locale] ?? e.i18n?.[locale] ?? e.name;
  const franchise = getFranchise(id);
  if (!franchise) return null;
  const honor = franchiseHonor(franchise);
  const players = franchisePlayers(franchise);
  const confName = franchise.conference === "East" ? L.east : L.west;
  const groups = [
    { type: "nba_title" as const, label: L.titles, n: franchise.titles },
    { type: "finals_loss" as const, label: L.finals, n: franchise.finals },
  ].filter((g) => g.n > 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <BackButton fallback="/basketball/clubs" />

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surface-2 font-mono text-xl font-semibold text-fg-muted">
              {franchise.code}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight">{fName(franchise)}</h1>
                <RegionBadge region={confName} />
              </div>
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">{L.honor}</div>
            <div className="tnum text-4xl font-semibold leading-none text-accent">{formatNumber(honor)}</div>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {groups.map((g) => (
          <div key={g.type} className="rounded-xl border border-transparent bg-[color:var(--gold-soft)] p-3.5">
            <div className="flex items-center justify-between">
              <TrophyIcon type={g.type} size={30} className="text-[color:var(--medal-gold)]" />
              <span className="tnum text-2xl font-semibold leading-none text-[color:var(--medal-gold)]">{g.n}</span>
            </div>
            <div className="mt-2.5 text-[13px] font-medium leading-tight text-fg">{g.label}</div>
          </div>
        ))}
        {franchise.titleYears.length > 0 && (
          <div className="col-span-2 rounded-xl border border-border bg-surface-2 p-3.5 sm:col-span-1">
            <div className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">{L.titles}</div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {franchise.titleYears.map((y) => (
                <span key={y} className="tnum rounded bg-surface px-1.5 py-0.5 text-[11px] text-fg-muted">
                  &rsquo;{String(y).slice(2)}
                </span>
              ))}
            </div>
          </div>
        )}
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
                  href={`/basketball/players/${p.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2 transition-colors hover:border-border-strong"
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
