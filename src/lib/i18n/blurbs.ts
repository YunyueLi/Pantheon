import type { Locale } from "./config";
import generated from "./blurbs.generated.json";

/**
 * Localized player bios, keyed by player id, for every non-English locale.
 * `blurbs.generated.json` is produced from each Player's English `blurb` by the
 * translation pipeline (see CONTRIBUTING) — regenerate it after adding players or
 * editing English bios. English readers see the original `blurb`; other locales
 * see the translation here.
 */
export const BLURBS = generated as Partial<Record<Locale, Record<string, string>>>;

/**
 * Bio to display for a player. English shows the original `blurb`; other locales
 * show the translation when present, otherwise nothing (never untranslated English).
 */
export function localizedBlurb(id: string, english: string | undefined, locale: Locale): string | undefined {
  return locale === "en" ? english : BLURBS[locale]?.[id];
}
