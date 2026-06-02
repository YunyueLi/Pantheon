import { ACHIEVEMENT_META } from "@/lib/honor";
import { cn } from "@/lib/utils";

type Kind = "worlds" | "msi" | "regional" | "medal" | "star";

const ICON: Record<string, { kind: Kind; ghost?: boolean }> = {
  worlds_title: { kind: "worlds" },
  worlds_runnerup: { kind: "worlds", ghost: true },
  msi_title: { kind: "msi" },
  first_stand_title: { kind: "msi" },
  ewc_title: { kind: "msi" },
  asian_games_gold: { kind: "medal" },
  msc_title: { kind: "regional" },
  regional_title: { kind: "regional" },
  regional_runnerup: { kind: "regional", ghost: true },
  worlds_mvp: { kind: "medal" },
  msi_mvp: { kind: "medal" },
  season_mvp: { kind: "medal" },
  finals_mvp: { kind: "medal" },
  all_pro_1: { kind: "star" },
  all_pro_2: { kind: "star" },
  all_pro_3: { kind: "star" },

  // Football
  world_cup: { kind: "worlds" },
  wc_runnerup: { kind: "worlds", ghost: true },
  champions_league: { kind: "msi" },
  ucl_runnerup: { kind: "msi", ghost: true },
  continental_nt: { kind: "regional" },
  continental_nt_runnerup: { kind: "regional", ghost: true },
  copa_libertadores: { kind: "regional" },
  copa_sudamericana: { kind: "regional" },
  recopa: { kind: "regional" },
  club_world_cup: { kind: "regional" },
  league_title: { kind: "regional" },
  europa_league: { kind: "regional" },
  nations_league: { kind: "regional" },
  domestic_cup: { kind: "regional" },
  continental_club: { kind: "regional" },
  super_cup: { kind: "regional" },
  confederations_cup: { kind: "regional" },
  olympic_gold_early: { kind: "medal" },
  olympic_gold_amateur: { kind: "medal" },
  olympic_gold_u23: { kind: "medal" },
  ballon_dor: { kind: "medal" },
  ballon_dor_retro: { kind: "medal", ghost: true },
  ballon_dor_2nd: { kind: "medal", ghost: true },
  ballon_dor_3rd: { kind: "medal", ghost: true },
  fifa_best: { kind: "medal" },
  uefa_poty: { kind: "star" },
  yashin_trophy: { kind: "star" },
  wc_golden_ball: { kind: "star" },
  wc_golden_boot: { kind: "star" },
  golden_shoe: { kind: "star" },
  league_poty: { kind: "star" },
  league_top_scorer: { kind: "star" },
  world_xi: { kind: "star" },
  jsl_title: { kind: "regional" },
  jsl_runnerup: { kind: "regional", ghost: true },
  jsl_best_player: { kind: "star" },
  jsl_golden_boot: { kind: "star" },
  jsl_best_gk: { kind: "star" },

  // Basketball
  nba_title: { kind: "worlds" },
  aba_title: { kind: "regional" },
  olympic_gold: { kind: "medal" },
  fiba_gold: { kind: "medal" },
  euroleague: { kind: "regional" },
  mvp: { kind: "medal" },
  nba_finals_mvp: { kind: "medal" },
  aba_mvp: { kind: "medal" },
  dpoy: { kind: "star" },
  scoring_title: { kind: "star" },
  all_nba_first: { kind: "star" },
  all_nba_second: { kind: "star" },
  all_nba_third: { kind: "star" },
  all_defensive_first: { kind: "star" },
  all_star: { kind: "star" },
  stat_title: { kind: "star" },
  roy: { kind: "star" },
  finals_loss: { kind: "regional", ghost: true },

  // F1
  wdc: { kind: "worlds" },
  race_win: { kind: "msi" },
  pole: { kind: "star" },
  podium: { kind: "regional" },

  // Table tennis
  olympic_singles_gold: { kind: "worlds" },
  world_singles_gold: { kind: "worlds" },
  world_cup_singles_gold: { kind: "msi" },
  career_grand_slam: { kind: "worlds" },
  olympic_team_gold: { kind: "medal" },
  world_team_gold: { kind: "regional" },
  olympic_doubles_gold: { kind: "medal" },
  world_doubles_gold: { kind: "regional" },
  doubles_gold: { kind: "regional" },
  tour_finals_gold: { kind: "star" },

  // Go
  world_title: { kind: "worlds" },
  domestic_title: { kind: "regional" },
  ing: { kind: "worlds" },
  fujitsu: { kind: "worlds" },
  tong_yang: { kind: "worlds" },
  lg: { kind: "worlds" },
  samsung: { kind: "worlds" },
  chunlan: { kind: "msi" },
  bailing: { kind: "msi" },
  mlily: { kind: "msi" },
  world_oza: { kind: "msi" },
  quzhou_lanke: { kind: "msi" },
  nanyang: { kind: "msi" },
  other_intl: { kind: "medal" },
  kisei: { kind: "regional" },
  meijin: { kind: "regional" },
  honinbo: { kind: "regional" },
  jp_other: { kind: "star" },
  kr_major: { kind: "star" },
  cn_major: { kind: "star" },

  // Dota 2
  ti_title: { kind: "worlds" },
  ti_runner_up: { kind: "worlds", ghost: true },
  valve_major_title: { kind: "msi" },
  premier_title: { kind: "regional" },
  best_player_award: { kind: "star" },

  // VALORANT
  champions_title: { kind: "worlds" },
  champions_mvp: { kind: "medal" },
  masters_title: { kind: "msi" },
  masters_mvp: { kind: "medal" },
  vct_regional: { kind: "regional" },
  champions_finalist: { kind: "worlds", ghost: true },
};

