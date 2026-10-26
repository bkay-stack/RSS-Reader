"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ reset }: DashboardErrorProps) {
  const router = useRouter();

  function handleRetry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div role="alert" className="p-6 text-sm text-text-secondary">
      <p>Something went wrong loading your feed.</p>
      <button type="button" onClick={handleRetry} className="mt-2 underline">
        Try again
      </button>
    </div>
  );
}
