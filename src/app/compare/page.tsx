import { Suspense } from "react";
import { CompareView } from "@/components/compare-view";

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Suspense>
        <CompareView />
      </Suspense>
    </div>
  );
}
