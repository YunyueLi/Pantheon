import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listSports, getSport } from "@/lib/sport/registry";
import { ranked } from "@/lib/sport/honor";
import { SportProvider } from "@/lib/sport/provider";
import { PlayerProfile } from "@/components/player-profile";

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
  if (!sport || !sport.players.some((p) => p.id === params.id)) notFound();
  return (
    <SportProvider sportId={params.sport}>
      <PlayerProfile id={params.id} />
    </SportProvider>
  );
}
