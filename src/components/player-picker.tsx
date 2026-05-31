"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, ChevronsUpDown } from "lucide-react";
import { useSport } from "@/lib/sport/provider";
import { useI18n } from "@/lib/i18n/provider";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, PositionBadge } from "@/components/badges";
import { cn } from "@/lib/utils";

/** A searchable player selector — a typeahead dialog replacing the unwieldy dropdown. */
export function PlayerPicker({
  value,
  onSelect,
  exclude,
}: {
  value: string;
  onSelect: (id: string) => void;
  exclude?: string;
}) {
  const { t } = useI18n();
  const { config, positionMeta } = useSport();
  const { players } = config;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const current = players.find((p) => p.id === value);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query
      ? players.filter((p) =>
          [p.name, p.realName, p.team, p.league, p.position]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
      : players;
  }, [q, players]);

  useEffect(() => setActive(0), [q]);

  const pick = (id: string) => {
    if (id === exclude) return;
    setOpen(false);
    setQ("");
    onSelect(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      pick(results[active].id);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm transition-colors hover:border-border-strong">
          <span className="truncate text-fg">
            {current ? `${current.name} · ${current.team}` : t("search.placeholder")}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-fg-subtle" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-[12%] z-50 mx-auto flex max-h-[76vh] w-[92vw] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-raised shadow-pop data-[state=open]:animate-fade-up"
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
            {results.map((p, i) => {
              const disabled = p.id === exclude;
              return (
                <li key={p.id} data-idx={i}>
                  <button
                    disabled={disabled}
                    onClick={() => pick(p.id)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                      disabled
                        ? "cursor-not-allowed opacity-40"
                        : i === active
                          ? "bg-surface-2"
                          : "hover:bg-surface-2",
                      p.id === value && "ring-1 ring-border-strong"
                    )}
                  >
                    <PlayerAvatar id={p.id} name={p.name} photo={p.photo} size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-fg">{p.name}</span>
                        {!p.active && (
                          <span className="shrink-0 text-[9px] uppercase tracking-wide text-fg-subtle">
                            {t("common.retired")}
                          </span>
                        )}
                      </div>
                      <div className="truncate text-xs text-fg-subtle">{p.team}</div>
                    </div>
                    <RegionBadge region={p.league} />
                    <PositionBadge abbr={positionMeta(p.position)?.abbr ?? p.position} />
                  </button>
                </li>
              );
            })}
            {results.length === 0 && (
              <li className="px-2 py-10 text-center text-sm text-fg-subtle">{t("search.empty")}</li>
            )}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
