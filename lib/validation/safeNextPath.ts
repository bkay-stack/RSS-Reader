// Keeps ?next= only if it's a path on this site, so sign-in can't redirect elsewhere.
// "/dashboard" → kept; "//evil.com", "/\evil.com", "@evil.com" → fallback.

export function safeNextPath(next: string | null, fallback: string): string {
  if (!next) return fallback;

  const isLocalPath =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");

  return isLocalPath ? next : fallback;
}
