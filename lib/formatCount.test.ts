import { describe, expect, it } from "vitest";
import { formatCount } from "./formatCount";

describe("formatCount", () => {
  it("shows small counts as they are", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(99)).toBe("99");
  });

  it("caps counts over 99", () => {
    expect(formatCount(100)).toBe("99+");
    expect(formatCount(4363)).toBe("99+");
  });
});
