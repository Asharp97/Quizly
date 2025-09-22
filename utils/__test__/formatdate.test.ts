import { describe, it, expect } from "vitest";
import { formatDate } from "../formatdate";

describe("formatDate", () => {
  it("formats a typical date string", () => {
    expect(formatDate("2025-09-22T14:05:00")).toBe("22 Sep 2025 02:05 PM");
  });

  it("formats a morning time as AM", () => {
    expect(formatDate("2025-01-02T03:04:00")).toBe("2 Jan 2025 03:04 AM");
  });

  it("formats midnight as 12:xx AM", () => {
    expect(formatDate("2025-01-02T00:15:00")).toBe("2 Jan 2025 12:15 AM");
  });

  it("formats noon as 12:xx PM", () => {
    expect(formatDate("2025-01-02T12:30:00")).toBe("2 Jan 2025 12:30 PM");
  });

  it("pads single digit hours and minutes", () => {
    expect(formatDate("2025-01-02T09:07:00")).toBe("2 Jan 2025 09:07 AM");
  });
});
