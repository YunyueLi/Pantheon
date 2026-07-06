"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Download, Link2 } from "lucide-react";
import { shareMatchupCard } from "@/lib/share-card";
import { honorScore, normalizedAxes, countType, ranked } from "@/lib/sport/honor";
import type { Player } from "@/lib/sport/types";
import { useSport, useHonorLabel, useName, useLeagueLabel } from "@/lib/sport/provider";
import { cn, formatNumber } from "@/lib/utils";
import { playerPhoto } from "@/lib/player-photos";
import { photoFraming } from "@/lib/player-photo-framing";
import { PlayerPicker } from "@/components/player-picker";
import { CompareRadar } from "@/components/compare-radar";
import { TrophyIcon } from "@/components/trophy-icon";
import { Plate } from "@/components/ui/plate";
import { useI18n } from "@/lib/i18n/provider";

// The combatant's portrait behind one side of the duel — the same monument field as
// the profile (halftone + radiant bloom), the photo feathered toward the face and a
// scrim rising from the page colour so the name/index stay legible over it.
function DuelFace({ photo, pos, zoom, side }: { photo: string; pos?: string; zoom?: number; side: "a" | "b" }) {
  // Faces sit ~30-45% down a head-and-shoulders crop. object-position Y aligns the
  // image's Y% line to the box's Y% line, so anchoring at ~42% keeps the face in the
  // upper-middle of the (often wide, short) duel panel — not the hairline.
  const objectPosition = pos ?? "50% 42%";
  return (
    <div className="duel-portrait" aria-hidden>
      <svg className="duel-field" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`dht-${side}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.1" fill="currentColor" />
          </pattern>
          <radialGradient id={`dvig-${side}`} cx="50%" cy="32%" r="62%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.82" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="520" fill={`url(#dht-${side})`} opacity="0.3" />
        <rect className="field-bloom" width="400" height="520" fill={`url(#dvig-${side})`} />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="duel-photo"
        src={photo}
        alt=""
        aria-hidden
        decoding="async"
        fetchPriority="high"
        style={{ objectPosition, ...(zoom ? { transform: `scale(${zoom})`, transformOrigin: objectPosition } : {}) }}
      />
      <div className="duel-scrim" />
    </div>
  );
}

export function CompareView() {
  const { t, locale } = useI18n();
  const zh = locale === "zh";
  const { config, positionMeta } = useSport();
  const { players, model, headlineTypes } = config;
  const honorLabel = useHonorLabel();
  const leagueLabel = useLeagueLabel();
  const name = useName();
  const sp = useSearchParams();
  const has = (id: string) => players.some((p) => p.id === id);
  const rankedRows = useMemo(() => ranked(players, model), [players, model]);
  const [aId, setAId] = useState(() => (has(sp.get("a") ?? "") ? (sp.get("a") as string) : rankedRows[0]?.player.id));
  const [bId, setBId] = useState(() => (has(sp.get("b") ?? "") ? (sp.get("b") as string) : rankedRows[1]?.player.id));
  // Fall back safely if a sport ever has fewer than two ranked players (b→a) so the
  // duel renders instead of throwing on an undefined combatant.
  const a = players.find((p) => p.id === aId) ?? players[0];
  const b = players.find((p) => p.id === bId) ?? players.find((p) => p.id !== a?.id) ?? a;
  const aPhoto = playerPhoto(a.id)?.src;
  const bPhoto = playerPhoto(b.id)?.src;

  const aAxes = useMemo(() => normalizedAxes(a, players, model).map((d) => d.value), [aId]); // eslint-disable-line react-hooks/exhaustive-deps
  const bAxes = useMemo(() => normalizedAxes(b, players, model).map((d) => d.value), [bId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?a=${aId}&b=${bId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      if (navigator.share) navigator.share({ url, title: `${name(a)} vs ${name(b)}` }).catch(() => {});
    }
  };

  const [saving, setSaving] = useState(false);
  const subOf = (p: Player) => {
    const lg = leagueLabel(p.league);
    const pos = positionMeta(p.position)?.abbr;
    return pos ? `${lg} · ${pos}` : lg;
  };
  const saveCard = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await shareMatchupCard({
        sport: config.label,
        a: { name: name(a), sub: subOf(a), initials: a.name.slice(0, 2).toUpperCase(), honor: Math.round(honorScore(a, model)) },
        b: { name: name(b), sub: subOf(b), initials: b.name.slice(0, 2).toUpperCase(), honor: Math.round(honorScore(b, model)) },
        metrics: headlineTypes.map((type) => ({ label: honorLabel(type), a: countType(a, type), b: countType(b, type) })),
        filename: `${a.id}-vs-${b.id}`,
      });
    } finally {
      setSaving(false);
    }
  };

  // Tale of the tape — the honor index plus raw trophy counts, exact numbers, winner
  // emphasised. The 6 rated axes live in the radar below, so they aren't repeated here.
  const metrics: { label: string; av: number; bv: number; fmt?: (n: number) => string; type?: string }[] = [
    { label: t("player.honorIndex"), av: honorScore(a, model), bv: honorScore(b, model), fmt: formatNumber },
    ...headlineTypes.map((type) => ({ label: honorLabel(type), av: countType(a, type), bv: countType(b, type), type })),
  ];

  return (
    <div className="oracle">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.oracle{position:relative;overflow-x:hidden}
.oracle a{color:inherit}
.oracle .pad{padding-left:clamp(20px,5vw,64px);padding-right:clamp(20px,5vw,64px)}

.o-head{position:relative;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px;padding:58px 0 26px}
.o-head .kick{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.3em;font-size:11px;color:var(--fg-2)}
.o-head h1{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(32px,9vw,128px);line-height:.84;letter-spacing:-.02em;margin:14px 0 0}
.o-actions{display:flex;gap:10px}
.o-act{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-display);text-transform:uppercase;letter-spacing:.16em;font-size:11px;color:var(--fg-2);border:1px solid var(--border-strong);padding:11px 16px;transition:background-color .15s,color .15s}
.o-act:hover{background:var(--accent);color:var(--accent-contrast)}
.o-act:disabled{opacity:.5}

.duel{position:relative;display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.duel-vs{left:50%;top:50%;transform:translate(-50%,-50%);font-size:clamp(120px,20vw,300px);font-style:italic;z-index:2;opacity:.13}
.duel-seam{position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--border)}
.duel-side{position:relative;z-index:1;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;min-height:56vh;padding:48px clamp(20px,5vw,64px) 40px}
.duel-side.right{align-items:flex-end;text-align:right}
/* combatant portrait behind each side */
.duel-portrait{position:absolute;inset:0;z-index:0;color:var(--fg);pointer-events:none}
.duel-field{position:absolute;inset:0;width:100%;height:100%}
.duel-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.5) brightness(1.02);opacity:.9;-webkit-mask-image:radial-gradient(82% 74% at 50% 42%,#000 48%,transparent 100%);mask-image:radial-gradient(82% 74% at 50% 42%,#000 48%,transparent 100%)}
.duel-scrim{position:absolute;inset:0;background:linear-gradient(to top,var(--bg) 16%,color-mix(in srgb,var(--bg) 52%,transparent) 42%,transparent 72%)}
.duel-content{position:relative;z-index:2;display:flex;flex-direction:column}
.duel-side.right .duel-content{align-items:flex-end;text-align:right}
.side-meta{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.18em;font-size:11px;color:var(--fg-2)}
.side-name{font-family:var(--font-display);font-weight:900;text-transform:uppercase;line-height:.86;letter-spacing:-.02em;font-size:clamp(26px,6vw,88px);margin:10px 0 0;word-break:break-word}
.side-idx{margin-top:20px;display:flex;align-items:baseline;gap:12px}
.duel-side.right .side-idx{flex-direction:row-reverse}
.side-idx .lab{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.16em;font-size:10px;color:var(--fg-2)}
.side-idx .val{font-family:var(--font-display);font-weight:900;font-variant-numeric:tabular-nums;font-size:clamp(34px,5vw,68px);line-height:.8}
.side-pick{margin-top:26px;width:100%;max-width:320px}
.duel-side.right .side-pick{margin-left:auto}
/* On phones the side-by-side duel can't fit two names — stack the combatants. */
@media(max-width:680px){
.duel{grid-template-columns:1fr}
.duel-seam{display:none}
.duel-vs{display:none}
.duel-side{min-height:46vh;padding:30px clamp(20px,5vw,64px)}
.duel-side.b{border-top:1px solid var(--border)}
.duel-side.right{align-items:flex-start;text-align:left}
.duel-side.right .duel-content{align-items:flex-start;text-align:left}
.duel-side.right .side-idx{flex-direction:row}
.duel-side.right .side-pick{margin-left:0}
}

.sec{position:relative;padding-bottom:46px}
.tape{margin-top:8px}
.tape-row{display:grid;grid-template-columns:1fr minmax(110px,auto) 1fr;align-items:center;gap:16px;border-bottom:1px solid var(--border);padding:22px 0}
.tape-row .num{font-family:var(--font-display);font-weight:800;font-variant-numeric:tabular-nums;font-size:clamp(34px,6vw,80px);line-height:.82}
.tape-row .num.l{text-align:left}
.tape-row .num.r{text-align:right}
.tape-row .num.win{color:var(--fg)}
.tape-row .num.lose{color:transparent;-webkit-text-stroke:1px var(--fg-3)}
.tape-row .lab{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.tape-row .lab .t{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.14em;font-size:10px;color:var(--fg-2);line-height:1.3}
.tape-key{display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding:0 0 14px;font-family:var(--font-display);font-size:14px}
.tape-key .dot{display:inline-block;width:9px;height:9px;border-radius:9999px;margin:0 8px}

.radar-frame{position:relative;margin-top:18px;border:1px solid var(--border);padding:24px 14px}
.radar-frame .col-grid{opacity:.5}
.radar-frame .inner{position:relative;width:100%}
`,
        }}
      />

      <header className="o-head pad">
        <div className="col-grid" />
        <div style={{ position: "relative" }} data-reveal>
          <p className="kick">{t("compare.eyebrow")}</p>
          <h1>{t("compare.title")}</h1>
        </div>
        <div className="o-actions" style={{ position: "relative" }}>
          <button type="button" onClick={saveCard} disabled={saving} className="o-act">
            <Download className="h-3.5 w-3.5" /> {t("compare.saveImage")}
          </button>
          <button type="button" onClick={share} aria-live="polite" className="o-act">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            {copied ? t("compare.copied") : t("compare.share")}
          </button>
        </div>
      </header>

      {/* The duel — two combatants across a central seam. */}
      <section className="duel" data-reveal>
        <div className="col-grid" />
        <span className="ghost-glyph duel-vs">VS</span>
        <div className="duel-seam" />
        <div className="duel-side a">
          {aPhoto && <DuelFace photo={aPhoto} pos={photoFraming(a.id)?.pos} zoom={photoFraming(a.id)?.zoom} side="a" />}
          <div className="duel-content">
            <div className="side-meta">{subOf(a)}</div>
            <div className="side-name">{name(a)}</div>
            <div className="side-idx">
              <span className="lab">{t("player.honorIndex")}</span>
              <span className="val">{formatNumber(honorScore(a, model))}</span>
            </div>
            <div className="side-pick">
              <PlayerPicker value={aId} onSelect={setAId} exclude={bId} />
            </div>
          </div>
        </div>
        <div className="duel-side b right">
          {bPhoto && <DuelFace photo={bPhoto} pos={photoFraming(b.id)?.pos} zoom={photoFraming(b.id)?.zoom} side="b" />}
          <div className="duel-content">
            <div className="side-meta">{subOf(b)}</div>
            <div className="side-name">{name(b)}</div>
            <div className="side-idx">
              <span className="lab">{t("player.honorIndex")}</span>
              <span className="val">{formatNumber(honorScore(b, model))}</span>
            </div>
            <div className="side-pick">
              <PlayerPicker value={bId} onSelect={setBId} exclude={aId} />
            </div>
          </div>
        </div>
      </section>

      {/* Tale of the tape */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅰ" title={zh ? "硬荣誉对账" : "Tale of the Tape"} />
        <div className="tape-key" style={{ marginTop: "18px" }}>
          <span>
            <span className="dot" style={{ background: "var(--accent)" }} />
            {name(a)}
          </span>
          <span>
            {name(b)}
            <span className="dot" style={{ background: "var(--fg-3)" }} />
          </span>
        </div>
        <div className="tape">
          {metrics.map((m, i) => {
            const aWin = m.av > m.bv;
            const bWin = m.bv > m.av;
            const fmt = m.fmt ?? ((n: number) => String(n));
            return (
              <div key={m.label} className="tape-row" data-reveal style={{ transitionDelay: `${Math.min(i, 8) * 45}ms` }}>
                <span className={cn("num l", aWin ? "win" : bWin ? "lose" : "win")}>{fmt(m.av)}</span>
                <span className="lab">
                  {m.type && <TrophyIcon type={m.type} size={16} className="text-fg-subtle" />}
                  <span className="t">{m.label}</span>
                </span>
                <span className={cn("num r", bWin ? "win" : aWin ? "lose" : "win")}>{fmt(m.bv)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radar — the rated dimensions */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅱ" title={zh ? "六维评定" : "The Dimensions"} />
        <div className="radar-frame">
          <div className="col-grid" />
          <div className="inner">
            <CompareRadar a={{ label: name(a), values: aAxes }} b={{ label: name(b), values: bAxes }} axes={model.axes} />
          </div>
        </div>
      </section>
    </div>
  );
}
