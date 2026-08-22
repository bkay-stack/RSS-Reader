import type { SupabaseClient } from "@supabase/supabase-js";
import type { FeedFetchResult } from "./fetchAndParseFeed";

const BATCH_SIZE = 100;

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function storeFeedItems(
  supabase: SupabaseClient,
  results: (FeedFetchResult & { feedId: string })[],
) {
  const rows = results.flatMap((result) =>
    result.items.map((item) => ({
      feed_id: result.feedId,
      guid: item.id,
      title: item.title,
      excerpt: item.excerpt,
      url: item.url,
      published_at: item.publishedAt,
    })),
  );

  if (rows.length === 0) return;

  const batches = chunkArray(rows, BATCH_SIZE);

  for (const [i, batch] of batches.entries()) {
    const { error } = await supabase
      .from("feed_items")
      .upsert(batch, { onConflict: "feed_id,guid" });

    if (error) {
      console.error(
        `feed_items upsert failed on batch ${i + 1}/${batches.length}:`,
        error,
      );
    }
  }
}
