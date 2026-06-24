import type { ReactNode } from "react";

/**
 * Custom per-discipline emblems in the monument line style — original marks (not
 * official/trademarked logos): a ball, a helmet, a paddle, a Go board, a sword,
 * a shield, a reticle. currentColor so they theme with crimson / paper / obsidian.
 */
const MARKS: Record<string, ReactNode> = {
  football: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4 L15.6 10 L14.2 14.3 H9.8 L8.4 10 Z" fill="currentColor" stroke="none" />
      <path d="M12 7.4 V3.6 M15.6 10 L19.4 8.7 M14.2 14.3 L16.7 18.2 M9.8 14.3 L7.3 18.2 M8.4 10 L4.6 8.7" />
    </>
  ),
  basketball: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 3.6 V20.4 M3.6 12 H20.4" />
      <path d="M5.4 6 C9 9 9 15 5.4 18" />
      <path d="M18.6 6 C15 9 15 15 18.6 18" />
    </>
  ),
  f1: (
    <>
      <path d="M4.6 12.6 C4.6 7.9 8.1 5 12.3 5 C16.5 5 19.4 7.9 19.4 12 C19.4 13.4 18.8 14.2 17.5 14.5 L17.5 15.8 C17.5 17 16.6 17.9 15.4 17.9 L9.2 17.9 C6.6 17.9 4.6 15.7 4.6 12.6 Z" />
      <path d="M7.4 11.3 C10 10.3 15 10.3 17.3 11.5 L17.3 13.4 H8 C7.6 13.4 7.4 13 7.4 12.5 Z" fill="currentColor" stroke="none" />
    </>
  ),
  "table-tennis": (
    <>
      <circle cx="11" cy="9.6" r="5.8" />
      <path d="M7.9 14 L5.7 19.2" />
      <circle cx="18.4" cy="6" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),
  go: (
    <>
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="0.6" />
      <path d="M9.4 4.2 V19.8 M14.6 4.2 V19.8 M4.2 9.4 H19.8 M4.2 14.6 H19.8" />
      <circle cx="9.4" cy="9.4" r="2.1" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="14.6" r="2.1" />
    </>
  ),
  lol: (
    <>
      <path d="M12 3 L13.3 5.2 V13.5 H10.7 V5.2 Z" fill="currentColor" stroke="none" />
      <path d="M8 14 H16 M12 14 V19" />
      <circle cx="12" cy="20.1" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  dota2: (
    <>
      <path d="M12 3.6 L19 6.2 V12 C19 16.4 15.9 19.4 12 20.6 C8.1 19.4 5 16.4 5 12 V6.2 Z" />
      <path d="M9 11 L12 8.4 L15 11" />
      <path d="M12 8.4 V16" />
    </>
  ),
  valorant: (
    <>
      <circle cx="12" cy="12" r="2.8" />
      <path d="M12 2.6 V6.8 M12 17.2 V21.4 M2.6 12 H6.8 M17.2 12 H21.4" />
    </>
  ),
};

export function SportMark({ sport, className }: { sport: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {MARKS[sport] ?? MARKS.lol}
    </svg>
  );
}
