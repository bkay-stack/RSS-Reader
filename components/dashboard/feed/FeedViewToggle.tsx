"use client";

import { List, LayoutGrid, AlignJustify } from "lucide-react";

import ViewButton from "./ViewButton";
import type { FeedView } from "./feedView";

type FeedViewToggleProps = {
  view: FeedView;
  onViewChange: (view: FeedView) => void;
};

export default function FeedViewToggle({
  view,
  onViewChange,
}: FeedViewToggleProps) {
  return (
    <div className="hidden sm:flex overflow-hidden rounded-md border border-border divide-x divide-border">
      <ViewButton
        view="list"
        label="List view"
        isActive={view === "list"}
        onSelect={onViewChange}>
        <List className="h-4 w-4" />
      </ViewButton>

      <ViewButton
        view="card"
        label="Card view"
        isActive={view === "card"}
        onSelect={onViewChange}>
        <LayoutGrid className="h-4 w-4" />
      </ViewButton>

      <ViewButton
        view="compact"
        label="Compact view"
        isActive={view === "compact"}
        onSelect={onViewChange}>
        <AlignJustify className="h-4 w-4" />
      </ViewButton>
    </div>
  );
}
