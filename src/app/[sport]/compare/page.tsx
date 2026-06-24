import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CompareView } from "@/components/compare-view";
import { SportProvider } from "@/lib/sport/provider";
import { listSports, getSport } from "@/lib/sport/registry";

export function generateStaticParams() {
  return listSports().map((s) => ({ sport: s.id }));
}

export function generateMetadata({ params }: { params: { sport: string } }): Metadata {
  const sport = getSport(params.sport);
  if (!sport) return {};
  const title = `Compare ${sport.label} players`;
  const description = `Head-to-head ${sport.label}: trophy tale-of-the-tape plus honor dimensions on an interactive radar. Settle the GOAT debate with numbers.`;
  return { title, description, alternates: { canonical: `/${sport.id}/compare/` }, openGraph: { title, description } };
}

export default function ComparePage({ params }: { params: { sport: string } }) {
  if (!getSport(params.sport)) notFound();
  return (
    <SportProvider sportId={params.sport}>
      <Suspense>
        <CompareView />
      </Suspense>
    </SportProvider>
  );
}
