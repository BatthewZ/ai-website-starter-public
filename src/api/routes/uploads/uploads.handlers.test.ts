import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import type { AppEnv } from "../../env";
import { removeAvatar } from "./uploads.handlers";

/**
 * The guard paths of the avatar removal endpoint. They matter because the
 * Settings page calls it from an "are you sure"-free Remove button: it must
 * refuse cleanly (never touch D1) when storage is not bound or nobody is
 * signed in. The D1/R2 happy path needs real bindings and is exercised in the
 * browser against `wrangler dev`.
 */
function appWith(env: Partial<AppEnv["Bindings"]>, user: AppEnv["Variables"]["user"]) {
  const app = new Hono<AppEnv>();
  app.use("/*", async (c, next) => {
    c.set("user", user);
    c.set("session", null);
    await next();
  });
  app.delete("/users/me/avatar", removeAvatar);
  return { app, env };
}

const testUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  emailVerified: true,
  image: "/api/uploads/avatar/user-1/x.png",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

describe("DELETE /users/me/avatar", () => {
  it("returns 503 when the STORAGE binding is missing", async () => {
    const { app, env } = appWith({}, testUser);
    const res = await app.request("/users/me/avatar", { method: "DELETE" }, env);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "File storage is not configured" });
  });

  it("returns 401 when no user is signed in", async () => {
    const storage = {} as R2Bucket;
    const { app, env } = appWith({ STORAGE: storage }, null);
    const res = await app.request("/users/me/avatar", { method: "DELETE" }, env);
    expect(res.status).toBe(401);
  });
});
