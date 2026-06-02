"use client";

import type { Bucket } from "@/lib/sport/types";
import { useSport, useHonorLabel, useAxisLabel } from "@/lib/sport/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";

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
  // Hide display-only aggregates (base 0, e.g. Go's world-title tally) from the weights table.
  const rows = Object.entries(model.achievementMeta)
    .filter(([, m]) => m.base > 0)
    .sort((a, b) => b[1].base - a[1].base);
  const usesCount = config.players.some((p) => p.achievements.some((a) => (a.count ?? 1) > 1));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{t("methodology.eyebrow")}</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">{t("methodology.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">{t("methodology.intro")}</p>

      {/* Two pillars side by side: the trophy-based Honor Index and the separate Stature lens. */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle>{zh ? "荣誉指数（数奖杯）" : "Honor Index (the trophies)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block overflow-x-auto rounded-lg bg-surface-2 px-4 py-3 font-mono text-[13px] leading-relaxed text-fg">
              HonorScore = Σ ( base × bucket × share{usesCount ? " × count" : ""}{model.repeatDecay ? " × decayᵏ" : ""} )
            </code>
            <ul className="mt-4 space-y-3">
              {BUCKETS.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: BUCKET_COLOR[b] }} />
                  <span className="text-sm">
                    <span className="font-medium text-fg">{t(`bucket.${b}`)}</span>
                    <span className="text-fg-muted"> — {t(`bucketDesc.${b}`)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-fg-subtle">{t("methodology.voteShareNote")}</p>
            {model.repeatDecay && (
              <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
                {zh
                  ? `重复夺得同一项荣誉采用边际递减:第 k 次按 ${model.repeatDecay.factor}^k 加权,使"刷量"不致压过巅峰与稀缺荣誉。最稀缺的标志性奖项(如 MVP、奥运/世界冠军)不递减。`
                  : `Repeated wins of the same honor use diminishing returns — the k-th win is scaled by ${model.repeatDecay.factor}^k, so accumulation can't outweigh peak and scarce honors. The rarest marquee awards (MVP, Olympic/World gold) are never discounted.`}
              </p>
            )}
            {usesCount && (
              <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
                {zh
                  ? "高产量类荣誉(如 F1 的分站冠军、围棋的国内头衔)按总数计:分值 = 基础分 × 数量,档案中以 ×N 显示。"
                  : "High-volume honors (e.g. F1 race wins, Go domestic titles) are counted in bulk: score = base × count, shown as ×N in the cabinet."}
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
                ? "星光是与荣誉指数完全独立的可选透镜,衡量历史地位与影响力(可在排行榜切换)。"
                : "Stature is an optional lens, fully separate from the trophy-based Honor Index, capturing all-time standing and influence (toggle it on the leaderboard)."}
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
                  ? "时代强度:用同期(巅峰窗口重叠)、且自身荣誉分高的对手密度,取项目内百分位——中位选手为 50。"
                  : "Era strength — the percentile density of decorated contemporaries whose prime overlapped this player's; the median player sits at 50."}
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-fg-subtle">
              {zh
                ? "关键:这是一次性计算(荣誉分→时代密度→星光),不回灌荣誉指数,因此无循环依赖。强时代上浮、弱时代下浮,幅度封顶 ±12%。"
                : "Crucially this is one-pass (honor scores → era density → stature) and never feeds back into the Honor Index, so there's no circular dependency. Strong eras nudge up, weak eras down, capped at ±12%."}
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">{t("methodology.weightsTitle")}</h2>
      <p className="mt-1 max-w-2xl text-sm text-fg-muted">
        {zh
          ? "每类荣誉的基础分,按赛事级别与稀缺度设定。下表为本项目的完整权重。"
          : "The base value of every honor, set by event prestige and scarcity. The full per-sport weighting follows."}
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
                    <span className="w-24 shrink-0 text-sm font-medium text-fg">{axisLabel(axis.id, axis.label)}</span>
                    <span className="text-sm text-fg-muted">{d === dKey ? "" : d}</span>
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
