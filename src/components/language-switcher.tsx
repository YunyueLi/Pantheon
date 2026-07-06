"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// Globe icon → dropdown of every locale. Built on Radix DropdownMenu (like the
// sport switcher) so it is fully keyboard-operable — Enter/Space to open, arrow
// keys to move, Enter to pick, Esc to close — with proper menu/menuitem roles.
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Language"
        className="flex h-8 w-8 items-center justify-center text-fg-subtle outline-none transition-colors hover:text-fg"
      >
        <Globe className="h-4 w-4" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[10rem] border border-border bg-raised p-1 shadow-pop data-[state=open]:animate-fade-up"
        >
          {LOCALES.map((l) => (
            <DropdownMenu.Item
              key={l}
              onSelect={() => setLocale(l)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-6 px-2.5 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-surface-2",
                l === locale ? "text-fg" : "text-fg-muted"
              )}
            >
              <span>{LOCALE_LABELS[l]}</span>
              {l === locale && <Check className="h-3.5 w-3.5 text-accent" aria-hidden />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
