import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLUBS, getClub } from "@/lib/sport/football/clubs";
import { FootballClubProfile } from "@/components/football-clubs";

const SITE_URL = "https://pantheon.ungetsu.net";

export function generateStaticParams() {
  return CLUBS.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const club = getClub(params.id);
  if (!club) return {};
  const title = `${club.name} — Trophy Cabinet`;
  const description = `${club.name}: ${club.leagueTitles} league titles, ${club.championsLeague} European Cups${
    club.intercontinental ? `, ${club.intercontinental} world/intercontinental titles` : ""
  } — honors and Pantheon ranking.`;
  const canonical = `/football/clubs/${club.id}/`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: `${SITE_URL}${canonical}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ClubPage({ params }: { params: { id: string } }) {
  const club = getClub(params.id);
  if (!club) notFound();
  const canonical = `${SITE_URL}/football/clubs/${club.id}/`;
  const awards: string[] = [];
  if (club.leagueTitles) awards.push(`${club.leagueTitles}× ${club.league} title`);
  if (club.championsLeague) awards.push(`${club.championsLeague}× European Cup / Champions League`);
  if (club.libertadores) awards.push(`${club.libertadores}× Copa Libertadores`);
  if (club.intercontinental) awards.push(`${club.intercontinental}× Intercontinental / Club World Cup`);
  if (club.europa) awards.push(`${club.europa}× UEFA Cup / Europa League`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    sport: "Association football",
    name: club.name,
    ...(club.code ? { alternateName: club.code } : {}),
    memberOf: { "@type": "SportsOrganization", name: club.league },
    ...(awards.length ? { award: awards } : {}),
    url: canonical,
    mainEntityOfPage: canonical,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FootballClubProfile id={params.id} />
    </>
  );
}
