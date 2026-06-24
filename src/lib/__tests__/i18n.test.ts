import { describe, it, expect } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { LOCALES } from "@/lib/i18n/config";
import { BLURBS } from "@/lib/i18n/blurbs";
import { listSports } from "@/lib/sport/registry";

// Deep key parity is already enforced by the `Dict` type at compile time. This
// adds a runtime guard for the two things types can't catch: that a dictionary
// exists for every declared locale, and that top-level sections never drift.

const sections = (o: object) => Object.keys(o).sort();

describe("i18n dictionaries", () => {
  it("declares a dictionary for every locale in LOCALES", () => {
    for (const loc of LOCALES) {
      expect(dictionaries[loc], `missing dictionary for "${loc}"`).toBeDefined();
    }
  });

  it("every locale covers all of English's top-level sections", () => {
    // Locales MAY add sections English omits (e.g. `league`, `roleAbbr`, which
    // English resolves from the model labels via fallback). What must never
    // happen is a locale dropping a section English relies on.
    const en = sections(dictionaries.en);
    for (const loc of LOCALES) {
      expect(sections(dictionaries[loc]), `"${loc}" is missing a section`).toEqual(
        expect.arrayContaining(en)
      );
    }
  });
});

describe("localized player blurbs", () => {
  const realIds = new Set(listSports().flatMap((s) => s.players.map((p) => p.id)));
  const localesWithBlurbs = Object.keys(BLURBS);

  it("every translated id refers to a real player", () => {
    const orphans: string[] = [];
    for (const [loc, map] of Object.entries(BLURBS)) {
      for (const id of Object.keys(map ?? {})) if (!realIds.has(id)) orphans.push(`${loc} → ${id}`);
    }
    expect(orphans).toEqual([]);
  });

  it("all locales translate the same set of players (no half-translated player)", () => {
    const ref = Object.keys(BLURBS[localesWithBlurbs[0] as keyof typeof BLURBS] ?? {}).sort();
    for (const loc of localesWithBlurbs) {
      const ids = Object.keys(BLURBS[loc as keyof typeof BLURBS] ?? {}).sort();
      expect(ids, `"${loc}" blurb set differs`).toEqual(ref);
    }
  });
});
