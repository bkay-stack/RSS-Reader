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
  link?: string;
  pubDate?: string;
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
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
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

    const rawSummary = extractText(entry.summary) || extractText(entry.content);

    // Atom summaries are often entity-encoded HTML (`&lt;p&gt;`), so decode
    // first to expose the real tags, then let sanitizeText strip them.
    const decodedSummary = decodeHtmlEntities(rawSummary);
    const publishedDate = entry.published ?? entry.updated ?? null;

    return {
      id: entry.id ?? alternateLink?.["@_href"] ?? "",
      title: cleanPlainText(extractText(entry.title)) || "Untitled",
      excerpt: truncate(sanitizeText(decodedSummary), 200),
      url: sanitizeUrl(alternateLink?.["@_href"], source.siteUrl),
      publishedAt: publishedDate ? new Date(publishedDate).toISOString() : null,
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
  const rawDescription = extractText(item.description);

  // Prefer the feed's own id; fall back to the link so upserts stay stable.
  const id =
    typeof item.guid === "object"
      ? item.guid["#text"]
      : (item.guid ?? item.link ?? "");

  return {
    id,
    title: cleanPlainText(extractText(item.title)) || "Untitled",
    excerpt: truncate(sanitizeText(rawDescription), 200),
    url: sanitizeUrl(item.link, source.siteUrl),
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : null,
    source: { name: source.name, siteUrl: source.siteUrl },
    category: source.category,
    isRead: false,
    isSaved: false,
  };
}
