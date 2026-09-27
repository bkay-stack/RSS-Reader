import { createClient } from "@/lib/supabase/server";

export type UnreadCounts = {
  total: number;
  byFeed: Record<string, number>;
  byCategory: Record<string, number>;
};

type UnreadRow = {
  feed_id: string;
  category_id: string | null;
  unread: number;
};

// Unread counts for the signed-in user: total, per feed, and per category.
export async function getUnreadCounts(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<UnreadCounts> {
  const counts: UnreadCounts = { total: 0, byFeed: {}, byCategory: {} };

  const { data, error } = await supabase.rpc("unread_counts");
  if (error) {
    console.error("unread counts fetch failed:", error);
    return counts;
  }

  for (const row of data as UnreadRow[]) {
    counts.total += row.unread;
    counts.byFeed[row.feed_id] = row.unread;

    // Feeds with no category are grouped under "uncategorized".
    const category = row.category_id ?? "uncategorized";
    counts.byCategory[category] = (counts.byCategory[category] ?? 0) + row.unread;
  }

  return counts;
}
