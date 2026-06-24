"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { listSports } from "@/lib/sport/registry";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Labeled dropdown anchored on the current sport. Replaces the row of per-sport
 * pills so the control stays one fixed-width trigger no matter how many sports
 * exist — scales cleanly and fits portrait mobile.
 */
export function SportSwitcher() {
  const path = usePathname();
  const { t } = useI18n();
  const sports = listSports();
  const current = sports.find((s) => path.startsWith(s.basePath)) ?? sports[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="label flex h-8 items-center gap-1.5 px-1 text-[11px] text-fg outline-none transition-colors hover:text-fg-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="hidden sm:inline">{t(`nav.${current.id}`)}</span>
        <ChevronDown className="h-3.5 w-3.5 text-fg-subtle" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 min-w-[10rem] border border-border bg-raised p-1 shadow-pop data-[state=open]:animate-fade-up"
        >
          {sports.map((s) => {
            const active = s.id === current.id;
            return (
              <DropdownMenu.Item key={s.id} asChild>
                <Link
                  href={`${s.basePath}/leaderboard`}
                  className={cn(
                    "label flex cursor-pointer items-center justify-between gap-6 px-2.5 py-2 text-[11px] outline-none transition-colors data-[highlighted]:bg-surface-2",
                    active ? "text-fg" : "text-fg-muted"
                  )}
                >
                  {t(`nav.${s.id}`)}
                  {active && <Check className="h-3.5 w-3.5 text-accent" />}
                </Link>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
