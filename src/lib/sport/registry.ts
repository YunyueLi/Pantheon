import type { SportConfig, SportId } from "./types";
import { LOL } from "./lol";
import { FOOTBALL } from "./football";
import { BASKETBALL } from "./basketball";

export const SPORTS: SportConfig[] = [LOL, FOOTBALL, BASKETBALL];

export function getSport(id: SportId): SportConfig | undefined {
  return SPORTS.find((s) => s.id === id);
}

export function listSports(): SportConfig[] {
  return SPORTS;
}
