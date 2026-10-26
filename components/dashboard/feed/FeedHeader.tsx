"use client";

import { List, LayoutGrid, AlignJustify, ArrowDownUp } from "lucide-react";
import MarkAllReadButton from "./MarkAllReadButton";
import RefreshButton from "./RefreshButton";
import type { SortOrder } from "./getFeedItems";

type FeedHeaderProps = {
  unreadCount: number;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
};

export default function FeedHeader({
  unreadCount,
  sort,
  onSortChange,
}: FeedHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full border-b border-border px-3 sm:px-6 py-3 sm:py-4">
      {/* Title */}
      <div className="flex items-baseline gap-2 min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-text-primary truncate">
          All Items
        </h1>
        <span className="text-xs sm:text-sm text-text-secondary shrink-0">
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* View Toggle — hidden on mobile */}
        <div className="hidden sm:flex overflow-hidden rounded-md border border-border cursor-pointer">
          <button className="bg-surface-secondary p-2.5 cursor-pointer">
            <List className="h-4 w-4" />
          </button>
          <button className="border-l border-border p-2.5 cursor-pointer">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button className="border-l border-border p-2.5 cursor-pointer">
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        {/* Sort: click to flip between newest and oldest */}
        <button
          type="button"
          onClick={() => onSortChange(sort === "newest" ? "oldest" : "newest")}
          aria-label={`Sorted by ${sort} first. Switch to ${sort === "newest" ? "oldest" : "newest"} first.`}
          className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-sm cursor-pointer">
          <ArrowDownUp className="h-4 w-4" />
          <span className="hidden sm:inline">
            {sort === "newest" ? "Newest" : "Oldest"}
          </span>
        </button>

        {/* Refresh — icon only on mobile */}
        <RefreshButton />

        {/* Mark all — kept, tighter padding on mobile */}
        <MarkAllReadButton unreadCount={unreadCount} />
      </div>
    </header>
  );
}
