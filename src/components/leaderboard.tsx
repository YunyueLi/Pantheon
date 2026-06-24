"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { honorScore, countType, careerSpan, activeInDecade } from "@/lib/sport/honor";
import { localizeTeam } from "@/lib/sport/football/clubs";
import type { Player } from "@/lib/sport/types";
import { useSport, useName, useLeagueLabel, usePositionAbbr } from "@/lib/sport/provider";
import { cn, formatNumber } from "@/lib/utils";
import { FlatToggle, FlatSelect } from "@/components/ui/flat-controls";
import { useI18n } from "@/lib/i18n/provider";

type Row = { player: Player; score: number };

export function Leaderboard() {
  const { t, locale } = useI18n();
  const { config, positionMeta } = useSport();
  const { players, model, leagues, positions, headlineTypes, basePath } = config;
  const name = useName();
  const leagueLabel = useLeagueLabel();
  const posAbbr = usePositionAbbr();
  const hasCoaches = useMemo(() => players.some((p) => p.kind === "coach"), [players]);
  const [kind, setKind] = useState<string>("player");
  const kindOpts = [
    { value: "player", label: t("leaderboard.kindPlayers") },
    { value: "coach", label: t("leaderboard.kindCoaches") },
  ];
  const sp = useSearchParams();
  const spRegion = sp.get("region");
  const spRole = sp.get("role");
  const [region, setRegion] = useState<string>(leagues.some((l) => l.id === spRegion) ? (spRegion as string) : "ALL");
  const splitGender = Boolean(config.splitByPosition) && positions.length > 0;
  const [role, setRole] = useState<string>(
    positions.some((p) => p.id === spRole) ? (spRole as string) : splitGender ? positions[0].id : "ALL"
  );
  const [presetKey, setPresetKey] = useState(model.presets[0].key);
  const [era, setEra] = useState<string>("ALL");
  const [rankBy, setRankBy] = useState<"honor" | "stature">("honor");

  const weights = model.presets.find((p) => p.key === presetKey)!.weights;

  const eras = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const p of players) {
      const s = careerSpan(p);
      if (s.start < min) min = s.start;
      if (s.end > max) max = s.end;
    }
    const out: number[] = [];
    for (let d = Math.floor(max / 10) * 10; d >= Math.floor(min / 10) * 10; d -= 10) out.push(d);
    return out;
  }, [players]);

  const regionOpts = [
    { value: "ALL", label: t("leaderboard.allRegions") },
    ...leagues.map((l) => ({ value: l.id, label: leagueLabel(l.id) })),
  ];
  const roleLabel = (pid: string) => {
    const v = t(`role.${pid}`);
    return v !== `role.${pid}` ? v : positionMeta(pid)?.label ?? pid;
  };
  const availablePositions = positions.filter((p) =>
    players.some((pl) => (kind === "coach" ? pl.kind === "coach" : pl.kind !== "coach") && pl.position === p.id)
  );
  const roleOpts = [
    ...(splitGender ? [] : [{ value: "ALL", label: t("leaderboard.allRoles") }]),
    ...availablePositions.map((p) => ({ value: p.id, label: roleLabel(p.id) })),
  ];
  const hasPositions = availablePositions.length > 0;
  const roleColLabel = t(config.roleNoun ?? "leaderboard.colRole");
  const presetOpts = model.presets.map((p) => ({ value: p.key, label: t(`preset.${p.key}`) }));
  const eraOpts = [{ value: "ALL", label: t("leaderboard.allEras") }, ...eras.map((d) => ({ value: String(d), label: `${d}s` }))];
  const hasStature = players.some((p) => p.stature != null);
  const rankByOpts = [
    { value: "honor", label: t("leaderboard.byHonor") },
    { value: "stature", label: t("leaderboard.byStature") },
  ];

  const data = useMemo<Row[]>(
    () =>
      players
        .filter((p) => (kind === "coach" ? p.kind === "coach" : p.kind !== "coach"))
        .filter(
          (p) =>
            (region === "ALL" || p.league === region) &&
            (kind === "coach" || role === "ALL" || p.position === role) &&
            (era === "ALL" || activeInDecade(p, +era))
        )
        .map((player) => ({
          player,
          score: rankBy === "stature" ? player.stature ?? 0 : honorScore(player, model, weights),
        }))
        .sort((a, b) => b.score - a.score),
    [region, role, kind, era, rankBy, weights, players, model]
  );

  const maxScore = useMemo(() => Math.max(1, ...data.map((d) => d.score)), [data]);

  return (
    <div className="board">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.board{position:relative;overflow-x:hidden}
.board a{color:inherit}
.board .pad{padding-left:clamp(20px,5vw,64px);padding-right:clamp(20px,5vw,64px)}

.board .head{position:relative;padding:60px 0 30px}
.board .head .kick{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.3em;font-size:11px;color:var(--fg-2)}
.board .head h1{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(56px,12vw,164px);line-height:.82;letter-spacing:-.02em;margin:14px 0 0}
.board .head .desc{margin-top:22px;max-width:46ch;font-family:var(--font-display);font-style:italic;font-size:clamp(15px,1.8vw,19px);line-height:1.45;color:var(--fg-2)}

.board .filters{position:relative;display:flex;flex-wrap:wrap;align-items:flex-end;gap:26px 34px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:20px 0}

.board .reg{position:relative}
.board .row{position:relative;display:grid;grid-template-columns:3.4rem 1fr auto;align-items:center;gap:20px;border-bottom:1px solid var(--border);padding:26px 0;transition:background-color .15s}
.board .row:hover{background:var(--accent-soft)}
.board .row .rk{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.04em;font-size:12px;color:var(--fg-3);text-align:right;font-variant-numeric:tabular-nums}
.board .row.first .rk{font-size:15px;color:var(--fg)}
.board .row .nm{font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:-.01em;line-height:.86;font-size:clamp(28px,5vw,52px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:font-style .15s}
.board .row.first .nm{font-size:clamp(48px,10vw,128px);font-weight:900}
.board .row:hover .nm{font-style:italic}
.board .row .meta{margin-top:12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 16px;font-family:var(--font-display);text-transform:uppercase;letter-spacing:.14em;font-size:10px;color:var(--fg-2)}
.board .row .team{font-family:var(--font-display);text-transform:none;letter-spacing:0;font-style:italic;font-size:13px;color:var(--fg-3)}
.board .row .retired{color:var(--fg-3)}
.board .row .sc{text-align:right;min-width:0}
.board .row .sc .v{font-family:var(--font-display);font-weight:800;font-variant-numeric:tabular-nums;font-size:clamp(18px,2vw,22px)}
.board .row.first .sc .v{font-size:clamp(30px,4vw,46px)}
.board .row .sc .bar{margin-top:12px;margin-left:auto;height:2px;width:clamp(96px,16vw,180px);background:var(--border)}
.board .row .sc .bar span{display:block;height:2px;background:var(--accent)}
.board .empty{padding:64px 0;text-align:center;font-family:var(--font-display);font-style:italic;color:var(--fg-3)}
`,
        }}
      />

      <header className="head pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "-1%", top: "-14%", fontSize: "clamp(300px,42vw,640px)" }}>
          ★
        </span>
        <span className="v-edge" style={{ position: "absolute", right: "18px", top: "60px" }}>
          {t(`nav.${config.id}`)} · MMXXVI
        </span>
        <div style={{ position: "relative" }}>
          <p className="kick">{t(`nav.${config.id}`)}</p>
          <h1>{t("leaderboard.title")}</h1>
          <p className="desc">{t("leaderboard.desc")}</p>
        </div>
      </header>

      {/* Filters — a single flat hairline strip of serif controls. */}
      <div className="filters pad">
        {hasCoaches && <FlatToggle options={kindOpts} value={kind} onChange={setKind} />}
        <FlatSelect label={t("leaderboard.colRegion")} value={region} onChange={setRegion} options={regionOpts} />
        {kind !== "coach" && hasPositions && (
          <FlatSelect label={roleColLabel} value={role} onChange={setRole} options={roleOpts} />
        )}
        <FlatSelect label={t("leaderboard.era")} value={era} onChange={setEra} options={eraOpts} />
        {hasStature && <FlatToggle options={rankByOpts} value={rankBy} onChange={(v) => setRankBy(v as "honor" | "stature")} />}
        {rankBy === "honor" && (
          <FlatSelect label={t("leaderboard.weighting")} value={presetKey} onChange={setPresetKey} options={presetOpts} />
        )}
      </div>

      {/* The register — a monumental roll-call of legends. */}
      <div className="reg pad">
        {data.map((row, i) => {
          const p = row.player;
          const rank = i + 1;
          const first = rank === 1;
          const counts = headlineTypes.map((type) => ({ type, n: countType(p, type), short: model.achievementMeta[type]?.short }));
          return (
            <Link key={p.id} href={`${basePath}/players/${p.id}`} className={cn("row group", first && "first")}>
              <span className="rk">{String(rank).padStart(2, "0")}</span>
              <div style={{ minWidth: 0 }}>
                <span className="nm">{name(p)}</span>
                <div className="meta">
                  <span>{leagueLabel(p.league)}</span>
                  {hasPositions && p.position && <span>{posAbbr(p.position)}</span>}
                  {counts.map((c) => (c.n > 0 ? <span key={c.type}>{c.n}× {c.short}</span> : null))}
                  {!p.active && <span className="retired">{t("common.retired")}</span>}
                  <span className="team">{localizeTeam(p.team, locale)}</span>
                </div>
              </div>
              <div className="sc">
                <div className="v">{formatNumber(row.score)}</div>
                <div className="bar">
                  <span style={{ width: `${(row.score / maxScore) * 100}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
        {data.length === 0 && <p className="empty">—</p>}
      </div>
    </div>
  );
}
