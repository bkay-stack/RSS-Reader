import { describe, it, expect } from "vitest";
import { sanitizeUrl } from "./sanitizeUrl";

describe("sanitizeUrl", () => {
  it("keeps a normal https link", () => {
    expect(sanitizeUrl("https://example.com/post")).toBe(
      "https://example.com/post",
    );
  });

  it("completes a relative link using the site URL", () => {
    expect(sanitizeUrl("/posts/1", "https://blog.com")).toBe(
      "https://blog.com/posts/1",
    );
  });

  it("blocks javascript: links", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });

  it("returns empty text for an empty link", () => {
    expect(sanitizeUrl("")).toBe("");
  });
});
