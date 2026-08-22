import { createClient } from "@supabase/supabase-js";
import { fetchAllFeeds } from "../lib/feed/fetchAllFeeds";
import { storeFeedItems } from "../lib/feed/storeFeedItems";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function run() {
  console.log("fetching feeds...");
  const results = await fetchAllFeeds(supabase);

  const totalItems = results.reduce((sum, r) => sum + r.items.length, 0);
  console.log(`fetched ${totalItems} items across ${results.length} feeds`);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.log(
      "feeds with errors:",
      errors.map((e) => `${e.sourceName}: ${e.error}`),
    );
  }

  console.log("storing in database...");
  await storeFeedItems(supabase, results);
  console.log("done");
}

run();
