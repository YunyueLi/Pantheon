# 万神殿 — 设计语言（「Codex 法典」）

*English: [DESIGN.md](./DESIGN.md)*

视觉系统唯一的成文权威。**真正的实现以代码为准** —— `src/app/globals.css`（`:root`
颜色 token + `@layer components` primitives）以及 `src/components/ui/` 下的共享组件；
本文解释**意图**,让改动保持一致。代码与本文冲突时,以代码为准,并应回头更新本文。

**维护:** 本文与英文版 [`DESIGN.md`](./DESIGN.md) 是逐节对应的镜像。设计一变,**两份在同一次提交里一起改**,绝不让它们漂移;代码始终是唯一权威。

---

## 0. 产品论点（一切决定的标尺）

**唯一 · 透明 · 权威。** 万神殿是一座纪念碑,不是一个 app:一份说一不二的榜单 +
一套能手算复现的方法。每个设计选择都服务于此。旋钮、投票、「做你自己的」这类通用
app 功能会稀释权威,已被刻意砍掉（2026-06-25 审计）。拿不准时,选让「判决」更唯一、
更手作的那一边,而不是更可交互的那一边。

---

## 1. 渊源与参照

气质参照:**Nous Research 的 Hermes agent 官网**（`hermes-agent.nousresearch.com`）。
我们**借神,不抄形**。

- **取自 Hermes:** 超大号 display 字;编号分节;安静的、随滚动揭示的信息节奏;暗色发光场;少装饰胜于多。
- **刻意分野（万神殿自己的）:**
  - 全**衬线** Didone —— Hermes 是无衬线;
  - 刻意**非对称** + 发丝网格 —— Hermes 居中对称;
  - **半调双色 + 线刻 + 幽灵字** —— Hermes 用 3D 实拍渲染;
  - 饱和的**绛红**主色（+ obsidian / paper）;
  - 拉丁的**「碑刻 / 法典」**调性（"MMXXVI"、罗马数字）。
- **已否的死路:** 字面照搬的羊皮纸 / Cinzel / 金色「Hermetic」那版 —— 因「拙劣的模仿」
  放弃,**别复活**。

Hermes 的编号分节 → 我们的**罗马数字 Plate（Ⅰ–Ⅶ）**;它的超大 hero 字 → 我们的
`.mega`;它的滚动揭示 → 我们的 `data-reveal`。

---

## 2. 主题与色彩 token

三套主题,由导航的主题键循环切换。**obsidian 是默认。** 每套只覆盖*基础* token;
*派生* token（`--accent-soft`、`--bg-glass`、`--gold-soft`、`--gold-line`）用
`color-mix` 从基础重算。

| token | obsidian（`.dark`,默认） | crimson（`:root`） | paper（`.paper`） |
|---|---|---|---|
| `--bg` / `--surface` | `#0c0b0a` | `#cc1326` | `#f3eee2` |
| `--fg`（正文墨色） | `#f3efe6`（骨白） | `#ffffff` | `#221c14`（墨黑） |
| `--fg-2` / `--fg-3` | 骨白 68% / 46% | 白 72% / 54% | 墨 70% / 50% |
| `--border` / `--border-strong` | 骨白 18% / 42% | 白 26% / 52% | 墨 20% / 42% |
| `--accent`（强调色） | `#e23a4e`（绛红） | `#ffffff`（白墨） | `#cc1326`（绛红） |
| `--accent-contrast` | `#0c0b0a` | `#cc1326` | `#ffffff` |
| `--medal-gold` | `#e8c879` | `#ffe7ad` | `#9c7b2e` |

主题存在 `localStorage` 的 `pantheon-mode`;`layout.tsx` 里的内联脚本在首屏绘制前就设好
类名（无闪烁）。主题逻辑以 `theme-provider.tsx` 为准。

---

## 3. 字体排印

- **一切皆衬线。** 拉丁 = **Playfair Display**（Didone,高对比）;中文 = **Noto Serif
  SC / 思源宋体**（对比度匹配的宋体）。在 `--font-display: var(--font-latin),
  var(--font-cjk), Georgia, …, serif` 里组合,每条衬线规则都会按字符脚本取对的字形。
  全站无任何无衬线。
- **`.label`** = 衬线 + `text-transform:uppercase` + `letter-spacing:0.2em`。这是
  eyebrow / 导航 / 说明文字的声口。**「标签感」由大写 + 字距承载,绝不靠换字体。**
- **Display:** `.mega`（字重 900、`line-height:0.84`、紧字距、大写）。
- **数字:** 等宽 + lining（`.tnum`、`.ledger-num`）—— 排名、分数、年份不能跳宽。
- **字号:** 流式 `clamp()`。桌面取 vw/max 端;移动端只压低 *min*。中文宋体无斜体 →
  伪斜可接受。

---

## 4. 布局与网格

- **发丝 6 列叠层**（`.col-grid`;≤640px 收成 3 列）—— hero 与色带背后的结构签名。
- **`.pad` 轨:** 水平内边距 `clamp(20px,5vw,64px)`,所有 header/hero/筛选行共用,
  让内容对齐同一条边。
  - **规则:** 任何与 `.pad` 同时出现的布局类,竖向内边距必须用 **`padding-block`**,
    绝不用 4 值 `padding` 简写 —— 简写会把左右重置为 0,把内容顶到视口边缘。
- **满幅**（board/compare 不加 `max-w` 包裹）、刻意**非对称**、底部锚定的海报式 hero。

---

## 5. 动效

