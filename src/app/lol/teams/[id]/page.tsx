import { notFound } from "next/navigation";
import { TEAMS, getTeam } from "@/lib/teams";
import { TeamProfile } from "@/components/team-profile";

export function generateStaticParams() {
  return TEAMS.map((t) => ({ id: t.id }));
}

export default function TeamPage({ params }: { params: { id: string } }) {
  if (!getTeam(params.id)) notFound();
  return <TeamProfile id={params.id} />;
}
