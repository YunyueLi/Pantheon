import { Suspense } from "react";
import { Leaderboard } from "@/components/leaderboard";
import { SportProvider } from "@/lib/sport/provider";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <SportProvider sportId="f1">
        <Suspense>
          <Leaderboard />
        </Suspense>
      </SportProvider>
    </div>
  );
}
