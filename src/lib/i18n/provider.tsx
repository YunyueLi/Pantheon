"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { dictionaries } from "./dictionaries";

type Vars = Record<string, string | number>;
type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Vars) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function lookup(dict: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((obj, key) => {
    if (obj && typeof obj === "object") return (obj as Record<string, unknown>)[key];
    return undefined;
  }, dict);
}

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Static export can't read the locale cookie server-side, so restore the
  // saved choice on the client (brief first-paint flash for returning users).
  useEffect(() => {
    try {
      const stored = localStorage.getItem("pantheon-locale");
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("pantheon-locale", l);
      document.cookie = `pantheon-locale=${l}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = l;
    } catch {
      // ignore
    }
  };

  const t = (path: string, vars?: Vars) => {
    let value = lookup(dictionaries[locale], path);
    if (typeof value !== "string") {
      const fallback = lookup(dictionaries[DEFAULT_LOCALE], path);
      value = typeof fallback === "string" ? fallback : path;
    }
    let str = value as string;
    if (vars) {
      for (const key of Object.keys(vars)) {
        str = str.replace(new RegExp(`\\{${key}\\}`, "g"), String(vars[key]));
      }
    }
    return str;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
