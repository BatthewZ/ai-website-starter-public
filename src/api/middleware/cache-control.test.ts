import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import type { AppEnv } from "../env";
import { cacheControl } from "./cache-control";

describe("cacheControl", () => {
  it("sets Cache-Control header on successful GET responses", async () => {
    const app = new Hono<AppEnv>();
    app.use("*", cacheControl(300));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test");

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, max-age=300");
  });

  it("does not set Cache-Control on POST requests", async () => {
    const app = new Hono<AppEnv>();
    app.use("*", cacheControl(300));
    app.post("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test", { method: "POST" });

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBeNull();
  });

  it("does not set Cache-Control on error GET responses", async () => {
    const app = new Hono<AppEnv>();
    app.use("*", cacheControl(300));
    app.get("/not-found", (c) => c.json({ error: "Not Found" }, 404));

    const res = await app.request("/not-found");

    expect(res.status).toBe(404);
    expect(res.headers.get("Cache-Control")).toBeNull();
  });

  it("uses the provided maxAge value", async () => {
    const app = new Hono<AppEnv>();
    app.use("*", cacheControl(3600));
    app.get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test");

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, max-age=3600");
  });
});