- `data-reveal` → 随滚动淡入 + 上移（`ScrollReveal`,在 layout 里挂一次）。门控在
  `.js`（首屏前加上）+ `prefers-reduced-motion` 之后。视口内元素立即显示,其余用
  `IntersectionObserver` 观察,并有 2.5s 兜底全部显示(内容**绝不会卡在隐藏**）。错峰用
  内联 `transitionDelay`。
- **规则:** 绝不把 `data-reveal` 放在条件/交互才挂载的节点上 —— 观察器只在加载时建一次,
  看不到后来出现的元素,会让它卡在 `opacity:0`。

---

## 6. 纪念碑 primitives（视觉词汇）

定义在 `globals.css` 的 `@layer components`。**用这些来搭,别造通用控件。**

| 类名 | 是什么 |
|---|---|
| `.col-grid` | 发丝 6 列背景叠层 |
| `.v-edge` | 竖排（旋转）边缘标签,如 `PANTHEON · ANNO MMXXVI` |
| `.ghost-glyph` | 超大极淡幽灵字（★ ♛ Σ / 项目徽记）,`opacity:.05`,溢出边缘 |
| `.mega` / `.mega-outline` | display 大字 / 描边镂空大字 |
| `.ledger-num` | 等宽 lining 数字 |
| `.plate`（+`-n` `-t` `-note`） | **标准节标题** —— 罗马数字/序号 + 衬线标题 + 注脚,压在一条发丝线上。用 `<Plate n title note/>`（`ui/plate.tsx`） |
| `.label` | 衬线大写带字距（eyebrow/导航/说明） |
| `.ftog` / `.fsel` | **扁平控件**（`ui/flat-controls.tsx`）:下划线式 `FlatSelect`（自绘 listbox,非原生 `<select>`）+ `FlatToggle` |

每页专属的布局写在各组件**作用域内的 `<style>`**,keyed 到根类 —— 绝不外泄到全局。

---

## 7. 图像与图标

- **肖像**(`Portrait`,选手档案)—— 半调双色场 + 放射日芒 + 径向光晕,雕刻字母压在其上。
  有**自由授权肖像**的,渲染成**干净的高对比黑白「纪念碑」肖像**(灰度 + 强对比,边缘羽化,
  人脸从光中浮现);没有的就用那张光效字母场兜底。**干净黑白是标准 —— 不加网点/颗粒。**
- **选手照片** —— 取自维基共享(多为 CC BY-SA),在 `src/lib/player-photos.ts` 登记,
  落在 `/public/players/<id>.jpg`,并在 **`/credits`** 页署名。电竞选手少有自由图 → 回退光效场。
- **字母组合镌刻** —— 姓名首字母作巨大极淡的笔画(多词名取首末首字母,单名取前两字母)。
- **幽灵字** —— 巨大、极淡、溢出一边;**绝不用柔光渐变「光晕/球」**。
- **无项目徽记** —— 导航**只用文字**(项目名)。抽象象形标读着像通用「AI」图标,已于 2026-06-26 移除;
  质感交给肖像 + 排版(Hermes 也不用象形图)。
- **`trophy-icon.tsx`** —— 古典**刻线奖杯**(高脚杯 / 大奖杯 / 绶带奖章 / 多面星),按奖牌等级着色。
- **OG 分享卡**(`scripts/generate-og.ts`,构建期 satori→resvg 生成 PNG):发丝网格 +
  字母镌刻 + `Nº` + 荣誉指数 —— 一页「被撕下的法典」。`public/og/` 被 gitignore,每次
  `prebuild` 重生。

---

## 8. 页面范式（根类）

| 类名 | 页面 |
|---|---|
| `.home` | 首页 |
| `.board` | 排行榜（满幅名册 + 扁平衬线筛选） |
| `.enshrine` | 球员侧写（海报式 hero、№ 分数、判词引文、奖杯 haul、台账） |
| `.oracle` | 对比（正面对决、幽灵「VS」、雷达图） |
| `.codex` | 方法论（公式 hero、幽灵 Σ、罗马数字篇章、关税台账） |
| `.houses` / `.crest` | 战队列表 / 战队主页 |

---

## 9. Do / Don't（防「AI 味」）

**该做** —— 扩展上面的 primitives;每节用罗马数字 **Plate**;发丝线与台账数字;拉丁/碑刻
调性;只下**一个**判决。

**不该做**（以下都读着像通用「AI」套模板,已于 2026-06-25 审计移除）:

- 圆角药丸 / chip 当状态或标签;
- 原生系统 `<select>` 下拉;
- 柔光渐变**「光晕 / 球」**当装饰;
- 装饰性**彩色圆点图例**;
- 双栏**「正方 / 反方」**辩论面板（神殿不打和稀泥）;
- **投票 / 民调**控件与群众输入（它不为自己的判决做民调）;
- 自由的**用户旋钮**(「做你自己的排名」)稀释那一份指数 —— 策展的**预设镜头**可以,
  无限滑块玩具不行。
- 抽象的**项目象形徽记 / 图标库式标记** —— 读着通用;导航改纯文字,身份交给图像(2026-06-26 移除)。

---

## 10. 文件地图

- `src/app/globals.css` —— token、`@layer components` primitives、`@media print`。
- `src/components/theme-provider.tsx` —— 三主题。`reveal.tsx` —— 滚动动效。
- `src/components/ui/plate.tsx` —— 节标题。`ui/flat-controls.tsx` —— 控件。
- `src/components/trophy-icon.tsx` —— 奖杯刻线。`player-profile.tsx` 的 `Portrait` —— 纪念碑肖像处理。
- `src/lib/player-photos.ts` —— 自由授权照片清单,在 `app/credits/page.tsx` 署名。
- `scripts/generate-og.ts` —— 构建期 OG 卡。
- 各页面:`leaderboard.tsx`、`player-profile.tsx`、`compare-view.tsx`、
  `methodology.tsx`、`team-profile.tsx`、`football-clubs.tsx` 等。
