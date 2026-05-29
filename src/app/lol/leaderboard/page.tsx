import { Suspense } from "react";
import { Leaderboard } from "@/components/leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Suspense>
        <Leaderboard />
      </Suspense>
    </div>
  );
}
