"use client";

import { useState } from "react";

import FeedList from "@/components/dashboard/feed/FeedList";
import FeedViewToggle from "@/components/dashboard/feed/FeedViewToggle";

import type { ArticleItem } from "@/components/dashboard/feed/FeedItem";
import type { FeedView } from "@/components/dashboard/feed/feedView";

type SearchResultsClientProps = {
  items: ArticleItem[];
};

export default function SearchResultsClient({
  items,
}: SearchResultsClientProps) {
  const [view, setView] = useState<FeedView>("list");

  return (
    <section className="w-full">
      <header className="flex items-center justify-between w-full border-b border-border px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-text-primary">
            Search results
          </h1>

          <span className="text-xs sm:text-sm text-text-secondary">
            {items.length} found
          </span>
        </div>

        <FeedViewToggle view={view} onViewChange={setView} />
      </header>

      <FeedList items={items} view={view} />
    </section>
  );
}
