import { Suspense } from "react";
import { CompareView } from "@/components/compare-view";
import { SportProvider } from "@/lib/sport/provider";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <SportProvider sportId="lol">
        <Suspense>
          <CompareView />
        </Suspense>
      </SportProvider>
    </div>
  );
}
