import { describe, it, expect, vi } from "vitest";
import { stopWatch } from "../stopwatch";

describe("stopWatch", () => {
  it("should measure elapsed time", () => {
    const sw = stopWatch();
    sw.start();
    // Simulate 100ms elapsed
    const now = new Date().getTime();
    vi.spyOn(global, "Date").mockImplementation(
      () =>
        ({
          getTime: () => now + 100,
        } as Date)
    );
    expect(sw.stop()).toBe(100);
    vi.restoreAllMocks();
  });

  it("should return 0 if stopped immediately after start", () => {
    const sw = stopWatch();
    sw.start();
    expect(sw.stop()).toBeGreaterThanOrEqual(0);
  });
});
