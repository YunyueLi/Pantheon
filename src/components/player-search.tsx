"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, CornerDownLeft } from "lucide-react";
import { PLAYERS, ranked } from "@/lib/data";
import { TEAMS } from "@/lib/teams";
import type { Player } from "@/lib/types";
import type { Team } from "@/lib/teams";
import { useI18n } from "@/lib/i18n/provider";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, RoleBadge } from "@/components/badges";
import { cn } from "@/lib/utils";

type Hit = { kind: "player"; player: Player } | { kind: "team"; team: Team };

export function PlayerSearch() {
  const { t } = useI18n();
  const router = useRouter();
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
      return ranked(PLAYERS)
        .slice(0, 6)
        .map((r) => ({ kind: "player", player: r.player }));
    }
    const players: Hit[] = PLAYERS.filter((p) =>
      [p.name, p.realName, p.team, p.region, p.role]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
      .slice(0, 6)
      .map((player) => ({ kind: "player", player }));
    const teams: Hit[] = TEAMS.filter((tm) =>
      [tm.name, ...(tm.aka ?? []), tm.region].join(" ").toLowerCase().includes(query)
    )
      .slice(0, 4)
      .map((team) => ({ kind: "team", team }));
    return [...players, ...teams];
  }, [q]);

  // Reset highlight whenever the result set changes; keep it in range.
  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    if (active >= hits.length) setActive(0);
  }, [hits.length, active]);

  const go = (hit: Hit) => {
    setOpen(false);
    setQ("");
    router.push(hit.kind === "player" ? `/lol/players/${hit.player.id}` : `/lol/teams/${hit.team.id}`);
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

  // Keep the active row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label={t("search.label")}
          className="flex h-8 items-center gap-2 rounded-full border border-border px-2.5 text-xs text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">{t("search.label")}</span>
          <kbd className="hidden rounded border border-border px-1 font-mono text-[10px] text-fg-subtle lg:inline">
            ⌘K
          </kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-[12%] z-50 mx-auto flex max-h-[76vh] w-[92vw] max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-raised shadow-pop data-[state=open]:animate-fade-up"
        >
          <Dialog.Title className="sr-only">{t("search.label")}</Dialog.Title>
          <div className="flex items-center gap-2.5 border-b border-border px-4">
            <Search className="h-4 w-4 shrink-0 text-fg-subtle" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t("search.placeholder")}
              className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            />
          </div>
          <ul ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2">
            {hits.map((hit, i) => {
              const id = hit.kind === "player" ? hit.player.id : hit.team.id;
              const isActive = i === active;
              return (
                <li key={`${hit.kind}-${id}`} data-idx={i}>
                  <button
                    onClick={() => go(hit)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                      isActive ? "bg-surface-2" : "hover:bg-surface-2"
                    )}
                  >
                    {hit.kind === "player" ? (
                      <>
                        <PlayerAvatar id={hit.player.id} name={hit.player.name} photo={hit.player.photo} size={30} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-sm font-medium text-fg">{hit.player.name}</span>
                            {!hit.player.active && (
                              <span className="shrink-0 text-[9px] uppercase tracking-wide text-fg-subtle">
                                {t("common.retired")}
                              </span>
                            )}
                          </div>
                          <div className="truncate text-xs text-fg-subtle">{hit.player.team}</div>
                        </div>
                        <RegionBadge region={hit.player.region} />
                        <RoleBadge role={hit.player.role} />
                      </>
                    ) : (
                      <>
                        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg bg-surface-2 font-mono text-[11px] font-semibold text-fg-muted">
                          {hit.team.code}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-fg">{hit.team.name}</div>
                          <div className="truncate text-xs text-fg-subtle">{t("nav.teams")}</div>
                        </div>
                        <RegionBadge region={hit.team.region} />
                      </>
                    )}
                  </button>
                </li>
              );
            })}
            {hits.length === 0 && (
              <li className="px-2 py-10 text-center text-sm text-fg-subtle">{t("search.empty")}</li>
            )}
          </ul>
          <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border px-1 font-mono">↑</kbd>
              <kbd className="rounded border border-border px-1 font-mono">↓</kbd>
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
