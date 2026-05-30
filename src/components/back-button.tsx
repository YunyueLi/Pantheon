"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

/**
 * A real "back" control: returns to the previous in-app page when there is
 * history, and falls back to a listing page on a direct load or shared link
 * (where there is nothing to go back to).
 */
export function BackButton({ fallback }: { fallback: string }) {
  const { t } = useI18n();
  const router = useRouter();

  const onClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-5 inline-flex items-center gap-1.5 text-sm text-fg-subtle transition-colors hover:text-fg"
    >
      <ArrowLeft className="h-3.5 w-3.5" /> {t("common.back")}
    </button>
  );
}
