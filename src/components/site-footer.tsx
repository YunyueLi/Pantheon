"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-10 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded bg-accent text-[10px] font-bold text-accent-contrast">
              P
            </span>
            <span className="text-sm font-semibold tracking-tight">Pantheon</span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-fg-subtle">{t("footer.tagline")}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
            {t("footer.exploreHeading")}
          </span>
          <Link href="/lol/leaderboard" className="text-fg-muted transition-colors hover:text-fg">
            {t("nav.leaderboard")}
          </Link>
          <Link href="/compare" className="text-fg-muted transition-colors hover:text-fg">
            {t("nav.compare")}
          </Link>
          <Link href="/methodology" className="text-fg-muted transition-colors hover:text-fg">
            {t("nav.methodology")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
