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
): Promise<number> {
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

  if (rows.length === 0) return 0;

  const batches = chunkArray(rows, BATCH_SIZE);
  let newCount = 0;

  for (const [i, batch] of batches.entries()) {
    const { data, error } = await supabase
      .from("feed_items")
      .upsert(batch, { onConflict: "feed_id,guid", ignoreDuplicates: true })
      .select("guid");

    if (error) {
      console.error(
        `feed_items upsert failed on batch ${i + 1}/${batches.length}:`,
        error,
      );
      continue;
    }

    newCount += data.length;
  }

  return newCount;
}
