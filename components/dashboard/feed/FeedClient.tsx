"use client";

import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import FeedHeader from "./FeedHeader";
import FeedList from "./FeedList";
import type { ArticleItem } from "./FeedItem";
import type { SortOrder } from "./getFeedItems";

type FeedClientProps = {
  userId: string;
  initialItems: ArticleItem[];
  unreadCount: number;
  children?: ReactNode;
};

async function fetchFeedItems(sort: SortOrder): Promise<ArticleItem[]> {
  const response = await fetch(`/api/feed-items?sort=${sort}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load feed items");
  }

  const payload: { items: ArticleItem[] } = await response.json();

  return payload.items;
}

export default function FeedClient({
  userId,
  initialItems,
  unreadCount,
  children,
}: FeedClientProps) {
  const [sort, setSort] = useState<SortOrder>("newest");

  const {
    data: items,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["feed-items", userId, sort],
    queryFn: () => fetchFeedItems(sort),
    initialData: sort === "newest" ? initialItems : undefined,
    staleTime: 30_000,
    placeholderData: (previousData) => previousData,
  });

  return (
    <section className="mx-auto flex w-full flex-1 flex-col">
      <FeedHeader
        unreadCount={unreadCount}
        sort={sort}
        onSortChange={setSort}
      />

      {children}

      {isFetching && (
        <p role="status" className="text-sm text-text-secondary">
          Updating posts...
        </p>
      )}

      {isError && (
        <p role="alert" className="text-sm text-red-500">
          Failed to load posts. Please try again.
        </p>
      )}

      <FeedList items={items ?? []} />
    </section>
  );
}
