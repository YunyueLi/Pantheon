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
import { honorScore, countType, careerSpan, activeInDecade } from "@/lib/sport/honor";
import { localizeTeam } from "@/lib/sport/football/clubs";
import type { Player } from "@/lib/sport/types";
import { useSport, useName, useLeagueLabel, usePositionAbbr } from "@/lib/sport/provider";
import { cn, formatNumber } from "@/lib/utils";
import { Pills } from "@/components/pills";
import { SelectMenu } from "@/components/ui/select";
import { PlayerAvatar } from "@/components/player-avatar";
import { RegionBadge, PositionBadge } from "@/components/badges";
import { TrophyIcon } from "@/components/trophy-icon";
import { useI18n } from "@/lib/i18n/provider";

type Row = { player: Player; score: number };

export function Leaderboard() {
  const { t, locale } = useI18n();
  const { config, positionMeta } = useSport();
  const { players, model, leagues, positions, headlineTypes, basePath } = config;
  const name = useName();
  const leagueLabel = useLeagueLabel();
  const posAbbr = usePositionAbbr();
  const hasCoaches = useMemo(() => players.some((p) => p.kind === "coach"), [players]);
  const [kind, setKind] = useState<string>("player");
  const kindOpts = [
    { value: "player", label: t("leaderboard.kindPlayers") },
    { value: "coach", label: t("leaderboard.kindCoaches") },
  ];
  const sp = useSearchParams();
  const spRegion = sp.get("region");
  const spRole = sp.get("role");
  const [region, setRegion] = useState<string>(
    leagues.some((l) => l.id === spRegion) ? (spRegion as string) : "ALL"
  );
  // Sports flagged splitByPosition (table tennis) never mix positions: no "All",
  // default to the first position (men's), switchable to women's.
  const splitGender = Boolean(config.splitByPosition) && positions.length > 0;
  const [role, setRole] = useState<string>(
    positions.some((p) => p.id === spRole) ? (spRole as string) : splitGender ? positions[0].id : "ALL"
  );
  const [presetKey, setPresetKey] = useState(model.presets[0].key);
  const [era, setEra] = useState<string>("ALL");
  const [rankBy, setRankBy] = useState<"honor" | "stature">("honor");

  const weights = model.presets.find((p) => p.key === presetKey)!.weights;

  // Active-era buckets (decades), derived from the roster's actual span.
  const eras = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const p of players) {
      const s = careerSpan(p);
      if (s.start < min) min = s.start;
      if (s.end > max) max = s.end;
    }
    const out: number[] = [];
    for (let d = Math.floor(max / 10) * 10; d >= Math.floor(min / 10) * 10; d -= 10) out.push(d);
    return out;
  }, [players]);

  const regionOpts = [
    { value: "ALL", label: t("leaderboard.allRegions") },
    ...leagues.map((l) => ({ value: l.id, label: leagueLabel(l.id) })),
  ];
  const roleLabel = (pid: string) => {
    const v = t(`role.${pid}`);
    return v !== `role.${pid}` ? v : positionMeta(pid)?.label ?? pid;
  };
  // Only offer positions actually held by the players currently in view, so a
  // coach-only position (e.g. Manager) never shows up in the player filter.
  const availablePositions = positions.filter((p) =>
    players.some(
      (pl) => (kind === "coach" ? pl.kind === "coach" : pl.kind !== "coach") && pl.position === p.id
    )
  );
  const roleOpts = [
    ...(splitGender ? [] : [{ value: "ALL", label: t("leaderboard.allRoles") }]),
    ...availablePositions.map((p) => ({ value: p.id, label: roleLabel(p.id) })),
  ];
  // Individual sports (F1, Go) have no positions → hide the role column + filter.
  // Table tennis keeps it but renames it "Gender" via config.roleNoun.
  const hasPositions = availablePositions.length > 0;
  const roleColLabel = t(config.roleNoun ?? "leaderboard.colRole");
  const presetOpts = model.presets.map((p) => ({ value: p.key, label: t(`preset.${p.key}`) }));
  const eraOpts = [
    { value: "ALL", label: t("leaderboard.allEras") },
    ...eras.map((d) => ({ value: String(d), label: `${d}s` })),
  ];
  const hasStature = players.some((p) => p.stature != null);
  const rankByOpts = [
    { value: "honor", label: t("leaderboard.byHonor") },
    { value: "stature", label: t("leaderboard.byStature") },
  ];

  const data = useMemo<Row[]>(
    () =>
      players
        .filter((p) => (kind === "coach" ? p.kind === "coach" : p.kind !== "coach"))
        .filter(
          (p) =>
            (region === "ALL" || p.league === region) &&
            (kind === "coach" || role === "ALL" || p.position === role) &&
            (era === "ALL" || activeInDecade(p, +era))
        )
        .map((player) => ({
          player,
          score: rankBy === "stature" ? player.stature ?? 0 : honorScore(player, model, weights),
        }))
        .sort((a, b) => b.score - a.score),
    [region, role, kind, era, rankBy, weights, players, model]
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
                  <span className="font-medium text-fg group-hover:text-accent">{name(p)}</span>
                  {!p.active && (
                    <span className="text-[10px] uppercase tracking-wide text-fg-subtle">
                      {t("common.retired")}
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-fg-subtle">{localizeTeam(p.team, locale)}</div>
              </div>
            </Link>
          );
        },
      },
      {
        id: "region",
        header: t("leaderboard.colRegion"),
        accessorFn: (r) => r.player.league,
        cell: ({ row }) => <RegionBadge region={leagueLabel(row.original.player.league)} />,
      },
      ...(hasPositions
        ? [
            {
              id: "role",
              header: roleColLabel,
              accessorFn: (r: Row) => r.player.position,
              cell: ({ row }: { row: { original: Row } }) => (
                <PositionBadge abbr={posAbbr(row.original.player.position)} />
              ),
            } as ColumnDef<Row>,
          ]
        : []),
      {
        id: "titles",
        header: t("leaderboard.colTitles"),
        enableSorting: false,
        cell: ({ row }) => <TitlesCell player={row.original.player} headlineTypes={headlineTypes} />,
      },
      {
        id: "score",
        header: rankBy === "stature" ? t("leaderboard.byStature") : t("leaderboard.colHonor"),
        accessorFn: (r) => r.score,
        cell: ({ row }) => <ScoreCell score={row.original.score} max={maxScore} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxScore, locale, rankBy, hasPositions, roleColLabel]
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
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3.5 shadow-card sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {hasCoaches && <Pills options={kindOpts} value={kind} onChange={setKind} size="sm" />}
            <SelectMenu
              value={region}
              onChange={setRegion}
              options={regionOpts}
              ariaLabel={t("leaderboard.colRegion")}
              className="min-w-[8.5rem]"
            />
            {kind !== "coach" && hasPositions && (
              <SelectMenu
                value={role}
                onChange={setRole}
                options={roleOpts}
                ariaLabel={roleColLabel}
                className="min-w-[7.5rem]"
              />
            )}
            <SelectMenu
              value={era}
              onChange={setEra}
              options={eraOpts}
              ariaLabel={t("leaderboard.era")}
              className="min-w-[7rem]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasStature && (
              <Pills
                options={rankByOpts}
                value={rankBy}
                onChange={(v) => setRankBy(v as "honor" | "stature")}
                size="sm"
              />
            )}
            {rankBy === "honor" && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide text-fg-subtle">
                  {t("leaderboard.weighting")}
                </span>
                <SelectMenu
                  value={presetKey}
                  onChange={setPresetKey}
                  options={presetOpts}
                  ariaLabel={t("leaderboard.weighting")}
                  className="min-w-[9rem]"
                />
              </div>
            )}
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
                      <span className="truncate text-sm font-medium text-fg">{name(p)}</span>
                      {!p.active && (
                        <span className="shrink-0 text-[9px] uppercase tracking-wide text-fg-subtle">
                          {t("common.retired")}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <RegionBadge region={leagueLabel(p.league)} />
                      <PositionBadge abbr={posAbbr(p.position)} />
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
