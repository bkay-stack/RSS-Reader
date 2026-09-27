/**
 * Feed parsing: raw RSS / Atom / RDF XML → ArticleItem[].
 *
 * Everything inside a feed is untrusted, so every field is cleaned HERE,
 * before it is stored in the database:
 *
 *   title    → cleanPlainText   decode character codes, keep the text as-is
 *   excerpt  → sanitizeText     strip all HTML, then cut to 200 characters
 *   url      → sanitizeUrl      http(s) only; relative links are completed
 *                               with the feed's site URL
 *   date     → toISODate        unreadable dates become null instead of
 *                               crashing the whole feed
 *
 * RSS and RDF items have the same shape and share mapRSSItem. Atom entries
 * are shaped differently and are mapped inline in parseAtomFeed.
 */

import { XMLParser } from "fast-xml-parser";
import type { ArticleItem } from "@/components/dashboard/feed/FeedItem";
import {
  cleanPlainText,
  decodeHtmlEntities,
  sanitizeText,
} from "./sanitizeText";
import { sanitizeUrl } from "@/lib/sanitizeUrl";

// Raw shapes, as fast-xml-parser returns them

type RawRSSItem = {
  guid?: { "#text": string } | string;
  title?: { __cdata: string } | string;
  description?: { __cdata: string } | string;
  "content:encoded"?: { __cdata: string } | string;
  link?: string;
  pubDate?: string;
  "dc:date"?: string;
};

type RawAtomLink = {
  "@_rel"?: string;
  "@_href"?: string;
};

type RawAtomEntry = {
  id?: string;
  title?: { "#text": string } | string;
  summary?: { "#text": string } | string;
  content?: { "#text": string } | string;
  link?: RawAtomLink | RawAtomLink[];
  published?: string;
  updated?: string;
};

// Attributes come back prefixed with "@_" (e.g. link["@_href"]), and
// <![CDATA[...]]> blocks come back as { __cdata: "..." }.
// parseTagValue: false keeps every value as text, so "0012345" isn't turned
// into the number 12345.
// stopNodes keeps Atom summary/content as raw markup. Atom can put real HTML
// tags there (type="xhtml"), which the parser would otherwise scramble.
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
  parseTagValue: false,
  stopNodes: ["feed.entry.summary", "feed.entry.content"],
});

// Helpers

// A text node can arrive as a plain string, as { "#text" } (when the element
// also has attributes) or as { __cdata } (when wrapped in CDATA). Returns the
// raw string in every case — it is NOT cleaned yet.
function extractText(
  field: { "#text": string } | { __cdata: string } | string | undefined,
): string {
  if (typeof field === "object" && field !== null) {
    return ("#text" in field ? field["#text"] : field.__cdata) ?? "";
  }
  return field ?? "";
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

// Hacker News feeds (hnrss.org) fill the description with links and stats:
//   "Article URL: https://… Comments URL: https://… Points: 402 # Comments: 146"
// Turn that into "402 points · 146 comments", keeping any real post text.
function tidyHackerNews(text: string): string {
  if (!text.includes("Comments URL: https://news.ycombinator.com/")) return text;

  const count = (label: string, word: string) => {
    const n = text.match(new RegExp(`${label}: (\\d+)`))?.[1];
    return n ? `${n} ${word}${n === "1" ? "" : "s"}` : "";
  };
  const stats = [count("Points", "point"), count("# Comments", "comment")]
    .filter(Boolean)
    .join(" · ");

  const body = text
    .replace(/(Article|Comments) URL: \S+/g, "")
    .replace(/(Points|# Comments): \d+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Post text that's only a link adds nothing to the preview.
  const hasText = body && !/^https?:\/\/\S+$/.test(body);
  return [stats, hasText ? body : ""].filter(Boolean).join(" — ");
}

// Feed HTML → short plain-text preview for the feed list.
function toExcerpt(html: string): string {
  return truncate(tidyHackerNews(sanitizeText(html)), 200);
}

// Feed date → ISO string. Missing or unreadable dates become null, so one bad
// date can't throw and take the whole feed down with it.
function toISODate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value.trim());
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export type FeedSourceMeta = {
  name: string;
  siteUrl: string;
  category: string;
};

// RSS

export function parseRSSFeed(
  xml: string,
  source: FeedSourceMeta,
): ArticleItem[] {
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? [];
  const itemArray = Array.isArray(items) ? items : [items];

  return itemArray.map((item: RawRSSItem) => mapRSSItem(item, source));
}

// Atom

export function parseAtomFeed(
  xml: string,
  source: FeedSourceMeta,
): ArticleItem[] {
  const parsed = parser.parse(xml);
  const entries = parsed?.feed?.entry ?? [];
  const entryArray = Array.isArray(entries) ? entries : [entries];

  return entryArray.map((entry: RawAtomEntry) => {
    // An entry can have several <link>s; the "alternate" one is the article.
    const links = Array.isArray(entry.link) ? entry.link : [entry.link];
    const alternateLink =
      links.find((l) => l?.["@_rel"] === "alternate") ?? links[0];

    // summary/content arrive as raw markup (see stopNodes), so unwrap CDATA.
    const rawSummary = (
      extractText(entry.summary) || extractText(entry.content)
    ).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");

    // Atom summaries are often entity-encoded HTML (`&lt;p&gt;`), so decode
    // first to expose the real tags, then let sanitizeText strip them.
    const decodedSummary = decodeHtmlEntities(rawSummary);

    return {
      id: extractText(entry.id).trim() || alternateLink?.["@_href"] || "",
      title: cleanPlainText(extractText(entry.title)) || "Untitled",
      excerpt: toExcerpt(decodedSummary),
      url: sanitizeUrl(alternateLink?.["@_href"], source.siteUrl),
      publishedAt: toISODate(entry.published) ?? toISODate(entry.updated),
      source: { name: source.name, siteUrl: source.siteUrl },
      category: source.category,
      isRead: false,
      isSaved: false,
    };
  });
}

// RDF (RSS 1.0) — items live under <rdf:RDF> but look like RSS items

export function parseRDFFeed(
  xml: string,
  source: FeedSourceMeta,
): ArticleItem[] {
  const parsed = parser.parse(xml);
  const items = parsed?.["rdf:RDF"]?.item ?? [];
  const itemArray = Array.isArray(items) ? items : [items];
  return itemArray.map((item: RawRSSItem) => mapRSSItem(item, source));
}

// Shared RSS / RDF mapping

function mapRSSItem(item: RawRSSItem, source: FeedSourceMeta): ArticleItem {
  // Some items only carry the full article (content:encoded), no description.
  const rawDescription =
    extractText(item.description) || extractText(item["content:encoded"]);
  const link = extractText(item.link).trim();

  // Prefer the feed's own id; fall back to the link so upserts stay stable.
  const id = extractText(item.guid).trim() || link;

  return {
    id,
    title: cleanPlainText(extractText(item.title)) || "Untitled",
    excerpt: toExcerpt(rawDescription),
    url: sanitizeUrl(link, source.siteUrl),
    // RSS 2.0 uses pubDate; RSS 1.0 (RDF) and some RSS feeds use dc:date.
    publishedAt: toISODate(item.pubDate) ?? toISODate(item["dc:date"]),
    source: { name: source.name, siteUrl: source.siteUrl },
    category: source.category,
    isRead: false,
    isSaved: false,
  };
}
