"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeControls } from "@/components/theme-controls";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PlayerSearch } from "@/components/player-search";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", key: "nav.explore" },
  { href: "/lol/leaderboard", key: "nav.leaderboard" },
  { href: "/compare", key: "nav.compare" },
  { href: "/methodology", key: "nav.methodology" },
];

export function SiteNav() {
  const path = usePathname();
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color:var(--bg-glass)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-[11px] font-bold text-accent-contrast">
              P
            </span>
            <span className="text-sm font-semibold tracking-tight">Pantheon</span>
          </Link>
          <nav className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((l) => {
              const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
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
        </div>
      </div>
    </header>
  );
}
