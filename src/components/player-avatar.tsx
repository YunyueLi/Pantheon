"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Photo-ready avatar. Drop a licensed/owned image into /public/players/<id>.(jpg|png|webp)
 * and it fades in automatically with a unified circular crop + ring. Until then a clean
 * monogram shows. Failed/missing images stay invisible (no broken-image flash). An explicit
 * `photo` path takes precedence over the id convention.
 */
export function PlayerAvatar({
  id,
  name,
  photo,
  size = 40,
  className,
}: {
  id?: string;
  name: string;
  photo?: string;
  size?: number;
  className?: string;
}) {
  const initials = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase();

  const candidates = useMemo(() => {
    const list: string[] = [];
    if (photo) list.push(photo);
    if (id) list.push(`/players/${id}.jpg`, `/players/${id}.png`, `/players/${id}.webp`);
    return list;
  }, [id, photo]);

  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setIdx(0);
    setLoaded(false);
  }, [id, photo]);

  const src = candidates[idx];

  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-2",
        className
      )}
    >
      <span
        aria-hidden
        className="font-mono font-medium text-fg-muted"
        style={{ fontSize: Math.round(size * 0.34) }}
      >
        {initials}
      </span>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          className={cn(
            "absolute inset-0 h-full w-full object-cover [object-position:50%_18%] transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setIdx((i) => i + 1)}
        />
      )}
    </span>
  );
}
