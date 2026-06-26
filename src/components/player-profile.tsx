"use client";

import Link from "next/link";
import { useState } from "react";
import { achievementPoints, countType, honorScore, percentile, ranked } from "@/lib/sport/honor";
import { useSport, useHonorLabel, useName, useLeagueLabel, useBlurb } from "@/lib/sport/provider";
import { teamIdFromName } from "@/lib/teams";
import { localizeTeam } from "@/lib/sport/football/clubs";
import { TrophyIcon, trophyTone } from "@/components/trophy-icon";
import { HonorTimeline } from "@/components/honor-timeline";
import { HonorBreakdown } from "@/components/honor-breakdown";
import { TrophyCabinet } from "@/components/trophy-cabinet";
import { Plate } from "@/components/ui/plate";
import { formatNumber } from "@/lib/utils";
import { playerPhoto } from "@/lib/player-photos";
import { useI18n } from "@/lib/i18n/provider";

const r2 = (n: number) => Math.round(n * 100) / 100;
// Fixed radiant sunburst — rounded coords render byte-identical on server + client.
const RAYS = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  return { x: r2(200 + Math.cos(a) * 440), y: r2(210 + Math.sin(a) * 440) };
});

/**
 * The enshrinement portrait. A halftone duotone field with a radiant bloom and
 * the player's monogram engraved over it. When a (freely-licensed) likeness is
 * supplied it renders as a clean, high-contrast monochrome "monument" portrait —
 * grayscale + steep contrast, feathered out of the dark field so the figure
 * emerges from the light. No photo → the radiant monogram field stands on its own.
 */
function Portrait({ photo, initials, caption }: { photo?: string; initials: string; caption: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="portrait">
      <svg className="portrait-ht" viewBox="0 0 400 520" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <pattern id="ht-portrait" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.15" fill="currentColor" />
          </pattern>
          <radialGradient id="vig-portrait" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.92" />
            <stop offset="48%" stopColor="currentColor" stopOpacity="0.12" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="520" fill="url(#ht-portrait)" opacity="0.4" />
        <g opacity="0.3">
          {RAYS.map((r, i) => (
            <line key={i} x1="200" y1="210" x2={r.x} y2={r.y} stroke="currentColor" strokeWidth="0.6" />
          ))}
        </g>
        <rect width="400" height="520" fill="url(#vig-portrait)" />
      </svg>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          aria-hidden
          className="portrait-photo"
          data-loaded={loaded}
          ref={(el) => {
            if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
          }}
          onLoad={() => setLoaded(true)}
        />
      )}
      {!loaded && <span className="portrait-mono mega">{initials}</span>}
      <span className="portrait-cap label">{caption}</span>
    </div>
  );
}

