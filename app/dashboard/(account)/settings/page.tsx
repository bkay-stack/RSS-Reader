"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cloud,
  Database,
  FolderCog,
  Import,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  RefreshCw,
  Rss,
  Settings2,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import Link from "next/link";

type Theme = "system" | "light" | "dark";
type SyncInterval = "15" | "30" | "60" | "manual";

type SettingsSectionProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
};

type SettingSwitchProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

type SettingRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  trailing?: ReactNode;
};

/* ---------- Shared styles (colors read CSS variables directly) ---------- */

const cardStyles =
  "overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]";

const pressable =
  "transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60";

const btnPrimary = `${pressable} ${focusRing} bg-[color:var(--color-accent)] text-white shadow-sm hover:bg-[color:var(--color-accent-hover)] hover:shadow-md`;

const btnSecondary = `${pressable} ${focusRing} border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)] shadow-sm hover:bg-[color:var(--color-bg-secondary)] hover:shadow-md`;

const btnDanger = `${pressable} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-error)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)] border border-[color:var(--color-error)] bg-[color:var(--color-surface)] text-[color:var(--color-error)] hover:bg-[color:var(--color-bg-secondary)]`;

/* ---------- Small components ---------- */

function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-accent">{icon}</span>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {title}
        </h2>
      </div>

      <div className={cardStyles}>{children}</div>
    </section>
  );
}

