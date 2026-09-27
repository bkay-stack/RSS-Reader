"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { recordVisit } from "@/lib/feed/lastVisit";

export type NewItemsBannerProps = {
  count: number;
};

export default function NewItemsBanner({ count }: NewItemsBannerProps) {
  // The count from when the page opened. Later page refreshes don't change it.
  const [newCount, setNewCount] = useState(count);
  const bannerRef = useRef<HTMLButtonElement>(null);

  // This visit becomes the "last visit" that the next count starts from.
  useEffect(() => {
    recordVisit();
  }, []);

  // New items are at the top: scroll there, focus the first one, hide the banner.
  function showNewItems() {
    const main = bannerRef.current?.closest("main");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    main?.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    main?.querySelector<HTMLElement>("article a")?.focus({ preventScroll: true });
    setNewCount(0);
  }

  if (newCount <= 0) return null;

  return (
    <button
      ref={bannerRef}
      type="button"
      onClick={showNewItems}
      className="sticky top-0 z-10 flex items-center justify-center gap-2 w-full py-2 text-sm text-accent bg-accent-subtle hover:bg-accent-subtle/80 cursor-pointer">
      <ArrowUp size={16} aria-hidden="true" />
      {newCount} new item{newCount !== 1 ? "s" : ""} since your last visit
    </button>
  );
}
