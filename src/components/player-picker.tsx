"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, ChevronsUpDown } from "lucide-react";
import { useSport, useName, useLeagueLabel } from "@/lib/sport/provider";
import { useI18n } from "@/lib/i18n/provider";
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
  const name = useName();
  const leagueLabel = useLeagueLabel();
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
        <button className="flex w-full items-center justify-between gap-2 border-b border-border-strong pb-1.5 text-left font-display text-sm transition-colors hover:border-fg">
          <span className="truncate text-fg">
            {current ? `${name(current)} · ${current.team}` : t("search.placeholder")}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-fg-subtle" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-[12%] z-50 mx-auto flex max-h-[76vh] w-[92vw] max-w-md flex-col overflow-hidden border border-border-strong bg-raised shadow-pop data-[state=open]:animate-fade-up"
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
            {results.map((p, i) => {
              const disabled = p.id === exclude;
              return (
                <li key={p.id} data-idx={i}>
                  <button
                    disabled={disabled}
                    onClick={() => pick(p.id)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-4 border-b border-border px-5 py-3.5 text-left transition-colors",
                      disabled
                        ? "cursor-not-allowed opacity-40"
                        : i === active || p.id === value
                          ? "bg-accent-soft text-fg"
                          : "hover:bg-accent-soft"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-display text-lg font-semibold text-fg">{name(p)}</span>
                        {!p.active && <span className="label shrink-0 text-[9px] text-fg-subtle">{t("common.retired")}</span>}
                      </span>
                      <span className="mt-0.5 block truncate font-display text-xs italic text-fg-subtle">{p.team}</span>
                    </div>
                    <span className="label shrink-0 text-[10px] text-fg-muted">
                      {leagueLabel(p.league)}
                      {positionMeta(p.position)?.abbr ? ` · ${positionMeta(p.position)?.abbr}` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
            {results.length === 0 && (
              <li className="px-5 py-12 text-center font-display text-sm italic text-fg-subtle">{t("search.empty")}</li>
            )}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
