import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchAndParseFeed, type FeedFetchResult } from "./fetchAndParseFeed";

export async function fetchAllFeeds(
  supabase: SupabaseClient,
): Promise<(FeedFetchResult & { feedId: string })[]> {
  const { data: feeds, error } = await supabase
    .from("feeds")
    .select("id, title, feed_url, site_url");

  if (error || !feeds) {
    console.error("could not load feeds for fetching:", error);
    return [];
  }

  const fetchPromises = feeds.map(async (feed) => {
    const result = await fetchAndParseFeed(feed.feed_url, {
      name: feed.title,
      siteUrl: feed.site_url ?? "",
      category: "",
    });
    return { ...result, feedId: feed.id };
  });

  const results = await Promise.allSettled(fetchPromises);

  return results.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : {
          sourceName: "unknown",
          items: [],
          error: "Fetch rejected unexpectedly",
          feedId: "",
        },
  );
}
