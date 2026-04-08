import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import type { AppEnv } from "../env";
import {
  computeCompoundNextCursor,
  computeNextCursor,
  parseCompoundCursor,
  parseCursorDate,
  parseCursorParams,
} from "./pagination";

describe("parseCursorParams", () => {
  const app = new Hono<AppEnv>();
  app.get("/items", (c) => {
    const result = parseCursorParams(c, { defaultLimit: 20, maxLimit: 100 });
    return c.json(result);
  });

  it("returns defaults when no query params are provided", async () => {
    const res = await app.request("/items");
    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.limit).toBe(20);
    expect(body.cursor).toBeUndefined();
  });

  it("uses the provided limit", async () => {
    const res = await app.request("/items?limit=50");
    const body: any = await res.json();
    expect(body.limit).toBe(50);
  });

  it("clamps limit to maxLimit", async () => {
    const res = await app.request("/items?limit=200");
    const body: any = await res.json();
    expect(body.limit).toBe(100);
  });

  it("falls back to defaultLimit when limit is 0", async () => {
    const res = await app.request("/items?limit=0");
    const body: any = await res.json();
    expect(body.limit).toBe(20);
  });

  it("clamps negative limit to minimum of 1", async () => {
    const res = await app.request("/items?limit=-5");
    const body: any = await res.json();
    expect(body.limit).toBe(1);
  });

  it("passes through the cursor query param", async () => {
    const res = await app.request("/items?cursor=abc");
    const body: any = await res.json();
    expect(body.cursor).toBe("abc");
  });
});

describe("parseCursorDate", () => {
  it("returns a Date for a valid ISO string", () => {
    const result = parseCursorDate("2025-01-15T10:30:00.000Z");
    expect(result).toBeInstanceOf(Date);
    expect(result!.toISOString()).toBe("2025-01-15T10:30:00.000Z");
  });

  it("returns null for an invalid string", () => {
    expect(parseCursorDate("not-a-date")).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(parseCursorDate(undefined)).toBeNull();
  });
});

describe("computeNextCursor", () => {
  const items = [
    { id: "1", createdAt: new Date("2025-01-01T00:00:00.000Z") },
    { id: "2", createdAt: new Date("2025-01-02T00:00:00.000Z") },
    { id: "3", createdAt: new Date("2025-01-03T00:00:00.000Z") },
  ];

  it("returns null when items.length < limit (no more pages)", () => {
    const result = computeNextCursor(items, 5, (i) => i.createdAt);
    expect(result).toBeNull();
  });

  it("returns the ISO string of the last item's date when items.length === limit", () => {
    const result = computeNextCursor(items, 3, (i) => i.createdAt);
    expect(result).toBe("2025-01-03T00:00:00.000Z");
  });

  it("handles a string date getter", () => {
    const stringItems = [
      { id: "1", date: "2025-06-01T00:00:00.000Z" },
      { id: "2", date: "2025-06-02T00:00:00.000Z" },
    ];
    const result = computeNextCursor(stringItems, 2, (i) => i.date);
    expect(result).toBe("2025-06-02T00:00:00.000Z");
  });
});

describe("parseCompoundCursor", () => {
  it("parses a compound cursor with date and id", () => {
    const result = parseCompoundCursor("2025-01-15T10:30:00.000Z|abc123");
    expect(result).not.toBeNull();
    expect(result!.date.toISOString()).toBe("2025-01-15T10:30:00.000Z");
    expect(result!.id).toBe("abc123");
  });

  it("parses a simple date without pipe as date-only with empty id", () => {
    const result = parseCompoundCursor("2025-01-15T10:30:00.000Z");
    expect(result).not.toBeNull();
    expect(result!.date.toISOString()).toBe("2025-01-15T10:30:00.000Z");
    expect(result!.id).toBe("");
  });

  it("returns null for an invalid string", () => {
    expect(parseCompoundCursor("garbage")).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(parseCompoundCursor(undefined)).toBeNull();
  });
});

describe("computeCompoundNextCursor", () => {
  const items = [
    { id: "a1", createdAt: new Date("2025-03-01T00:00:00.000Z") },
    { id: "b2", createdAt: new Date("2025-03-02T00:00:00.000Z") },
    { id: "c3", createdAt: new Date("2025-03-03T00:00:00.000Z") },
  ];

  it("returns null when items.length < limit", () => {
    const result = computeCompoundNextCursor(items, 5, (i) => i.createdAt, (i) => i.id);
    expect(result).toBeNull();
  });

  it("returns date|id format when items.length === limit", () => {
    const result = computeCompoundNextCursor(items, 3, (i) => i.createdAt, (i) => i.id);
    expect(result).toBe("2025-03-03T00:00:00.000Z|c3");
  });
});
