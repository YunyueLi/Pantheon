import type { SportConfig, SportId } from "./types";
import { FOOTBALL } from "./football";

// LoL is added here once it is migrated onto the neutral core (task #2).
export const SPORTS: SportConfig[] = [FOOTBALL];

export function getSport(id: SportId): SportConfig | undefined {
  return SPORTS.find((s) => s.id === id);
}

export function listSports(): SportConfig[] {
  return SPORTS;
}
