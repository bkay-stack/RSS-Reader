import { XMLParser } from "fast-xml-parser";
import type { ArticleItem } from "@/components/dashboard/feed/FeedItem";

type RawRSSItem = {
  guid?: { "#text": string } | string;
  title?: string;
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
  title?: string;
  summary?: { "#text": string } | string;
  content?: { "#text": string } | string;
  link?: RawAtomLink | RawAtomLink[];
  published?: string;
  updated?: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
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

  return itemArray.map((item: RawRSSItem) => {
    const rawDescription =
      typeof item.description === "object"
        ? item.description.__cdata
        : (item.description ?? "");

    const id =
      typeof item.guid === "object"
        ? item.guid["#text"]
        : (item.guid ?? item.link ?? "");

    return {
      id,
      title: decodeHtmlEntities(item.title ?? "Untitled"),
      excerpt: truncate(stripHtml(rawDescription), 200),
      url: item.link ?? "",
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      source: { name: source.name, siteUrl: source.siteUrl },
      category: source.category,
      isRead: false,
      isSaved: false,
    };
  });
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
    const links = Array.isArray(entry.link) ? entry.link : [entry.link];
    const alternateLink =
      links.find((l) => l?.["@_rel"] === "alternate") ?? links[0];

    const rawSummary =
      typeof entry.summary === "object"
        ? entry.summary["#text"]
        : (entry.summary ??
          (typeof entry.content === "object"
            ? entry.content["#text"]
            : (entry.content ?? "")));

    const decodedSummary = decodeHtmlEntities(rawSummary);
    const publishedDate = entry.published ?? entry.updated ?? null;

    return {
      id: entry.id ?? "",
      title: decodeHtmlEntities(entry.title ?? "Untitled"),
      excerpt: truncate(stripHtml(decodedSummary), 200),
      url: alternateLink?.["@_href"] ?? "",
      publishedAt: publishedDate ? new Date(publishedDate).toISOString() : null,
      source: { name: source.name, siteUrl: source.siteUrl },
      category: source.category,
      isRead: false,
      isSaved: false,
    };
  });
}
