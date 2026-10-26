"use client";

import { RefreshCw } from "lucide-react";
import { useRefreshFeeds } from "@/components/dashboard/feed/useRefreshFeeds";
import type { RefreshResult } from "@/lib/feed/refreshFeeds";

function getErrorMessage(isError: boolean, data?: RefreshResult) {
  if (data && "error" in data) return data.error;
  if (isError) return "Couldn't refresh. Try again.";
  return "";
}

function getStatusMessage(data?: RefreshResult) {
  if (data && "newCount" in data && data.newCount > 0) {
    return `${data.newCount} new posts loaded.`;
  }
  return "";
}

export default function RefreshButton() {
  const { mutate, isPending, isError, data } = useRefreshFeeds();

  function handleClick() {
    mutate();
  }

  const errorMessage = getErrorMessage(isError, data);

  return (
    <>
      <span role="status" className="sr-only">
        {getStatusMessage(data)}
      </span>
      {errorMessage && (
        <span role="alert" className="text-xs text-error">
          {errorMessage}
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label="Refresh posts"
        className="rounded-md border border-border bg-surface px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50">
        <RefreshCw size={16} className={isPending ? "animate-spin" : ""} />
      </button>
    </>
  );
}
