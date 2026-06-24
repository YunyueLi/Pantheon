// Client-side "tale of the tape" share card. The site is statically hosted, so a
// per-pairing Open Graph image (which would need a server to read ?a=&b=) isn't
// possible — instead we render the specific matchup to a 1200×630 PNG in the
// browser and hand it to the native share sheet (with a download fallback). Pure
// SVG shapes + text only, so the canvas stays untainted and toBlob() works.

export type CardPlayer = { name: string; sub: string; initials: string; honor: number };
export type CardMetric = { label: string; a: number; b: number };

const W = 1200;
const H = 630;

// Dark-theme brand tokens, hardcoded (CSS vars don't resolve in a detached SVG).
const C = {
  bg: "#0a0a0b",
  panel: "#121214",
  chip: "#161619",
  border: "#232327",
  fg: "#f4f4f5",
  fg2: "#a1a1aa",
  fg3: "#6e6e77",
  gold: "#d9be7a",
};
const FONT =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans', 'Noto Sans CJK SC', sans-serif";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (n: number) => n.toLocaleString("en-US");

function buildSvg(sport: string, a: CardPlayer, b: CardPlayer, metrics: CardMetric[]): string {
  const col = (cx: number, p: CardPlayer) => `
    <circle cx="${cx}" cy="232" r="46" fill="${C.chip}" stroke="${C.gold}" stroke-width="2"/>
    <text x="${cx}" y="232" font-family="${FONT}" font-size="34" font-weight="600" fill="${C.gold}"
      text-anchor="middle" dominant-baseline="central">${esc(p.initials)}</text>
    <text x="${cx}" y="320" font-family="${FONT}" font-size="42" font-weight="700" fill="${C.fg}" text-anchor="middle">${esc(p.name)}</text>
    <text x="${cx}" y="354" font-family="${FONT}" font-size="20" fill="${C.fg2}" text-anchor="middle" letter-spacing="1">${esc(p.sub)}</text>
    <text x="${cx}" y="424" font-family="${FONT}" font-size="58" font-weight="700" fill="${C.gold}" text-anchor="middle">${fmt(p.honor)}</text>
    <text x="${cx}" y="452" font-family="${FONT}" font-size="15" fill="${C.fg3}" text-anchor="middle" letter-spacing="2">HONOR INDEX</text>`;

  const n = metrics.length || 1;
  const cells = metrics
    .map((m, i) => {
      const cx = 100 + ((i + 0.5) * (W - 200)) / n;
      const aWin = m.a > m.b;
      const bWin = m.b > m.a;
      const aFill = aWin ? C.gold : C.fg2;
      const bFill = bWin ? C.gold : C.fg2;
      const aWeight = aWin ? "700" : "400";
      const bWeight = bWin ? "700" : "400";
      return `
        <text x="${cx}" y="524" font-family="${FONT}" font-size="15" fill="${C.fg3}" text-anchor="middle" letter-spacing="1.5">${esc(
          m.label.toUpperCase()
        )}</text>
        <text x="${cx}" y="566" font-family="${FONT}" font-size="30" text-anchor="middle">
          <tspan fill="${aFill}" font-weight="${aWeight}">${fmt(m.a)}</tspan><tspan fill="${C.fg3}" font-weight="400">  ·  </tspan><tspan fill="${bFill}" font-weight="${bWeight}">${fmt(
        m.b
      )}</tspan>
        </text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="24" fill="${C.panel}" stroke="${C.border}" stroke-width="1.5"/>
    <circle cx="84" cy="92" r="5" fill="${C.gold}"/>
    <text x="100" y="98" font-family="${FONT}" font-size="22" font-weight="700" fill="${C.fg}" letter-spacing="3">PANTHEON</text>
    <text x="${W - 80}" y="98" font-family="${FONT}" font-size="18" fill="${C.fg2}" text-anchor="end" letter-spacing="1">${esc(sport)}</text>
    <text x="${W / 2}" y="150" font-family="${FONT}" font-size="16" fill="${C.fg3}" text-anchor="middle" letter-spacing="4">HEAD TO HEAD</text>
    ${col(330, a)}
    ${col(870, b)}
    <text x="${W / 2}" y="300" font-family="${FONT}" font-size="36" font-weight="700" fill="${C.gold}" text-anchor="middle">VS</text>
    <line x1="100" y1="486" x2="${W - 100}" y2="486" stroke="${C.border}" stroke-width="1"/>
    ${cells}
    <text x="${W / 2}" y="600" font-family="${FONT}" font-size="14" fill="${C.fg3}" text-anchor="middle" letter-spacing="1">pantheon.ungetsu.net</text>
  </svg>`;
}

function svgToPng(svg: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("no 2d context"));
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((png) => (png ? resolve(png) : reject(new Error("toBlob failed"))), "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("svg load failed"));
    };
    img.src = url;
  });
}

/** Render the matchup to a PNG and share it (native sheet) or download it. */
export async function shareMatchupCard(opts: {
  sport: string;
  a: CardPlayer;
  b: CardPlayer;
  metrics: CardMetric[];
  filename: string;
}): Promise<void> {
  const png = await svgToPng(buildSvg(opts.sport, opts.a, opts.b, opts.metrics));
  const file = new File([png], `${opts.filename}.png`, { type: "image/png" });

  // Prefer the native share sheet with the image attached (mobile); fall back to a download.
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: `${opts.a.name} vs ${opts.b.name}` });
      return;
    } catch {
      /* user cancelled — fall through to download */
    }
  }
  const url = URL.createObjectURL(png);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${opts.filename}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
