"use client";

import type { ReactNode } from "react";
import type { FeedView } from "./feedView";

type ViewButtonProps = {
  view: FeedView;
  label: string;
  isActive: boolean;
  onSelect: (view: FeedView) => void;
  children: ReactNode;
};

export default function ViewButton({
  view,
  label,
  isActive,
  onSelect,
  children,
}: ViewButtonProps) {
  function handleClick() {
    onSelect(view);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isActive}
      className={`p-2.5 cursor-pointer ${isActive ? "bg-surface-secondary" : ""}`}>
      {children}
    </button>
  );
}
