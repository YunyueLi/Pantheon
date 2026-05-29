"use client";

import { cn } from "@/lib/utils";

export type PillOption<T extends string> = { value: T; label: string };

export function Pills<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: PillOption<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-full border font-medium transition-colors",
              size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-[13px]",
              active
                ? "border-transparent bg-accent-soft text-accent"
                : "border-border text-fg-subtle hover:bg-surface-2 hover:text-fg"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
