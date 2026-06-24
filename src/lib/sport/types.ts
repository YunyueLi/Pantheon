// Sport-neutral core. Each sport supplies a HonorModel + a roster of Players in
// these shapes; the math in ./honor operates purely on the model and has no
// knowledge of any specific sport (no LoL/football assumptions baked in here).

export type SportId = string;

/** General honor categories shared across sports. */
export type Bucket = "team" | "individual" | "placement";

export type Tier = "S" | "A" | "B";

export type AchievementMeta = {
  label: string;
  short: string;
  bucket: Bucket;
  tier: Tier;
  /** Base point value before bucket weighting / vote-share scaling. */
  base: number;
};

export type Achievement = {
  /** A key into the sport's HonorModel.achievementMeta. */
  type: string;
  year: number;
  /** Display label for the event, e.g. "World Cup 2022". */
  event?: string;
  /** Team/club represented at the time. */
  team?: string;
  /** 0..1 vote share for voted individual awards (optional; defaults to 1). */
  share?: number;
  /**
   * 0..1 participation factor for a title the player contributed little to —
   * a squad/bench medal or a near-absent campaign (e.g. an unused reserve).
   * Defaults to 1 (full credit). Set below 1 only for well-documented cases.
   */
  part?: number;
  /**
   * Multiplicity for volume honors counted in bulk rather than enumerated —
   * e.g. an F1 driver's "105 wins" is ONE entry with count: 105 instead of 105
   * rows. Score = base × … × count; display shows ×count. Defaults to 1.
   * Do not combine with repeatDecay types (decay assumes one entry per win).
   */
  count?: number;
};

export type Player = {
  id: string;
  name: string;
  realName?: string;
  sport: SportId;
  /** Primary competitive grouping — a LoL region or a football league. */
  league: string;
  /** On-field role / position. */
  position: string;
  /** Current or most-associated club/team/org. */
  team: string;
  /** Nationality. */
  nation: string;
  active: boolean;
  debutYear: number;
  blurb?: string;
  photo?: string;
  /** "player" (default) or "coach" — lets a sport rank managers as a separate group. */
  kind?: "player" | "coach";
  /** Cross-link to the same person's other identity (e.g., a player who also coached). */
  alsoId?: string;
  /** Optional per-locale display name; falls back to `name`. */
  i18n?: Record<string, string>;
  /**
   * 0..100 Stature / Influence score — all-time standing and cultural footprint,
   * sourced from authoritative all-time rankings (and fan-vote/popularity for
   * esports). Kept SEPARATE from the trophy-based Honor Index; an optional lens.
   */
  stature?: number;
  /**
   * Era-strength engine outputs (computed in the registry, not authored):
   * `statureBase` is the curated/derived base before era adjustment;
   * `eraStrength` (0..100) is how concentrated elite, honor-bearing talent was
   * during this player's prime; `stature` above becomes the era-adjusted display
   * value (base × (1 ± ~12%)). Honor Index is never affected — Stature only.
   */
  statureBase?: number;
  eraStrength?: number;
  achievements: Achievement[];
};

export type Weights = Record<Bucket, number>;

export type Preset = { key: string; label: string; weights: Weights };

/** A radar axis: either a sum of specific achievement types, or a computed quantity. */
export type Axis =
  | { id: string; label: string; kind: "sum"; types: string[] }
  | { id: string; label: string; kind: "peak" }
  | { id: string; label: string; kind: "longevity" };

/** Everything sport-specific the honor engine needs. */
export type HonorModel = {
  achievementMeta: Record<string, AchievementMeta>;
  presets: Preset[];
  axes: Axis[];
  /** Order in which to render the trophy cabinet. */
  cabinetOrder: string[];
  /**
   * Optional diminishing returns for repeated wins of the same achievement type.
   * The k-th win of a listed type (k = 0, 1, 2 …) is scaled by factor^k, so a flood
   * of the same club trophy can't out-weigh peak/individual greatness. Sports that
   * omit this are scored purely linearly (no behavior change).
   */
  repeatDecay?: { factor: number; types: string[] };
};

/** Chip metadata for the primary grouping (league / region). */
export type LeagueMeta = { id: string; label: string; country: string; flag: string };

/** Chip metadata for positions / roles. */
export type PositionMeta = { id: string; label: string; abbr: string };

export type SportConfig = {
  id: SportId;
  label: string;
  /** Route base, e.g. "/lol" or "/football". */
  basePath: string;
  leagues: LeagueMeta[];
  positions: PositionMeta[];
  /**
   * i18n key for what the `positions` dimension is called on this sport. Defaults
   * to "leaderboard.colRole" ("Position"). Individual sports with no positions
   * leave `positions` empty (the column/filter then hides); table tennis sets this
   * to "leaderboard.colGender" since its split is by gender, not a field position.
   */
  roleNoun?: string;
  /**
   * When true, players are NEVER ranked in one mixed pool — the position filter
   * has no "All" option and defaults to the first position. Used by table tennis
   * so men's and women's boards are always separate (default: men, switch to women).
   */
  splitByPosition?: boolean;
  /** Achievement types shown as headline trophy counts on the leaderboard. */
  headlineTypes: string[];
  /**
   * Where this sport's curated Stature base ratings come from (authoritative
   * all-time rankings, fan votes, etc.). Surfaced on the methodology page so the
   * subjective popularity input is auditable. Omit when Stature is purely derived
   * from the Honor-Index percentile (no hand-authored ratings).
   */
  statureSources?: string[];
  model: HonorModel;
  players: Player[];
};
