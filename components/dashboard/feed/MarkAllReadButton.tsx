"use client";

import { useState, useTransition } from "react";
import { markAllRead, type ReadScope } from "@/lib/feed/readState";

type MarkAllReadButtonProps = {
  unreadCount: number;
  scope?: ReadScope; // leave out for "everything"
};

export default function MarkAllReadButton({
  unreadCount,
  scope,
}: MarkAllReadButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  function handleClick() {
    // Bulk action, so ask first.
    if (!window.confirm(`Mark all ${unreadCount} items as read?`)) return;

    setStatus("");
    startTransition(async () => {
      const result = await markAllRead(scope);
      setError(result.error);
      // Screen readers hear that it worked.
      if (!result.error) setStatus("All items marked as read.");
    });
  }

  return (
    <>
      <span role="status" className="sr-only">
        {status}
      </span>
      {error && (
        <span role="alert" className="text-xs text-error">
          {error}
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || unreadCount === 0}
        className="rounded-md border border-border px-2 py-1 text-xs sm:text-sm whitespace-nowrap disabled:opacity-50">
        {isPending ? "Marking…" : "Mark all read"}
      </button>
    </>
  );
}
