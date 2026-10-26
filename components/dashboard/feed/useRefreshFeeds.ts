"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { refreshFeeds, type RefreshResult } from "@/lib/feed/refreshFeeds";

export function useRefreshFeeds() {
  const router = useRouter();

  function handleSuccess(result: RefreshResult) {
    if ("error" in result) return;
    if (result.newCount === 0) return;
    router.refresh();
  }

  return useMutation({
    mutationFn: refreshFeeds,
    onSuccess: handleSuccess,
  });
}
