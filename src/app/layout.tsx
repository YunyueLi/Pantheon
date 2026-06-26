import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display, IBM_Plex_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

// Latin display = high-contrast Didone (Hermes-style giant caps). CJK = Noto Serif SC
// (思源宋体), a Song with matching thick/thin contrast. globals.css composes the two
// into --font-display so every serif rule gets the right glyph per script.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-latin",
  display: "swap",
});
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cjk",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/provider";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ScrollReveal } from "@/components/reveal";
import { Analytics } from "@/components/analytics";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const SITE_URL = "https://pantheon.ungetsu.net";
const SITE_DESC =
  "A visual hall of fame for competitive sport. Trophy cabinets, a transparent honor index, and head-to-head comparison across regions and roles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Pantheon — Competitive Honors", template: "%s | Pantheon" },
  description: SITE_DESC,
  applicationName: "Pantheon",
  openGraph: {
    type: "website",
    siteName: "Pantheon",
    title: "Pantheon — Competitive Honors",
    description: SITE_DESC,
    url: SITE_URL,
    images: ["/og/default.png"],
  },
  twitter: { card: "summary_large_image", title: "Pantheon — Competitive Honors", description: SITE_DESC, images: ["/og/default.png"] },
};

const themeScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var m=localStorage.getItem('pantheon-mode');if(m==='paper'){d.classList.add('paper');}else if(m==='crimson'||m==='light'){}else{d.classList.add('dark');}}catch(_){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${plexMono.variable} ${notoSerifSC.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Analytics />
      </head>
      <body className="antialiased">
        {/* Duotone filter for the .paper theme: maps photo shadows→ink, highlights→cream
            so portraits read as an on-palette gravure instead of a dark blob on cream.
            Referenced by .paper .portrait-photo / .hs-photo / .duel-photo in globals.css. */}
        <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
          <filter id="pantheon-duo" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.14 0.95" />
              <feFuncG type="table" tableValues="0.11 0.93" />
              <feFuncB type="table" tableValues="0.08 0.89" />
            </feComponentTransfer>
          </filter>
        </svg>
        <I18nProvider initialLocale={DEFAULT_LOCALE}>
          <ThemeProvider>
            <ScrollReveal />
            <SiteNav />
            <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
            <SiteFooter />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
