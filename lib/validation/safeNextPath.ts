/**
 * safeNextPath — validates the `?next=` value used after sign-in/confirm.
 *
 * WHY
 *   The auth routes redirect to `${origin}${next}`. If `next` is not a plain
 *   path, an attacker can send users to their own site (an "open redirect"):
 *     "@evil.com"  → "https://myapp.com@evil.com"  → opens evil.com
 *     ".evil.com"  → "https://myapp.com.evil.com"  → a domain they own
 *
 * WHAT IT DOES
 *   Keeps `next` only if it is a path on this site:
 *     - starts with a single "/"
 *     - is not "//…" or "/\…" (browsers treat both as another host)
 *   Otherwise returns `fallback`.
 */

export function safeNextPath(next: string | null, fallback: string): string {
  if (!next) return fallback;

  const isLocalPath =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");

  return isLocalPath ? next : fallback;
}
