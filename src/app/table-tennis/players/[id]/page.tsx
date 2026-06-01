import { notFound } from "next/navigation";
import { getSport } from "@/lib/sport/registry";
import { SportProvider } from "@/lib/sport/provider";
import { PlayerProfile } from "@/components/player-profile";

export function generateStaticParams() {
  return getSport("table-tennis")!.players.map((p) => ({ id: p.id }));
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  if (!getSport("table-tennis")!.players.some((p) => p.id === params.id)) notFound();
  return (
    <SportProvider sportId="table-tennis">
      <PlayerProfile id={params.id} />
    </SportProvider>
  );
}
