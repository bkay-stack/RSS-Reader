"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Code2,
  Palette,
  Server,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { applyOnboardingSelection } from "@/lib/onboarding/applySelection";
import feedsData from "@/data/sample-feeds.json";

// Connects a category NAME (from your JSON) to an icon.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Frontend: Code2,
  Design: Palette,
  "Backend & DevOps": Server,
  "General Tech": Newspaper,
  "AI & ML": Sparkles,
};
const DEFAULT_ICON = Newspaper; // used if a category name has no match above

const CATEGORY_NAMES = feedsData.categories.map((c) => c.name);

export default function CategoryPicker() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    const result = await applyOnboardingSelection(selected);
    setSubmitting(false);
    setFailed(result.failed);
    if (result.failed.length === 0) {
      router.push("/onboarding/step-2");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_NAMES.map((name) => {
          const Icon = CATEGORY_ICONS[name] ?? DEFAULT_ICON;
          const isChecked = selected.includes(name);

          return (
            <div key={name}>
              <input
                type="checkbox"
                id={name}
                checked={isChecked}
                onChange={() => toggle(name)}
                className="peer sr-only"
              />
              <label
                htmlFor={name}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm cursor-pointer transition-colors peer-checked:bg-accent-subtle peer-checked:border-accent peer-checked:text-accent">
                <Icon size={16} />
                {name}
              </label>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || selected.length === 0}
        className="mt-auto mb-6 flex h-11 items-center justify-center rounded bg-accent px-4 text-white lg:mt-8 lg:mb-0 lg:self-start">
        {submitting ? "Setting up..." : "Continue"}
      </button>

      {failed.length > 0 && (
        <p>{`Couldn't add: ${failed.join(", ")}. You can retry from Settings.`}</p>
      )}
    </div>
  );
}