export function PlayerProfile({ id }: { id: string }) {
  const { t, locale } = useI18n();
  const zh = locale === "zh";
  const { config, leagueMeta, positionMeta } = useSport();
  const { players, model, headlineTypes, basePath } = config;
  const honorLabel = useHonorLabel();
  const name = useName();
  const leagueLabel = useLeagueLabel();
  const blurbOf = useBlurb();
  const roleLabel = (pid: string) => {
    const v = t(`role.${pid}`);
    return v !== `role.${pid}` ? v : positionMeta(pid)?.label ?? pid;
  };

  const player = players.find((p) => p.id === id);
  if (!player) return null;
  const blurb = blurbOf(player);
  const hasRole = Boolean(player.position) && Boolean(positionMeta(player.position));
  const also = player.alsoId ? players.find((p) => p.id === player.alsoId) : undefined;
  const teamId = teamIdFromName(player.team);

  const score = honorScore(player, model);
  const overall = ranked(players, model).find((r) => r.player.id === player.id)!;
  const roleRank = ranked(players.filter((p) => p.position === player.position), model).find((r) => r.player.id === player.id)!;
  const regionRank = ranked(players.filter((p) => p.league === player.league), model).find((r) => r.player.id === player.id)!;
  const roleTotal = players.filter((p) => p.position === player.position).length;
  const regionTotal = players.filter((p) => p.league === player.league).length;
  const pct = percentile(player, players.filter((p) => p.position === player.position), model);

  const countryKey = `regionCountry.${player.league}`;
  const countryVal = t(countryKey);
  const country = countryVal === countryKey ? leagueMeta(player.league)?.country ?? "" : countryVal;

  const honors = player.achievements
    .filter((a) => (model.achievementMeta[a.type]?.base ?? 0) > 0)
    .map((a) => ({ a, pts: achievementPoints(a, model) }))
    .sort((x, y) => y.a.year - x.a.year || y.pts - x.pts);
  const lastYear = Math.max(...player.achievements.map((a) => a.year));
  const seasons = lastYear - player.debutYear + 1;

  // The headline trophy haul: only the types this player actually owns, biggest first.
  const haul = headlineTypes
    .map((type) => ({ type, n: countType(player, type), label: honorLabel(type) }))
    .filter((h) => h.n > 0);

  const initials = (() => {
    const clean = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");
    const parts = player.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return ((clean(parts[0])[0] ?? "") + (clean(parts[parts.length - 1])[0] ?? "")).toUpperCase();
    return clean(player.name).slice(0, 2).toUpperCase();
  })();
  const isGoat = overall.rank === 1;
  const era = `${player.debutYear}–${player.active ? (zh ? "至今" : "NOW") : lastYear}`;
  const verdict = isGoat ? (zh ? "万神殿之首" : "First of the Pantheon") : (zh ? "封神录" : "Enshrined");

  return (
    <div className="enshrine">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.enshrine{position:relative;overflow-x:hidden}
.enshrine a{color:inherit}
.enshrine .pad{padding-left:clamp(20px,5vw,64px);padding-right:clamp(20px,5vw,64px)}
.enshrine .back{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-display);text-transform:uppercase;letter-spacing:.2em;font-size:11px;color:var(--fg-3);padding:22px 0 0}
.enshrine .back:hover{color:var(--fg)}

/* HERO — the rite of enshrinement */
.rite{position:relative;min-height:84vh;display:grid;grid-template-columns:1.1fr .9fr;gap:0;border-bottom:1px solid var(--border)}
@media(max-width:880px){.rite{grid-template-columns:1fr;min-height:auto}}
.rite-text{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;padding:64px 0 56px;min-height:84vh}
@media(max-width:880px){.rite-text{min-height:auto;padding:40px 0 36px}}
.rite-kick{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.3em;font-size:11px;color:var(--fg-2)}
.rite-real{font-family:var(--font-display);font-style:italic;font-size:clamp(16px,2vw,22px);color:var(--fg-2);margin-top:20px}
.rite-name{font-size:clamp(40px,11vw,168px);margin-top:6px;word-break:break-word}
.rite-meta{margin-top:26px;font-size:12px;color:var(--fg-2);line-height:1.9}
.rite-also{display:inline-block;margin-top:16px;font-family:var(--font-display);font-style:italic;font-size:14px;color:var(--fg);border-bottom:1px solid var(--border-strong);padding-bottom:2px}
.rite-index{margin-top:38px;display:flex;align-items:flex-end;gap:22px}
.rite-index .lab{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.22em;font-size:10px;color:var(--fg-2);writing-mode:vertical-rl;transform:rotate(180deg)}
.rite-index .val{font-family:var(--font-display);font-weight:900;font-size:clamp(64px,11vw,150px);line-height:.8;letter-spacing:-.03em}

.rite-portrait{position:relative;border-left:1px solid var(--border)}
@media(max-width:880px){.rite-portrait{border-left:0;border-top:1px solid var(--border);min-height:62vh}}
.portrait{position:absolute;inset:0;overflow:hidden;color:var(--fg)}
@media(max-width:880px){.portrait{position:relative;min-height:62vh}}
.portrait-ht{position:absolute;inset:0}
.portrait-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 14%;filter:grayscale(1) contrast(1.55) brightness(1.04);opacity:0;transition:opacity .6s;-webkit-mask-image:radial-gradient(76% 68% at 50% 39%,#000 46%,transparent 100%);mask-image:radial-gradient(76% 68% at 50% 39%,#000 46%,transparent 100%)}
.portrait-photo[data-loaded="true"]{opacity:.96}
.portrait-mono{position:absolute;inset:0;display:grid;place-items:center;font-size:clamp(120px,22vw,300px);-webkit-text-stroke:1.5px var(--fg);color:transparent;opacity:.5}
.portrait-cap{position:absolute;left:22px;bottom:20px;font-size:10px;color:var(--fg-2)}

/* STANDINGS */
.stand{position:relative;display:flex;flex-wrap:wrap;border-bottom:1px solid var(--border)}
.stand-cell{position:relative;flex:1 1 160px;min-width:0;padding:26px clamp(16px,3vw,40px);border-left:1px solid var(--border)}
.stand-cell:first-child{border-left:0}
.stand-cell .lab{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.18em;font-size:10px;color:var(--fg-2)}
.stand-cell .val{margin-top:12px;font-family:var(--font-display);font-weight:800;font-size:clamp(40px,6vw,72px);line-height:.92;letter-spacing:-.01em;font-variant-numeric:tabular-nums;white-space:nowrap}
.stand-cell .sub{margin-top:8px;font-family:var(--font-display);font-size:13px;letter-spacing:.04em;color:var(--fg-3);font-variant-numeric:tabular-nums}
.stand-note{flex:0 0 100%;border-top:1px solid var(--border);padding:14px clamp(20px,5vw,64px);font-family:var(--font-display);font-style:italic;font-size:14px;color:var(--fg-2)}

/* HAUL — the trophy headline numerals */
.haul{position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));border-bottom:1px solid var(--border)}
.haul-cell{position:relative;padding:34px clamp(20px,5vw,64px) 30px;border-left:1px solid var(--border)}
.haul-cell:first-child{border-left:0}
.haul-cell .n{font-family:var(--font-display);font-weight:900;font-size:clamp(48px,8vw,104px);line-height:.82;font-variant-numeric:tabular-nums}
.haul-cell.gold .n{color:var(--medal-gold)}
.haul-cell .lab{margin-top:14px;font-family:var(--font-display);text-transform:uppercase;letter-spacing:.16em;font-size:11px;color:var(--fg-2)}

