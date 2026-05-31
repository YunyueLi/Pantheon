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
  const { config } = useSport();
  const { model } = config;
  const honorLabel = useHonorLabel();
  const axisLabel = useAxisLabel();
  const rows = Object.entries(model.achievementMeta).sort((a, b) => b[1].base - a[1].base);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{t("methodology.eyebrow")}</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">{t("methodology.title")}</h1>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t("methodology.intro")}</p>

      <Card className="mt-7">
        <CardContent className="pt-5">
          <code className="block rounded-lg bg-surface-2 px-4 py-3 font-mono text-sm text-fg">
            HonorScore = Σ ( base × bucketWeight × voteShare )
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
              {locale === "zh"
                ? `重复夺得同一项俱乐部冠军采用边际递减:第 k 次按 ${model.repeatDecay.factor}^k 加权,使长期效力豪门的“刷冠”不致压过巅峰表现与个人荣誉。国家队冠军与个人奖项不递减。`
                : `Repeated club trophies use diminishing returns — the k-th win of a club title is scaled by ${model.repeatDecay.factor}^k, so accumulation at dominant clubs can't outweigh peak and individual greatness. National-team titles and individual awards are never discounted.`}
            </p>
          )}
        </CardContent>
      </Card>

      <h2 className="mt-10 text-lg font-semibold tracking-tight">{t("methodology.weightsTitle")}</h2>
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

      <h2 className="mt-10 text-lg font-semibold tracking-tight">{t("methodology.presetsTitle")}</h2>
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

      <h2 className="mt-10 text-lg font-semibold tracking-tight">{t("methodology.axesTitle")}</h2>
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

      <h2 className="mt-10 text-lg font-semibold tracking-tight">{t("methodology.dataTitle")}</h2>
      <Card className="mt-4">
        <CardContent className="pt-5">
          <p className="text-sm leading-relaxed text-fg-muted">{t("methodology.dataNote")}</p>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t("methodology.dataNote2")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
