"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Compare moved under each sport (/lol/compare, /football/compare). Keep the old
// path working for existing links by redirecting to the LoL comparison.
export default function CompareRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/lol/compare");
  }, [router]);
  return null;
}
