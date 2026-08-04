"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Bookmark, CheckCircle2 } from "lucide-react";

const topNav = [
  { href: "/dashboard", label: "All Items", icon: FileText, count: 47 },
  { href: "/dashboard/saved", label: "Saved", icon: Bookmark, count: 12 },
];

// Stub — will come from Supabase `categories` + `feeds` tables (feeds join on category_id)
const categories = [
  {
    id: "frontend",
    name: "Frontend",
    color: "bg-accent",
    count: 14,
    feeds: [
      { id: "css-tricks", name: "CSS-Tricks", count: 3 },
      { id: "smashing-mag", name: "Smashing Magazine", count: 4 },
      { id: "josh-comeau", name: "Josh W. Comeau", count: 2 },
      { id: "kent-c-dodds", name: "Kent C. Dodds", count: 2 },
      { id: "web-dev", name: "web.dev", count: 3 },
    ],
  },
  {
    id: "design",
    name: "Design",
    color: "bg-unread",
    count: 11,
    feeds: [
      { id: "sidebar-io", name: "Sidebar.io", count: 5 },
      { id: "nn-group", name: "Nielsen Norman Group", count: 2 },
      { id: "figma-blog", name: "Figma Blog", count: 2 },
      { id: "ux-collective", name: "UX Collective", count: 2 },
    ],
  },
  {
    id: "backend-devops",
    name: "Backend & DevOps",
    color: "bg-warning",
    count: 9,
    feeds: [
      { id: "cloudflare", name: "Cloudflare Blog", count: 4 },
      { id: "vercel", name: "Vercel Blog", count: 2 },
      { id: "github-blog", name: "The GitHub Blog", count: 3 },
    ],
  },
  {
    id: "general-tech",
    name: "General Tech",
    color: "bg-success",
    count: 6,
    feeds: [
      { id: "pragmatic-engineer", name: "The Pragmatic Engineer", count: 2 },
      { id: "hn-best", name: "Hacker News Best", count: 4 },
    ],
  },
  {
    id: "ai-ml",
    name: "AI & ML",
    color: "bg-error",
    count: 8,
    feeds: [
      { id: "simon-willison", name: "Simon Willison's Weblog", count: 5 },
      { id: "hugging-face", name: "Hugging Face Blog", count: 3 },
    ],
  },
];

export default function DashboardSidebar() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-16 lg:w-sidebar border-r border-border bg-bg-secondary transition-all">
      <nav className="flex-1 overflow-y-auto p-2 lg:p-4">
        <ul className="flex flex-col gap-1">
          {topNav.map(({ href, label, icon: Icon, count }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center justify-between px-3 py-2 rounded text-xs lg:text-sm text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-colors">
                <span className="flex items-center gap-2 font-medium text-text-secondary">
                  <Icon size={16} />
                  <span className="hidden lg:inline">{label}</span>
                </span>
                <span className="hidden lg:inline text-xs text-text-tertiary">
                  {count}
                </span>
              </Link>
            </li>
          ))}

          <div className="border-t border-border w-7/8 mt-(--space-4) mx-auto"></div>
        </ul>

        {/* Categories */}

        <p className="hidden lg:block px-3 mt-6 mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Categories
        </p>
        <ul className="flex flex-col gap-1 mt-6 lg:mt-0">
          {categories.map(({ id, name, color, count, feeds }) => {
            const isOpen = openCategories.has(id);

            return (
              <li key={id}>
                <button
                  onClick={() => toggleCategory(id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-xs lg:text-sm text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-colors">
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${color}`}
                      aria-hidden="true"
                    />
                    <span className="hidden lg:inline">{name}</span>
                  </span>
                  <span className="hidden lg:inline text-xs text-text-tertiary">
                    {count}
                  </span>
                </button>

                {/* Subcategories */}

                {isOpen && (
                  <ul className="hidden lg:flex flex-col gap-0.5 mt-1 ml-6">
                    {feeds.map((feed) => (
                      <li key={feed.id}>
                        <Link
                          href={`/dashboard/feed/${feed.id}`}
                          className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-accent-subtle transition-colors">
                          <span className="truncate">{feed.name}</span>
                          <span className="text-text-tertiary shrink-0 ml-2">
                            {feed.count}
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
