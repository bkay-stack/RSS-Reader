"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";

export function GuestBanner({ pendingEmail }: { pendingEmail?: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Save your account"
      className="relative flex flex-wrap items-center justify-center gap-3 px-12 py-3 bg-accent-subtle border-b border-border text-sm text-center">
      <p className="text-text-secondary">
        You&apos;re browsing as a guest. Sign up to keep your data, add your own
        feeds, and sync across devices.
      </p>

      {pendingEmail ? (
        <p role="status" className="text-text-primary font-medium">
          Confirmation sent to {pendingEmail}. Check your email.
        </p>
      ) : (
        <Link
          href="/auth/sign-up"
          className="px-4 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white font-semibold">
          Create account
        </Link>
      )}

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary">
        <X size={16} aria-hidden="true" />
      </button>
    </aside>
  );
}
