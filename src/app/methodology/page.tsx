"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Methodology moved under each sport (/lol/methodology, /football/methodology).
// Redirect the old path to the LoL version for existing links.
export default function MethodologyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/lol/methodology");
  }, [router]);
  return null;
}
