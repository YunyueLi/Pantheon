import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pantheon — Competitive Honors",
    short_name: "Pantheon",
    description: "A visual hall of fame for competitive sport — one transparent honor index across every discipline.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0b0a",
    theme_color: "#cc1326",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
