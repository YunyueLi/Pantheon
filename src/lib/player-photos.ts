// Freely-licensed player portraits. Keyed by player id. Add an entry ONLY after
// the image file is in /public/players and its license is verified — every entry
// is surfaced on /credits for attribution. Most usable images are CC BY-SA, which
// requires crediting the author and linking the license (done on the credits page);
// players without a free image fall back to the generated radiant field.
export type PhotoCredit = {
  /** Public path to the image, e.g. "/players/messi.jpg". */
  src: string;
  /** Photographer / author, as named on the source. */
  author: string;
  /** Human label, e.g. "CC BY-SA 4.0". */
  license: string;
  /** Canonical license deed URL. */
  licenseUrl: string;
  /** Source page (Wikimedia Commons file page). */
  source: string;
};

export const PLAYER_PHOTOS: Record<string, PhotoCredit> = {
  messi: {
    src: "/players/messi.jpg",
    author: "Bryan Berlin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source:
      "https://commons.wikimedia.org/wiki/File:Lionel_Messi_NE_Revolution_Inter_Miami_7.9.25-178_(cropped_2).jpg",
  },
};

export function playerPhoto(id: string): PhotoCredit | undefined {
  return PLAYER_PHOTOS[id];
}
