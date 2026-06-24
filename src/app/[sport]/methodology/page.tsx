import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Methodology } from "@/components/methodology";
import { SportProvider } from "@/lib/sport/provider";
import { listSports, getSport } from "@/lib/sport/registry";

export function generateStaticParams() {
  return listSports().map((s) => ({ sport: s.id }));
}

export function generateMetadata({ params }: { params: { sport: string } }): Metadata {
  const sport = getSport(params.sport);
  if (!sport) return {};
  const title = `${sport.label} — Methodology`;
  const description = `How the ${sport.label} Honor Index is computed: every event tier and weight documented and auditable.`;
  return { title, description, alternates: { canonical: `/${sport.id}/methodology/` }, openGraph: { title, description } };
}

export default function MethodologyPage({ params }: { params: { sport: string } }) {
  if (!getSport(params.sport)) notFound();
  return (
    <SportProvider sportId={params.sport}>
      <Methodology />
    </SportProvider>
  );
}
