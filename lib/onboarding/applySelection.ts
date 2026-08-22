"use server";

import feedsData from "@/data/sample-feeds.json";
import { createClient } from "@/lib/supabase/server";

export async function applyOnboardingSelection(
  selectedCategoryNames: string[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const selectedCategories = feedsData.categories.filter((c) =>
    selectedCategoryNames.includes(c.name),
  );

  const [categoriesResult, feedsResult] = await Promise.all([
    supabase
      .from("categories")
      .upsert(
        selectedCategories.map((c) => ({ user_id: user.id, name: c.name })),
        { onConflict: "user_id,name" },
      )
      .select(),
    supabase
      .from("feeds")
      .select("id, feed_url")
      .in(
        "feed_url",
        selectedCategories.flatMap((c) => c.feeds.map((f) => f.feedUrl)),
      ),
  ]);

  const { data: insertedCategories, error: categoriesError } = categoriesResult;
  const { data: existingFeeds, error: feedsError } = feedsResult;

  if (categoriesError || feedsError) {
    console.error("setup failed:", categoriesError, feedsError);
    return { failed: selectedCategoryNames };
  }

  const categoryIdByName = new Map(
    insertedCategories.map((c) => [c.name, c.id]),
  );
  const feedIdByUrl = new Map(existingFeeds.map((f) => [f.feed_url, f.id]));

  const failed: string[] = [];
  const userFeedRows = selectedCategories.flatMap((c) => {
    const categoryId = categoryIdByName.get(c.name);
    if (!categoryId) {
      failed.push(c.name);
      return [];
    }
    return c.feeds
      .map((feed) => {
        const feedId = feedIdByUrl.get(feed.feedUrl);
        if (!feedId) return null;
        return { user_id: user.id, feed_id: feedId, category_id: categoryId };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
  });

  const { error: userFeedsError } = await supabase
    .from("user_feeds")
    .upsert(userFeedRows, { onConflict: "user_id,feed_id" });

  if (userFeedsError) {
    console.error("user_feeds upsert failed:", userFeedsError);
    return { failed: selectedCategoryNames };
  }

  await supabase.from("user_preferences").upsert({
    user_id: user.id,
    onboarding_completed_at: new Date().toISOString(),
  });

  return { failed };
}
