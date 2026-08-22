import feedsData from "../data/sample-feeds.json";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  const allFeeds = feedsData.categories.flatMap((c) => c.feeds);

  const { data, error } = await supabase
    .from("feeds")
    .upsert(
      allFeeds.map((feed) => ({
        title: feed.title,
        feed_url: feed.feedUrl,
        site_url: feed.siteUrl,
        format: feed.format === "rss2" ? "rss" : feed.format,
      })),
      { onConflict: "feed_url" },
    )
    .select();

  if (error) {
    console.error("seed failed:", error);
    process.exit(1);
  }

  console.log(`seeded ${data.length} feeds`);
}

seed();
