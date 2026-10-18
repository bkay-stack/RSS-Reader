"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, FileText, CheckCircle2 } from "lucide-react";
import Logo from "@/components/branding/logo";
import { getCategoryDot } from "@/lib/getCategoryColor";
import { formatCount } from "@/lib/formatCount";
import type { SidebarData } from "./getSidebarData";

export default function MobileSidebarDrawer({ data }: { data: SidebarData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger — only visible below md: */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded hover:bg-accent-subtle"
        aria-label="Open navigation menu">
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-bg-secondary border-r border-border z-50 transform transition-transform md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <Logo />
          <button onClick={() => setIsOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded text-sm text-text-secondary hover:bg-accent-subtle">
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  All Items
                </span>
                <span className="text-xs text-text-tertiary">
                  {formatCount(data.totalUnread)}
                </span>
              </Link>
            </li>
          </ul>

          <p className="px-3 mt-6 mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Categories
          </p>
          <ul className="flex flex-col gap-1">
            {data.categories.map(({ id, name, unread }) => (
              <li key={id}>
                <Link
                  href={`/dashboard?category=${id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded text-sm text-text-secondary hover:bg-accent-subtle">
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getCategoryDot(name)}`}
                    />
                    {name}
                  </span>
                  <span className="text-xs text-text-tertiary">{formatCount(unread)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-border text-xs text-text-secondary font-bold">
          <CheckCircle2 size={14} className="text-success" />
          All feeds healthy
        </div>
      </aside>
    </>
  );
}
