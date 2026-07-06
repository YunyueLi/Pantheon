"use client";

import { Flame, Moon, Sun } from "lucide-react";
import { useTheme, type Mode } from "@/components/theme-provider";

// Icon reflects the CURRENT field; clicking cycles crimson → paper → obsidian.
const ICON: Record<Mode, typeof Flame> = { crimson: Flame, paper: Sun, obsidian: Moon };

export function ThemeControls() {
  const { mode, cycleMode } = useTheme();
  const Icon = ICON[mode];
  return (
    <button
      onClick={cycleMode}
      aria-label={`Theme: ${mode}. Click to switch.`}
      title={`Theme: ${mode}`}
      className="flex h-8 w-8 items-center justify-center text-fg-muted transition-colors hover:text-fg"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
