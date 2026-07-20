import { describe, expect, test } from "bun:test";

import { rateLimit } from "./rate-limit";

let counter = 0;
function uniqueKey() {
  counter++;
  return `test-key-${counter}`;
}

describe("rateLimit", () => {
  test("allows requests within the limit", () => {
    const key = uniqueKey();
    expect(rateLimit(key, 3, 10_000)).toBe(true);
    expect(rateLimit(key, 3, 10_000)).toBe(true);
    expect(rateLimit(key, 3, 10_000)).toBe(true);
  });

  test("blocks requests exceeding the limit", () => {
    const key = uniqueKey();
    expect(rateLimit(key, 2, 10_000)).toBe(true);
    expect(rateLimit(key, 2, 10_000)).toBe(true);
    expect(rateLimit(key, 2, 10_000)).toBe(false);
  });

  test("resets after the window expires", () => {
    const key = uniqueKey();
    expect(rateLimit(key, 1, 10_000)).toBe(true);
    expect(rateLimit(key, 1, 10_000)).toBe(false);
  });

  test("different keys have independent counters", () => {
    expect(rateLimit(uniqueKey(), 1, 10_000)).toBe(true);
    expect(rateLimit(uniqueKey(), 1, 10_000)).toBe(true);
  });
});
