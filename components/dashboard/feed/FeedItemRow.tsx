"use client";

import { startTransition, useOptimistic } from "react";
import { setItemRead } from "@/lib/feed/readState";

type FeedItemRowProps = {
  itemId: string;
  url: string;
  isRead: boolean;
  children: React.ReactNode;
};

// Wraps a feed item: the read/unread dot plus the link. The content comes in as children.
export default function FeedItemRow({
  itemId,
  url,
  isRead,
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
    <article className="flex border-b border-border hover:bg-bg-secondary transition-colors">
      {/* Zone 1: the dot is a button that flips read/unread */}
      <button
        type="button"
        onClick={() => saveRead(!shownIsRead)}
        aria-label={toggleLabel}
        title={toggleLabel}
        className="group flex items-start shrink-0 pl-3 pr-2 pt-5 sm:pl-6 sm:pr-3 sm:pt-6 focus-visible:outline-2 focus-visible:outline-accent">
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
        className={`flex flex-1 min-w-0 items-start gap-2 sm:gap-3 py-3 sm:py-4 pr-3 sm:pr-6 transition-opacity duration-300 ${
          shownIsRead ? "opacity-60" : ""
        }`}>
        {children}
      </a>
    </article>
  );
}
