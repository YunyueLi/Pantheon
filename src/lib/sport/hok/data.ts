import type { Achievement, Player } from "../types";

/**
 * Honor of Kings (王者荣耀 / KPL) roster — 14 of the most-decorated players of the
 * KPL era (2016–), every honor WEB-VERIFIED against Liquipedia (liquipedia.net/
 * honorofkings) and KPL records, frozen 2026-06. Honors are recorded at their REAL
 * YEAR as dated entries so the career timeline is truthful.
 *
 * Sourcing decisions (accuracy over completeness):
 * - `world_champ` = the annual INTERNATIONAL apex only, across its renamed banners:
 *   Champion Cup 2017–18 (KCC), World Champion Cup 2019–21, International Championship
 *   2022–23 (KIC), World Cup 2025 (Riyadh / EWC). The 2016 KCC (won by eStar Gaming)
 *   predates every player here. The year-end "Winter Champion Cup" editions are NOT
 *   counted — Liquipedia classes them as domestic cups with limited invitees, not the
 *   apex. The 2024 year-end "Championship" (won by minor international teams) is also
 *   excluded to keep `world_champ` to the recognized global apex.
 * - `kpl_title` = KPL seasonal split titles (Spring/Summer/Fall) AND the year-end KPL
 *   Grand Finals (年度总决赛, added 2024) — both are KPL championships.
 * - `kpl_fmvp` = Finals MVP of a KPL SPLIT/Grand-Finals only. Apex-final MVPs (e.g.
 *   Fly's KCC/WCC final MVPs, HuaHai's KIC 2022, ZhongYi's World Cup 2025) are already
 *   carried by the `world_champ` credit and are NOT re-counted here to avoid crediting
 *   the same match twice.
 * - `kpl_mvp` = KPL regular-season MVP (the split-long award, not a finals award).
 *
 * NOTE ON IDs: Chen "ZhongYi" Jiahao (AG jungler, b. 2004-12-26) also competes under
 * the international ID "Zoe" (AG.AL International, World Cup 2025 FMVP). They are ONE
 * person, recorded once as ZhongYi. Likewise "Sheng" is a short form of ChangSheng.
 */
const A = (type: string, years: number[]): Achievement[] => years.map((year) => ({ type, year }));

type Raw = {
  id: string; name: string; realName?: string; nation: string;
  active: boolean; debut: number; blurb: string;
  wc?: number[]; kt?: number[]; kf?: number[]; km?: number[];
};
const mk = (r: Raw): Player => ({
  id: r.id, name: r.name, ...(r.realName ? { realName: r.realName } : {}),
  sport: "hok", league: "CHN", position: "",
  team: "", nation: r.nation, active: r.active, debutYear: r.debut, blurb: r.blurb,
  achievements: [
    ...A("world_champ", r.wc ?? []),
    ...A("kpl_title", r.kt ?? []),
    ...A("kpl_fmvp", r.kf ?? []),
    ...A("kpl_mvp", r.km ?? []),
  ],
});

