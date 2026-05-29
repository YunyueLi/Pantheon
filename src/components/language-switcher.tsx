"use client";

import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        aria-label="Language"
        className="flex h-8 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        <Globe className="h-3.5 w-3.5" />
        {LOCALE_SHORT[locale]}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-36 rounded-xl border border-border bg-raised p-1 shadow-pop">
          {LOCALES.map((l) => (
            <button
              key={l}
              onMouseDown={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors",
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
