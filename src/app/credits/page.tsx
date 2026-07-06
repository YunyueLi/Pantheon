"use client";

import { listSports } from "@/lib/sport/registry";
import { PLAYER_PHOTOS } from "@/lib/player-photos";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Attribution page for the freely-licensed player portraits. Every entry in
 * PLAYER_PHOTOS is listed with its photographer, license (linked), and source —
 * satisfying the credit terms of CC BY / CC BY-SA images sourced from Wikimedia
 * Commons. Portraits are shown with a monochrome duotone treatment for display.
 */
export default function CreditsPage() {
  const { t, locale } = useI18n();
  const meta = new Map<string, { name: string; sport: string }>();
  for (const s of listSports()) {
    for (const p of s.players) {
      if (PLAYER_PHOTOS[p.id]) meta.set(p.id, { name: p.i18n?.[locale] ?? p.name, sport: t(`nav.${s.id}`) });
    }
  }
  const entries = Object.entries(PLAYER_PHOTOS).map(([id, c]) => ({ id, ...c, ...(meta.get(id) ?? { name: id, sport: "" }) }));

  return (
    <div className="credits">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.credits{position:relative;min-height:70vh}
.credits .pad{padding-inline:clamp(20px,5vw,64px)}
.credits .head{position:relative;padding-block:56px 22px;border-bottom:1px solid var(--border)}
.credits .head .mega{font-family:var(--font-display);font-weight:900;font-size:clamp(40px,7vw,92px);line-height:.9;letter-spacing:-.02em;text-transform:uppercase;margin:14px 0 0}
.credits .head .note{font-family:var(--font-display);font-size:13px;color:var(--fg-2);margin-top:16px;max-width:60ch;line-height:1.5}
.credits .row{display:grid;grid-template-columns:1.4fr 1fr auto auto;align-items:baseline;gap:24px;padding-block:18px;border-bottom:1px solid var(--border)}
.credits .row .nm{font-family:var(--font-display);font-weight:800;font-size:clamp(18px,2.4vw,26px);text-transform:uppercase;letter-spacing:-.01em}
.credits .row .nm small{display:block;font-weight:600;font-size:10px;letter-spacing:.2em;color:var(--fg-3);text-transform:uppercase;margin-top:4px}
.credits .row .by{font-family:var(--font-display);font-size:13px;color:var(--fg-2)}
.credits .row a{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--fg-2);white-space:nowrap;transition:color .15s}
.credits .row a:hover{color:var(--accent)}
.credits .row .lic{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:var(--fg-2);white-space:nowrap}
.credits .empty{font-family:var(--font-display);color:var(--fg-2);padding-block:40px}
@media(max-width:680px){.credits .row{grid-template-columns:1fr auto;gap:6px 14px}.credits .row .by{grid-column:1/-1;order:3}}
`,
        }}
      />
      <header className="head pad">
        <span className="label">PANTHEON · {t("footer.credits")}</span>
        <h1 className="mega">{t("footer.credits")}</h1>
        <p className="note">
          Player portraits are sourced from Wikimedia Commons under the licenses listed below and shown with a
          monochrome duotone treatment. All rights remain with the original photographers.
        </p>
      </header>
      <section className="pad">
        {entries.length === 0 ? (
          <p className="empty">{locale === "zh" ? "暂无肖像致谢。" : "No portraits credited yet."}</p>
        ) : (
          entries.map((e) => (
            <div className="row" key={e.id}>
              <span className="nm">
                {e.name}
                {e.sport && <small>{e.sport}</small>}
              </span>
              <span className="by">{e.author}</span>
              {e.licenseUrl ? (
                <a
                  href={e.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${e.name} ${e.license} license`}
                >
                  {e.license} <span aria-hidden>↗</span>
                </a>
              ) : (
                <span className="lic">{e.license}</span>
              )}
              <a
                href={e.source}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${e.name} source`}
              >
                Source <span aria-hidden>↗</span>
              </a>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
