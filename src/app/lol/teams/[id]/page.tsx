import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEAMS, getTeam } from "@/lib/teams";
import { TeamProfile } from "@/components/team-profile";

const SITE_URL = "https://pantheon.ungetsu.net";

export function generateStaticParams() {
  return TEAMS.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const team = getTeam(params.id);
  if (!team) return {};
  const w = team.worlds.length;
  const m = team.msi.length;
  const title = `${team.name} — Trophy Cabinet`;
  const description = `${team.name} (${team.region}): ${w} World Championship${w === 1 ? "" : "s"}${
    m ? `, ${m} MSI` : ""
  } — League of Legends honors and Pantheon ranking.`;
  const canonical = `/lol/teams/${team.id}/`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: `${SITE_URL}${canonical}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function TeamPage({ params }: { params: { id: string } }) {
  const team = getTeam(params.id);
  if (!team) notFound();
  const canonical = `${SITE_URL}/lol/teams/${team.id}/`;
  const awards = [
    ...team.worlds.map((y) => `World Championship ${y}`),
    ...team.msi.map((y) => `MSI ${y}`),
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    sport: "Esports (League of Legends)",
    name: team.name,
    alternateName: [team.code, ...(team.aka ?? [])],
    ...(awards.length ? { award: awards } : {}),
    url: canonical,
    mainEntityOfPage: canonical,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TeamProfile id={params.id} />
    </>
  );
}
