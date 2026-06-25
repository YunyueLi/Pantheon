/**
 * Privacy-friendly, cookieless analytics — DISABLED by default.
 *
 * Renders nothing unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set at BUILD time
 * (NEXT_PUBLIC_* vars are inlined during `next build`, which suits the static
 * export). Out of the box there are therefore zero third-party requests, no
 * cookies, and no consent banner required.
 *
 * To enable, set these in the build environment (e.g. GitHub Actions repo
 * variables) and rebuild:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN = pantheon.ungetsu.net
 *   NEXT_PUBLIC_PLAUSIBLE_SRC    = https://plausible.io/js/script.js   (optional override:
 *                                  self-hosted Plausible, or a proxied path to dodge blockers)
 * Plausible is GDPR/CCPA/PECR-compliant without cookies and reports only
 * aggregate pageviews — no personal data.
 *
 * Prefer GoatCounter / Cloudflare Web Analytics / Umami instead? Each is a
 * single cookieless <script> tag — swap the element below; the build-time
 * env-gating pattern stays identical.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";
  // eslint-disable-next-line @next/next/no-sync-scripts -- defer makes this non-blocking; next/script isn't needed for a static export.
  return <script defer data-domain={domain} src={src} />;
}
