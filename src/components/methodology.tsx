"use client";

import type { Bucket } from "@/lib/sport/types";
import { achievementPoints, ranked } from "@/lib/sport/honor";
import { useSport, useHonorLabel, useAxisLabel, useName } from "@/lib/sport/provider";
import { Plate } from "@/components/ui/plate";
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
    <div className="codex">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.codex{position:relative;overflow-x:hidden}
.codex .pad{padding-left:clamp(20px,5vw,64px);padding-right:clamp(20px,5vw,64px)}

.cx-hero{position:relative;padding:60px 0 44px;border-bottom:1px solid var(--border)}
.cx-hero .kick{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.3em;font-size:11px;color:var(--fg-2)}
.cx-hero h1{font-family:var(--font-display);font-weight:900;text-transform:uppercase;font-size:clamp(52px,11vw,150px);line-height:.82;letter-spacing:-.02em;margin:14px 0 0}
.cx-intro{position:relative;margin-top:24px;max-width:52ch;font-family:var(--font-display);font-style:italic;font-size:clamp(16px,2vw,21px);line-height:1.5;color:var(--fg-2)}

.cx-formula{position:relative;margin-top:32px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:30px 0;font-family:var(--font-display);font-size:clamp(18px,3vw,38px);letter-spacing:.01em;color:var(--fg);text-align:center}
.cx-formula .op{color:var(--fg-3)}
.cx-formula.sub{font-size:clamp(16px,2.4vw,30px);border:0;border-bottom:1px solid var(--border);margin-top:0;padding-top:8px}

.sec{position:relative;padding-bottom:46px}
.cx-cols{margin-top:22px;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,72px);align-items:start}
@media(max-width:820px){.cx-cols{grid-template-columns:1fr;gap:32px}}
.cx-body p{font-family:var(--font-display);font-size:15px;line-height:1.65;color:var(--fg-2);margin:0 0 14px}
.cx-body p strong,.cx-body p b{color:var(--fg);font-weight:700}
.cx-note{font-style:italic;color:var(--fg-2);border-left:1px solid var(--border-strong);padding-left:16px;margin-top:6px}

.cx-defs{list-style:none;margin:0;padding:0}
.cx-defs li{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:baseline;border-bottom:1px solid var(--border);padding:16px 0}
.cx-defs .term{font-family:var(--font-display);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:13px;color:var(--fg)}
.cx-defs .dsc{font-family:var(--font-display);font-size:14px;line-height:1.5;color:var(--fg-2)}
.cx-dot{display:inline-block;width:10px;height:10px;margin-right:9px;vertical-align:middle}

.exhibit{margin-top:22px}
.exhibit .lead{font-family:var(--font-display);font-size:16px;color:var(--fg-2);margin-bottom:20px}
.exhibit .lead b{color:var(--fg);font-weight:700}
.exhibit .lead .sc{font-weight:800;font-variant-numeric:tabular-nums}
.ex-row{display:grid;grid-template-columns:minmax(140px,16rem) 1fr auto;align-items:center;gap:18px;padding:13px 0;border-bottom:1px solid var(--border)}
.ex-row .nm{font-family:var(--font-display);font-size:15px;color:var(--fg)}
.ex-row .nm .x{color:var(--fg-3)}
.ex-row .track{height:3px;background:var(--border)}
.ex-row .track span{display:block;height:3px;background:var(--accent)}
.ex-row .pts{font-family:var(--font-display);font-weight:700;font-variant-numeric:tabular-nums;font-size:16px;text-align:right;min-width:3.5rem}

.tariff{width:100%;border-collapse:collapse;margin-top:20px}
.tariff th{font-family:var(--font-display);text-transform:uppercase;letter-spacing:.16em;font-size:10px;color:var(--fg-2);text-align:left;padding:0 12px 14px;border-bottom:1px solid var(--border)}
.tariff th.r{text-align:right}
.tariff td{padding:14px 12px;border-bottom:1px solid var(--border);font-family:var(--font-display)}
.tariff tr:hover td{background:var(--accent-soft)}
.tariff .hon{font-size:16px;color:var(--fg)}
.tariff .bk{font-size:13px;color:var(--fg-2)}
.tariff .tier{font-size:10px;letter-spacing:.12em;color:var(--fg-3);border:1px solid var(--border);padding:2px 7px}
.tariff .base{text-align:right;font-weight:800;font-variant-numeric:tabular-nums;font-size:22px}

