import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchAndParseFeed, type FeedFetchResult } from "./fetchAndParseFeed";

export async function fetchAllFeeds(
  supabase: SupabaseClient,
  feedIds?: string[],
): Promise<(FeedFetchResult & { feedId: string })[]> {
  let query = supabase.from("feeds").select("id, title, feed_url, site_url");

  if (feedIds) {
    query = query.in("id", feedIds);
  }

  const { data: feeds, error } = await query;

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
