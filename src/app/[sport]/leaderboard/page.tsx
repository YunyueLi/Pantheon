import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Leaderboard } from "@/components/leaderboard";
import { SportProvider } from "@/lib/sport/provider";
import { listSports, getSport } from "@/lib/sport/registry";

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
  if (!getSport(params.sport)) notFound();
  return (
    <SportProvider sportId={params.sport}>
      <Suspense>
        <Leaderboard />
      </Suspense>
    </SportProvider>
  );
}
