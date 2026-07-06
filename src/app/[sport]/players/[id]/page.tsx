import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listSports, getSport } from "@/lib/sport/registry";
import { ranked } from "@/lib/sport/honor";
import { SportProvider } from "@/lib/sport/provider";
import { PlayerProfile } from "@/components/player-profile";
import { playerPhoto } from "@/lib/player-photos";

const SITE_URL = "https://pantheon.ungetsu.net";

export function generateStaticParams() {
  return listSports().flatMap((s) => s.players.map((p) => ({ sport: s.id, id: p.id })));
}

export function generateMetadata({ params }: { params: { sport: string; id: string } }): Metadata {
  const sport = getSport(params.sport);
  const player = sport?.players.find((p) => p.id === params.id);
  if (!sport || !player) return {};
  const rank = ranked(sport.players, sport.model).find((r) => r.player.id === player.id)?.rank;
  const title = `${player.name} — ${sport.label} Honor Index`;
  const description =
    player.blurb ??
    `${player.name}'s trophy cabinet and Honor Index${rank ? ` (ranked #${rank} of ${sport.players.length})` : ""} on Pantheon.`;
  return {
    title,
    description,
    alternates: { canonical: `/${sport.id}/players/${player.id}/` },
    openGraph: { title, description, type: "profile", images: [`/og/${sport.id}-${player.id}.png`] },
    twitter: { card: "summary_large_image", title, description, images: [`/og/${sport.id}-${player.id}.png`] },
  };
}

export default function PlayerPage({ params }: { params: { sport: string; id: string } }) {
  const sport = getSport(params.sport);
  const player = sport?.players.find((p) => p.id === params.id);
  if (!sport || !player) notFound();

  // Structured data: a Person (also an Athlete) so search engines can build a
  // knowledge-graph entity, plus a breadcrumb trail. S-tier honors become awards.
  const url = `${SITE_URL}/${sport.id}/players/${player.id}/`;
  const meta = sport.model.achievementMeta;
  const awards = Array.from(
    new Set(
      player.achievements
        .filter((a) => meta[a.type]?.tier === "S")
        .map((a) => `${meta[a.type].label} ${a.year}`)
    )
  );
  const photo = playerPhoto(player.id)?.src;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      additionalType: "https://schema.org/Athlete",
      name: player.name,
      ...(player.realName ? { alternateName: player.realName } : {}),
      ...(player.nation ? { nationality: { "@type": "Country", name: player.nation } } : {}),
      ...(player.position ? { jobTitle: player.position } : {}),
      ...(photo ? { image: `${SITE_URL}${photo}` } : {}),
      ...(awards.length ? { award: awards } : {}),
      url,
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Pantheon", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: sport.label, item: `${SITE_URL}/${sport.id}/leaderboard/` },
        { "@type": "ListItem", position: 3, name: player.name, item: url },
      ],
    },
  ];

  return (
    <SportProvider sportId={params.sport}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PlayerProfile id={params.id} />
    </SportProvider>
  );
}
