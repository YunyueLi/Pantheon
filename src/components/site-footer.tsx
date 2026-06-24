"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <span className="font-display text-2xl font-extrabold uppercase tracking-[0.1em]">Pantheon</span>
          <span className="label ml-3 text-[11px] text-fg-subtle">万神殿</span>
          <p className="mt-3 font-mono text-[12px] leading-relaxed text-fg-subtle">{t("footer.tagline")}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="label text-[10px] text-fg-subtle">{t("footer.exploreHeading")}</span>
          <Link href="/lol/leaderboard" className="label text-[11px] text-fg-muted transition-colors hover:text-fg">
            {t("nav.leaderboard")}
          </Link>
          <Link href="/compare" className="label text-[11px] text-fg-muted transition-colors hover:text-fg">
            {t("nav.compare")}
          </Link>
          <Link href="/methodology" className="label text-[11px] text-fg-muted transition-colors hover:text-fg">
            {t("nav.methodology")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
