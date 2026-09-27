"use server";

import { createClient } from "@/lib/supabase/server";

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
