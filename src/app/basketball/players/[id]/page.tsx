import { notFound } from "next/navigation";
import { getSport } from "@/lib/sport/registry";
import { SportProvider } from "@/lib/sport/provider";
import { PlayerProfile } from "@/components/player-profile";

export function generateStaticParams() {
  return getSport("basketball")!.players.map((p) => ({ id: p.id }));
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  if (!getSport("basketball")!.players.some((p) => p.id === params.id)) notFound();
  return (
    <SportProvider sportId="basketball">
      <PlayerProfile id={params.id} />
    </SportProvider>
  );
}
