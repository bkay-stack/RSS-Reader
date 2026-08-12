import feedsData from "@/data/sample-feeds.json";
import { fetchAndParseFeed, type FeedFetchResult } from "./fetchAndParseFeed";

export async function fetchAllFeeds(): Promise<FeedFetchResult[]> {
  const fetchPromises = feedsData.categories.flatMap((category) =>
    category.feeds.map((feed) =>
      fetchAndParseFeed(feed.feedUrl, {
        name: feed.title,
        siteUrl: feed.siteUrl,
        category: category.name,
      }),
    ),
  );

  const results = await Promise.allSettled(fetchPromises);

  return results.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : {
          sourceName: "unknown",
          items: [],
          error: "Fetch rejected unexpectedly",
        },
  );
}
