import { notFound } from "next/navigation";
import { PLAYERS, getPlayer } from "@/lib/data";
import { PlayerProfile } from "@/components/player-profile";

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ id: p.id }));
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  if (!getPlayer(params.id)) notFound();
  return <PlayerProfile id={params.id} />;
}
