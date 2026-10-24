"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAsGuest } from "@/lib/supabase/auth.service";
import { seedGuestFeeds } from "@/lib/guest/seedGuestFeeds";

export function TryAsGuestButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);

    const { error } = await signInAsGuest();

    if (error) {
      setError(error);
      setPending(false);
      return;
    }

    const { failed } = await seedGuestFeeds();
    if (failed.length) {
      setError("Couldn't load the sample feeds. Please try again.");
      setPending(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 w-full md:w-auto">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={`${className ?? ""} disabled:opacity-60 disabled:cursor-not-allowed`}>
        {pending ? "Loading..." : "Try as Guest"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
