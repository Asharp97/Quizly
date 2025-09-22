import { describe, it, expect } from "vitest";
import { clockFormate } from "../clockFormate";

describe("clockFormate", () => {
  it("formats 0 ms as 00:00:00", () => {
    expect(clockFormate(0)).toBe("00:00:00");
  });

  it("formats 1 second", () => {
    expect(clockFormate(1000)).toBe("00:00:01");
  });

  it("formats 1 minute", () => {
    expect(clockFormate(60000)).toBe("00:01:00");
  });

  it("formats 1 hour", () => {
    expect(clockFormate(3600000)).toBe("01:00:00");
  });

  it("formats 1 hour, 2 minutes, 3 seconds", () => {
    expect(clockFormate(3723000)).toBe("01:02:03");
  });

  it("pads single digit numbers", () => {
    expect(clockFormate(3661000)).toBe("01:01:01");
  });
});
