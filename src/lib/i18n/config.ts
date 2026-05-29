export const LOCALES = ["en", "zh", "ko", "ja", "de", "fr", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
  ko: "한국어",
  ja: "日本語",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  zh: "中",
  ko: "한",
  ja: "日",
  de: "DE",
  fr: "FR",
  es: "ES",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
