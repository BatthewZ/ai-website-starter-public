import { Hono } from "hono";
import { describe, expect, it, vi } from "vitest";

vi.mock("../lib/auth", () => ({
  createAuth: vi.fn(),
}));

import { createAuth } from "../lib/auth";
import { authSessionMiddleware } from "./auth";

const mockCreateAuth = vi.mocked(createAuth);

function createApp() {
  const app = new Hono();

  app.use("*", authSessionMiddleware as never);
  app.get("/test", (c) => {
    const user = c.get("user" as never);
    const session = c.get("session" as never);
    return c.json({ user, session });
  });

  return app;
}

describe("authSessionMiddleware", () => {
  it("sets user and session when getSession returns a session", async () => {
    const fakeUser = { id: "1", email: "test@example.com", name: "Test" };
    const fakeSession = { id: "s1", expiresAt: new Date() };

    mockCreateAuth.mockReturnValue({
      api: {
        getSession: vi.fn().mockResolvedValue({
          user: fakeUser,
          session: fakeSession,
        }),
      },
    } as never);

    const app = createApp();
    const res = await app.request("/test");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user).toEqual(fakeUser);
    expect(body.session).toMatchObject({ id: "s1" });
  });

  it("sets user and session to null when getSession returns null", async () => {
    mockCreateAuth.mockReturnValue({
      api: {
        getSession: vi.fn().mockResolvedValue(null),
      },
    } as never);

    const app = createApp();
    const res = await app.request("/test");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user).toBeNull();
    expect(body.session).toBeNull();
  });

  it("calls next() in both cases — handler is always reached", async () => {
    mockCreateAuth.mockReturnValue({
      api: {
        getSession: vi.fn().mockResolvedValue(null),
      },
    } as never);

    const app = createApp();
    const res = await app.request("/test");

    // If next() wasn't called, we'd get a 404
    expect(res.status).toBe(200);
  });
});
