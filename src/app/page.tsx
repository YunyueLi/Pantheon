"use client";

import Link from "next/link";
import { listSports, getSport } from "@/lib/sport/registry";
import { ranked, countType } from "@/lib/sport/honor";
import { formatNumber } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

const GITHUB_URL = "https://github.com/YunyueLi/Pantheon";

function Halftone() {
  const rays = Array.from({ length: 44 }, (_, i) => {
    const a = (i / 44) * Math.PI * 2;
    return <line key={i} x1="200" y1="230" x2={200 + Math.cos(a) * 380} y2={230 + Math.sin(a) * 380} stroke="currentColor" strokeWidth="0.7" />;
  });
  return (
    <svg viewBox="0 0 400 560" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <pattern id="hthome" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill="currentColor" />
        </pattern>
        <radialGradient id="bghome" cx="50%" cy="41%" r="62%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="46%" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="560" fill="url(#hthome)" opacity="0.42" />
      <g opacity="0.5">{rays}</g>
      <rect width="400" height="560" fill="url(#bghome)" />
    </svg>
  );
}

export default function Home() {
  const { t, locale } = useI18n();
  const name = (e: { name: string; i18n?: Record<string, string> }) => e.i18n?.[locale] ?? e.name;
  const sports = listSports();
  const lol = getSport("lol")!;
  const goat = ranked(lol.players, lol.model)[0];
  const gp = goat.player;
  const worlds = countType(gp, "worlds_title");
  const msi = countType(gp, "msi_title");

  const immortals = sports
    .map((s) => {
      const g = ranked(s.players, s.model)[0];
      return g ? { s, p: g.player, score: g.score } : null;
    })
    .filter(Boolean) as { s: (typeof sports)[number]; p: (typeof gp); score: number }[];

  return (
    <div className="home">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.home{position:relative;overflow:hidden}
.home .cols{position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(90deg,var(--border) 0 1px,transparent 1px calc(100%/6))}
.home .kick{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.32em;font-size:11px;color:var(--fg-2)}
.home .hero{position:relative;min-height:78vh;padding:62px 48px 40px;display:flex;flex-direction:column;justify-content:space-between}
.home .ghost{position:absolute;right:-30px;top:-130px;font-family:var(--font-display);font-weight:900;font-size:560px;line-height:1;color:var(--fg);opacity:.05;pointer-events:none}
.home .vlabel{position:absolute;right:22px;top:44%;writing-mode:vertical-rl;text-orientation:mixed;font-family:var(--font-display);text-transform:uppercase;font-size:11px;letter-spacing:.4em;color:var(--fg-2)}
.home .mega{position:relative;font-family:var(--font-display);font-weight:900;font-size:clamp(64px,12vw,176px);line-height:.84;letter-spacing:-.02em;margin:18px 0 0}
.home .mega .o{-webkit-text-stroke:2px var(--fg);color:transparent}
.home .mega em{font-style:italic;font-weight:800}
.home .zh{font-family:var(--font-display);font-size:20px;letter-spacing:.5em;color:var(--fg-2);margin-top:22px}
.home .herofoot{position:relative;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}

.home .feature{position:relative;display:grid;grid-template-columns:1.15fr .85fr;border-top:1px solid var(--border)}
@media(max-width:860px){.home .feature{grid-template-columns:1fr}.home .fright{display:none}}
.home .fleft{position:relative;padding:60px 48px;display:flex;flex-direction:column;justify-content:center;min-height:80vh}
.home .frank{font-family:var(--font-display);font-weight:800;font-size:26px;letter-spacing:.08em;text-transform:uppercase}
.home .fname{font-family:var(--font-display);font-weight:900;font-size:clamp(56px,10vw,150px);line-height:.84;letter-spacing:-.02em;margin:10px 0 0;text-transform:uppercase}
.home .fmeta{display:flex;gap:34px;margin-top:38px}
.home .fmeta .lab{font-family:var(--font-display);font-size:10px;letter-spacing:.22em;color:var(--fg-2);text-transform:uppercase}
.home .fmeta .val{font-family:var(--font-display);font-weight:800;font-size:30px;margin-top:8px}
.home .findex{margin-top:44px}
.home .findex .big{font-family:var(--font-display);font-weight:800;font-size:84px;line-height:1;margin-top:4px}
.home .fright{position:relative;border-left:1px solid var(--border);overflow:hidden;color:var(--fg)}
.home .callout{position:absolute;font-family:var(--font-display);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg)}

.home .index{position:relative;border-top:1px solid var(--border);padding:54px 48px 18px}
.home .ihd{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--border);padding-bottom:14px}
.home .ihd .t{font-family:var(--font-display);font-weight:800;font-size:clamp(28px,4vw,40px);letter-spacing:-.01em;text-transform:uppercase}
.home .irow{display:grid;grid-template-columns:160px 1fr auto;align-items:baseline;gap:24px;padding:14px 0;border-bottom:1px solid var(--border);transition:background-color .15s}
.home .irow:hover{background:var(--accent-soft)}
.home .irow .lab{font-family:var(--font-display);font-size:11px;letter-spacing:.2em;color:var(--fg-2);text-transform:uppercase}
.home .irow .nm{font-family:var(--font-display);font-weight:800;font-size:clamp(28px,5vw,52px);line-height:1;letter-spacing:-.01em;text-transform:uppercase;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.home .irow:hover .nm{font-style:italic}
.home .irow .sc{font-family:var(--font-display);font-size:16px}

.home .cta{position:relative;text-align:center;padding:96px 48px;border-top:1px solid var(--border)}
.home .cta h2{font-family:var(--font-display);font-weight:900;font-size:clamp(40px,7vw,84px);line-height:.92;letter-spacing:-.02em;text-transform:uppercase;max-width:18ch;margin:0 auto}
.home .btn{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.2em;font-size:12px;border:1px solid var(--border-strong);padding:15px 26px;display:inline-block;transition:background-color .15s,color .15s}
.home .btn:hover{background:var(--accent);color:var(--accent-contrast)}
`,
        }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="cols" />
        <span className="ghost">Ⅰ</span>
        <span className="vlabel">PANTHEON — ANNO MMXXVI</span>
        <div>
          <div className="kick">Open hall of fame · {sports.length} disciplines · 633 immortals · one index</div>
          <h1 className="mega">
            EVERY<br />
            <span className="o">TROPHY.</span><br />
            ONE <em>HALL.</em>
          </h1>
          <div className="zh">万 神 殿</div>
        </div>
        <div className="herofoot">
          <span className="kick">{t("home.heroDesc")}</span>
          <Link href="/lol/leaderboard" className="kick" style={{ whiteSpace: "nowrap" }}>
            {t("home.exploreCta")} →
          </Link>
        </div>
      </section>

      {/* FEATURE — the headline immortal */}
      <section className="feature">
        <Link href={`/lol/players/${gp.id}`} className="fleft">
          <div className="cols" />
          <div style={{ position: "relative" }}>
            <div className="frank">No. 01 · {t("nav.lol")}</div>
            <h2 className="fname">{name(gp)}</h2>
            <div className="fmeta">
              {worlds > 0 && (
                <div><div className="lab">Worlds</div><div className="val">×{worlds}</div></div>
              )}
              {msi > 0 && <div><div className="lab">MSI</div><div className="val">×{msi}</div></div>}
              <div><div className="lab">{t("leaderboard.colRegion")}</div><div className="val">{gp.league}</div></div>
            </div>
            <div className="findex">
              <div className="lab kick">{t("player.honorIndex")}</div>
              <div className="big">{formatNumber(goat.score)}</div>
            </div>
          </div>
        </Link>
        <div className="fright">
          <Halftone />
          <span className="callout" style={{ left: "10%", top: "15%" }}>{gp.realName ?? name(gp)}</span>
          <span className="callout" style={{ left: "12%", bottom: "14%" }}>{t("home.goatBand")}</span>
        </div>
      </section>

      {/* INDEX OF IMMORTALS — each discipline's all-time #1 */}
      <section className="index">
        <div className="cols" />
        <div className="ihd">
          <span className="t">{t("home.topTitle")}</span>
          <span className="kick">{t("home.goatBand")}</span>
        </div>
        {immortals.map(({ s, p, score }) => (
          <Link key={s.id} href={`${s.basePath}/players/${p.id}`} className="irow">
            <span className="lab">{t(`nav.${s.id}`)}</span>
            <span className="nm">{name(p)}</span>
            <span className="sc">{formatNumber(score)}</span>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cols" />
        <h2>{t("home.ctaTitle")}</h2>
        <div style={{ marginTop: "34px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          <Link href="/lol/leaderboard" className="btn">{t("home.exploreCta")} →</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn" style={{ borderColor: "var(--border)", color: "var(--fg-2)" }}>
            {t("home.github")} ↗
          </a>
        </div>
      </section>
    </div>
  );
}
