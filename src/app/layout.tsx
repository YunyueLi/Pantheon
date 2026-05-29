import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/provider";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
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

export const metadata: Metadata = {
  title: "Pantheon — Competitive Honors",
  description:
    "A visual hall of fame for competitive sport. Trophy cabinets, a transparent honor index, and head-to-head comparison across regions and roles.",
};

const themeScript = `(function(){try{var m=localStorage.getItem('pantheon-mode');var e=document.documentElement;if(m==='light'){e.classList.remove('dark');}else if(m==='dark'){e.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = cookies().get("pantheon-locale")?.value;
  const initialLocale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  return (
    <html lang={initialLocale} className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <I18nProvider initialLocale={initialLocale}>
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
