export const LOCALES = ["en", "zh", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
  ko: "한국어",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  zh: "中",
  ko: "한",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
