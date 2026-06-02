"use client";

import type { Bucket } from "@/lib/sport/types";
import { achievementPoints, ranked } from "@/lib/sport/honor";
import { useSport, useHonorLabel, useAxisLabel, useName } from "@/lib/sport/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import { formatNumber } from "@/lib/utils";

const BUCKET_COLOR: Record<Bucket, string> = {
  team: "var(--accent)",
  individual: "var(--chart-2)",
  placement: "var(--chart-4)",
};
const BUCKETS: Bucket[] = ["team", "individual", "placement"];

export function Methodology() {
  const { t, locale } = useI18n();
  const zh = locale === "zh";
  const { config } = useSport();
  const { model } = config;
  const honorLabel = useHonorLabel();
  const axisLabel = useAxisLabel();
  const name = useName();
  const rows = Object.entries(model.achievementMeta)
    .filter(([, m]) => m.base > 0)
    .sort((a, b) => b[1].base - a[1].base);
  const usesCount = config.players.some((p) => p.achievements.some((a) => (a.count ?? 1) > 1));

  // Worked example: how the current #1 player's score is composed, by honor type.
  const top = ranked(config.players, model)[0];
  const exById = new Map<string, { pts: number; n: number }>();
  if (top) {
    for (const a of top.player.achievements) {
      const pts = achievementPoints(a, model);
      if (pts <= 0) continue;
      const cur = exById.get(a.type) ?? { pts: 0, n: 0 };
      cur.pts += pts;
      cur.n += a.count ?? 1;
      exById.set(a.type, cur);
    }
  }
  const contributors = [...exById.entries()].sort((a, b) => b[1].pts - a[1].pts).slice(0, 8);
  const exMax = contributors[0]?.[1].pts ?? 1;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{t("methodology.eyebrow")}</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">{t("methodology.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        {zh
          ? "荣誉指数只数真实赢下的硬荣誉,完全透明、可逐项手算——没有黑箱,也没有任何「多拿反而扣分」的把戏。下面是每一步的拆解。"
          : "The Honor Index counts only real, hard-won silverware — fully transparent and reproducible by hand, with no black box and no penalty for winning more. Here is every step."}
      </p>

      {/* Two pillars: the trophy-based Honor Index and the separate Stature lens. */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>{zh ? "荣誉指数（数奖杯）" : "Honor Index (counting the trophies)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block overflow-x-auto rounded-lg bg-surface-2 px-4 py-3 font-mono text-[13px] leading-relaxed text-fg">
              HonorScore = Σ ( base × bucket × share{usesCount ? " × count" : ""} )
            </code>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[3px] bg-fg-subtle" />
                <span>
                  <span className="font-medium text-fg">base</span>
                  <span className="text-fg-muted">{zh ? " — 每项荣誉的基础分,按赛事级别与稀缺度设定(下表)。" : " — each honor's base value, set by prestige and scarcity (table below)."}</span>
                </span>
              </li>
              {BUCKETS.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: BUCKET_COLOR[b] }} />
                  <span>
                    <span className="font-medium text-fg">{t(`bucket.${b}`)}</span>
                    <span className="text-fg-muted"> — {t(`bucketDesc.${b}`)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-fg-subtle">{t("methodology.voteShareNote")}</p>
            <p className="mt-2 rounded-lg bg-[color:var(--gold-soft)] px-3 py-2 text-xs leading-relaxed text-fg">
              {zh
                ? "无边际递减:同一项荣誉拿得越多,分值线性累加,绝不打折——统治力只会加分。"
                : "No diminishing returns: every repeat win of an honor adds full value — dominance is only ever rewarded."}
            </p>
            {usesCount && (
              <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
                {zh
                  ? "高产量类荣誉(如 F1 分站冠军、围棋国内头衔)按总数计:分值 = 基础分 × 数量,以 ×N 标注,不绑定到某一年。"
                  : "High-volume honors (F1 wins, Go domestic titles) are counted in bulk: score = base × count, marked ×N and never tied to one season."}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{zh ? "星光与时代强度（口碑透镜）" : "Stature & Era Strength (the reputation lens)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block overflow-x-auto rounded-lg bg-surface-2 px-4 py-3 font-mono text-[13px] leading-relaxed text-fg">
              Stature = base × ( 1 ± 12% · eraStrength )
            </code>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {zh
                ? "一个与荣誉指数完全独立的可选透镜,衡量历史地位与影响力(可在排行榜一键切换)。"
                : "An optional lens, fully separate from the trophy-based Honor Index, capturing all-time standing and influence (toggle it on the leaderboard)."}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-fg-muted">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--chart-2)]" />
                {zh
                  ? "基础星光:有编辑共识评分时取之,否则按该项目荣誉指数的百分位推导。"
                  : "Base — a curated GOAT-consensus rating where authored, else derived from the player's Honor-Index percentile."}
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--chart-4)]" />
                {zh
                  ? "时代强度:你巅峰期同台、且自身荣誉分高的对手密度,取项目内百分位(中位选手 = 50)。"
                  : "Era strength — the percentile density of decorated rivals whose prime overlapped yours (median player = 50)."}
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-fg-subtle">
              {zh
                ? "关键:这是一次性计算(荣誉分→时代密度→星光),从不回灌荣誉指数,因此没有循环依赖;幅度封顶 ±12%。"
                : "Crucially this is one-pass (honor scores → era density → stature) and never feeds back into the Honor Index — no circular dependency; capped at ±12%."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Worked example — make the score concrete with the sport's current #1. */}
      {top && contributors.length > 0 && (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>{zh ? "实例拆解" : "Worked example"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-fg-muted">
              {zh ? (
                <>
                  本项目当前第一 <span className="font-semibold text-fg">{name(top.player)}</span> 的{" "}
                  <span className="tnum font-semibold text-accent">{formatNumber(top.score)}</span> 分,按荣誉构成如下:
                </>
              ) : (
                <>
                  How the current No.&nbsp;1, <span className="font-semibold text-fg">{name(top.player)}</span>, builds a
                  score of <span className="tnum font-semibold text-accent">{formatNumber(top.score)}</span>:
                </>
              )}
            </p>
            <div className="mt-4 space-y-2.5">
              {contributors.map(([type, v]) => (
                <div key={type} className="grid grid-cols-[10rem_1fr_auto] items-center gap-3">
                  <span className="truncate text-sm text-fg">
                    {honorLabel(type)}
                    {v.n > 1 && <span className="tnum text-fg-subtle"> ×{v.n}</span>}
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <span
                      className="block h-full rounded-full bg-accent"
                      style={{ width: `${Math.max(3, (v.pts / exMax) * 100)}%` }}
                    />
                  </span>
                  <span className="tnum w-14 text-right text-sm font-medium text-fg-muted">{formatNumber(Math.round(v.pts))}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="mt-10 text-lg font-semibold tracking-tight">{t("methodology.weightsTitle")}</h2>
      <p className="mt-1 max-w-2xl text-sm text-fg-muted">
        {zh
          ? "本项目每一类荣誉的基础分(已按赛事级别与稀缺度校准)。这就是上面公式里的 base。"
          : "The base value of every honor in this sport, calibrated by event prestige and scarcity — the base term in the formula above."}
      </p>
      <Card className="mt-4">
        <CardContent className="px-0 py-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wide text-fg-subtle">
                <th className="px-5 py-2.5 text-left font-medium">{t("methodology.colAchievement")}</th>
                <th className="px-2 py-2.5 text-left font-medium">{t("methodology.colBucket")}</th>
                <th className="px-2 py-2.5 text-center font-medium">{t("methodology.colTier")}</th>
                <th className="px-5 py-2.5 text-right font-medium">{t("methodology.colBase")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([type, meta]) => (
                <tr key={type} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-2.5 text-sm text-fg">{honorLabel(type)}</td>
                  <td className="px-2 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
                      <span className="h-2 w-2 rounded-[2px]" style={{ background: BUCKET_COLOR[meta.bucket] }} />
                      {t(`bucket.${meta.bucket}`)}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle">
                      {meta.tier}
                    </span>
                  </td>
                  <td className="tnum px-5 py-2.5 text-right text-sm font-medium text-fg">{meta.base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{t("methodology.presetsTitle")}</h2>
          <p className="mt-1 text-sm text-fg-muted">{t("methodology.presetsDesc")}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {model.presets.map((p) => (
              <Card key={p.key}>
                <CardHeader>
                  <CardTitle>{t(`preset.${p.key}`)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {BUCKETS.map((b) => (
                    <div key={b} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-fg-muted">
                        <span className="h-2 w-2 rounded-[2px]" style={{ background: BUCKET_COLOR[b] }} />
                        {t(`bucket.${b}`)}
                      </span>
                      <span className="tnum font-medium text-fg">×{p.weights[b]}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">{t("methodology.axesTitle")}</h2>
          <p className="mt-1 text-sm text-fg-muted">{t("methodology.axesDesc")}</p>
          <Card className="mt-4">
            <CardContent className="space-y-3 pt-5">
              {model.axes.map((axis) => {
                const dKey = `axisDesc.${axis.id}`;
                const d = t(dKey);
                return (
                  <div key={axis.id} className="flex gap-3">
                    <span className="w-20 shrink-0 text-sm font-medium text-fg">{axisLabel(axis.id, axis.label)}</span>
                    <span className="text-sm leading-relaxed text-fg-muted">{d === dKey ? "" : d}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">{t("methodology.dataTitle")}</h2>
      <Card className="mt-4">
        <CardContent className="grid gap-3 pt-5 lg:grid-cols-2">
          <p className="text-sm leading-relaxed text-fg-muted">{t("methodology.dataNote")}</p>
          <p className="text-sm leading-relaxed text-fg-muted">{t("methodology.dataNote2")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
