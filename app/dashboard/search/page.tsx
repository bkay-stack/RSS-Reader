// Search Page

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/components/dashboard/SearchInput";
import SearchResultsClient from "@/app/dashboard/search/SearchResultsClient";
import { getFeedItems } from "@/components/dashboard/feed/getFeedItems";

import type { ArticleItem } from "@/components/dashboard/feed/FeedItem";

type SearchArticleRow = {
  id: string;
  feed_id: string;
  title: string;
  excerpt: string | null;
  url: string;
  published_at: string | null;
  rank: number;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  let results: ArticleItem[] = [];

  if (query.length >= 2) {
    // 1. Find matching articles.
    const { data, error } = await supabase.rpc("search_articles", {
      q: query,
      p_limit: 20,
      p_offset: 0,
    });

    if (error) throw error;

    // 2. Type the database response.
    const searchRows = (data ?? []) as SearchArticleRow[];

    // 3. Extract matching article IDs.
    const ids: string[] = searchRows.map((article) => article.id);
    console.log("1. rpc rows:", searchRows.length);

    if (ids.length > 0) {
      // 4. Fetch complete UI-ready article objects.
      const items = await getFeedItems(supabase, user.id, "newest", { ids });
      console.log("2. after getFeedItems:", items.length);

      // 5. Preserve search relevance order.
      const itemsById = new Map<string, ArticleItem>(
        items.map((item) => [item.id, item]),
      );

      results = ids.flatMap((id) => {
        const item = itemsById.get(id);
        return item ? [item] : [];
      });
    }
  }

  return (
    <>
      <Suspense>
        <SearchInput className="mb-6 md:hidden" />
      </Suspense>

      {query.length < 2 ? (
        <p className="text-text-secondary">
          Type at least 2 characters to search.
        </p>
      ) : results.length === 0 ? (
        <p className="text-text-secondary">
          No results for &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <SearchResultsClient items={results} />
      )}
    </>
  );
}
