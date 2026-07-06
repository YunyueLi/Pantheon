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
import { photoFraming } from "@/lib/player-photo-framing";
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
function Portrait({ photo, initials, caption, pos, zoom }: { photo?: string; initials: string; caption: string; pos?: string; zoom?: number }) {
  const [loaded, setLoaded] = useState(false);
  const objectPosition = pos ?? "50% 14%";
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
        <rect className="field-bloom" width="400" height="520" fill="url(#vig-portrait)" />
      </svg>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          aria-hidden
          className="portrait-photo"
          decoding="async"
          fetchPriority="high"
          data-loaded={loaded}
          style={{ objectPosition, ...(zoom ? { transform: `scale(${zoom})`, transformOrigin: objectPosition } : {}) }}
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
  // Percentiles read as noise for tiny disciplines (e.g. a 14-player pool); show the
  // rank fraction alone below this pool size.
  const MIN_POOL_FOR_PERCENTILE = 20;
  const pctPool = hasRole ? roleTotal : players.length;
  const showPercentile = pctPool >= MIN_POOL_FOR_PERCENTILE;

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
          <Portrait
            photo={playerPhoto(player.id)?.src}
            pos={photoFraming(player.id)?.pos}
            zoom={photoFraming(player.id)?.zoom}
            initials={initials}
            caption={player.realName ?? name(player)}
          />
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
        {showPercentile && (
          <div className="stand-note">
            {hasRole
              ? t("player.topPct", { p: Math.max(1, 100 - pct), role: roleLabel(player.position) })
              : t("player.topPctNoRole", { p: Math.max(1, 100 - pct) })}
          </div>
        )}
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
          <div style={{ marginTop: "20px", overflowX: "auto" }}>
          <table className="recordtbl">
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
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="col-grid" />
        <h2 style={{ position: "relative" }}>{zh ? "与诸神对决" : "Set against the gods"}</h2>
        <Link href={`${basePath}/compare?a=${player.id}`} className="btn">
          {t("player.compare")} →
        </Link>
      </section>
    </div>
  );
}
