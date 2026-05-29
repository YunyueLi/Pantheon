import { notFound } from "next/navigation";
import { getPlayer } from "@/lib/data";
import { PlayerProfile } from "@/components/player-profile";

export default function PlayerPage({ params }: { params: { id: string } }) {
  if (!getPlayer(params.id)) notFound();
  return <PlayerProfile id={params.id} />;
}
