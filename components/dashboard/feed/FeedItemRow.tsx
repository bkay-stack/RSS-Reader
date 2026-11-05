"use client";

import { startTransition, useOptimistic } from "react";
import { setItemRead } from "@/lib/feed/readState";
import type { FeedView } from "./feedView";

type FeedItemRowProps = {
  itemId: string;
  url: string;
  isRead: boolean;
  view: FeedView;
  children: React.ReactNode;
};

// One entry per view, so each layout's look lives in one place.
const articleClasses: Record<FeedView, string> = {
  list: "flex border-b border-border hover:bg-bg-secondary transition-colors",
  compact:
    "flex border-b border-border hover:bg-bg-secondary transition-colors",
  card: "flex min-w-0 rounded-lg border border-border hover:bg-bg-secondary transition-colors",
};

const dotClasses: Record<FeedView, string> = {
  list: "items-start pt-5 sm:pt-6",
  compact: "items-center",
  card: "items-start pt-5 sm:pt-6",
};

const linkClasses: Record<FeedView, string> = {
  list: "items-start gap-2 sm:gap-3 py-3 sm:py-4",
  compact: "items-center gap-2 sm:gap-3 py-2 sm:py-2.5",
  card: "items-start gap-2 sm:gap-3 py-3 sm:py-4",
};

// Wraps a feed item: the read/unread dot plus the link. The content comes in as children.
export default function FeedItemRow({
  itemId,
  url,
  isRead,
  view,
  children,
}: FeedItemRowProps) {
  // Shows the new value right away, while the server saves it.
  const [shownIsRead, setShownIsRead] = useOptimistic(isRead);

  function saveRead(next: boolean) {
    startTransition(async () => {
      setShownIsRead(next);
      await setItemRead(itemId, next);
    });
  }

  // Opening the article (click or middle-click) marks it read.
  function handleOpen(e: React.MouseEvent) {
    if (e.button > 1) return; // ignore right-click
    if (!shownIsRead) saveRead(true);
  }

  const toggleLabel = shownIsRead ? "Mark as unread" : "Mark as read";

  return (
    <article className={articleClasses[view]}>
      {/* Zone 1: the dot is a button that flips read/unread */}
      <button
        type="button"
        onClick={() => saveRead(!shownIsRead)}
        aria-label={toggleLabel}
        title={toggleLabel}
        className={`group flex shrink-0 pl-3 pr-2 sm:pl-6 sm:pr-3 focus-visible:outline-2 focus-visible:outline-accent ${dotClasses[view]}`}>
        <span
          className={`block w-2 h-2 rounded-full transition ${
            shownIsRead
              ? "border border-text-tertiary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              : "bg-accent"
          }`}
        />
      </button>

      {/* Zones 2 + 3: the link, dimmed once read */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOpen}
        onAuxClick={handleOpen}
        className={`flex flex-1 min-w-0 pr-3 sm:pr-6 transition-opacity duration-300 ${linkClasses[view]} ${
          shownIsRead ? "opacity-60" : ""
        }`}>
        {children}
      </a>
    </article>
  );
}
