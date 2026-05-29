# Pantheon

[English](./README.md) · **简体中文**

竞技体育的可视化荣誉殿堂。Pantheon 把散落的冠军、MVP 与最佳阵容,整合成一个透明、可核查的
**荣誉指数**——按赛区与位置切片,用你能逐项核对的数据来终结 GOAT 之争。

> 起点是英雄联盟电竞。数据模型与项目无关,可扩展到其他电竞与传统体育。

## 功能

- **荣誉排行榜** —— 每位选手按"按赛事分级加权"的荣誉指数排名;可按赛区(LCK / LPL / LEC / LCS)
  与位置(上单 / 打野 / 中单 / 下路 / 辅助)切片,切换权重预设即时重排。
- **选手档案** —— 大号荣誉指数 + 同位置百分位、带赛事图标的奖杯陈列(亚军以虚影奖杯呈现)、
  生涯时间线(visx)、指数构成环图(Recharts)。
- **正面对决** —— 五个荣誉维度的雷达图对比。
- **透明算法** —— 每个权重都在 `/methodology` 公开、可手动复算。
- **多语言** —— English / 简体中文 / 한국어(基于 cookie,无闪烁)。
- **明暗主题**,简约高级,单一香槟金强调色。
- **照片就绪头像** —— 把授权图片放进 `public/players/` 即可。

## 技术栈

Next.js 14(App Router)· React 18 · TypeScript · Tailwind CSS 3 · visx · Recharts ·
TanStack Table · Motion · lucide-react · Geist。

## 快速开始

```bash
npm install
npm run dev      # http://localhost:3000
# 生产构建
npm run build && npm start
```

需要 Node.js 18.17+(推荐 20+)。

## 数据

仓库自带一小份**手工种子数据**(`src/lib/data.ts`),开箱即可运行;在同步前荣誉为近似值。

真实荣誉来自 **Leaguepedia**(Cargo API,CC BY-SA 3.0):

```bash
node scripts/ingest-leaguepedia.mjs --dry   # 预览数据行,不写文件
node scripts/ingest-leaguepedia.mjs         # 写入 src/lib/players.generated.json
```

脚本会把真实的冠军 / 亚军 / MVP / 最佳阵容合并到手工 bios 上(赛区、位置、简介保留,只替换荣誉)。
匿名 API 限流很严(约 1 次/分钟)——要批量同步请注册 Leaguepedia/Fandom 机器人账号,通过
`.env.local` 设置 `LP_USER` / `LP_PASS`(切勿提交凭据)。同步数据为 CC BY-SA,请保留署名。

## 选手照片

把授权或自有的头像放进 `public/players/<id>.(jpg|png|webp)`(如 `faker.jpg`),会自动以圆形裁切
显示;没有时显示干净的字母占位。**只放你有权使用的图片——本仓库不打包任何版权照片。**

## 多语言

在 `src/lib/i18n/` 增加语言(`config.ts` + 在 `dictionaries.ts` 补一套词典)。所有界面文案与
荣誉 / 位置 / 赛区 / 维度标签都走 `t()`。

## 目录结构

```
src/app          路由:首页、/lol/leaderboard、/lol/players/[id]、/compare、/methodology
src/lib/honor.ts 荣誉指数引擎(权重、类别、预设、雷达维度)
src/lib/data.ts  手工选手种子 + 取数函数
src/lib/i18n     语言与词典
src/components   图表、表格、头像、奖杯图标、主题与 i18n Provider
scripts          Leaguepedia 抓取脚本
```

## 许可证

代码以 [MIT](./LICENSE) 协议发布。从 Leaguepedia 同步的荣誉数据为 **CC BY-SA 3.0**,
需保留署名并以相同协议共享。Geist 字体 © Vercel。

## 免责声明

本项目与 Riot Games 无任何关联或背书。选手、战队与赛事名称归各自所有者所有。种子荣誉数据在
同步前仅作示意。
