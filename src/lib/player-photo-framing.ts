// Per-photo framing overrides (hand-tuned), kept SEPARATE from the generated
// player-photos.ts so re-running the photo scripts never wipes them. Most photos
// look right with the default crop (object-position 50% 14%); add an entry only
// when a subject sits low/off-centre or reads too small.
//   pos  — CSS object-position focal point (default "50% 14%")
//   zoom — extra scale to enlarge the subject (default 1; e.g. 1.3 crops tighter)
export type PhotoFraming = { pos?: string; zoom?: number };

export const PHOTO_FRAMING: Record<string, PhotoFraming> = {
  "ma-long": { pos: "50% 34%", zoom: 1.45 },
};

export function photoFraming(id: string): PhotoFraming | undefined {
  return PHOTO_FRAMING[id];
}
