// Search Input
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const SEARCH_PATH = "/dashboard/search";
const DEBOUNCE_MS = 300;

export default function SearchInput({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [value, setValue] = useState(urlQuery);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // URL -> input (Back button, leaving the search page), but never while typing
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setValue(urlQuery);
  }, [urlQuery]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function go(raw: string) {
    const q = raw.trim();
    if (q.length === 1) return;
    if (q === urlQuery) return;

    const onSearchPage = pathname === SEARCH_PATH;
    const params = new URLSearchParams(
      onSearchPage ? searchParams.toString() : "",
    );
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("page");

    const qs = params.toString();
    const url = qs ? `${SEARCH_PATH}?${qs}` : SEARCH_PATH;

    startTransition(() => {
      if (onSearchPage) router.replace(url);
      else router.push(url);
    });
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => go(next), DEBOUNCE_MS);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearTimeout(timer.current);
    go(value);
  }

  return (
    <form
      action={SEARCH_PATH}
      onSubmit={onSubmit}
      className={`flex items-center gap-2 rounded border border-border px-3 py-1.5 text-sm text-text-tertiary focus-within:border-accent focus-within:text-text-primary transition-colors ${className}`}>
      <Search size={16} className="shrink-0" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={onChange}
        maxLength={100}
        placeholder="Search articles..."
        aria-busy={pending}
        className="bg-transparent outline-none placeholder:text-text-tertiary text-text-primary w-40"
      />
    </form>
  );
}
