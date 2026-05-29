import { Leaderboard } from "@/components/leaderboard";
import { REGIONS, ROLES, type Region, type Role } from "@/lib/types";

export default function LeaderboardPage({
  searchParams,
}: {
  searchParams: { region?: string; role?: string };
}) {
  const region = REGIONS.includes(searchParams.region as Region) ? (searchParams.region as Region) : "ALL";
  const role = ROLES.includes(searchParams.role as Role) ? (searchParams.role as Role) : "ALL";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Leaderboard initialRegion={region} initialRole={role} />
    </div>
  );
}
