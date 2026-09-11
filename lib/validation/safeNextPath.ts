// Checks the "?next=" page to go to after sign-in.
// Only allows paths on this site (like "/dashboard"), so attackers can't
// send users to another site. Anything else uses the fallback.

export function safeNextPath(next: string | null, fallback: string): string {
  if (!next) return fallback;

  const isLocalPath =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");

  return isLocalPath ? next : fallback;
}
