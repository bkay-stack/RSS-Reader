// Makes a feed link safe to use in an href.
// Keeps only http/https links; relative links ("/post") get the site URL added.
// Anything else (javascript:, data:, broken links) becomes "".

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function sanitizeUrl(
  value: string | null | undefined,
  base?: string | null,
): string {
  if (!value) return "";

  try {
    const url = new URL(value.trim(), base || undefined);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.href : "";
  } catch {
    return ""; // broken link
  }
}
