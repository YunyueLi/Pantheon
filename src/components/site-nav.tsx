"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeControls } from "@/components/theme-controls";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PlayerSearch } from "@/components/player-search";
import { SportSwitcher } from "@/components/sport-switcher";
import { listSports } from "@/lib/sport/registry";
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

export function SiteNav() {
  const path = usePathname();
  const { t } = useI18n();
  // Segment-safe match so a new id can't be shadowed by a prefix of another
  // (e.g. `/golf` must not resolve to `go`, `/mlbb` must not resolve to `mlb`).
  const sport =
    listSports()
      .map((s) => s.id)
      .find((id) => id !== "lol" && (path === `/${id}` || path.startsWith(`/${id}/`))) ?? "lol";
  const links = sectionLinks(sport);
  // Methodology is the "how it's computed" colophon — it sits on the right rail with
  // the utility controls, set apart from the browse sections (rank / teams / compare).
  const browseLinks = links.filter((l) => l.key !== "nav.methodology");
  const methodology = links.find((l) => l.key === "nav.methodology");
  return (
    <header className="sticky top-0 z-50 transform-gpu border-b border-border bg-[color:var(--bg-glass)] backdrop-blur-lg backdrop-saturate-150">
      <div className="relative flex h-16 items-center justify-between gap-4 px-[clamp(20px,5vw,64px)]">
        {/* Left — sport context + section links */}
        <div className="flex items-center gap-5">
          <SportSwitcher />
          <nav className="hidden items-center gap-5 lg:flex">
            {browseLinks.map((l) => {
              const active = path.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "label text-[11px] transition-colors",
                    active ? "text-fg" : "text-fg-subtle hover:text-fg"
                  )}
                >
                  {t(l.key)}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center — wordmark, optically centered on the bar regardless of side widths */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-display text-base font-extrabold uppercase tracking-[0.08em] text-fg sm:text-2xl sm:tracking-[0.18em]"
        >
          Pantheon
        </Link>

        {/* Right — methodology colophon + utility controls */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-4">
          {methodology && (
            <>
              <Link
                href={methodology.href}
                className={cn(
                  "label hidden text-[11px] transition-colors lg:inline",
                  path.startsWith(methodology.href) ? "text-fg" : "text-fg-subtle hover:text-fg"
                )}
              >
                {t(methodology.key)}
              </Link>
              <span aria-hidden className="mr-1 hidden h-4 w-px bg-border lg:block" />
            </>
          )}
          <PlayerSearch />
          <LanguageSwitcher />
          <ThemeControls />
          <a
            href="https://github.com/YunyueLi/Pantheon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star Pantheon on GitHub"
            className="hidden h-8 w-8 items-center justify-center text-fg-subtle transition-colors hover:text-fg sm:flex"
          >
            <GithubMark className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Compact section nav (< lg): wraps to its own row instead of overflowing, since the
          desktop links are hidden below lg to clear the absolutely-centered wordmark. */}
      <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-border px-4 py-2 lg:hidden">
        {links.map((l) => {
          const active = path.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "label px-2 py-1 text-[11px] transition-colors",
                active ? "text-fg" : "text-fg-subtle hover:text-fg"
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
