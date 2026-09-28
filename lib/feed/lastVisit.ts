"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Redraw the dashboard so it shows the latest articles (the banner's click).
export async function loadNewItems() {
  refresh();
}

// How many articles arrived after `since` (the pill's check while the page is open).
// Your security rules already limit feed_items to the user's own feeds.
export async function countNewSince(since: string) {
  if (!z.iso.datetime().safeParse(since).success) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("feed_items")
    .select("id", { count: "exact", head: true })
    .gt("fetched_at", since);

  if (error) {
    console.error("countNewSince failed:", error);
    return 0;
  }

  return count ?? 0;
}

// Save "now" as the user's last visit; the next visit counts new items from here.
export async function recordVisit() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("user_preferences")
    .upsert(
      { user_id: user.id, last_visited_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );

  if (error) console.error("recordVisit failed:", error);
}
