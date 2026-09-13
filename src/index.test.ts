import { describe, it, expect } from "vitest";

describe("sanity check", () => {
  it("confirms the test harness runs", () => {
    expect(1 + 1).toBe(2);
  });
});