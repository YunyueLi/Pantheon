"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { honorScore, countType } from "@/lib/sport/honor";
import type { Player } from "@/lib/sport/types";
import { useSport } from "@/lib/sport/provider";
import { cn, formatNumber } from "@/lib/utils";
import { Pills } from "@/components/pills";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, PositionBadge } from "@/components/badges";
import { TrophyIcon } from "@/components/trophy-icon";
import { useI18n } from "@/lib/i18n/provider";

type Row = { player: Player; score: number };

export function Leaderboard() {
  const { t, locale } = useI18n();
  const { config, positionMeta } = useSport();
  const { players, model, leagues, positions, headlineTypes, basePath } = config;
  const sp = useSearchParams();
  const spRegion = sp.get("region");
  const spRole = sp.get("role");
  const [region, setRegion] = useState<string>(
    leagues.some((l) => l.id === spRegion) ? (spRegion as string) : "ALL"
  );
  const [role, setRole] = useState<string>(
    positions.some((p) => p.id === spRole) ? (spRole as string) : "ALL"
  );
  const [presetKey, setPresetKey] = useState(model.presets[0].key);

  const weights = model.presets.find((p) => p.key === presetKey)!.weights;

  const regionOpts = [
    { value: "ALL", label: t("leaderboard.allRegions") },
    ...leagues.map((l) => ({ value: l.id, label: l.id })),
  ];
  const roleOpts = [
    { value: "ALL", label: t("leaderboard.allRoles") },
    ...positions.map((p) => ({ value: p.id, label: t(`role.${p.id}`) })),
  ];
  const presetOpts = model.presets.map((p) => ({ value: p.key, label: t(`preset.${p.key}`) }));

  const data = useMemo<Row[]>(
    () =>
      players
        .filter(
          (p) => (region === "ALL" || p.league === region) && (role === "ALL" || p.position === role)
        )
        .map((player) => ({ player, score: honorScore(player, model, weights) }))
        .sort((a, b) => b.score - a.score),
    [region, role, weights, players, model]
  );

  const maxScore = useMemo(() => Math.max(1, ...data.map((d) => d.score)), [data]);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "rank",
        header: "#",
        enableSorting: false,
        cell: ({ row, table }) => (
          <Rank n={table.getRowModel().rows.findIndex((r) => r.id === row.id) + 1} />
        ),
      },
      {
        id: "player",
        header: t("leaderboard.colPlayer"),
        accessorFn: (r) => r.player.name,
        cell: ({ row }) => {
          const p = row.original.player;
          return (
            <Link href={`${basePath}/players/${p.id}`} className="group flex items-center gap-3">
              <PlayerAvatar id={p.id} name={p.name} photo={p.photo} size={34} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-fg group-hover:text-accent">{p.name}</span>
                  {!p.active && (
                    <span className="text-[10px] uppercase tracking-wide text-fg-subtle">
                      {t("common.retired")}
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-fg-subtle">{p.team}</div>
              </div>
            </Link>
          );
        },
      },
      {
        id: "region",
        header: t("leaderboard.colRegion"),
        accessorFn: (r) => r.player.league,
        cell: ({ row }) => <RegionBadge region={row.original.player.league} />,
      },
      {
        id: "role",
        header: t("leaderboard.colRole"),
        accessorFn: (r) => r.player.position,
        cell: ({ row }) => (
          <PositionBadge
            abbr={positionMeta(row.original.player.position)?.abbr ?? row.original.player.position}
          />
        ),
      },
      {
        id: "titles",
        header: t("leaderboard.colTitles"),
        enableSorting: false,
        cell: ({ row }) => <TitlesCell player={row.original.player} headlineTypes={headlineTypes} />,
      },
      {
        id: "score",
        header: t("leaderboard.colHonor"),
        accessorFn: (r) => r.score,
        cell: ({ row }) => <ScoreCell score={row.original.score} max={maxScore} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxScore, locale]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div>
      <header className="mb-7">
        <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{t(`nav.${config.id}`)}</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">{t("leaderboard.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{t("leaderboard.desc")}</p>
      </header>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <Pills options={regionOpts} value={region} onChange={setRegion} />
            <Pills options={roleOpts} value={role} onChange={setRole} />
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <span className="text-[11px] uppercase tracking-wide text-fg-subtle">{t("leaderboard.weighting")}</span>
            <Pills options={presetOpts} value={presetKey} onChange={setPresetKey} size="sm" />
          </div>
        </div>

        {/* Mobile: the 6-column table overflows, so render a compact ranked list instead. */}
        <div className="md:hidden">
          <div className="space-y-2">
            {rows.map((row, i) => {
              const p = row.original.player;
              return (
                <Link
                  key={row.id}
                  href={`${basePath}/players/${p.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 shadow-card transition-colors hover:border-border-strong"
                >
                  <span className="tnum w-5 shrink-0 text-right text-sm text-fg-subtle">{i + 1}</span>
                  <PlayerAvatar id={p.id} name={p.name} photo={p.photo} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-fg">{p.name}</span>
                      {!p.active && (
                        <span className="shrink-0 text-[9px] uppercase tracking-wide text-fg-subtle">
                          {t("common.retired")}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <RegionBadge region={p.league} />
                      <PositionBadge abbr={positionMeta(p.position)?.abbr ?? p.position} />
                    </div>
                  </div>
                  <div className="tnum shrink-0 text-right text-sm font-semibold text-fg">
                    {formatNumber(row.original.score)}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-card md:block">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-fg-subtle",
                        header.id === "score" && "w-[180px]",
                        header.id === "rank" && "w-[64px]"
                      )}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/70 transition-colors last:border-0 hover:bg-surface-2"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Rank({ n }: { n: number }) {
  const medal =
    n === 1 ? "var(--medal-gold)" : n === 2 ? "var(--medal-silver)" : n === 3 ? "var(--medal-bronze)" : null;
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: medal ?? "transparent" }} />
      <span className={cn("tnum w-5 text-right text-sm", n <= 3 ? "font-semibold text-fg" : "text-fg-subtle")}>
        {n}
      </span>
    </div>
  );
}

function ScoreCell({ score, max }: { score: number; max: number }) {
  return (
    <div className="min-w-[130px]">
      <div className="tnum text-sm font-semibold text-fg">{formatNumber(score)}</div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-accent" style={{ width: `${(score / max) * 100}%` }} />
      </div>
    </div>
  );
}

function TitlesCell({ player, headlineTypes }: { player: Player; headlineTypes: string[] }) {
  const counts = headlineTypes.map((type) => ({ type, n: countType(player, type) }));
  if (counts.every((c) => c.n === 0)) return <span className="text-xs text-fg-subtle">—</span>;
  return (
    <div className="flex items-center gap-3">
      {counts.map((c) =>
        c.n > 0 ? (
          <span key={c.type} className="inline-flex items-center gap-1">
            <TrophyIcon type={c.type} size={16} className="text-[color:var(--medal-gold)]" />
            <span className="tnum text-xs font-medium text-fg-muted">{c.n}</span>
          </span>
        ) : null
      )}
    </div>
  );
}
