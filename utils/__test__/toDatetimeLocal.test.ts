import { describe, it, expect } from "vitest";
import { toDatetimeLocal } from "../toDatetimeLocal";

describe("toDatetimeLocal", () => {
  it("formats a Date object correctly", () => {
    const date = new Date("2025-09-22T08:05:03");
    expect(toDatetimeLocal(date)).toBe("2025-09-22T08:05");
  });

  it("formats a date string correctly", () => {
    expect(toDatetimeLocal("2025-09-22T08:05:03")).toBe("2025-09-22T08:05");
  });

  it("returns empty string for empty input", () => {
    expect(toDatetimeLocal("")).toBe("");
  });

  it("pads single digit month, day, hour, and minute", () => {
    expect(toDatetimeLocal("2025-01-02T03:04:00")).toBe("2025-01-02T03:04");
  });
});
