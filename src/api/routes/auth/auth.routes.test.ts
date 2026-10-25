import { describe, expect, it, vi } from "vitest";

import authRoutes from "./auth.routes";

/**
 * POST /api/auth/send-verification-email mails an address the caller picks,
 * so it has its own, much lower limit than the rest of /auth/*. Requests are
 * counted before Better Auth runs, so the handler's own result (it has no
 * database here) does not matter: only the fourth call's 429 does.
 */
describe("auth routes rate limits", () => {
  it("allows three verification-email requests an hour, then refuses", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const env = {
      BETTER_AUTH_SECRET: "test-secret-at-least-32-characters-long",
      BETTER_AUTH_URL: "http://localhost",
    };
    const send = () =>
      authRoutes.request(
        "/auth/send-verification-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.7" },
          body: JSON.stringify({ email: "a@example.com" }),
        },
        env
      );

    for (let i = 0; i < 3; i++) expect((await send()).status).not.toBe(429);
    const limited = await send();
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get("Retry-After"))).toBeGreaterThan(3000);
  });
});
