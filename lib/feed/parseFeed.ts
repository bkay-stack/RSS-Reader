// Turns RSS / Atom / RDF XML into ArticleItems.
// Feed content is untrusted, so every field is cleaned here before saving.

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

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_", // attributes: link["@_href"]
  cdataPropName: "__cdata", // CDATA: { __cdata: "…" }
  parseTagValue: false, // keep "0012345" as text
  stopNodes: ["feed.entry.summary", "feed.entry.content"], // keep Atom HTML raw
});

// Helpers

// Gets the raw text from a string, { "#text" } or { __cdata }.
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

// Hacker News: swap the links and stats for "402 points · 146 comments".
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

  // Skip post text that's just a link.
  const hasText = body && !/^https?:\/\/\S+$/.test(body);
  return [stats, hasText ? body : ""].filter(Boolean).join(" — ");
}

// HTML → short text preview.
function toExcerpt(html: string): string {
  return truncate(tidyHackerNews(sanitizeText(html)), 200);
}

// Date → ISO string, or null if missing or unreadable.
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
    // The "alternate" link is the article.
    const links = Array.isArray(entry.link) ? entry.link : [entry.link];
    const alternateLink =
      links.find((l) => l?.["@_rel"] === "alternate") ?? links[0];

    // Unwrap CDATA and decode &lt;p&gt; so the tags can be stripped.
    const rawSummary = (
      extractText(entry.summary) || extractText(entry.content)
    ).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
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

// RDF (RSS 1.0): RSS-style items under <rdf:RDF>

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
  // No description? Use the full article.
  const rawDescription =
    extractText(item.description) || extractText(item["content:encoded"]);
  const link = extractText(item.link).trim();

  // The feed's id, or the link if it has none.
  const id = extractText(item.guid).trim() || link;

  return {
    id,
    title: cleanPlainText(extractText(item.title)) || "Untitled",
    excerpt: toExcerpt(rawDescription),
    url: sanitizeUrl(link, source.siteUrl),
    // pubDate (RSS 2.0) or dc:date (RDF)
    publishedAt: toISODate(item.pubDate) ?? toISODate(item["dc:date"]),
    source: { name: source.name, siteUrl: source.siteUrl },
    category: source.category,
    isRead: false,
    isSaved: false,
  };
}
