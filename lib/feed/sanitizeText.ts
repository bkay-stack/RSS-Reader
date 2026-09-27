// Cleans untrusted feed text: titles use cleanPlainText, summaries sanitizeText.
// Both return plain text — render as {text}, never with dangerouslySetInnerHTML.

import DOMPurify from "isomorphic-dompurify";

// Common named codes. Number codes like &#8217; are handled below.
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "—", ndash: "–", hellip: "…", bull: "•", middot: "·",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»",
  copy: "©", reg: "®", trade: "™", times: "×",
};

// Turns codes like &amp; and &#8217; back into & and ’.
export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#\d+|#x[\da-f]+|[a-z][a-z\d]*);/gi, (match, code: string) => {
    if (code[0] !== "#") return NAMED_ENTITIES[code] ?? match;
    const isHex = code[1] === "x" || code[1] === "X";
    const point = parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

// For titles: decodes codes and tidies spaces. Keeps "<canvas>" as text.
export function cleanPlainText(value: unknown): string {
  const input = typeof value === "string" ? value : String(value ?? "");
  return decodeHtmlEntities(input).replace(/\s+/g, " ").trim();
}

// For summaries: DOMPurify removes all HTML, then spaces are tidied.
export function sanitizeText(html: unknown): string {
  const input = typeof html === "string" ? html : String(html ?? "");
  const text = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return decodeHtmlEntities(text).replace(/\s+/g, " ").trim();
}