export function TrophyIcon({
  type,
  size = 28,
  className,
}: {
  type: string;
  size?: number;
  className?: string;
}) {
  const { kind, ghost } = ICON[type] ?? { kind: "medal" as Kind };

  const body = ghost
    ? ({ fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinejoin: "round" } as const)
    : ({ fill: "currentColor" } as const);
  const line = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: ghost ? 1.4 : 1.7,
    strokeLinecap: "round",
  } as const;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-hidden
      className={cn(className)}
      style={{ opacity: ghost ? 0.5 : 1 }}
    >
      {kind === "worlds" && (
        <>
          <path d="M6.6 5.2 H25.4 V7.2 H6.6 Z" {...body} />
          <path
            d="M8 7.2 H24 L21.8 15.6 C21.2 18 18.9 19.6 16 19.6 C13.1 19.6 10.8 18 10.2 15.6 Z"
            {...body}
          />
          <path d="M8 7.8 C3 8.8 3 15.6 9.4 16.3" {...line} />
          <path d="M24 7.8 C29 8.8 29 15.6 22.6 16.3" {...line} />
          <path d="M14.3 19.6 H17.7 V23.6 H14.3 Z" {...body} />
          <path d="M11 23.6 H21 V25.6 H11 Z" {...body} />
          <path d="M8.8 25.6 H23.2 V28.6 H8.8 Z" {...body} />
        </>
      )}

      {kind === "msi" && (
        <>
          <path d="M9 6.6 H23 L16 17.6 Z" {...body} />
          <path d="M9 7.3 C5 8.3 5.4 13 10.6 13.7" {...line} />
          <path d="M23 7.3 C27 8.3 26.6 13 21.4 13.7" {...line} />
          <path d="M14.5 16.8 H17.5 V21 H14.5 Z" {...body} />
          <path d="M11.4 21 H20.6 V23.8 H11.4 Z" {...body} />
        </>
      )}

      {kind === "regional" && (
        <>
          <path
            d="M10 7 H22 L20.1 15.4 C19.6 17.3 18 18.4 16 18.4 C14 18.4 12.4 17.3 11.9 15.4 Z"
            {...body}
          />
          <path d="M10 7.6 C6.4 8.2 6.4 13 11 13.7" {...line} />
          <path d="M22 7.6 C25.6 8.2 25.6 13 21 13.7" {...line} />
          <path d="M14.5 18.4 H17.5 V21.8 H14.5 Z" {...body} />
          <path d="M11.6 21.8 H20.4 V24.2 H11.6 Z" {...body} />
        </>
      )}

      {kind === "medal" && (
        <>
          <path d="M11.4 3.4 L15.4 12.6 L10.7 12.6 Z" {...body} />
          <path d="M20.6 3.4 L16.6 12.6 L21.3 12.6 Z" {...body} />
          <circle cx="16" cy="21" r="6.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <polygon
            points="16,18 16.74,19.99 18.85,20.07 17.19,21.39 17.76,23.43 16,22.25 14.24,23.43 14.81,21.39 13.15,20.07 15.26,19.99"
            fill="currentColor"
          />
        </>
      )}

      {kind === "star" && (
        <polygon
          points="16,7 18.23,12.93 24.56,13.22 19.61,17.17 21.29,23.28 16,19.8 10.71,23.28 12.39,17.17 7.44,13.22 13.77,12.93"
          {...body}
        />
      )}
    </svg>
  );
}

/** Cups & finals use the gold tone; personal awards stay neutral to preserve hierarchy. */
export function trophyTone(type: string): string {
  // Team/placement honors render gold; personal awards (MVP, All-Pro) stay neutral.
  return ACHIEVEMENT_META[type as keyof typeof ACHIEVEMENT_META]?.bucket === "individual"
    ? "text-fg-muted"
    : "text-[color:var(--medal-gold)]";
}
