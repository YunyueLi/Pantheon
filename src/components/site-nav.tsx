"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";
import { ThemeControls } from "@/components/theme-controls";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PlayerSearch } from "@/components/player-search";
import { SportSwitcher } from "@/components/sport-switcher";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

function sectionLinks(sport: string) {
  if (sport === "football") {
    return [
      { href: "/football/leaderboard", key: "nav.leaderboard" },
      { href: "/football/clubs", key: "nav.clubs" },
      { href: "/football/compare", key: "nav.compare" },
      { href: "/football/methodology", key: "nav.methodology" },
    ];
  }
  if (sport === "basketball") {
    return [
      { href: "/basketball/leaderboard", key: "nav.leaderboard" },
      { href: "/basketball/clubs", key: "nav.clubs" },
      { href: "/basketball/compare", key: "nav.compare" },
      { href: "/basketball/methodology", key: "nav.methodology" },
    ];
  }
  if (sport === "lol") {
    return [
      { href: "/lol/leaderboard", key: "nav.leaderboard" },
      { href: "/lol/teams", key: "nav.teams" },
      { href: "/lol/compare", key: "nav.compare" },
      { href: "/lol/methodology", key: "nav.methodology" },
    ];
  }
  // Individual sports (F1, table tennis, Go) and esports without a club/team page.
  return [
    { href: `/${sport}/leaderboard`, key: "nav.leaderboard" },
    { href: `/${sport}/compare`, key: "nav.compare" },
    { href: `/${sport}/methodology`, key: "nav.methodology" },
  ];
}

const SPORT_PREFIXES = ["football", "basketball", "f1", "table-tennis", "go", "dota2", "valorant"];

export function SiteNav() {
  const path = usePathname();
  const { t } = useI18n();
  const sport = SPORT_PREFIXES.find((s) => path.startsWith(`/${s}`)) ?? "lol";
  const links = sectionLinks(sport);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color:var(--bg-glass)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-[11px] font-bold text-accent-contrast">
              P
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:inline">Pantheon</span>
          </Link>
          <SportSwitcher />
          <nav className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => {
              const active = path.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition-colors",
                    active ? "text-fg" : "text-fg-subtle hover:text-fg"
                  )}
                >
                  {t(l.key)}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <PlayerSearch />
          <LanguageSwitcher />
          <ThemeControls />
          <a
            href="https://github.com/YunyueLi/Pantheon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star Pantheon on GitHub"
            className="flex h-8 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs text-fg-subtle transition-colors hover:border-border-strong hover:text-fg"
          >
            <GithubMark className="h-3.5 w-3.5" />
            <span className="hidden font-medium sm:inline">Star</span>
            <Star className="h-3 w-3 fill-[color:var(--medal-gold)] text-[color:var(--medal-gold)]" />
          </a>
        </div>
      </div>

      {/* Mobile section nav: wraps instead of overflowing, since the desktop row is hidden < md. */}
      <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-border px-4 py-2 md:hidden">
        {links.map((l) => {
          const active = path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[13px] transition-colors",
                active ? "bg-surface-2 text-fg" : "text-fg-subtle hover:text-fg"
              )}
            >
              {t(l.key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
