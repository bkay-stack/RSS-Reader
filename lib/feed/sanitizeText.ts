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

/**
 * Turns HTML character codes back into the characters they stand for.
 *
 *   "Tom &amp; Jerry &lt;3"  →  "Tom & Jerry <3"
 *
 * `&amp;` is replaced LAST, so "&amp;lt;" decodes once to the literal text
 * "&lt;" instead of being decoded twice into "<".
 */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
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
