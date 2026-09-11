/**
 * sanitizeUrl — makes an untrusted link safe to put in an `href`.
 *
 * WHY
 *   Feed links come from third-party XML. A `javascript:` link runs code when
 *   clicked, and a `data:` link can load a fake page. Only real web links pass.
 *
 * WHAT IT DOES
 *   1. Empty input                → ""
 *   2. Relative link + base       → completed using the feed's site URL
 *        "/posts/1" + "https://blog.com"  → "https://blog.com/posts/1"
 *   3. http: or https: result     → kept (normalised by `URL`)
 *   4. Anything else              → ""
 *        javascript:, data:, vbscript:, malformed, or relative with no base
 *
 * WHERE IT RUNS
 *   - lib/feed/parseFeed.ts: at ingest, before links are stored.
 *   - components/dashboard/feed/getFeedItems.ts: again on read, so rows stored
 *     before sanitization existed are covered too.
 *
 * It lives in its own file (not next to sanitizeText) so importing it never
 * pulls DOMPurify into a bundle.
 */

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function sanitizeUrl(
  value: string | null | undefined,
  base?: string | null,
): string {
  if (!value) return "";

  try {
    // `URL` does the hard parsing: it lowercases the scheme (so "JaVaScRiPt:"
    // can't sneak past the check) and throws on anything it can't parse.
    const url = new URL(value.trim(), base || undefined);
    return ALLOWED_PROTOCOLS.has(url.protocol) ? url.href : "";
  } catch {
    // Malformed URL, or a relative link without a usable base.
    return "";
  }
}
