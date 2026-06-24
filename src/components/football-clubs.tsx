"use client";

import { useState } from "react";
import Link from "next/link";
import { clubHonor, clubPlayers, getClub, rankedClubs, type Club, type Confederation } from "@/lib/sport/football/clubs";
import { FOOTBALL_LEAGUES } from "@/lib/sport/football/model";
import { TrophyIcon } from "@/components/trophy-icon";
import { Plate } from "@/components/ui/plate";
import { FlatToggle } from "@/components/ui/flat-controls";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { getSport } from "@/lib/sport/registry";

function labels(locale: string) {
  return locale === "zh"
    ? {
        title: "顶尖俱乐部",
        desc: "足坛最具荣誉的俱乐部。",
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
          "欧冠 ×100、解放者杯 ×40、洲际杯/世俱杯 ×35、欧联杯 ×27；联赛冠军 ×10 并按联赛强度加权（英超/西甲/意甲/德甲 1.0，法甲 0.75，巴西 0.60，葡超/荷甲 0.55，阿根廷 0.50，其余弱势联赛 0.14）。权重依据奖金、欧足联系数、IFFHS 联赛排名等公开认可度调研设定；数据逐一核对维基百科，截至 2025 年 8 月 1 日（含 2024-25 赛季与 2025 年世俱杯）。",
      }
    : {
        title: "Top clubs",
        desc: "The most decorated clubs in football.",
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
          "Champions League ×100, Copa Libertadores ×40, Intercontinental / Club World Cup ×35, Europa League ×27; league titles ×10 scaled by league strength (PL / LaLiga / Serie A / Bundesliga 1.0, Ligue 1 0.75, Brazil 0.60, Primeira / Eredivisie 0.55, Argentina 0.50, other weaker leagues 0.14). Weights calibrated from prize money, UEFA coefficients and IFFHS league ranks; every club verified against Wikipedia, as of 1 August 2025.",
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
  const maxHonor = Math.max(1, ...clubs.map((x) => x.honor));
  const confOpts = [
    { value: "ALL", label: L.all },
    { value: "UEFA", label: L.europe },
    { value: "CONMEBOL", label: L.southAm },
  ];

  return (
    <div className="houses">
      <header className="head pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "-1%", top: "-12%", fontSize: "clamp(260px,40vw,600px)" }}>
          ♛
        </span>
        <span className="v-edge" style={{ position: "absolute", right: "18px", top: "58px" }}>
          {t("nav.football")} · MMXXVI
        </span>
        <div style={{ position: "relative" }} data-reveal>
          <p className="kick">{t("nav.football")}</p>
          <h1>{L.title}</h1>
          <p className="desc">{L.desc}</p>
        </div>
      </header>

      <div className="filters pad">
        <FlatToggle options={confOpts} value={conf} onChange={(v) => setConf(v as "ALL" | Confederation)} />
        <details className="method">
          <summary>{L.method}</summary>
          <p>{L.methodBody}</p>
        </details>
      </div>

      <div className="pad">
        {clubs.map(({ club, honor, rank }) => (
          <Link
            key={club.id}
            href={`/football/clubs/${club.id}`}
            className="row"
            data-reveal
            style={{ transitionDelay: rank <= 12 ? `${(rank - 1) * 30}ms` : "0ms" }}
          >
            <span className="rk">{String(rank).padStart(2, "0")}</span>
            <div style={{ minWidth: 0 }}>
              <span className="nm">{clubName(club)}</span>
              <div className="meta">
                <span className="reg">{regionName(club)}</span>
                <span className="chips">
                  {trophyChips(club).map((c) => (
                    <span key={c.type} className="chip">
                      <TrophyIcon type={c.type} size={15} className="text-[color:var(--medal-gold)]" />
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
  const rank = rankedClubs().findIndex((x) => x.club.id === id) + 1;
  const regionName = club.confederation === "CONMEBOL" ? L.southAm : leagueLabel(club.league);
  const groups = [
    { type: "champions_league" as const, label: L.ucl, n: club.championsLeague },
    { type: "copa_libertadores" as const, label: L.libertadores, n: club.libertadores },
    { type: "league_title" as const, label: L.league, n: club.leagueTitles },
    { type: "club_world_cup" as const, label: L.inter, n: club.intercontinental },
    { type: "europa_league" as const, label: L.europa, n: club.europa },
  ].filter((g) => g.n > 0);

  return (
    <div className="crest">
      <div className="pad">
        <Link href="/football/clubs" className="back">← {t("common.back")}</Link>
      </div>

      <section className="hero pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "3%", top: "-6%", fontSize: "clamp(150px,26vw,420px)" }}>
          {club.code}
        </span>
        <span className="v-edge" style={{ position: "absolute", right: "18px", top: "60px" }}>
          PANTHEON · ANNO MMXXVI
        </span>
        <div style={{ position: "relative" }} data-reveal>
          <p className="kick">
            № {rank} · {regionName}
          </p>
          <h1 className="name">{clubName(club)}</h1>
          <div className="idx">
            <span className="lab">{L.honor}</span>
            <span className="val">{formatNumber(honor)}</span>
          </div>
        </div>
      </section>

      {groups.length > 0 && (
        <section className="titles" data-reveal>
          {groups.map((g) => (
            <div key={g.type} className="tcell gold">
              <div className="n">{g.n}</div>
              <div className="lab">{g.label}</div>
            </div>
          ))}
        </section>
      )}

      {players.length > 0 && (
        <section className="sec pad" style={{ paddingTop: "8px" }} data-reveal>
          <Plate n="Ⅰ" title={L.roster} note={String(players.length)} />
          <div className="roster">
            {players.map((p) => (
              <Link key={p.id} href={`/football/players/${p.id}`} className="rcell">
                <span className="pn">{name(p)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
