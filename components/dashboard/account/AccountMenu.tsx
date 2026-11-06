"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRound, Settings, LogOut, ChevronDown } from "lucide-react";

export default function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="relative cursor:pointer  hover:bg-surface-secondary">
      {/* Account trigger */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open account menu"
        className="flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-surface-secondary">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border">
          <UserRound className="h-4 w-4 text-text-secondary" />
        </div>

        <ChevronDown
          className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown card */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg">
          {/* Account information */}
          <div className="border-b border-border px-3 py-3">
            <p className="text-sm font-medium text-text-primary">My Account</p>

            <p className="truncate text-xs text-text-secondary">
              user@example.com
            </p>
          </div>

          {/* Menu actions */}
          <div className="space-y-1 py-2">
            <Link
              href="/dashboard/profile"
              onClick={closeMenu}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary">
              <UserRound className="h-4 w-4" />
              Profile
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={closeMenu}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary">
              <Settings className="h-4 w-4" />
              Settings
            </Link>

            <button
              type="button"
              onClick={() => {
                closeMenu();
                // TODO: Connect Supabase signOut()
              }}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-error transition-colors hover:bg-surface-secondary">
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
