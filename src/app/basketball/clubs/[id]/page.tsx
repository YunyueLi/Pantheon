import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FRANCHISES, getFranchise } from "@/lib/sport/basketball/franchises";
import { BasketballFranchiseProfile } from "@/components/basketball-franchises";

const SITE_URL = "https://pantheon.ungetsu.net";

export function generateStaticParams() {
  return FRANCHISES.map((f) => ({ id: f.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const fr = getFranchise(params.id);
  if (!fr) return {};
  const title = `${fr.name} — Championship History`;
  const description = `${fr.name}: ${fr.titles} NBA championship${fr.titles === 1 ? "" : "s"} and ${fr.finals} Finals appearances — honors and Pantheon ranking.`;
  const canonical = `/basketball/clubs/${fr.id}/`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: `${SITE_URL}${canonical}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function FranchisePage({ params }: { params: { id: string } }) {
  const fr = getFranchise(params.id);
  if (!fr) notFound();
  const canonical = `${SITE_URL}/basketball/clubs/${fr.id}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    sport: "Basketball",
    name: fr.name,
    ...(fr.code ? { alternateName: fr.code } : {}),
    memberOf: { "@type": "SportsOrganization", name: "National Basketball Association" },
    ...(fr.titles ? { award: `${fr.titles}× NBA Champion` } : {}),
    url: canonical,
    mainEntityOfPage: canonical,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BasketballFranchiseProfile id={params.id} />
    </>
  );
}
