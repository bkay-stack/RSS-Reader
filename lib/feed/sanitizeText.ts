// Cleans text from RSS feeds before we save it.
// Titles use cleanPlainText (keeps the words). Summaries use sanitizeText (removes all HTML).
// Show the result as normal React text — never with dangerouslySetInnerHTML.

import DOMPurify from "isomorphic-dompurify";

// Turns "&amp;" into "&", "&lt;" into "<", etc. ("&amp;" goes last on purpose.)
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

// For titles: decodes characters and tidies spaces. Does not remove tags.
export function cleanPlainText(value: unknown): string {
  const input = typeof value === "string" ? value : String(value ?? "");
  return decodeHtmlEntities(input).replace(/\s+/g, " ").trim();
}

// For summaries: removes all HTML (including <script>) and keeps only the words.
export function sanitizeText(html: unknown): string {
  const input = typeof html === "string" ? html : String(html ?? "");
  const text = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return decodeHtmlEntities(text).replace(/\s+/g, " ").trim();
}
