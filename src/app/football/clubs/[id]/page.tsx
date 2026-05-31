import { notFound } from "next/navigation";
import { CLUBS, getClub } from "@/lib/sport/football/clubs";
import { FootballClubProfile } from "@/components/football-clubs";

export function generateStaticParams() {
  return CLUBS.map((c) => ({ id: c.id }));
}

export default function ClubPage({ params }: { params: { id: string } }) {
  if (!getClub(params.id)) notFound();
  return <FootballClubProfile id={params.id} />;
}
