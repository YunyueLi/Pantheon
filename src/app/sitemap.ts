import type { MetadataRoute } from "next";
import { listSports } from "@/lib/sport/registry";
import { CLUBS } from "@/lib/sport/football/clubs";
import { FRANCHISES } from "@/lib/sport/basketball/franchises";
import { TEAMS } from "@/lib/teams";

// Static sitemap covering the home page, credits, every sport's leaderboard /
// compare / methodology and player profiles, plus the club / franchise / team
// registers and profiles. Trailing slashes match next.config's `trailingSlash: true`.
const SITE_URL = "https://pantheon.ungetsu.net";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/credits/`, priority: 0.2 },
  ];
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
  // Club / franchise / team registers and profiles.
  urls.push(
    { url: `${SITE_URL}/football/clubs/`, priority: 0.5 },
    { url: `${SITE_URL}/basketball/clubs/`, priority: 0.5 },
    { url: `${SITE_URL}/lol/teams/`, priority: 0.5 }
  );
  for (const c of CLUBS) urls.push({ url: `${SITE_URL}/football/clubs/${c.id}/`, priority: 0.4 });
  for (const f of FRANCHISES) urls.push({ url: `${SITE_URL}/basketball/clubs/${f.id}/`, priority: 0.4 });
  for (const t of TEAMS) urls.push({ url: `${SITE_URL}/lol/teams/${t.id}/`, priority: 0.4 });
  return urls;
}
