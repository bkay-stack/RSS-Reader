"use server";

import feedsData from "@/data/sample-feeds.json";
import { createClient } from "@/lib/supabase/server";
import { applyOnboardingSelection } from "@/lib/onboarding/applySelection";

export async function seedGuestFeeds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.is_anonymous) return { failed: [] as string[] };

  return applyOnboardingSelection(feedsData.categories.map((c) => c.name));
}
