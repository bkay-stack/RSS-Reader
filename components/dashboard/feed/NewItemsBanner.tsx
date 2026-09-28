"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";
import { countNewSince, loadNewItems, recordVisit } from "@/lib/feed/lastVisit";

export type NewItemsBannerProps = {
  count: number; // articles that arrived since the user's last visit
  loadedAt: string; // when the server built the list on screen
};

// Show the loading state for at least this long, even if loading is faster.
const MIN_LOADING_MS = 4000;

// How often to check for articles that arrive while the page is open.
const CHECK_EVERY_MS = 5 * 60 * 1000;

export default function NewItemsBanner({
  count,
  loadedAt,
}: NewItemsBannerProps) {
  // The count from when the page opened. Later page refreshes don't change it.
  const [newCount, setNewCount] = useState(count);
  // Articles that arrived after the list on screen was built.
  const [liveCount, setLiveCount] = useState(0);
  const [listLoadedAt, setListLoadedAt] = useState(loadedAt);
  const [isLoading, startTransition] = useTransition();
  const bannerRef = useRef<HTMLButtonElement>(null);

  // A fresh list from the server already includes those articles: count from zero.
  if (loadedAt !== listLoadedAt) {
    setListLoadedAt(loadedAt);
    setLiveCount(0);
  }

  // This visit becomes the "last visit" that the next count starts from.
  useEffect(() => {
    recordVisit();
  }, []);

  // Every few minutes, ask the server if anything new arrived (skips hidden tabs).
  useEffect(() => {
    const timer = setInterval(async () => {
      if (document.hidden) return;
      setLiveCount(await countNewSince(loadedAt));
    }, CHECK_EVERY_MS);
    return () => clearInterval(timer);
  }, [loadedAt]);

  const total = newCount + liveCount;

  // Load the latest articles, then scroll up to them and hide the banner.
  function showNewItems() {
    startTransition(async () => {
      await Promise.all([
        loadNewItems(),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
      ]);

      const main = bannerRef.current?.closest("main");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      main?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      main
        ?.querySelector<HTMLElement>("article a")
        ?.focus({ preventScroll: true });
      setNewCount(0);
      setLiveCount(0);
    });
  }

  return (
    // Always on the page, so screen readers hear the pill when it appears.
    <div role="status" className="sticky top-0 z-10">
      {total > 0 && (
        <button
          ref={bannerRef}
          type="button"
          onClick={showNewItems}
          disabled={isLoading}
          aria-busy={isLoading}
          className="flex items-center justify-center gap-2 w-full py-2 text-sm text-accent bg-accent-subtle hover:bg-accent-subtle/80 cursor-pointer disabled:cursor-wait">
          {isLoading ? (
            <>
              <LoaderCircle
                size={16}
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
              Loading new items…
            </>
          ) : (
            <>
              <ArrowUp size={16} aria-hidden="true" />
              {total} new item{total !== 1 ? "s" : ""} since your last visit
            </>
          )}
        </button>
      )}
    </div>
  );
}
