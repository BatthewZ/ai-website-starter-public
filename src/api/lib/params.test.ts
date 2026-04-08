import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import type { AppEnv } from "../env";
import { requireParam, requireParams } from "./params";

describe("requireParam", () => {
  it("returns the path parameter value when present", async () => {
    const app = new Hono<AppEnv>();
    app.get("/items/:id", (c) => {
      const id = requireParam(c, "id");
      return c.json({ id });
    });

    const res = await app.request("/items/abc");

    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.id).toBe("abc");
  });

  it("throws when the parameter is missing", async () => {
    const app = new Hono<AppEnv>();
    app.get("/test", (c) => {
      const value = requireParam(c, "nonexistent");
      return c.json({ value });
    });
    app.onError((_err, c) => c.json({ error: "Internal Server Error" }, 500));

    const res = await app.request("/test");

    expect(res.status).toBe(500);
  });
});

describe("requireParams", () => {
  it("returns all requested path parameters as a record", async () => {
    const app = new Hono<AppEnv>();
    app.get("/w/:workspaceId/p/:projectId", (c) => {
      const params = requireParams(c, "workspaceId", "projectId");
      return c.json(params);
    });

    const res = await app.request("/w/ws1/p/proj2");

    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.workspaceId).toBe("ws1");
    expect(body.projectId).toBe("proj2");
  });
});
