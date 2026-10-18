import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUnreadCounts } from "./feed/getUnreadCounts";

export type SidebarFeed = { id: string; name: string; unread: number };

export type SidebarCategory = {
  id: string;
  name: string;
  unread: number;
  feeds: SidebarFeed[];
};

export type SidebarData = {
  totalUnread: number;
  categories: SidebarCategory[];
};

// The user's categories, the feeds in each, and their unread counts.
// cache() lets the layout and the page share one load per request.
export const getSidebarData = cache(async (): Promise<SidebarData> => {
  const supabase = await createClient();

  const [{ data, error }, unread] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, user_feeds ( feed_id, custom_title, feeds ( title ) )")
      .order("sort_order")
      .order("name"),
    getUnreadCounts(supabase),
  ]);

  if (error) {
    console.error("sidebar data fetch failed:", error);
    return { totalUnread: unread.total, categories: [] };
  }

  const categories = data.map((category) => ({
    id: category.id,
    name: category.name,
    unread: unread.byCategory[category.id] ?? 0,
    feeds: category.user_feeds
      .map((userFeed) => {
        // Supabase types this as a list, but each row has one feed.
        const feed = Array.isArray(userFeed.feeds)
          ? userFeed.feeds[0]
          : userFeed.feeds;
        return {
          id: userFeed.feed_id,
          name: userFeed.custom_title || feed?.title || "Untitled feed",
          unread: unread.byFeed[userFeed.feed_id] ?? 0,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));

  return { totalUnread: unread.total, categories };
});
