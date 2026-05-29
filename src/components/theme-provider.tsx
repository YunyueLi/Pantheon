"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark";

type ThemeContextValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");

  useEffect(() => {
    const el = document.documentElement;
    const storedMode =
      (localStorage.getItem("pantheon-mode") as Mode | null) ??
      (el.classList.contains("dark") ? "dark" : "light");
    setModeState(storedMode);
    el.classList.toggle("dark", storedMode === "dark");
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem("pantheon-mode", m);
    document.documentElement.classList.toggle("dark", m === "dark");
  };

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
