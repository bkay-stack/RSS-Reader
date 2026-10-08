// Makes an untrusted feed link safe for an href: only http/https links pass.
// "/posts/1" + base → full link; javascript:, data: or junk → "".
// Kept apart from sanitizeText so importing it never pulls in DOMPurify.

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function sanitizeUrl(
  value: string | null | undefined,
  base?: string | null,
): string {
  if (!value) return "";

  try {
    // URL lowercases the scheme, so "JaVaScRiPt:" can't slip past.
    const url = new URL(value.trim(), base || undefined);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.href : "";
  } catch {
    // Bad URL, or a relative link with no base.
    return "";
  }
}
