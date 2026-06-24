import { describe, it, expect } from "vitest";
import { listSports } from "@/lib/sport/registry";

// Data-integrity guard. The product's whole promise is "numbers you can audit",
// so a typo'd achievement type (silently scores 0) or an impossible year is a
// credibility bug. These run per sport and name the exact offending entry.

const CURRENT_YEAR = new Date().getFullYear();
const sports = listSports();

for (const s of sports) {
  describe(`data integrity: ${s.id}`, () => {
    const meta = s.model.achievementMeta;

    it("player ids are unique", () => {
      const ids = s.players.map((p) => p.id);
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(dupes).toEqual([]);
    });

    it("every achievement type is defined in the model", () => {
      const unknown: string[] = [];
      for (const p of s.players) {
        for (const a of p.achievements) {
          if (!meta[a.type]) unknown.push(`${p.id} → "${a.type}"`);
        }
      }
      expect(unknown).toEqual([]);
    });

    it("no honor lands in the future", () => {
      const bad: string[] = [];
      for (const p of s.players) {
        for (const a of p.achievements) {
          if (a.year > CURRENT_YEAR) bad.push(`${p.id}:${a.type} @${a.year}`);
        }
      }
      expect(bad).toEqual([]);
    });

    it("no honor predates the player's career by more than a few years", () => {
      // `debutYear` is the PRO debut. National-team / Olympic / amateur honors
      // can legitimately precede it (e.g. Jerry Lucas' 1960 Olympic gold, NBA
      // debut 1963), so allow a 6-year grace — wide enough for those, tight
      // enough to still catch a decade-off typo.
      const GRACE = 6;
      const bad: string[] = [];
      for (const p of s.players) {
        for (const a of p.achievements) {
          if (a.year < p.debutYear - GRACE) {
            bad.push(`${p.id}:${a.type} @${a.year} (debut ${p.debutYear})`);
          }
        }
      }
      expect(bad).toEqual([]);
    });

    it("debut years are plausible", () => {
      // Floor at 1800: Go's cabinet includes Edo-era legends (e.g. Honinbo
      // Shusaku, debut 1840). Anything earlier is almost certainly a typo.
      const bad = s.players
        .filter((p) => p.debutYear < 1800 || p.debutYear > CURRENT_YEAR)
        .map((p) => `${p.id} (debut ${p.debutYear})`);
      expect(bad).toEqual([]);
    });

    it("vote share & participation are in (0,1]; count is a positive integer", () => {
      const bad: string[] = [];
      for (const p of s.players) {
        for (const a of p.achievements) {
          if (a.share != null && (a.share <= 0 || a.share > 1)) bad.push(`${p.id}:${a.type} share=${a.share}`);
          if (a.part != null && (a.part <= 0 || a.part > 1)) bad.push(`${p.id}:${a.type} part=${a.part}`);
          if (a.count != null && (!Number.isInteger(a.count) || a.count < 1)) bad.push(`${p.id}:${a.type} count=${a.count}`);
        }
      }
      expect(bad).toEqual([]);
    });

    it("cabinetOrder, headlineTypes and sum-axis types all exist in the model", () => {
      const missing: string[] = [];
      for (const type of s.model.cabinetOrder) if (!meta[type]) missing.push(`cabinetOrder:${type}`);
      for (const type of s.headlineTypes) if (!meta[type]) missing.push(`headline:${type}`);
      for (const axis of s.model.axes) {
        if (axis.kind === "sum") for (const type of axis.types) if (!meta[type]) missing.push(`axis ${axis.id}:${type}`);
      }
      expect(missing).toEqual([]);
    });

    it("every player belongs to a declared league (when leagues are defined)", () => {
      if (s.leagues.length === 0) return;
      const valid = new Set(s.leagues.map((l) => l.id));
      const bad = s.players.filter((p) => !valid.has(p.league)).map((p) => `${p.id} → "${p.league}"`);
      expect(bad).toEqual([]);
    });
  });
}