/* SECTIONS */
.sec{position:relative;padding-top:8px;padding-bottom:42px}
.verdict{position:relative;border-bottom:1px solid var(--border);padding:54px clamp(20px,5vw,64px)}
.verdict p{font-family:var(--font-display);font-style:italic;font-size:clamp(22px,3.4vw,40px);line-height:1.28;max-width:24ch}
.verdict .mark{font-size:1.4em;color:var(--fg-3);font-style:normal}
.recordtbl{width:100%;border-collapse:collapse}
.recordtbl th{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.16em;font-size:10px;color:var(--fg-2);text-align:left;padding:0 12px 14px;border-bottom:1px solid var(--border)}
.recordtbl th.r{text-align:right}
.recordtbl td{padding:16px 12px;border-bottom:1px solid var(--border)}
.recordtbl tr:hover td{background:var(--accent-soft)}
.recordtbl .yr{font-family:var(--font-display);font-weight:800;font-size:24px;font-variant-numeric:tabular-nums;color:var(--fg)}
.recordtbl .hon{font-family:var(--font-display);font-size:17px}
.recordtbl .mut{color:var(--fg-2);font-size:13px}
.recordtbl .pts{text-align:right;font-family:var(--font-display);font-weight:700;font-variant-numeric:tabular-nums}
.recordtbl .tier{font-family:var(--font-display);font-size:10px;letter-spacing:.12em;color:var(--fg-3);border:1px solid var(--border);padding:2px 7px}

