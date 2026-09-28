import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatRelativeTime } from "./formatRelativeTime";

// Freeze the clock so "now" is the same every time the tests run
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-28T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("formatRelativeTime", () => {
  it("returns empty text when there is no date", () => {
    expect(formatRelativeTime(null)).toBe("");
  });

  it("says 'just now' for under a minute", () => {
    expect(formatRelativeTime("2026-09-28T11:59:30Z")).toBe("just now");
  });

  it("shows minutes", () => {
    expect(formatRelativeTime("2026-09-28T11:55:00Z")).toBe("5m ago");
  });

  it("shows hours", () => {
    expect(formatRelativeTime("2026-09-28T09:00:00Z")).toBe("3h ago");
  });

  it("shows days", () => {
    expect(formatRelativeTime("2026-09-26T12:00:00Z")).toBe("2d ago");
  });

  it("shows the date after a week", () => {
    expect(formatRelativeTime("2026-09-18T12:00:00Z")).toBe("Sep 18");
  });
});