export const HOK_PLAYERS: Player[] = [
  // ---- QG Happy / eStar dynasty (2017–2022) ----
  mk({ id: "alan", name: "Alan", realName: "Wang Tianlong", nation: "China", active: true, debut: 2016,
    wc: [2017, 2018, 2019, 2022], kt: [2017, 2017, 2019, 2021, 2022],
    blurb: "Wang Tianlong: the most-decorated support of the KPL era with four world titles across the QG Happy and eStar Pro dynasties, plus five KPL split crowns." }),
  mk({ id: "cat", name: "Cat", realName: "Chen Zhengzheng", nation: "China", active: true, debut: 2016,
    wc: [2017, 2018, 2019, 2023], kt: [2017, 2017, 2019, 2024, 2025], kf: [2019],
    blurb: "陈正正 / 猫神: four-time world champion across QG Happy, eStar Pro and AG Super Play; Liquipedia credits him the most international-championship titles of any player." }),
  mk({ id: "fly", name: "Fly", realName: "Peng Yunfei", nation: "China", active: true, debut: 2016,
    wc: [2017, 2018, 2021], kt: [2017, 2017, 2022, 2023], kf: [2017, 2017],
    blurb: "彭云飞: QG Happy / Wolves top-lane icon; three world titles and a Guinness World Record for the most professional Finals MVP awards (six)." }),
  mk({ id: "huahai", name: "HuaHai", realName: "Luo Siyuan", nation: "China", active: false, debut: 2019,
    wc: [2019, 2022], kt: [2019, 2021, 2022], kf: [2021],
    blurb: "罗思源 / 花海: eStar Pro's superstar jungler; two world titles (KIC 2022 Finals MVP), Best Player of 2021 and 2022, and the first to 3,000 KPL kills. Retired 2026." }),
  mk({ id: "qingrong", name: "QingRong", realName: "Huang Yaoqin", nation: "China", active: true, debut: 2020,
    wc: [2022], kt: [2021, 2021, 2022], kf: [2021],
    blurb: "黄垚钦 / 清融: eStar Pro mid laner, KIC 2022 world champion; Best Mid Laner of 2021 and 2022 and KPL Spring 2021 Finals MVP." }),
  mk({ id: "tanran", name: "TanRan", realName: "Sun Linwei", nation: "China", active: true, debut: 2021,
    wc: [2022], kt: [2021, 2022, 2025], kf: [2022],
    blurb: "孙麟威 / 坦然: eStar Pro top laner and KIC 2022 world champion; Best Top Laner of 2021 and 2022, later a KPL Grand Finals winner on loan to AG." }),
  mk({ id: "ziyang", name: "ZiYang", realName: "Xiang Yang", nation: "China", active: true, debut: 2020,
    wc: [2022], kt: [2021, 2021, 2022],
    blurb: "向阳 / 紫阳: eStar Pro roamer, KIC 2022 world champion; Best Roamer of 2021 and 2022 and the first support handed an FMVP skin." }),

  // ---- Hero JiuJing (2018) ----
  mk({ id: "jiucheng", name: "JiuCheng", realName: "Cao Zhishun", nation: "China", active: true, debut: 2017,
    kt: [2018, 2018, 2020], kf: [2018, 2018],
    blurb: "曹智舜 / 久诚: Hero JiuJing's ace mid laner who swept both 2018 KPL splits as Finals MVP; one of the scene's most celebrated carries despite never taking the world crown." }),

  // ---- TS / Turnso (2020) ----
  mk({ id: "nuanyang", name: "NuanYang", realName: "Lin Heng", nation: "China", active: true, debut: 2019,
    wc: [2020], kt: [2020], kf: [2020], km: [2023],
    blurb: "林桓 / 暖阳: TS jungler and World Champion Cup 2020 Finals MVP; later a KPL regular-season MVP (2023) and the third player to 3,000 KPL kills." }),

  // ---- AG Super Play dynasty (2019, 2023–) ----
  mk({ id: "laoshuai", name: "LaoShuai", realName: "Zhang Yuchen", nation: "China", active: false, debut: 2017,
    kt: [2019], kf: [2019],
    blurb: "张宇晨 / 老帅: AG Super Play mid laner, KPL Fall 2019 champion and Finals MVP, and Best Mid Laner of 2019 in the team's first title run." }),
  mk({ id: "yinuo", name: "YiNuo", realName: "Xu Bicheng", nation: "China", active: true, debut: 2019,
    wc: [2023, 2025], kt: [2019, 2024, 2024, 2025, 2025, 2025], km: [2025],
    blurb: "徐必成 / 一诺: AG Super Play's marquee marksman; two world titles (KIC 2023 Finals MVP — the first-ever marksman FMVP) and the engine of AG's 2024–25 grand-slam run." }),
  mk({ id: "zhongyi", name: "ZhongYi", realName: "Chen Jiahao", nation: "China", active: true, debut: 2022,
    wc: [2023, 2025], kt: [2024, 2024, 2025, 2025, 2025], kf: [2024, 2025],
    blurb: "陈嘉豪 / 钟意 (intl. ID Zoe): AG Super Play jungler; two world titles (World Cup 2025 Finals MVP as Zoe), Jungler of the Year 2024–25, Rookie of the Year 2023." }),
  mk({ id: "changsheng", name: "ChangSheng", realName: "Xie Chengjun", nation: "China", active: true, debut: 2022,
    wc: [2023, 2025], kt: [2024, 2024, 2025, 2025, 2025], kf: [2024],
    blurb: "谢承峻 / 长生: AG Super Play mid laner; two world titles and Mid Laner of the Year 2024, a cornerstone of AG's six-consecutive-title grand slam." }),

  // ---- QG Happy 2021 world champ / Wolves core ----
  mk({ id: "xiaopang", name: "XiaoPang", realName: "Li Daheng", nation: "China", active: true, debut: 2019,
    wc: [2021], kt: [2022, 2023, 2024], kf: [2022, 2024], km: [2025],
    blurb: "李达亨 / 小胖: QG Happy's World Champion Cup 2021 jungler and Wolves mainstay; three KPL splits, two split Finals MVPs and a regular-season MVP (2025)." }),
];
