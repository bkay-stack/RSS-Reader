"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchAllFeeds } from "@/lib/feed/fetchAllFeeds";
import { storeFeedItems } from "@/lib/feed/storeFeedItems";

export type RefreshResult = { error: string } | { newCount: number };

type UserFeedRow = { feed_id: string };

function toFeedId(row: UserFeedRow) {
  return row.feed_id;
}

export async function refreshFeeds(): Promise<RefreshResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: rows, error } = await supabase
    .from("user_feeds")
    .select("feed_id")
    .eq("user_id", user.id);

  if (error || !rows) return { error: "Could not load your feeds" };
  if (rows.length === 0) return { newCount: 0 };

  const results = await fetchAllFeeds(supabase, rows.map(toFeedId));
  const newCount = await storeFeedItems(supabase, results);

  return { newCount };
}
