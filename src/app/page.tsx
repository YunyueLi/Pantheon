"use client";

import Link from "next/link";
import { listSports } from "@/lib/sport/registry";
import { ranked } from "@/lib/sport/honor";
import { formatNumber } from "@/lib/utils";
import { playerPhoto } from "@/lib/player-photos";
import { useI18n } from "@/lib/i18n/provider";
import { HomeShowcase, type Immortal } from "@/components/home-showcase";

const GITHUB_URL = "https://github.com/YunyueLi/Pantheon";

export default function Home() {
  const { t, locale } = useI18n();
  const name = (e: { name: string; i18n?: Record<string, string> }) => e.i18n?.[locale] ?? e.name;
  const sports = listSports();
  const total = sports.reduce((acc, s) => acc + s.players.length, 0);

  const immortals: Immortal[] = sports
    .map((s) => {
      const g = ranked(s.players, s.model)[0];
      if (!g) return null;
      return {
        sportId: s.id,
        sportLabel: t(`nav.${s.id}`),
        basePath: s.basePath,
        id: g.player.id,
        name: name(g.player),
        honor: formatNumber(g.score),
        photoSrc: playerPhoto(g.player.id)?.src,
      } as Immortal;
    })
    .filter(Boolean) as Immortal[];

  return (
    <div className="home">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.home{position:relative;overflow:hidden}
.home .cols{position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(90deg,var(--border) 0 1px,transparent 1px calc(100%/6))}
.home .kick{font-family:var(--font-ui);text-transform:uppercase;letter-spacing:.26em;font-size:11px;color:var(--fg-2)}
.home .hero{position:relative;min-height:78vh;padding:62px 48px 40px;display:flex;flex-direction:column;justify-content:space-between}
.home .ghost{position:absolute;right:-30px;top:-130px;font-family:var(--font-display);font-weight:900;font-size:560px;line-height:1;color:var(--fg);opacity:.05;pointer-events:none}
.home .vlabel{position:absolute;right:22px;top:44%;writing-mode:vertical-rl;text-orientation:mixed;font-family:var(--font-display);text-transform:uppercase;font-size:11px;letter-spacing:.4em;color:var(--fg-2)}
.home .mega{position:relative;font-family:var(--font-display);font-weight:900;font-size:clamp(42px,12vw,176px);line-height:.84;letter-spacing:-.02em;margin:18px 0 0}
.home .mega .o{-webkit-text-stroke:2px var(--fg);color:transparent}
.home .mega em{font-style:italic;font-weight:800}
.home .zh{font-family:var(--font-display);font-size:20px;letter-spacing:.5em;color:var(--fg-2);margin-top:22px}
.home .herofoot{position:relative;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}

.home .cta{position:relative;text-align:center;padding:96px 48px;border-top:1px solid var(--border)}
.home .cta h2{font-family:var(--font-display);font-weight:900;font-size:clamp(40px,7vw,84px);line-height:.92;letter-spacing:-.02em;text-transform:uppercase;max-width:18ch;margin:0 auto}
.home .btn{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.2em;font-size:12px;border:1px solid var(--border-strong);padding:15px 26px;display:inline-block;transition:background-color .15s,color .15s}
.home .btn:hover{background:var(--accent);color:var(--accent-contrast)}
@media(max-width:640px){.home .vlabel{display:none}.home .hero{padding:54px 24px 40px}.home .cta{padding:64px 24px}}
`,
        }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="cols" />
        <span className="ghost">Ⅰ</span>
        <span className="vlabel">PANTHEON — ANNO MMXXVI</span>
        <div data-reveal>
          <div className="kick">Open hall of fame · {sports.length} disciplines · {total} immortals · one index</div>
          <h1 className="mega">
            EVERY<br />
            <span className="o">TROPHY.</span><br />
            ONE <em>HALL.</em>
          </h1>
          <div className="zh">万 神 殿</div>
        </div>
        <div className="herofoot">
          <span className="kick">{t("home.heroDesc")}</span>
          <Link href={`${sports[0].basePath}/leaderboard`} className="kick" style={{ whiteSpace: "nowrap" }}>
            {t("home.exploreCta")} →
          </Link>
        </div>
      </section>

      {/* Rotating spotlight of every discipline's #1 + the register of immortals */}
      <HomeShowcase immortals={immortals} />

      {/* CTA */}
      <section className="cta">
        <div className="cols" />
        <h2 data-reveal>{t("home.ctaTitle")}</h2>
        <div style={{ marginTop: "34px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          <Link href={`${sports[0].basePath}/leaderboard`} className="btn">{t("home.exploreCta")} →</Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn" style={{ borderColor: "var(--border)", color: "var(--fg-2)" }}>
            {t("home.github")} ↗
          </a>
        </div>
      </section>
    </div>
  );
}
