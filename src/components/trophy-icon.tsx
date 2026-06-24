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
  jp_title: { kind: "regional" },
  kr_title: { kind: "regional" },
  cn_title: { kind: "regional" },

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
      {/* Grand championship cup — tapered bowl, sweeping handles, two-tier pedestal. */}
      {kind === "worlds" && (
        <>
          <path d="M8.2 5.1 H23.8 V6.7 H8.2 Z" {...body} />
          <path d="M9.4 6.7 H22.6 L21.5 13 C21 15.7 18.8 17.6 16 17.6 C13.2 17.6 11 15.7 10.5 13 Z" {...body} />
          <path d="M9.5 7.3 C4.2 7.7 4.2 14.7 11.1 15.5" {...line} />
          <path d="M22.5 7.3 C27.8 7.7 27.8 14.7 20.9 15.5" {...line} />
          <path d="M14.7 17.6 H17.3 V20.4 H14.7 Z" {...body} />
          <path d="M13 20.4 H19 V22 H13 Z" {...body} />
          <path d="M13.5 22 H18.5 V24.1 H13.5 Z" {...body} />
          <path d="M10.4 24.1 H21.6 V26.9 H10.4 Z" {...body} />
        </>
      )}

      {/* Stemmed goblet — a rounded chalice on a domed foot. */}
      {kind === "msi" && (
        <>
          <path d="M9.4 5.3 H22.6 V6.7 H9.4 Z" {...body} />
          <path d="M10.4 6.7 H21.6 V8.4 C21.6 12.4 19.1 14.9 16 14.9 C12.9 14.9 10.4 12.4 10.4 8.4 Z" {...body} />
          <path d="M15.2 14.9 H16.8 V21.5 H15.2 Z" {...body} />
          <path d="M11.7 24.2 C11.7 22.1 13.7 21.5 16 21.5 C18.3 21.5 20.3 22.1 20.3 24.2 Z" {...body} />
          <path d="M10.9 24.2 H21.1 V25.9 H10.9 Z" {...body} />
        </>
      )}

      {/* Compact handled cup. */}
      {kind === "regional" && (
        <>
          <path d="M10.6 7 H21.4 L20.5 12.8 C20.1 15 18.3 16.4 16 16.4 C13.7 16.4 11.9 15 11.5 12.8 Z" {...body} />
          <path d="M10.7 7.5 C7.2 8 7.2 12.7 11.8 13.5" {...line} />
          <path d="M21.3 7.5 C24.8 8 24.8 12.7 20.2 13.5" {...line} />
          <path d="M14.7 16.4 H17.3 V19.4 H14.7 Z" {...body} />
          <path d="M13.9 19.4 H18.1 V21.7 H13.9 Z" {...body} />
          <path d="M11.8 21.7 H20.2 V24 H11.8 Z" {...body} />
        </>
      )}

      {/* Medallion on a ribbon, with a concentric ring and an inset star. */}
      {kind === "medal" && (
        <>
          <path d="M11.6 3.5 L15.3 11.4 L10.2 12.6 Z" {...body} />
          <path d="M20.4 3.5 L16.7 11.4 L21.8 12.6 Z" {...body} />
          <circle cx="16" cy="20.4" r="6.8" fill="none" stroke="currentColor" strokeWidth={ghost ? 1.4 : 1.9} />
          <circle cx="16" cy="20.4" r="4.5" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <polygon
            points="16,16.9 16.95,19.27 19.49,19.42 17.5,21 18.18,23.46 16,22.02 13.82,23.46 14.5,21 12.51,19.42 15.05,19.27"
            fill="currentColor"
          />
        </>
      )}

      {/* Faceted five-point star. */}
      {kind === "star" && (
        <path
          d="M16 4.6 L18.9 11.95 L26.8 12.5 L20.7 17.5 L22.7 25.2 L16 20.85 L9.3 25.2 L11.3 17.5 L5.2 12.5 L13.1 11.95 Z"
          {...body}
        />
      )}
    </svg>
  );
}

/**
 * Cups & finals use the gold tone; personal awards stay neutral to preserve
 * hierarchy. The bucket comes from the active sport's model, so individual
 * awards in every sport (Ballon d'Or, NBA MVP, …) get the neutral tone — not
 * just LoL's. Pass `config.model.achievementMeta` from the caller.
 */
export function trophyTone(type: string, meta: Record<string, { bucket: string }>): string {
  return meta[type]?.bucket === "individual" ? "text-fg-muted" : "text-[color:var(--medal-gold)]";
}