.enshrine .cta{position:relative;text-align:center;padding:88px 24px;border-top:1px solid var(--border)}
.enshrine .cta h3{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(30px,5vw,60px);line-height:.92;letter-spacing:-.02em}
.enshrine .btn{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.2em;font-size:12px;border:1px solid var(--border-strong);padding:15px 28px;display:inline-block;margin-top:30px;transition:background-color .15s,color .15s}
.enshrine .btn:hover{background:var(--accent);color:var(--accent-contrast)}
`,
        }}
      />

      <div className="pad">
        <Link href={`${basePath}/leaderboard`} className="back">← {t("common.back")}</Link>
      </div>

      {/* HERO — rite of enshrinement */}
      <section className="rite">
        <div className="col-grid" />
        <div className="rite-text pad" data-reveal>
          <div className="rite-kick">
            № {overall.rank} · {t(`nav.${config.id}`)} · {verdict}
          </div>
          {player.realName && <div className="rite-real">{player.realName}</div>}
          <h1 className="rite-name mega">{name(player)}</h1>
          <div className="rite-meta label">
            {leagueLabel(player.league)} · {hasRole ? `${roleLabel(player.position)} · ` : ""}
            {era}
            {country ? ` · ${country}` : ""}
            {!player.active ? ` · ${t("common.retired")}` : ""}
            <br />
            {teamId ? (
              <Link href={`${basePath}/teams/${teamId}`} className="hover:text-fg">
                {localizeTeam(player.team, locale)}
              </Link>
            ) : (
              localizeTeam(player.team, locale)
            )}
          </div>
          {also && (
            <Link href={`${basePath}/players/${also.id}`} className="rite-also">
              {zh
                ? `亦为封神${also.kind === "coach" ? "教头" : "选手"} →`
                : `Also an enshrined ${also.kind === "coach" ? "coach" : "player"} →`}
            </Link>
          )}
          <div className="rite-index">
            <span className="lab">{t("player.honorIndex")}</span>
            <span className="val">{formatNumber(score)}</span>
          </div>
        </div>
        <div className="rite-portrait">
          <span className="v-edge" style={{ position: "absolute", right: "20px", top: "40px", zIndex: 2 }}>
            PANTHEON · ANNO MMXXVI
          </span>
          <Portrait photo={playerPhoto(player.id)?.src} initials={initials} caption={player.realName ?? name(player)} />
        </div>
      </section>

      {/* STANDINGS — the rankings as monumental fractions */}
      <section className="stand" data-reveal>
        <div className="stand-cell">
          <div className="lab">{t("player.rankOverall")}</div>
          <div className="val">№{overall.rank}</div>
          <div className="sub">/ {players.length}</div>
        </div>
        {hasRole && (
          <div className="stand-cell">
            <div className="lab">{roleLabel(player.position)}</div>
            <div className="val">№{roleRank.rank}</div>
            <div className="sub">/ {roleTotal}</div>
          </div>
        )}
        <div className="stand-cell">
          <div className="lab">{leagueLabel(player.league)}</div>
          <div className="val">№{regionRank.rank}</div>
          <div className="sub">/ {regionTotal}</div>
        </div>
        {player.stature != null && (
          <div className="stand-cell">
            <div className="lab">{t("leaderboard.byStature")}</div>
            <div className="val">{player.stature}</div>
            <div className="sub">/ 100</div>
          </div>
        )}
        <div className="stand-note">
          {hasRole
            ? t("player.topPct", { p: Math.max(1, 100 - pct), role: roleLabel(player.position) })
            : t("player.topPctNoRole", { p: Math.max(1, 100 - pct) })}
        </div>
      </section>

      {/* VERDICT — the bio as a pull-quote */}
      {blurb && (
        <section className="verdict">
          <div className="col-grid" />
          <p style={{ position: "relative" }} data-reveal>
            <span className="mark">“</span>
            {blurb}
            <span className="mark">”</span>
          </p>
        </section>
      )}

      {/* HAUL — headline trophy numerals */}
      {(haul.length > 0 || seasons > 0) && (
        <section className="haul">
          {haul.map((h, i) => (
            <div
              key={h.type}
              className={`haul-cell${i === 0 ? " gold" : ""}`}
              data-reveal
              style={{ transitionDelay: `${Math.min(i, 8) * 45}ms` }}
            >
              <div className="n">{h.n}</div>
              <div className="lab">{h.label}</div>
            </div>
          ))}
          <div className="haul-cell" data-reveal style={{ transitionDelay: `${Math.min(haul.length, 8) * 45}ms` }}>
            <div className="n">{seasons}</div>
            <div className="lab">{t("player.statSeasons")}</div>
          </div>
        </section>
      )}

      {/* CAREER ARC */}
      <section className="sec" data-reveal>
        <div className="pad">
          <Plate n="Ⅰ" title={t("player.careerTimeline")} note={t("player.timelineHint")} />
          <div style={{ marginTop: "18px" }}>
            <HonorTimeline player={player} />
          </div>
        </div>
      </section>

      {/* COMPOSITION */}
      <section className="sec" data-reveal>
        <div className="pad">
          <Plate n="Ⅱ" title={t("player.indexComposition")} />
          <div style={{ marginTop: "24px", maxWidth: "560px" }}>
            <HonorBreakdown player={player} />
          </div>
        </div>
      </section>

      {/* CABINET */}
      <section className="sec" data-reveal>
        <div className="pad">
          <Plate n="Ⅲ" title={t("player.trophyCabinet")} />
          <div style={{ marginTop: "24px" }}>
            <TrophyCabinet player={player} />
          </div>
        </div>
      </section>

      {/* THE RECORD — full honors ledger */}
      <section className="sec" data-reveal>
        <div className="pad">
          <Plate n="Ⅳ" title={t("player.allHonors")} note={t("common.entries", { n: honors.length })} />
          <table className="recordtbl" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>{t("player.colYear")}</th>
                <th>{t("player.colHonor")}</th>
                <th>{t("player.colTeam")}</th>
                <th className="r">{t("player.colPoints")}</th>
              </tr>
            </thead>
            <tbody>
              {honors.map(({ a, pts }, i) => {
                const meta = model.achievementMeta[a.type];
                return (
                  <tr key={i}>
                    <td>
                      <span className="yr">{a.year}</span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <TrophyIcon type={a.type} size={18} className={trophyTone(a.type, model.achievementMeta)} />
                        <span className="hon">{honorLabel(a.type)}</span>
                        {typeof a.count === "number" && a.count > 1 && <span className="mut">×{a.count}</span>}
                        {meta?.tier && <span className="tier">{meta.tier}</span>}
                      </span>
                    </td>
                    <td className="mut">{a.team ? localizeTeam(a.team, locale) : "—"}</td>
                    <td className="pts">{formatNumber(pts)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="col-grid" />
        <h3 style={{ position: "relative" }}>{zh ? "与诸神对决" : "Set against the gods"}</h3>
        <Link href={`${basePath}/compare?a=${player.id}`} className="btn">
          {t("player.compare")} →
        </Link>
      </section>
    </div>
  );
}
