import { describe, expect, it } from "vitest";

import { relativeTime } from "./relative-time";

const NOW = new Date("2026-10-25T12:00:00Z").getTime();
const ago = (seconds: number) => new Date(NOW - seconds * 1000);

describe("relativeTime", () => {
  it("reads 'just now' under a minute", () => {
    expect(relativeTime(ago(0), "en", NOW)).toBe("just now");
    expect(relativeTime(ago(59), "en", NOW)).toBe("just now");
  });

  it("picks the largest whole unit", () => {
    expect(relativeTime(ago(5 * 60), "en", NOW)).toBe("5 minutes ago");
    expect(relativeTime(ago(3 * 3600), "en", NOW)).toBe("3 hours ago");
    expect(relativeTime(ago(24 * 3600), "en", NOW)).toBe("yesterday");
    expect(relativeTime(ago(3 * 24 * 3600), "en", NOW)).toBe("3 days ago");
    expect(relativeTime(ago(14 * 24 * 3600), "en", NOW)).toBe("2 weeks ago");
    expect(relativeTime(ago(400 * 24 * 3600), "en", NOW)).toBe("last year");
  });

  it("formats in the given locale", () => {
    expect(relativeTime(ago(3 * 24 * 3600), "de", NOW)).toBe("vor 3 Tagen");
  });
});
