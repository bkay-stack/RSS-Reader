import { createClient } from "@/lib/supabase/server";
import type { ArticleItem } from "./FeedItem";

function unwrap<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

export async function getFeedItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<ArticleItem[]> {
  const { data, error } = await supabase
    .from("feed_items")
    .select(
      `
      id,
      title,
      excerpt,
      url,
      published_at,
      feeds!inner (
        title,
        site_url,
        user_feeds!inner (
          category_id,
          user_id,
          categories ( name )
        )
      ),
      user_item_state (
        is_read,
        is_saved
      )
    `,
    )
    .eq("feeds.user_feeds.user_id", userId)
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("feed items fetch failed:", error);
    return [];
  }

  return data.map((item) => {
    const feed = unwrap(item.feeds);
    const userFeed = feed ? unwrap(feed.user_feeds) : undefined;
    const category = userFeed ? unwrap(userFeed.categories) : undefined;

    return {
      id: item.id,
      title: item.title,
      excerpt: item.excerpt ?? "",
      url: item.url ?? "",
      publishedAt: item.published_at ?? new Date().toISOString(),
      source: {
        name: feed?.title ?? "",
        siteUrl: feed?.site_url ?? "",
      },
      category: category?.name ?? "Uncategorized",
      isRead: item.user_item_state[0]?.is_read ?? false,
      isSaved: item.user_item_state[0]?.is_saved ?? false,
    };
  });
}
