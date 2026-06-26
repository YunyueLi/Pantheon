"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export type Immortal = {
  sportId: string;
  sportLabel: string;
  basePath: string;
  id: string;
  name: string;
  honor: string;
  photoSrc?: string;
};

function initialsOf(name: string) {
  const clean = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return ((clean(parts[0])[0] ?? "") + (clean(parts[parts.length - 1])[0] ?? "")).toUpperCase();
  return clean(name).slice(0, 2).toUpperCase();
}

/**
 * The home showcase: a rotating spotlight of every discipline's all-time #1 (each
 * an epic B&W monument portrait + "enter" link into that sport), followed by the
 * register of immortals whose rows reveal the player's face on hover. Replaces the
 * old LoL-only feature so the home reads as one comprehensive hall.
 */
export function HomeShowcase({ immortals }: { immortals: Immortal[] }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const paused = useRef(false);
  const n = immortals.length;

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) setI((x) => (x + 1) % n);
    }, 5200);
    return () => clearInterval(id);
  }, [n]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Rotating spotlight — every discipline's #1 */}
      <section
        className="hs-feature"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        <div className="hs-stage">
          {immortals.map((m, idx) => (
            <Link
              key={m.id}
              href={`${m.basePath}/leaderboard`}
              className="hs-slide"
              data-active={idx === i}
              aria-hidden={idx !== i}
              tabIndex={idx === i ? 0 : -1}
            >
              <div className="hs-left">
                <div className="hs-rank">Nº {String(idx + 1).padStart(2, "0")} · {m.sportLabel}</div>
                <div className="hs-name">{m.name}</div>
                <div className="hs-meta">
                  <span className="hs-lab">{t("player.honorIndex")}</span>
                  <span className="hs-val">{m.honor}</span>
                </div>
                <span className="hs-enter">{t("home.exploreCta")} →</span>
              </div>
              <div className="hs-right">
                <div className="hs-portrait">
                  {m.photoSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photoSrc} alt="" aria-hidden className="hs-photo" />
                  ) : (
                    <span className="hs-mono">{initialsOf(m.name)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="hs-dots" role="tablist" aria-label="Featured immortals">
          {immortals.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              className="hs-dot"
              data-active={idx === i}
              role="tab"
              aria-selected={idx === i}
              aria-label={m.name}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      </section>

      {/* Register of immortals — hover reveals the face */}
      <section className="hs-index">
        <div className="hs-ihd">
          <span className="hs-t">{t("home.topTitle")}</span>
          <span className="hs-band">{t("home.goatBand")}</span>
        </div>
        {immortals.map((m, idx) => (
          <Link
            key={m.id}
            href={`${m.basePath}/players/${m.id}`}
            className="hs-row"
            data-reveal
            style={{ transitionDelay: `${Math.min(idx, 10) * 40}ms` }}
          >
            <span className="hs-row-lab">{m.sportLabel}</span>
            <span className="hs-row-nm">{m.name}</span>
            <span className="hs-row-sc">{m.honor}</span>
          </Link>
        ))}
      </section>
    </>
  );
}

const CSS = `
.hs-feature{position:relative;border-top:1px solid var(--border)}
.hs-stage{position:relative;min-height:82vh}
.hs-slide{position:absolute;inset:0;display:grid;grid-template-columns:1.15fr .85fr;opacity:0;visibility:hidden;transition:opacity .8s ease;pointer-events:none;color:inherit}
.hs-slide[data-active="true"]{opacity:1;visibility:visible;pointer-events:auto}
.hs-left{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:center;padding:60px clamp(20px,5vw,64px);min-height:82vh}
.hs-rank{font-family:var(--font-ui);font-weight:600;font-size:clamp(13px,1.5vw,17px);letter-spacing:.14em;text-transform:uppercase;color:var(--fg-2)}
.hs-name{font-family:var(--font-display);font-weight:900;font-size:clamp(46px,9vw,140px);line-height:.84;letter-spacing:-.02em;text-transform:uppercase;margin:12px 0 0}
.hs-meta{margin-top:36px}
.hs-lab{display:block;font-family:var(--font-ui);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg-2)}
.hs-val{display:block;font-family:var(--font-display);font-weight:800;font-size:clamp(40px,5vw,72px);line-height:1;margin-top:6px;font-variant-numeric:tabular-nums lining-nums}
.hs-enter{display:inline-block;margin-top:40px;font-family:var(--font-ui);text-transform:uppercase;letter-spacing:.16em;font-size:11px;color:var(--fg-2);transition:color .15s}
.hs-slide:hover .hs-enter{color:var(--accent)}
.hs-right{position:relative;border-left:1px solid var(--border);overflow:hidden}
.hs-portrait{position:absolute;inset:0;background:radial-gradient(60% 52% at 50% 38%,color-mix(in srgb,var(--fg) 12%,transparent),transparent 72%)}
.hs-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 12%;filter:grayscale(1) contrast(1.5) brightness(1.04);-webkit-mask-image:radial-gradient(78% 72% at 50% 40%,#000 46%,transparent 100%);mask-image:radial-gradient(78% 72% at 50% 40%,#000 46%,transparent 100%)}
.hs-mono{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--font-display);font-weight:900;font-size:clamp(120px,20vw,280px);-webkit-text-stroke:1.5px var(--fg);color:transparent;opacity:.5}
.hs-dots{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:2;display:flex;gap:10px}
.hs-dot{width:9px;height:9px;border:1px solid var(--border-strong);background:transparent;cursor:pointer;transition:background-color .2s,border-color .2s;padding:0}
.hs-dot[data-active="true"]{background:var(--accent);border-color:var(--accent)}
@media(max-width:860px){
.hs-slide{grid-template-columns:1fr}
.hs-right{display:none}
.hs-left{min-height:60vh}
.hs-stage{min-height:60vh}
}

.hs-index{position:relative;border-top:1px solid var(--border);padding:54px clamp(20px,5vw,64px) 18px}
.hs-ihd{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--border);padding-bottom:14px;gap:18px}
.hs-t{font-family:var(--font-display);font-weight:800;font-size:clamp(28px,4vw,40px);letter-spacing:-.01em;text-transform:uppercase}
.hs-band{font-family:var(--font-ui);text-transform:uppercase;letter-spacing:.2em;font-size:11px;color:var(--fg-2);text-align:right}
.hs-row{position:relative;display:grid;grid-template-columns:170px 1fr auto;align-items:center;gap:24px;padding:16px 0;border-bottom:1px solid var(--border);overflow:hidden;transition:background-color .18s;color:inherit}
.hs-row:hover{background:var(--accent-soft)}
.hs-row-lab{position:relative;z-index:1;font-family:var(--font-ui);font-size:11px;letter-spacing:.16em;color:var(--fg-2);text-transform:uppercase}
.hs-row-nm{position:relative;z-index:1;font-family:var(--font-display);font-weight:800;font-size:clamp(26px,5vw,50px);line-height:1;letter-spacing:-.01em;text-transform:uppercase;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:font-style .15s}
.hs-row:hover .hs-row-nm{font-style:italic}
.hs-row-sc{position:relative;z-index:1;font-family:var(--font-display);font-size:16px;font-variant-numeric:tabular-nums lining-nums}
@media(max-width:640px){
.hs-index{padding:44px 24px 18px}
.hs-row{grid-template-columns:84px 1fr auto;gap:8px 14px}
.hs-band{display:none}
}
`;
