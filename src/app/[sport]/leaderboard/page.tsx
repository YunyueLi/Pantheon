import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Leaderboard } from "@/components/leaderboard";
import { SportProvider } from "@/lib/sport/provider";
import { listSports, getSport } from "@/lib/sport/registry";
import { ranked } from "@/lib/sport/honor";

const SITE_URL = "https://pantheon.ungetsu.net";

export function generateStaticParams() {
  return listSports().map((s) => ({ sport: s.id }));
}

export function generateMetadata({ params }: { params: { sport: string } }): Metadata {
  const sport = getSport(params.sport);
  if (!sport) return {};
  const title = `${sport.label} Honor Index — Leaderboard`;
  const description = `Every ${sport.label} great ranked by a transparent, tier-weighted Honor Index — slice by region and role, and re-weight on the fly.`;
  return { title, description, alternates: { canonical: `/${sport.id}/leaderboard/` }, openGraph: { title, description } };
}

export default function LeaderboardPage({ params }: { params: { sport: string } }) {
  const sport = getSport(params.sport);
  if (!sport) notFound();
  const url = `${SITE_URL}/${sport.id}/leaderboard/`;
  const top = ranked(sport.players, sport.model).slice(0, 25);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${sport.label} Honor Index`,
      itemListElement: top.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: r.player.name,
        url: `${SITE_URL}/${sport.id}/players/${r.player.id}/`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Pantheon", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: sport.label, item: url },
      ],
    },
  ];
  return (
    <SportProvider sportId={params.sport}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense>
        <Leaderboard />
      </Suspense>
    </SportProvider>
  );
}
