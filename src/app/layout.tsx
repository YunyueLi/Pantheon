import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/provider";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

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
  },
  twitter: { card: "summary_large_image", title: "Pantheon — Competitive Honors", description: SITE_DESC },
};

const themeScript = `(function(){try{var m=localStorage.getItem('pantheon-mode');var e=document.documentElement;if(m==='light'){e.classList.remove('dark');}else if(m==='dark'){e.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LOCALE} className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <I18nProvider initialLocale={DEFAULT_LOCALE}>
          <ThemeProvider>
            <SiteNav />
            <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
            <SiteFooter />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
