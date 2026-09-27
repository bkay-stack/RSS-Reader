import { fetchFeedXML } from "./fetchFeed";
import { detectFeedFormat } from "./detectFeedFormat";
import {
  parseRSSFeed,
  parseAtomFeed,
  parseRDFFeed,
  type FeedSourceMeta,
} from "./parseFeed";
import type { ArticleItem } from "@/components/dashboard/feed/FeedItem";

export type FeedFetchResult = {
  sourceName: string;
  items: ArticleItem[];
  error: string | null;
};

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

    const parsed =
      format === "atom"
        ? parseAtomFeed(xml, source)
        : format === "rdf"
          ? parseRDFFeed(xml, source)
          : parseRSSFeed(xml, source);

    // Skip items with no id or a repeated id (they can't be saved).
    const seen = new Set<string>();
    const items = parsed.filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    // No items means something's wrong, so report it.
    if (items.length === 0) {
      return {
        sourceName: source.name,
        items: [],
        error: `No items found in ${source.name}`,
      };
    }

    return { sourceName: source.name, items, error: null };
  } catch (err) {
    return {
      sourceName: source.name,
      items: [],
      error: err instanceof Error ? err.message : "Unknown fetch error",
    };
  }
}
