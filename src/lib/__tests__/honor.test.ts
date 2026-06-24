import { describe, it, expect } from "vitest";
import { listSports } from "@/lib/sport/registry";
import {
  ranked,
  honorScore,
  percentile,
  normalizedAxes,
  achievementPoints,
} from "@/lib/sport/honor";

// Engine invariants that must hold for EVERY sport. These guard the math itself,
// not the data — if a refactor breaks scoring, ranking or normalization, one of
// these fails regardless of which roster changed.

const sports = listSports();

describe("ranked()", () => {
  for (const s of sports) {
    it(`${s.id}: scores descending, ranks contiguous 1..n`, () => {
      const rows = ranked(s.players, s.model);
      expect(rows.length).toBe(s.players.length);
      for (let i = 1; i < rows.length; i++) {
        expect(rows[i - 1].score).toBeGreaterThanOrEqual(rows[i].score);
        expect(rows[i].rank).toBe(i + 1);
      }
    });
  }
});

describe("honorScore()", () => {
  it("is non-negative for every player in every sport", () => {
    for (const s of sports) {
      for (const p of s.players) {
        expect(honorScore(p, s.model)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("strictly increases when a top honor is added (lol worlds_title)", () => {
    const lol = sports.find((s) => s.id === "lol")!;
    const p = lol.players[0];
    const before = honorScore(p, lol.model);
    const boosted = { ...p, achievements: [...p.achievements, { type: "worlds_title", year: 2025 }] };
    expect(honorScore(boosted, lol.model)).toBeGreaterThan(before);
  });
});

describe("percentile()", () => {
  for (const s of sports) {
    it(`${s.id}: every player's percentile is within [0,100]`, () => {
      for (const p of s.players) {
        const pc = percentile(p, s.players, s.model);
        expect(pc).toBeGreaterThanOrEqual(0);
        expect(pc).toBeLessThanOrEqual(100);
      }
    });
  }
});

describe("normalizedAxes()", () => {
  for (const s of sports) {
    it(`${s.id}: every axis value is within [0,100]`, () => {
      for (const p of s.players) {
        for (const axis of normalizedAxes(p, s.players, s.model)) {
          expect(axis.value).toBeGreaterThanOrEqual(0);
          expect(axis.value).toBeLessThanOrEqual(100);
        }
      }
    });
  }
});

describe("achievementPoints()", () => {
  const lol = sports.find((s) => s.id === "lol")!;

  it("scales an individual award linearly by vote share", () => {
    const full = achievementPoints({ type: "worlds_mvp", year: 2020 }, lol.model);
    const half = achievementPoints({ type: "worlds_mvp", year: 2020, share: 0.5 }, lol.model);
    expect(half).toBeCloseTo(full * 0.5, 6);
  });

  it("scores an unknown achievement type as 0 (never throws)", () => {
    expect(achievementPoints({ type: "__does_not_exist__", year: 2020 }, lol.model)).toBe(0);
  });

  it("multiplies bulk-count honors by their count", () => {
    const f1 = sports.find((s) => s.id === "f1")!;
    const one = achievementPoints({ type: "race_win", year: 2020 }, f1.model);
    const five = achievementPoints({ type: "race_win", year: 2020, count: 5 }, f1.model);
    expect(five).toBeCloseTo(one * 5, 6);
  });
});
