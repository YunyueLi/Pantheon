"use client";

import { useState } from "react";
import Link from "next/link";
import {
  franchiseHonor, franchisePlayers, getFranchise, rankedFranchises,
  type Conference, type Franchise,
} from "@/lib/sport/basketball/franchises";
import { TrophyIcon } from "@/components/trophy-icon";
import { Plate } from "@/components/ui/plate";
import { FlatToggle } from "@/components/ui/flat-controls";
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
  const { t, locale } = useI18n();
  const L = labels(locale);
  const [conf, setConf] = useState<"ALL" | Conference>("ALL");
  const fName = (f: { id: string; name: string }) => (locale === "zh" && FRANCHISE_ZH[f.id]) || f.name;
  const confName = (f: Franchise) => (f.conference === "East" ? L.east : L.west);
  const rows = rankedFranchises(conf === "ALL" ? undefined : conf);
  const maxHonor = Math.max(1, ...rows.map((x) => x.honor));
  const confOpts = [
    { value: "ALL", label: L.all },
    { value: "East", label: L.east },
    { value: "West", label: L.west },
  ];

  return (
    <div className="houses">
      <header className="head pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "-1%", top: "-12%", fontSize: "clamp(260px,40vw,600px)" }}>
          ♛
        </span>
        <span className="v-edge" style={{ position: "absolute", right: "18px", top: "58px" }}>
          {t("nav.basketball")} · MMXXVI
        </span>
        <div style={{ position: "relative" }}>
          <p className="kick">{t("nav.basketball")}</p>
          <h1>{L.title}</h1>
          <p className="desc">{L.desc}</p>
        </div>
      </header>

      <div className="filters pad">
        <FlatToggle options={confOpts} value={conf} onChange={(v) => setConf(v as "ALL" | Conference)} />
        <details className="method">
          <summary>{L.method}</summary>
          <p>{L.methodBody}</p>
        </details>
      </div>

      <div className="pad">
        {rows.map(({ franchise, honor, rank }) => (
          <Link key={franchise.id} href={`/basketball/clubs/${franchise.id}`} className="row">
            <span className="rk">{String(rank).padStart(2, "0")}</span>
            <div style={{ minWidth: 0 }}>
              <span className="nm">{fName(franchise)}</span>
              <div className="meta">
                <span className="reg">{confName(franchise)}</span>
                <span className="chips">
                  {trophyChips(franchise).map((c) => (
                    <span key={c.type} className="chip">
                      <TrophyIcon
                        type={c.type}
                        size={15}
                        className={c.type === "nba_title" ? "text-[color:var(--medal-gold)]" : "text-fg-subtle"}
                      />
                      {c.n}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="sc">
              <div className="v">{formatNumber(honor)}</div>
              <div className="bar">
                <span style={{ width: `${(honor / maxHonor) * 100}%` }} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BasketballFranchiseProfile({ id }: { id: string }) {
  const { t, locale } = useI18n();
  const L = labels(locale);
  const fName = (f: { id: string; name: string }) => (locale === "zh" && FRANCHISE_ZH[f.id]) || f.name;
  const mergedById = new Map(getSport("basketball")!.players.map((m) => [m.id, m] as const));
  const name = (e: { id: string; name: string; i18n?: Record<string, string> }) =>
    mergedById.get(e.id)?.i18n?.[locale] ?? e.i18n?.[locale] ?? e.name;
  const franchise = getFranchise(id);
  if (!franchise) return null;
  const honor = franchiseHonor(franchise);
  const players = franchisePlayers(franchise);
  const rank = rankedFranchises().findIndex((x) => x.franchise.id === id) + 1;
  const confName = franchise.conference === "East" ? L.east : L.west;

  return (
    <div className="crest">
      <div className="pad">
        <Link href="/basketball/clubs" className="back">← {t("common.back")}</Link>
      </div>

      <section className="hero pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "3%", top: "-6%", fontSize: "clamp(150px,26vw,420px)" }}>
          {franchise.code}
        </span>
        <span className="v-edge" style={{ position: "absolute", right: "18px", top: "60px" }}>
          PANTHEON · ANNO MMXXVI
        </span>
        <div style={{ position: "relative" }}>
          <p className="kick">
            № {rank} · {confName}
          </p>
          <h1 className="name">{fName(franchise)}</h1>
          <div className="idx">
            <span className="lab">{L.honor}</span>
            <span className="val">{formatNumber(honor)}</span>
          </div>
        </div>
      </section>

      <section className="titles">
        {franchise.titles > 0 && (
          <div className="tcell gold">
            <div className="n">{franchise.titles}</div>
            <div className="lab">{L.titles}</div>
            {franchise.titleYears.length > 0 && (
              <div className="yrs">
                {franchise.titleYears.map((y) => (
                  <span key={y}>{`'${String(y).slice(2)}`}</span>
                ))}
              </div>
            )}
          </div>
        )}
        {franchise.finals > 0 && (
          <div className="tcell">
            <div className="n">{franchise.finals}</div>
            <div className="lab">{L.finals}</div>
          </div>
        )}
      </section>

      {players.length > 0 && (
        <section className="sec pad" style={{ paddingTop: "8px" }}>
          <Plate n="Ⅰ" title={L.roster} note={String(players.length)} />
          <div className="roster">
            {players.map((p) => (
              <Link key={p.id} href={`/basketball/players/${p.id}`} className="rcell">
                <span className="pn">{name(p)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