function SettingSwitch({
  title,
  description,
  checked,
  onChange,
}: SettingSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="mt-1 text-xs text-text-secondary">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent ${pressable} ${focusRing} ${
          checked ? "bg-accent" : "bg-text-tertiary"
        }`}>
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  onClick,
  trailing,
}: SettingRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-bg-secondary ${focusRing}`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary text-text-secondary">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          <p className="mt-1 text-xs text-text-secondary">{description}</p>
        </div>
      </div>

      {trailing ?? (
        <ChevronRight className="h-5 w-5 shrink-0 text-text-tertiary transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

/* ---------- Page ---------- */

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const [markAsRead, setMarkAsRead] = useState(true);
  const [showExcerpts, setShowExcerpts] = useState(true);
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const [syncInterval, setSyncInterval] = useState<SyncInterval>("30");

  const [dailyDigest, setDailyDigest] = useState(true);
  const [breakingUpdates, setBreakingUpdates] = useState(false);
  const [digestTime, setDigestTime] = useState("08:30");

  const [isSyncing, setIsSyncing] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast("");
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  function notify(message: string) {
    setToast(message);
  }

  function handleThemeChange(value: Theme) {
    setTheme(value);
    notify(`${value.charAt(0).toUpperCase()}${value.slice(1)} theme selected`);
  }

  function handleFontSizeChange(value: number) {
    setFontSize(value);
  }

  function handleSync() {
    setIsSyncing(true);
    notify("Sync integration is not connected yet");

    window.setTimeout(() => {
      setIsSyncing(false);
    }, 900);
  }

  function handleClearCache() {
    setCacheCleared(true);
    notify("Cache clearing needs to be connected");
  }

  function handleSignOut() {
    const confirmed = window.confirm("Are you sure you want to sign out?");

    if (!confirmed) return;

    notify("Connect your Supabase sign-out action here");
  }

  const intervalLabels: Record<SyncInterval, string> = {
    "15": "Every 15 minutes",
    "30": "Every 30 minutes",
    "60": "Every 1 hour",
    manual: "Manual only",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className={`rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary ${focusRing}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-xl font-semibold text-text-primary">
              Settings
            </h1>
            <p className="text-sm text-text-secondary">
              Customize your reading experience.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/profile"
          aria-label="Profile"
          className={`flex h-9 w-9 items-center justify-center rounded-full ${btnPrimary}`}>
          <UserRound className="h-4 w-4" />
        </Link>
      </header>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-text-primary px-4 py-2 text-sm text-surface shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-success" />
          {toast}
        </div>
      )}

      {/* Sync status */}
      <section
        className={`${cardStyles} flex items-center justify-between gap-3 p-4`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
            <Cloud className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-text-primary">
              Cloud sync
            </p>
            <p className="text-xs text-text-secondary">
              Sync status will appear here
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${btnPrimary}`}>
          <RefreshCw
            className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Syncing..." : "Sync"}
        </button>
      </section>

      {/* 1. Reading Experience */}
      <SettingsSection
        title="Reading Experience"
        icon={<BookOpen className="h-4 w-4" />}>
        {/* Theme */}
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-text-primary">Theme</p>
            <span className="text-xs text-text-secondary">
              Display preference
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-lg bg-bg-tertiary p-1">
            {(
              [
                { value: "system", label: "System", icon: Settings2 },
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
              ] as const
            ).map((option) => {
              const Icon = option.icon;
              const isActive = mounted && theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleThemeChange(option.value)}
                  className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-semibold ${pressable} ${focusRing} ${
                    isActive
                      ? "bg-accent text-white shadow-md"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary hover:shadow-sm"
                  }`}>
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* Font size */}
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">Font Size</p>
            <span className="rounded bg-accent-subtle px-2 py-1 text-xs font-medium text-accent">
              {fontSize}px Regular
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-secondary">A-</span>

            <input
              type="range"
              min="12"
              max="20"
              step="1"
              value={fontSize}
              onChange={(event) =>
                handleFontSizeChange(Number(event.target.value))
              }
              aria-label="Font size"
              className={`h-1.5 w-full cursor-pointer accent-accent ${focusRing}`}
            />

            <span className="text-lg font-bold text-text-secondary">A+</span>
          </div>

          <div
            className="rounded-lg bg-bg-secondary p-3 text-text-primary"
            style={{ fontSize: `${fontSize}px` }}>
            Quick brown fox skips over long RSS feeds effortlessly.
          </div>
        </div>

        <Divider />

        <SettingSwitch
          title="Mark as read on scroll"
          description="Automatically mark articles as read when scrolling past them"
          checked={markAsRead}
          onChange={setMarkAsRead}
        />

        <Divider />

        <SettingSwitch
          title="Show article excerpts"
          description="Include content previews in the article list"
          checked={showExcerpts}
          onChange={setShowExcerpts}
        />

        <Divider />

        <SettingSwitch
          title="Open original link in new tab"
          description="Open external articles in a separate browser tab"
          checked={openInNewTab}
          onChange={setOpenInNewTab}
        />
      </SettingsSection>

      {/* 2. Feeds & Sync */}
      <SettingsSection title="Feeds & Sync" icon={<Rss className="h-4 w-4" />}>
        <SettingRow
          icon={<FolderCog className="h-4 w-4" />}
          title="Feed Management"
          description="Manage your subscribed feeds and categories"
          onClick={() => notify("Feed management")}
        />

        <Divider />

        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-tertiary text-text-secondary">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-text-primary">
                Sync & Polling Interval
              </p>
              <p className="text-xs text-text-secondary">
                {intervalLabels[syncInterval]}
              </p>
            </div>
          </div>

          <select
            value={syncInterval}
            onChange={(event) =>
              setSyncInterval(event.target.value as SyncInterval)
            }
            aria-label="Sync polling interval"
            className={`max-w-32 cursor-pointer rounded-lg px-2 py-2 text-xs font-medium ${btnSecondary}`}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <Divider />

        <SettingRow
          icon={<Import className="h-4 w-4" />}
          title="OPML Import / Export"
          description="Import or back up your feed subscriptions"
          onClick={() => notify("Connect your OPML workflow here")}
        />

        <Divider />

        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-tertiary text-text-secondary">
              <Database className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-text-primary">
                Offline Reading Cache
              </p>
              <p className="text-xs text-text-secondary">
                {cacheCleared
                  ? "Cache status unavailable"
                  : "Local storage usage"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearCache}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${btnSecondary}`}>
            Clear cache
          </button>
        </div>
      </SettingsSection>

      {/* 3. Notifications & Digest */}
      <SettingsSection
        title="Notifications & Digest"
        icon={<Mail className="h-4 w-4" />}>
        <SettingSwitch
          title="Daily Digest Notification"
          description="Receive a daily summary of new articles"
          checked={dailyDigest}
          onChange={setDailyDigest}
        />

        <Divider />

        <div className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">
              Digest delivery time
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Choose when you receive your daily digest
            </p>
          </div>

          <input
            type="time"
            value={digestTime}
            onChange={(event) => setDigestTime(event.target.value)}
            aria-label="Digest delivery time"
            className={`rounded-lg px-2 py-2 text-sm ${btnSecondary}`}
          />
        </div>

        <Divider />

        <SettingSwitch
          title="Breaking Updates from Starred Feeds"
          description="Receive alerts from your favorite feeds"
          checked={breakingUpdates}
          onChange={setBreakingUpdates}
        />
      </SettingsSection>

      {/* 4. Account & Security */}
      <SettingsSection
        title="Account & Security"
        icon={<ShieldCheck className="h-4 w-4" />}>
        <SettingRow
          icon={<AtSign className="h-4 w-4" />}
          title="Email Address"
          description="Manage your account email"
          onClick={() => notify("Connect email management here")}
        />

        <Divider />

        <SettingRow
          icon={<LockKeyhole className="h-4 w-4" />}
          title="Change Password"
          description="Manage your account password"
          onClick={() => notify("Connect your password reset flow here")}
        />

        <Divider />

        <div className="p-4">
          <button
            type="button"
            onClick={handleSignOut}
            className={`flex w-full items-center justify-between rounded-lg p-3 text-left ${btnDanger}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-tertiary">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold">Sign Out</span>
            </div>

            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
