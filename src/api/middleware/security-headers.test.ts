import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import { requestIdMiddleware } from "./request-id";
import { securityHeadersMiddleware } from "./security-headers";

describe("securityHeadersMiddleware", () => {
  const app = new Hono();
  app.use("*", securityHeadersMiddleware);
  app.get("/test", (c) => c.json({ ok: true }));

  it("sets X-Content-Type-Options to nosniff", async () => {
    const res = await app.request("/test");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("sets X-Frame-Options to DENY", async () => {
    const res = await app.request("/test");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });

  it("sets Referrer-Policy", async () => {
    const res = await app.request("/test");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("sets Permissions-Policy", async () => {
    const res = await app.request("/test");
    expect(res.headers.get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=()");
  });

  it("sets X-XSS-Protection to 0", async () => {
    const res = await app.request("/test");
    expect(res.headers.get("X-XSS-Protection")).toBe("0");
  });

  it("sets Content-Security-Policy header", async () => {
    const res = await app.request("/test");
    const csp = res.headers.get("Content-Security-Policy");
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("includes all security headers together", async () => {
    const res = await app.request("/test");
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(res.headers.get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=()");
    expect(res.headers.get("X-XSS-Protection")).toBe("0");
    expect(res.headers.get("Content-Security-Policy")).toContain("default-src 'self'");
  });
});

describe("requestIdMiddleware", () => {
  const app = new Hono();
  app.use("*", requestIdMiddleware);
  app.get("/test", (c) => c.json({ requestId: c.get("requestId") }));

  it("generates a request ID and returns it in X-Request-Id header", async () => {
    const res = await app.request("/test");
    const requestId = res.headers.get("X-Request-Id");
    expect(requestId).toBeTruthy();
    expect(requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("makes request ID available on the context", async () => {
    const res = await app.request("/test");
    const body = await res.json();
    const headerRequestId = res.headers.get("X-Request-Id");
    expect(body.requestId).toBe(headerRequestId);
  });

  it("echoes back a client-provided X-Request-Id", async () => {
    const clientRequestId = "client-trace-abc-123";
    const req = new Request("http://localhost/test", {
      headers: { "X-Request-Id": clientRequestId },
    });
    const res = await app.request(req);
    expect(res.headers.get("X-Request-Id")).toBe(clientRequestId);
    const body = await res.json();
    expect(body.requestId).toBe(clientRequestId);
  });

  it("generates unique IDs for different requests", async () => {
    const res1 = await app.request("/test");
    const res2 = await app.request("/test");
    const id1 = res1.headers.get("X-Request-Id");
    const id2 = res2.headers.get("X-Request-Id");
    expect(id1).not.toBe(id2);
  });
});

describe("error handler with request ID", () => {
  it("includes request ID in error responses", async () => {
    const app = new Hono();
    app.use("*", requestIdMiddleware);
    app.onError((err, c) => {
      const requestId = c.get("requestId") ?? "unknown";
      return c.json({ error: "Internal Server Error", requestId }, 500);
    });
    app.get("/error", () => {
      throw new Error("test error");
    });

    const res = await app.request("/error");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal Server Error");
    expect(body.requestId).toBeTruthy();
    expect(body.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });
});
