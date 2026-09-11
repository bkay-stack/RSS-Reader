// Turns RSS / Atom / RDF feed XML into articles.
// Every field is cleaned here before it is saved (see sanitizeText and sanitizeUrl).

import { XMLParser } from "fast-xml-parser";
import type { ArticleItem } from "@/components/dashboard/feed/FeedItem";
import {
  cleanPlainText,
  decodeHtmlEntities,
  sanitizeText,
} from "./sanitizeText";
import { sanitizeUrl } from "@/lib/sanitizeUrl";

// Raw feed data, as the XML parser returns it

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

// "@_" marks attributes; CDATA comes back as { __cdata }.
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
});

// Gets the text out of a field, whatever shape the parser gave it.
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
    // The "alternate" link is the article.
    const links = Array.isArray(entry.link) ? entry.link : [entry.link];
    const alternateLink =
      links.find((l) => l?.["@_rel"] === "alternate") ?? links[0];

    const rawSummary = extractText(entry.summary) || extractText(entry.content);

    // Atom summaries are often encoded HTML, so decode first, then clean.
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

// RDF (same item shape as RSS)

export function parseRDFFeed(
  xml: string,
  source: FeedSourceMeta,
): ArticleItem[] {
  const parsed = parser.parse(xml);
  const items = parsed?.["rdf:RDF"]?.item ?? [];
  const itemArray = Array.isArray(items) ? items : [items];
  return itemArray.map((item: RawRSSItem) => mapRSSItem(item, source));
}

function mapRSSItem(item: RawRSSItem, source: FeedSourceMeta): ArticleItem {
  const rawDescription = extractText(item.description);

  // Use the feed's id, or the link if there isn't one.
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
