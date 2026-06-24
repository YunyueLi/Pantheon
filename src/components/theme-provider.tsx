"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Three fields: crimson (the signature, default), paper (warm light), obsidian (dark).
export type Mode = "crimson" | "paper" | "obsidian";
const ORDER: Mode[] = ["crimson", "paper", "obsidian"];

type ThemeContextValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
  cycleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Obsidian is the default; explicit choices persist. Old values migrate (light→crimson). */
function normalize(v: string | null): Mode {
  if (v === "paper") return "paper";
  if (v === "crimson" || v === "light") return "crimson";
  return "obsidian"; // "obsidian" | "dark" | null/unknown → default
}

function apply(el: HTMLElement, m: Mode) {
  el.classList.toggle("paper", m === "paper");
  el.classList.toggle("dark", m === "obsidian");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("obsidian");

  useEffect(() => {
    const stored = normalize(localStorage.getItem("pantheon-mode"));
    setModeState(stored);
    apply(document.documentElement, stored);
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem("pantheon-mode", m);
    apply(document.documentElement, m);
  };

  const cycleMode = () => setMode(ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, cycleMode }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
