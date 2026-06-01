import type { SportConfig, SportId } from "./types";
import { withEraStature } from "./stature";
import { LOL } from "./lol";
import { FOOTBALL } from "./football";
import { BASKETBALL } from "./basketball";
import { F1 } from "./f1";

/** Apply the era-strength → Stature engine to every sport, uniformly. */
function withStature(cfg: SportConfig): SportConfig {
  return { ...cfg, players: withEraStature(cfg.players, cfg.model) };
}

export const SPORTS: SportConfig[] = [LOL, FOOTBALL, BASKETBALL, F1].map(withStature);

export function getSport(id: SportId): SportConfig | undefined {
  return SPORTS.find((s) => s.id === id);
}

export function listSports(): SportConfig[] {
  return SPORTS;
}
