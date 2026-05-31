import type { SportConfig, SportId } from "./types";
import { LOL } from "./lol";
import { FOOTBALL } from "./football";

export const SPORTS: SportConfig[] = [LOL, FOOTBALL];

export function getSport(id: SportId): SportConfig | undefined {
  return SPORTS.find((s) => s.id === id);
}

export function listSports(): SportConfig[] {
  return SPORTS;
}
