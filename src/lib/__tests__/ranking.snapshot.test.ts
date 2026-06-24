import { describe, it, expect } from "vitest";
import { listSports } from "@/lib/sport/registry";
import { ranked } from "@/lib/sport/honor";

// Regression snapshot of each sport's top-15 under the balanced (default) preset.
// The roster is hand-edited often; this freezes the resulting order so any data
// change that shuffles the leaderboard shows up as an explicit, reviewable diff.
// Update intentionally with `vitest -u` after a deliberate data change.

const sports = listSports();

for (const s of sports) {
  describe(`top ranking: ${s.id}`, () => {
    it("top 15 by balanced Honor Index", () => {
      const top = ranked(s.players, s.model)
        .slice(0, 15)
        .map((r) => `${r.rank}. ${r.player.name} — ${Math.round(r.score)}`);
      expect(top).toMatchSnapshot();
    });
  });
}
