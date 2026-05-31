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
  /** Achievement types shown as headline trophy counts on the leaderboard. */
  headlineTypes: string[];
  model: HonorModel;
  players: Player[];
};
