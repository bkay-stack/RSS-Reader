import {
  List,
  LayoutGrid,
  AlignJustify,
  ArrowDownUp,
  RefreshCcw,
} from "lucide-react";

export default function FeedHeader() {
  return (
    <header className="flex items-center justify-between w-full border-b border-border px-3 sm:px-6 py-3 sm:py-4">
      {/* Title */}
      <div className="flex items-baseline gap-2 min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-text-primary truncate">
          All Items
        </h1>
        <span className="text-xs sm:text-sm text-text-secondary shrink-0">
          47 unread
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

        {/* Sort — icon only on mobile */}
        <button className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-sm cursor-pointer">
          <ArrowDownUp className="h-4 w-4" />
          <span className="hidden sm:inline">Newest</span>
        </button>

        {/* Refresh — icon only on mobile */}
        <button className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-sm cursor-pointer">
          <RefreshCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Mark all — kept, tighter padding on mobile */}
        <button className="rounded-md border border-border px-2 py-1 text-xs sm:text-sm cursor-pointer whitespace-nowrap">
          Mark all read
        </button>
      </div>
    </header>
  );
}
