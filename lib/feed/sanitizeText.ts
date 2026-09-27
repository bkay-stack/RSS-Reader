/**
 * Text cleaning for untrusted feed content.
 *
 * WHY
 *   Feed titles and summaries come from third-party XML, so they can contain
 *   HTML, <script> tags, event handlers (onerror=…) or encoded characters.
 *
 * WHICH FUNCTION TO USE
 *   Pick the cleaner that matches what the field is supposed to contain:
 *
 *   - Titles    → cleanPlainText
 *       Plain text by spec. Tags are KEPT as text, because stripping them
 *       would eat real words ("Why the <canvas> tag is slow").
 *
 *   - Summaries → sanitizeText
 *       Real HTML. We only show a 1–2 line text preview, so ALL markup is
 *       removed and just the readable words are kept.
 *
 * ⚠️ SAFETY RULE
 *   Both functions return TEXT, not safe HTML. Render the result as a normal
 *   React child ({item.title}), which escapes it. Never pass it to
 *   dangerouslySetInnerHTML — a title can legitimately be "<script>…".
 */

import DOMPurify from "isomorphic-dompurify";

// Named codes feeds commonly use. Number codes (&#8217; &#x2019;) are handled separately.
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", bull: "•", middot: "·",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»",
  copy: "©", reg: "®", trade: "™", times: "×",
};

/**
 * Turns HTML character codes back into the characters they stand for.
 *
 *   "Don&#8217;t &mdash; Tom &amp; Jerry"  →  "Don’t — Tom & Jerry"
 *
 * One pass, so "&amp;lt;" decodes once to the text "&lt;", not twice to "<".
 * Unknown codes are left as they are.
 */
export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#\d+|#x[\da-f]+|[a-z][a-z\d]*);/gi, (match, code: string) => {
    if (code[0] !== "#") return NAMED_ENTITIES[code] ?? match;
    const isHex = code[1] === "x" || code[1] === "X";
    const point = parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

/**
 * Cleans a plain-text field (titles). Does NOT remove tags.
 *
 *   1. Converts non-strings (numbers, null) to a string, so callers never crash.
 *   2. Decodes character codes: "&amp;" → "&".
 *   3. Collapses runs of spaces/newlines into one space and trims the ends.
 *
 *   "Why the <canvas>\n  tag &amp; more"  →  "Why the <canvas> tag & more"
 */
export function cleanPlainText(value: unknown): string {
  const input = typeof value === "string" ? value : String(value ?? "");
  return decodeHtmlEntities(input).replace(/\s+/g, " ").trim();
}

/**
 * Turns an HTML field (summaries) into plain text. Removes ALL markup.
 *
 *   1. Converts non-strings to a string.
 *   2. DOMPurify removes every tag and attribute. <script> and <style> are
 *      removed together with their contents; other tags keep their text.
 *   3. Decodes the character codes DOMPurify adds back when it outputs text.
 *   4. Collapses whitespace and trims.
 *
 *   "<p>Hi <b>there</b><script>alert(1)</script></p>"  →  "Hi there"
 *   "<img src=x onerror=alert(1)>Photo"                →  "Photo"
 */
export function sanitizeText(html: unknown): string {
  const input = typeof html === "string" ? html : String(html ?? "");
  const text = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return decodeHtmlEntities(text).replace(/\s+/g, " ").trim();
}
