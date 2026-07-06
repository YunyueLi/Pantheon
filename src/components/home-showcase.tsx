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
  photoPos?: string;
  photoZoom?: number;
};

function initialsOf(name: string) {
  const clean = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "");
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return ((clean(parts[0])[0] ?? "") + (clean(parts[parts.length - 1])[0] ?? "")).toUpperCase();
  return clean(name).slice(0, 2).toUpperCase();
}

// Same radiant sunburst as the profile Portrait, so the carousel matches it.
const r2 = (v: number) => Math.round(v * 100) / 100;
const RAYS = Array.from({ length: 48 }, (_, k) => {
  const a = (k / 48) * Math.PI * 2;
  return { x: r2(200 + Math.cos(a) * 440), y: r2(210 + Math.sin(a) * 440) };
});

const DWELL = 5200; // ms each featured slide holds before auto-advancing

/**
 * The home showcase: a rotating spotlight of every discipline's all-time #1 (each
 * an epic B&W monument portrait + "enter" link into that sport), followed by the
 * register of immortals whose rows reveal the player's face on hover. Replaces the
 * old LoL-only feature so the home reads as one comprehensive hall.
 */
export function HomeShowcase({ immortals }: { immortals: Immortal[] }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const n = immortals.length;

  useEffect(() => {
    setReduce(!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Auto-advance. The timer resets on every slide change, so a manual pick still
  // gets a full dwell, and it stops entirely while paused (hover) or reduced-motion —
  // which is why the active tick's progress fill only renders when actually counting.
  useEffect(() => {
    if (paused || reduce || n <= 1) return;
    const id = setTimeout(() => setI((x) => (x + 1) % n), DWELL);
    return () => clearTimeout(id);
  }, [i, n, paused, reduce]);

  const go = (next: number) => {
    const to = ((next % n) + n) % n;
    setI(to);
    const btn = railRef.current?.children[to];
    if (btn instanceof HTMLElement) btn.focus();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Rotating spotlight — every discipline's #1 */}
      <section
        className="hs-feature"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
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
                  <svg className="hs-field" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden>
                    <defs>
                      <pattern id={`hsht${idx}`} width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="3" cy="3" r="1.15" fill="currentColor" />
                      </pattern>
                      <radialGradient id={`hsvig${idx}`} cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.92" />
                        <stop offset="48%" stopColor="currentColor" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="400" height="520" fill={`url(#hsht${idx})`} opacity="0.4" />
                    <g opacity="0.3">
                      {RAYS.map((r, k) => (
                        <line key={k} x1="200" y1="210" x2={r.x} y2={r.y} stroke="currentColor" strokeWidth="0.6" />
                      ))}
                    </g>
                    <rect className="field-bloom" width="400" height="520" fill={`url(#hsvig${idx})`} />
                  </svg>
                  {m.photoSrc ? (
                    (Math.abs(idx - i) <= 1 || Math.abs(idx - i) >= immortals.length - 1) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photoSrc}
                        alt=""
                        aria-hidden
                        className="hs-photo"
                        loading="lazy"
                        decoding="async"
                        style={{
                          objectPosition: m.photoPos ?? "50% 12%",
                          ...(m.photoZoom ? { transform: `scale(${m.photoZoom})`, transformOrigin: m.photoPos ?? "50% 12%" } : {}),
                        }}
                      />
                    )
                  ) : (
                    <span className="hs-mono">{initialsOf(m.name)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div
          ref={railRef}
          className="hs-rail"
          data-playing={!paused && !reduce}
          role="group"
          aria-label="Featured immortals"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1); }
            else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1); }
            else if (e.key === "Home") { e.preventDefault(); go(0); }
            else if (e.key === "End") { e.preventDefault(); go(n - 1); }
          }}
        >
          {immortals.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              className="hs-tick"
              data-active={idx === i}
              aria-current={idx === i ? "true" : undefined}
              aria-label={`${m.sportLabel} — ${m.name}`}
              tabIndex={idx === i ? 0 : -1}
              onClick={() => setI(idx)}
            >
              <span className="hs-tick__bar" />
              {idx === i && !paused && !reduce && (
                <span className="hs-tick__fill" style={{ animationDuration: `${DWELL}ms` }} />
              )}
              <span className="hs-tick__tip" aria-hidden>{m.name}</span>
            </button>
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
.hs-portrait{position:absolute;inset:0}
.hs-field{position:absolute;inset:0;width:100%;height:100%}
.hs-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 12%;filter:grayscale(1) contrast(1.5) brightness(1.04);-webkit-mask-image:radial-gradient(78% 72% at 50% 40%,#000 46%,transparent 100%);mask-image:radial-gradient(78% 72% at 50% 40%,#000 46%,transparent 100%)}
.hs-mono{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--font-display);font-weight:900;font-size:clamp(120px,20vw,280px);-webkit-text-stroke:1.5px var(--fg);color:transparent;opacity:.5}
.hs-rail{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);z-index:2;display:flex;align-items:flex-end;gap:0}
.hs-tick{position:relative;display:flex;align-items:flex-end;justify-content:center;width:16px;height:36px;padding:0;border:0;background:transparent;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hs-tick__bar{width:2px;height:10px;background:var(--border-strong);opacity:.5;transition:height .28s cubic-bezier(.2,.7,.2,1),opacity .2s,background-color .2s}
.hs-tick:hover .hs-tick__bar{opacity:.95;height:16px}
.hs-tick[data-active="true"] .hs-tick__bar{height:22px;background:var(--accent);opacity:1}
.hs-rail[data-playing="true"] .hs-tick[data-active="true"] .hs-tick__bar{opacity:.28}
.hs-tick__fill{position:absolute;bottom:0;left:50%;width:2px;height:22px;background:var(--accent);transform:translateX(-50%) scaleY(0);transform-origin:bottom;animation-name:hs-fill;animation-timing-function:linear;animation-fill-mode:forwards}
@keyframes hs-fill{to{transform:translateX(-50%) scaleY(1)}}
.hs-tick__tip{position:absolute;bottom:29px;left:50%;transform:translateX(-50%) translateY(3px);white-space:nowrap;font-family:var(--font-ui);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg);background:var(--raised);border:1px solid var(--border);padding:4px 8px;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease;box-shadow:0 6px 18px -6px rgba(0,0,0,.55)}
.hs-tick:hover .hs-tick__tip,.hs-tick:focus-visible .hs-tick__tip{opacity:1;transform:translateX(-50%) translateY(0)}
.hs-tick:focus-visible{outline:none}
.hs-tick:focus-visible .hs-tick__bar{opacity:1;height:15px;background:var(--accent)}
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
