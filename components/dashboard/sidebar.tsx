"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FileText, CheckCircle2 } from "lucide-react";
import { getCategoryDot } from "@/lib/getCategoryColor";
import type { SidebarData } from "./getSidebarData";

const linkClass =
  "flex items-center justify-between px-3 py-2 rounded text-xs lg:text-sm text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-colors";
const activeClass = "bg-accent-subtle text-text-primary";

export default function DashboardSidebar({ data }: { data: SidebarData }) {
  // The filter in the URL: ?category=… or ?feed=… (neither = All Items).
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const feedId = searchParams.get("feed");
  const isAllItems = !categoryId && !feedId;

  // Categories showing their feeds. Starts with the one in the URL.
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const picked = data.categories.find(
      (c) => c.id === categoryId || c.feeds.some((f) => f.id === feedId),
    );
    return new Set(picked ? [picked.id] : []);
  });

  // Picking a category opens it; clicking it again closes it.
  function toggleCategory(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (id === categoryId && next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <aside className="hidden md:flex flex-col h-full w-16 lg:w-sidebar border-r border-border bg-bg-secondary transition-all">
      <nav className="flex-1 min-h-0 overflow-y-auto p-2 lg:p-4">
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/dashboard"
              aria-current={isAllItems ? "page" : undefined}
              aria-label={`All Items, ${data.totalUnread} unread`}
              className={`${linkClass} ${isAllItems ? activeClass : ""}`}>
              <span className="flex items-center gap-2 font-medium">
                <FileText size={16} />
                <span className="hidden lg:inline">All Items</span>
              </span>
              <span className="hidden lg:inline text-xs text-text-tertiary">
                {data.totalUnread}
              </span>
            </Link>
          </li>

          <div className="border-t border-border w-7/8 mt-(--space-4) mx-auto"></div>
        </ul>

        {/* Categories */}

        <p className="hidden lg:block px-3 mt-6 mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Categories
        </p>
        <ul className="flex flex-col gap-1 mt-6 lg:mt-0">
          {data.categories.map((category) => {
            const isActive = category.id === categoryId;
            const isOpen = openIds.has(category.id);

            return (
              <li key={category.id}>
                <Link
                  href={`/dashboard?category=${category.id}`}
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isOpen}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`${category.name}, ${category.unread} unread`}
                  className={`${linkClass} ${isActive ? activeClass : ""}`}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${getCategoryDot(category.name)}`}
                      aria-hidden="true"
                    />
                    <span className="hidden lg:inline">{category.name}</span>
                  </span>
                  <span className="hidden lg:inline text-xs text-text-tertiary">
                    {category.unread}
                  </span>
                </Link>

                {/* Feeds in this category */}

                {isOpen && (
                  <ul className="hidden lg:flex flex-col gap-0.5 mt-1 ml-6">
                    {category.feeds.map((feed) => (
                      <li key={feed.id}>
                        <Link
                          href={`/dashboard?feed=${feed.id}`}
                          aria-current={feed.id === feedId ? "page" : undefined}
                          className={`flex items-center justify-between px-3 py-1.5 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-colors ${feed.id === feedId ? activeClass : ""}`}>
                          <span className="truncate">{feed.name}</span>
                          <span className="text-text-tertiary shrink-0 ml-2">
                            {feed.unread}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}

          <div className="border-t border-border w-7/8 mt-(--space-4) mx-auto"></div>
        </ul>
      </nav>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-border text-xs text-text-secondary font-bold shrink-0">
        <CheckCircle2 size={14} className="text-success" aria-hidden="true" />
        <span className="hidden lg:inline">All feeds healthy</span>
      </div>
    </aside>
  );
}
