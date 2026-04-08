import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

import { deferWork } from "./defer";

describe("deferWork", () => {
  it("calls the work function in test env (no ExecutionContext)", async () => {
    let called = false;
    const app = new Hono();

    app.get("/test", (c) => {
      deferWork(c as unknown as Parameters<typeof deferWork>[0], async () => {
        called = true;
      });
      return c.json({ ok: true });
    });

    const res = await app.request("/test");
    expect(res.status).toBe(200);

    // Allow the microtask (void promise) to settle
    await new Promise((r) => setTimeout(r, 10));
    expect(called).toBe(true);
  });

  it("does not throw when deferred work throws", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const app = new Hono();

    app.get("/boom", (c) => {
      deferWork(c as unknown as Parameters<typeof deferWork>[0], async () => {
        throw new Error("boom");
      });
      return c.json({ ok: true });
    });

    const res = await app.request("/boom");
    expect(res.status).toBe(200);

    // Allow the microtask (void promise) to settle
    await new Promise((r) => setTimeout(r, 10));

    expect(errorSpy).toHaveBeenCalledWith(
      "[defer] deferred work failed:",
      expect.any(Error),
    );
    expect(errorSpy.mock.calls[0][1].message).toBe("boom");

    errorSpy.mockRestore();
  });
});