.cx-grid{margin-top:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));border-top:1px solid var(--border);border-left:1px solid var(--border)}
.cx-card{border-right:1px solid var(--border);border-bottom:1px solid var(--border);padding:22px}
.cx-card .ct{font-family:var(--font-display);font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:15px;color:var(--fg)}
.cx-card .wt{margin-top:14px;display:flex;justify-content:space-between;align-items:center;font-family:var(--font-display);font-size:14px;color:var(--fg-2)}
.cx-card .wt b{color:var(--fg);font-weight:800;font-variant-numeric:tabular-nums}
.cx-axes{margin-top:20px;border-top:1px solid var(--border)}
.cx-axis{display:grid;grid-template-columns:9rem 1fr;gap:18px;align-items:baseline;border-bottom:1px solid var(--border);padding:16px 0}
.cx-axis .an{font-family:var(--font-display);font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:14px;color:var(--fg)}
.cx-axis .ad{font-family:var(--font-display);font-size:14px;line-height:1.5;color:var(--fg-2)}
.cx-prov{margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px)}
@media(max-width:820px){.cx-prov{grid-template-columns:1fr;gap:24px}}
.cx-prov p{font-family:var(--font-display);font-size:15px;line-height:1.65;color:var(--fg-2);margin:0}
`,
        }}
      />

      {/* HERO — the equation is the subject */}
      <section className="cx-hero pad">
        <div className="col-grid" />
        <span className="ghost-glyph" style={{ right: "2%", top: "-18%", fontSize: "clamp(280px,42vw,560px)" }}>
          Σ
        </span>
        <div style={{ position: "relative" }} data-reveal>
          <p className="kick">{t("methodology.eyebrow")}</p>
          <h1>{t("methodology.title")}</h1>
          <p className="cx-intro">
            {zh
              ? "荣誉指数只数真实赢下的硬荣誉,完全透明、可逐项手算——没有黑箱,也没有任何「多拿反而扣分」的把戏。"
              : "The Honor Index counts only real, hard-won silverware — fully transparent and reproducible by hand, with no black box and no penalty for winning more."}
          </p>
        </div>
        <div className="cx-formula" data-reveal>
          HonorScore <span className="op">=</span> Σ <span className="op">(</span> base <span className="op">×</span> bucket{" "}
          <span className="op">×</span> share{usesCount ? <> <span className="op">×</span> count</> : null} <span className="op">)</span>
        </div>
      </section>

      {/* ARTICLE Ⅰ — Honor Index */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅰ" title={zh ? "荣誉指数 · 数奖杯" : "Honor Index · counting trophies"} />
        <div className="cx-cols">
          <div className="cx-body">
            <p>
              {zh
                ? "每一个冠军、每一场胜利都按真实年份单独记录,在生涯时间线上逐年铺开——绝不把生涯总数压到某一年。"
                : "Every title and win is recorded individually at its real year and laid out year-by-year on the timeline — career totals are never collapsed onto one season."}
            </p>
            <p className="cx-note">
              {zh
                ? "无边际递减:同一项荣誉拿得越多,分值线性累加,绝不打折——统治力只会加分。"
                : "No diminishing returns: every repeat win adds full value, never discounted — dominance is only ever rewarded."}
            </p>
            <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--fg-3)" }}>{t("methodology.voteShareNote")}</p>
          </div>
          <ul className="cx-defs">
            <li>
              <span className="term">base</span>
              <span className="dsc">{zh ? "每项荣誉的基础分,按赛事级别与稀缺度设定(下方关税表)。" : "each honor's base value, set by prestige and scarcity (tariff below)."}</span>
            </li>
            {BUCKETS.map((b) => (
              <li key={b}>
                <span className="term">
                  <span className="cx-dot" style={{ background: BUCKET_COLOR[b] }} />
                  {t(`bucket.${b}`)}
                </span>
                <span className="dsc">{t(`bucketDesc.${b}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ARTICLE Ⅱ — Stature */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅱ" title={zh ? "星光与时代强度 · 口碑透镜" : "Stature & Era Strength · the reputation lens"} />
        <div className="cx-formula sub">
          Stature <span className="op">=</span> base <span className="op">×</span> ( 1 <span className="op">±</span> 12%{" "}
          <span className="op">·</span> eraStrength )
        </div>
        <div className="cx-cols" style={{ marginTop: "24px" }}>
          <div className="cx-body">
            <p>
              {zh
                ? "一个与荣誉指数完全独立的可选透镜,衡量历史地位与影响力,可在排行榜一键切换。"
                : "An optional lens, fully separate from the trophy-based Honor Index, capturing all-time standing and influence — toggle it on the leaderboard."}
            </p>
            <p className="cx-note">
              {zh
                ? "关键:这是一次性计算(荣誉分 → 时代密度 → 星光),从不回灌荣誉指数,因此没有循环依赖;幅度封顶 ±12%。"
                : "Crucially this is one-pass (honor scores → era density → stature) and never feeds back into the Index — no circular dependency, capped at ±12%."}
            </p>
            {config.statureSources && config.statureSources.length > 0 && (
              <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--fg-3)" }}>
                <strong>{zh ? "基础星光来源:" : "Base ratings sourced from: "}</strong>
                {config.statureSources.join(zh ? "、" : ", ")}
                {zh ? "(全明星票数等人气信号)。" : "."}
              </p>
            )}
          </div>
          <ul className="cx-defs">
            <li>
              <span className="term">
                <span className="cx-dot" style={{ background: "var(--chart-2)" }} />
                {zh ? "基础星光" : "Base"}
              </span>
              <span className="dsc">{zh ? "有编辑共识评分时取之,否则按该项目荣誉指数的百分位推导。" : "a curated GOAT-consensus rating where authored, else derived from the player's Honor-Index percentile."}</span>
            </li>
            <li>
              <span className="term">
                <span className="cx-dot" style={{ background: "var(--chart-4)" }} />
                {zh ? "时代强度" : "Era strength"}
              </span>
              <span className="dsc">{zh ? "你巅峰期同台、且自身荣誉分高的对手密度,取项目内百分位(中位选手 = 50)。" : "the percentile density of decorated rivals whose prime overlapped yours (median player = 50)."}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* EXHIBIT — worked example */}
      {top && contributors.length > 0 && (
        <section className="sec pad">
          <Plate n="Ⅲ" title={zh ? "实例拆解" : "Worked Example"} />
          <div className="exhibit">
            <p className="lead">
              {zh ? (
                <>
                  本项目当前第一 <b>{name(top.player)}</b> 的 <span className="sc">{formatNumber(top.score)}</span> 分,按荣誉构成如下:
                </>
              ) : (
                <>
                  How the current No.&nbsp;1, <b>{name(top.player)}</b>, builds a score of{" "}
                  <span className="sc">{formatNumber(top.score)}</span>:
                </>
              )}
            </p>
            {contributors.map(([type, v]) => (
              <div key={type} className="ex-row">
                <span className="nm">
                  {honorLabel(type)}
                  {v.n > 1 && <span className="x"> ×{v.n}</span>}
                </span>
                <span className="track">
                  <span style={{ width: `${Math.max(3, (v.pts / exMax) * 100)}%` }} />
                </span>
                <span className="pts">{formatNumber(Math.round(v.pts))}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TARIFF — base values */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅳ" title={t("methodology.weightsTitle")} />
        <table className="tariff">
          <thead>
            <tr>
              <th>{t("methodology.colAchievement")}</th>
              <th>{t("methodology.colBucket")}</th>
              <th>{t("methodology.colTier")}</th>
              <th className="r">{t("methodology.colBase")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([type, meta]) => (
              <tr key={type}>
                <td className="hon">{honorLabel(type)}</td>
                <td className="bk">
                  <span className="cx-dot" style={{ background: BUCKET_COLOR[meta.bucket], width: 8, height: 8 }} />
                  {t(`bucket.${meta.bucket}`)}
                </td>
                <td>
                  <span className="tier">{meta.tier}</span>
                </td>
                <td className="base">{meta.base}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PRESETS */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅴ" title={t("methodology.presetsTitle")} note={t("methodology.presetsDesc")} />
        <div className="cx-grid">
          {model.presets.map((p) => (
            <div key={p.key} className="cx-card">
              <div className="ct">{t(`preset.${p.key}`)}</div>
              {BUCKETS.map((b) => (
                <div key={b} className="wt">
                  <span>
                    <span className="cx-dot" style={{ background: BUCKET_COLOR[b], width: 8, height: 8 }} />
                    {t(`bucket.${b}`)}
                  </span>
                  <b>×{p.weights[b]}</b>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* AXES */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅵ" title={t("methodology.axesTitle")} note={t("methodology.axesDesc")} />
        <div className="cx-axes">
          {model.axes.map((axis) => {
            const dKey = `axisDesc.${axis.id}`;
            const d = t(dKey);
            return (
              <div key={axis.id} className="cx-axis">
                <span className="an">{axisLabel(axis.id, axis.label)}</span>
                <span className="ad">{d === dKey ? "" : d}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROVENANCE */}
      <section className="sec pad" data-reveal>
        <Plate n="Ⅶ" title={t("methodology.dataTitle")} />
        <div className="cx-prov">
          <p>{t("methodology.dataNote")}</p>
          <p>{t("methodology.dataNote2")}</p>
        </div>
      </section>
    </div>
  );
}
