"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { PLAYERS } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, RoleBadge } from "@/components/badges";

export function PlayerSearch() {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

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

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = query
      ? PLAYERS.filter((p) =>
          [p.name, p.realName, p.team, p.region, p.role]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
      : PLAYERS;
    return list.slice(0, 8);
  }, [q]);

  const go = (id: string) => {
    setOpen(false);
    setQ("");
    router.push(`/lol/players/${id}`);
  };

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
          className="fixed left-1/2 top-[14%] z-50 w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-raised shadow-pop data-[state=open]:animate-fade-up"
        >
          <Dialog.Title className="sr-only">{t("search.label")}</Dialog.Title>
          <div className="flex items-center gap-2.5 border-b border-border px-4">
            <Search className="h-4 w-4 shrink-0 text-fg-subtle" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results[0]) go(results[0].id);
              }}
              placeholder={t("search.placeholder")}
              className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            />
          </div>
          <ul className="max-h-[60vh] overflow-y-auto p-2">
            {results.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => go(p.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-2"
                >
                  <PlayerAvatar id={p.id} name={p.name} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-fg">{p.name}</div>
                    <div className="truncate text-xs text-fg-subtle">{p.team}</div>
                  </div>
                  <RegionBadge region={p.region} />
                  <RoleBadge role={p.role} />
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-2 py-10 text-center text-sm text-fg-subtle">{t("search.empty")}</li>
            )}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
