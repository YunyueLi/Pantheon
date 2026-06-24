"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { getSport } from "@/lib/sport/registry";
import { ranked } from "@/lib/sport/honor";
import { localizeTeam } from "@/lib/sport/football/clubs";
import type { Player } from "@/lib/sport/types";
import { TEAMS, type Team } from "@/lib/teams";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type Hit = { kind: "player"; player: Player } | { kind: "team"; team: Team };

export function PlayerSearch() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const path = usePathname();
  const sportId =
    ["football", "basketball", "f1", "table-tennis", "go", "dota2", "valorant"].find((s) =>
      path.startsWith(`/${s}`)
    ) ?? "lol";
  const config = getSport(sportId)!;
  const players = config.players;
  const base = config.basePath;
  const posAbbr = (id: string) => {
    const k = `roleAbbr.${id}`;
    const v = t(k);
    return v !== k ? v : config.positions.find((p) => p.id === id)?.abbr ?? id;
  };
  const name = (e: { name: string; i18n?: Record<string, string> }) => e.i18n?.[locale] ?? e.name;
  const leagueLabel = (id: string) => {
    const k = `league.${id}`;
    const v = t(k);
    return v !== k ? v : config.leagues.find((l) => l.id === id)?.label ?? id;
  };

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase();
    if (!query) {
      return ranked(players, config.model)
        .slice(0, 30)
        .map((r) => ({ kind: "player", player: r.player }));
    }
    const playerHits: Hit[] = players
      .filter((p) =>
        [p.name, p.realName, p.team, p.league, p.position, ...Object.values(p.i18n ?? {})]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
      .slice(0, 40)
      .map((player) => ({ kind: "player", player }));
    // Teams currently exist only for LoL.
    const teamHits: Hit[] =
      sportId === "lol"
        ? TEAMS.filter((tm) => [tm.name, ...(tm.aka ?? []), tm.region].join(" ").toLowerCase().includes(query))
            .slice(0, 8)
            .map((team) => ({ kind: "team", team }))
        : [];
    return [...playerHits, ...teamHits];
  }, [q, sportId, players, config.model]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    if (active >= hits.length) setActive(0);
  }, [hits.length, active]);

  const go = (hit: Hit) => {
    setOpen(false);
    setQ("");
    router.push(hit.kind === "player" ? `${base}/players/${hit.player.id}` : `/lol/teams/${hit.team.id}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && hits[active]) {
      e.preventDefault();
      go(hits[active]);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label={t("search.label")}
          className="flex h-8 w-8 items-center justify-center text-fg-subtle transition-colors hover:text-fg"
        >
          <Search className="h-4 w-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-[12%] z-50 mx-auto flex max-h-[76vh] w-[92vw] max-w-lg flex-col overflow-hidden border border-border-strong bg-raised shadow-pop data-[state=open]:animate-fade-up"
        >
          <Dialog.Title className="sr-only">{t("search.label")}</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-5">
            <Search className="h-4 w-4 shrink-0 text-fg-subtle" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t("search.placeholder")}
              className="h-14 w-full bg-transparent font-display text-base text-fg outline-none placeholder:text-fg-subtle"
            />
          </div>
          <ul ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
            {hits.map((hit, i) => {
              const id = hit.kind === "player" ? hit.player.id : hit.team.id;
              const isActive = i === active;
              return (
                <li key={`${hit.kind}-${id}`} data-idx={i}>
                  <button
                    onClick={() => go(hit)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-4 border-b border-border px-5 py-3.5 text-left transition-colors",
                      isActive ? "bg-accent-soft text-fg" : "hover:bg-accent-soft"
                    )}
                  >
                    {hit.kind === "player" ? (
                      <>
                        <div className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-display text-lg font-semibold text-fg">{name(hit.player)}</span>
                            {!hit.player.active && (
                              <span className="label shrink-0 text-[9px] text-fg-subtle">{t("common.retired")}</span>
                            )}
                          </span>
                          <span className="mt-0.5 block truncate font-display text-xs italic text-fg-subtle">
                            {localizeTeam(hit.player.team, locale)}
                          </span>
                        </div>
                        <span className="label shrink-0 text-[10px] text-fg-muted">
                          {leagueLabel(hit.player.league)}
                          {hit.player.position ? ` · ${posAbbr(hit.player.position)}` : ""}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-display text-lg font-semibold text-fg">{hit.team.name}</span>
                          <span className="mt-0.5 block truncate font-display text-xs italic text-fg-subtle">{t("nav.teams")}</span>
                        </div>
                        <span className="label shrink-0 text-[10px] text-fg-muted">{leagueLabel(hit.team.region)}</span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
            {hits.length === 0 && (
              <li className="px-5 py-12 text-center font-display text-sm italic text-fg-subtle">{t("search.empty")}</li>
            )}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
