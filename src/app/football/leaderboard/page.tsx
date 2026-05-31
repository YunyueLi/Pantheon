import { Suspense } from "react";
import { Leaderboard } from "@/components/leaderboard";
import { SportProvider } from "@/lib/sport/provider";

export default function FootballLeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <SportProvider sportId="football">
        <Suspense>
          <Leaderboard />
        </Suspense>
      </SportProvider>
    </div>
  );
}
