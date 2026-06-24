"use client";

import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// Globe icon → dropdown of every locale. Icon-only trigger (no inline text) so it
// sits as a pure icon in the nav's right rail; flat (no pill).
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-label="Language"
        className="flex h-8 w-8 items-center justify-center text-fg-subtle transition-colors hover:text-fg"
      >
        <Globe className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-40 border border-border bg-raised p-1 shadow-pop">
          {LOCALES.map((l) => (
            <button
              key={l}
              onMouseDown={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-2.5 py-1.5 text-sm transition-colors",
                l === locale ? "bg-surface-2 text-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg"
              )}
            >
              {LOCALE_LABELS[l]}
              {l === locale && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
