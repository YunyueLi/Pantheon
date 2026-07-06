import { ROLE_META, type Role } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RegionBadge({ region, className }: { region: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-fg-muted",
        className
      )}
    >
      {region}
    </span>
  );
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const meta = ROLE_META[role];
  if (!meta) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-fg-subtle",
        className
      )}
    >
      {meta.abbr}
    </span>
  );
}

/** Sport-neutral position chip: render a pre-resolved abbreviation (LoL role or football position). */
export function PositionBadge({ abbr, className }: { abbr: string; className?: string }) {
  if (!abbr) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-fg-subtle",
        className
      )}
    >
      {abbr}
    </span>
  );
}
