import {
  List,
  LayoutGrid,
  AlignJustify,
  ArrowDownUp,
  RefreshCcw,
} from "lucide-react";

export default function FeedHeader() {
  return (
    <header className="flex items-center justify-between w-full border-b border-border px-6 py-4">
      {/* Title */}
      <div className="flex items-baseline gap-2">
        <h1 className="text-xl font-semibold text-text-primary">All Items</h1>
        <span className="text-sm text-text-secondary">47 unread</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* View Toggle */}
        <div className="flex overflow-hidden rounded-md border border-border cursor-pointer">
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

        {/* Sort */}
        <button className="flex items-center gap-2 rounded-md border border-border px-2 py-1 text-sm cursor-pointer">
          <ArrowDownUp className="h-4 w-4" />
          Newest
        </button>

        {/* Refresh */}
        <button className="flex items-center gap-2 rounded-md border border-border px-2 py-1  text-sm cursor-pointer">
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>

        {/* Mark all */}
        <button className="rounded-md border border-border px-2 py-1 text-sm cursor-pointer">
          Mark all read
        </button>
      </div>
    </header>
  );
}
