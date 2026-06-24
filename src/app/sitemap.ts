import type { MetadataRoute } from "next";
import { listSports } from "@/lib/sport/registry";

// Static sitemap covering the home page plus every sport's leaderboard, compare,
// methodology and player profiles — the full set of indexable content. Trailing
// slashes match next.config's `trailingSlash: true`.
const SITE_URL = "https://pantheon.ungetsu.net";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [{ url: `${SITE_URL}/`, priority: 1 }];
  for (const s of listSports()) {
    urls.push(
      { url: `${SITE_URL}/${s.id}/leaderboard/`, priority: 0.8 },
      { url: `${SITE_URL}/${s.id}/compare/`, priority: 0.6 },
      { url: `${SITE_URL}/${s.id}/methodology/`, priority: 0.4 }
    );
    for (const p of s.players) {
      urls.push({ url: `${SITE_URL}/${s.id}/players/${p.id}/`, priority: 0.5 });
    }
  }
  return urls;
}
