import { describe, it, expect } from "vitest";
import { listSports } from "@/lib/sport/registry";

// The era-strength → Stature engine runs in the registry for every sport. Its
// outputs are display values that must stay bounded; a regression that pushes
// stature out of [0,100] or NaN would corrupt the profile UI.

const sports = listSports();

for (const s of sports) {
  describe(`stature: ${s.id}`, () => {
    it("display stature is a finite number in [0,100]", () => {
      for (const p of s.players) {
        if (p.stature == null) continue;
        expect(Number.isFinite(p.stature)).toBe(true);
        expect(p.stature).toBeGreaterThanOrEqual(0);
        expect(p.stature).toBeLessThanOrEqual(100);
      }
    });

    it("era strength is a percentile in [0,100]", () => {
      for (const p of s.players) {
        if (p.eraStrength == null) continue;
        expect(p.eraStrength).toBeGreaterThanOrEqual(0);
        expect(p.eraStrength).toBeLessThanOrEqual(100);
      }
    });
  });
}
