import { fetchFeedXML } from "./fetchFeed";
import { detectFeedFormat } from "./detectFeedFormat";
import { parseRSSFeed, parseAtomFeed, type FeedSourceMeta } from "./parseFeed";
import type { ArticleItem } from "@/components/dashboard/feed/FeedItem";

export type FeedFetchResult = {
  sourceName: string;
  items: ArticleItem[];
  error: string | null;
};

/**
 * Fetches a single feed URL, detects whether it's RSS or Atom, and parses
 * it into normalized ArticleItem[] data.
 *
 * Never throws — any failure (network error, malformed XML, unrecognized
 * format) is caught and returned as `{ items: [], error: "..." }` instead,
 * so one broken feed never crashes a batch fetch (see fetchAllFeeds.ts).
 */
export async function fetchAndParseFeed(
  feedUrl: string,
  source: FeedSourceMeta,
): Promise<FeedFetchResult> {
  try {
    const xml = await fetchFeedXML(feedUrl);
    const format = detectFeedFormat(xml);

    if (format === "unknown") {
      return {
        sourceName: source.name,
        items: [],
        error: `Unrecognized feed format for ${source.name}`,
      };
    }

    const items =
      format === "atom"
        ? parseAtomFeed(xml, source)
        : parseRSSFeed(xml, source);
    return { sourceName: source.name, items, error: null };
  } catch (err) {
    return {
      sourceName: source.name,
      items: [],
      error: err instanceof Error ? err.message : "Unknown fetch error",
    };
  }
}
