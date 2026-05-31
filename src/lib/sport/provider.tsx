"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { LeagueMeta, PositionMeta, SportConfig } from "./types";
import { getSport } from "./registry";
import { useI18n } from "@/lib/i18n/provider";

type SportCtx = {
  config: SportConfig;
  leagueMeta: (id: string) => LeagueMeta | undefined;
  positionMeta: (id: string) => PositionMeta | undefined;
};

const Ctx = createContext<SportCtx | null>(null);

export function SportProvider({ sportId, children }: { sportId: string; children: ReactNode }) {
  const value = useMemo<SportCtx>(() => {
    const config = getSport(sportId);
    if (!config) throw new Error(`Unknown sport: ${sportId}`);
    const lm = new Map(config.leagues.map((l) => [l.id, l] as const));
    const pm = new Map(config.positions.map((p) => [p.id, p] as const));
    return {
      config,
      leagueMeta: (id) => lm.get(id),
      positionMeta: (id) => pm.get(id),
    };
  }, [sportId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSport() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSport must be used within a SportProvider");
  return ctx;
}

/**
 * Resolve an achievement type's display name: the translated dictionary entry
 * when present (LoL), otherwise the sport model's own English label (football).
 */
export function useHonorLabel() {
  const { t } = useI18n();
  const { config } = useSport();
  return (type: string) => {
    const key = `honorType.${type}`;
    const v = t(key);
    return v === key ? config.model.achievementMeta[type]?.label ?? type : v;
  };
}

/** Resolve a radar-axis label: translated when the dict has `axis.<id>`, else the model's label. */
export function useAxisLabel() {
  const { t } = useI18n();
  return (id: string, fallback: string) => {
    const key = `axis.${id}`;
    const v = t(key);
    return v === key ? fallback : v;
  };
}
