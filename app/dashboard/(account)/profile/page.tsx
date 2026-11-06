import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Pencil,
  Flame,
  Bookmark,
  History,
  PenLine,
  ChevronRight,
  BadgeCheck,
  ExternalLink,
  ChartNoAxesCombined,
} from "lucide-react";

const weeklyActivity = [
  { day: "M", height: "h-[42px]" },
  { day: "T", height: "h-[56px]" },
  { day: "W", height: "h-[28px]" },
  { day: "T", height: "h-[64px]" },
  { day: "F", height: "h-[48px]" },
  { day: "S", height: "h-[18px]", inactive: true },
  { day: "S", height: "h-[38px]", active: true },
];

const libraryItems = [
  {
    title: "Saved Articles & Bookmarks",
    description: "12 items stored",
    icon: Bookmark,
    href: "/dashboard/bookmarks",
  },
  {
    title: "Reading History",
    description: "Synchronized cross-device",
    icon: History,
    href: "/dashboard/history",
  },
  {
    title: "Personal Highlights & Notes",
    description: "5 snippets logged",
    icon: PenLine,
    href: "/dashboard/highlights",
  },
];

const cardStyles =
  "cursor-pointer rounded-xl border border-border bg-surface shadow-sm transition-all duration-200 hover:border-accent/40 hover:shadow-md";
export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4 sm:p-6">
      {/* Page Header */}
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="rounded-lg p-2 text-text-secondary transition-colors duration-200 hover:bg-bg-tertiary">
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-xl font-semibold text-text-primary">Profile</h1>
          <p className="text-sm text-text-secondary">
            Manage your personal information and reading activity.
          </p>
        </div>
      </header>

      {/* Profile Header */}
      <section className={`${cardStyles} space-y-5 p-5`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-tertiary text-xl font-semibold text-text-primary">
              AT
            </div>

            <button
              type="button"
              aria-label="Change profile photo"
              className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white shadow-sm transition-colors duration-200 hover:bg-accent-hover">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-text-primary">
                Alex Thompson
              </h2>

              <span className="rounded-full bg-accent-subtle px-2 py-1 text-xs font-medium text-accent">
                Pro Reader
              </span>
            </div>

            <p className="mt-1 truncate text-xs text-text-secondary">
              @alexthompson · alex.dev@frontpage.io
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-bg-secondary text-sm font-medium text-text-primary transition-colors duration-200 hover:bg-bg-tertiary">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>
      </section>

      {/* Reading Statistics */}
      <section className={`${cardStyles} p-5`}>
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="flex flex-col items-center px-2 text-center">
            <span className="text-2xl font-semibold text-text-primary">
              142
            </span>
            <span className="mt-1 text-xs text-text-secondary">
              Read this month
            </span>
          </div>

          <div className="flex flex-col items-center px-2 text-center">
            <span className="text-2xl font-semibold text-text-primary">19</span>
            <span className="mt-1 text-xs text-text-secondary">
              Subscribed feeds
            </span>
          </div>

          <div className="flex flex-col items-center px-2 text-center">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-semibold text-text-primary">
                14d
              </span>
              <Flame className="h-4 w-4 text-accent" />
            </div>

            <span className="mt-1 text-xs text-text-secondary">
              Daily streak
            </span>
          </div>
        </div>
      </section>

      {/* Weekly Activity - No Hover Effect */}
      <section className="space-y-5 rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined className="h-5 w-5 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">
              Weekly Rhythm
            </h3>
          </div>

          <span className="text-xs text-text-secondary">Past 7 days</span>
        </div>

        <div className="flex h-24 items-end justify-between px-2 pt-2">
          {weeklyActivity.map((item, index) => (
            <div
              key={`${item.day}-${index}`}
              className="flex w-8 flex-col items-center gap-2">
              <div
                className={`w-full rounded-t-sm ${item.height} ${
                  item.inactive ? "bg-border" : "bg-accent"
                }`}
              />

              <span
                className={`text-xs ${
                  item.active
                    ? "font-semibold text-accent"
                    : "text-text-secondary"
                }`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>

        {/* Top Category */}
        <div className="space-y-2 rounded-lg bg-bg-secondary p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-text-primary">
              Top Category: Frontend & Architecture
            </span>

            <span className="text-xs font-semibold text-accent">46%</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[46%] rounded-full bg-accent" />
          </div>
        </div>
      </section>

      {/* Reading Library */}
      <section className={`${cardStyles} overflow-hidden`}>
        <div className="px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Reading Library
          </h3>
        </div>

        {libraryItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center justify-between border-t border-border px-5 py-4 transition-colors duration-200 hover:bg-bg-secondary">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-subtle text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.title}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-text-tertiary transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          );
        })}
      </section>

      {/* Subscription */}
      <section className={`${cardStyles} space-y-4 p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle text-accent">
              <BadgeCheck className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Frontpage Pro
              </h3>
              <p className="text-xs text-text-secondary">Annual Plan</p>
            </div>
          </div>

          <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
            Active
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <p className="text-xs text-text-secondary">
            Cloud sync and full-text search active
          </p>

          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-accent transition-colors duration-200 hover:text-accent-hover">
            Manage Plan
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </main>
  );
}
