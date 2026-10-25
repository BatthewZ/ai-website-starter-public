import { createHash } from "node:crypto";

import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import { requestIdMiddleware } from "./request-id";
import {
  securityHeadersMiddleware,
  spaAssetRequest,
  withSpaSecurityHeaders,
} from "./security-headers";

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

  it("sets Strict-Transport-Security", async () => {
    const res = await app.request("/test");
    expect(res.headers.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains"
    );
  });

  it("includes all security headers together", async () => {
    const res = await app.request("/test");
    expect(res.status).toBe(200);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(res.headers.get("Permissions-Policy")).toBe("camera=(), microphone=(), geolocation=()");
    expect(res.headers.get("X-XSS-Protection")).toBe("0");
    expect(res.headers.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains"
    );
    expect(res.headers.get("Content-Security-Policy")).toContain("default-src 'self'");
  });
});

describe("withSpaSecurityHeaders", () => {
  it("sets all shared security headers on the response", async () => {
    const original = new Response("hello", { status: 200 });
    const wrapped = await withSpaSecurityHeaders(original, "/");

    expect(wrapped.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(wrapped.headers.get("X-Frame-Options")).toBe("DENY");
    expect(wrapped.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(wrapped.headers.get("Permissions-Policy")).toBe(
      "camera=(), microphone=(), geolocation=()"
    );
    expect(wrapped.headers.get("X-XSS-Protection")).toBe("0");
    expect(wrapped.headers.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains"
    );
    expect(wrapped.headers.get("Content-Security-Policy")).toContain("default-src 'self'");
  });

  /**
   * index.html carries r-ui's pre-paint theme script inline. Without its hash
   * in script-src the browser blocks it and every reload flashes the default
   * theme. The hash must be of the exact bytes served, so it is taken from
   * the HTML itself; these pin that, and that nothing wider is allowed.
   */
  const sha256 = (text: string) => createHash("sha256").update(text, "utf8").digest("base64");
  const html = (body: string) =>
    new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });

  it("allows each inline script of the served HTML by its SHA-256 hash, and nothing else", async () => {
    const script = "(function(){document.documentElement.dataset.x='1'})();";
    const page = `<!doctype html><html><head><script>${script}</script></head><body>
      <script type="module" crossorigin src="/assets/index.js"></script></body></html>`;
    const wrapped = await withSpaSecurityHeaders(html(page), "/");
    const csp = wrapped.headers.get("Content-Security-Policy") ?? "";

    expect(csp).toContain(`script-src 'self' 'sha256-${sha256(script)}';`);
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    // The external module script needs no hash ('self' covers it).
    expect(csp.match(/'sha256-/g)).toHaveLength(1);
    expect(await wrapped.text()).toBe(page);
  });

  it("follows the HTML when it changes (a new deploy)", async () => {
    const first = await withSpaSecurityHeaders(html("<script>a()</script>"), "/");
    const second = await withSpaSecurityHeaders(html("<script>b()</script>"), "/");
    expect(first.headers.get("Content-Security-Policy")).toContain(sha256("a()"));
    expect(second.headers.get("Content-Security-Policy")).toContain(sha256("b()"));
    expect(second.headers.get("Content-Security-Policy")).not.toContain(sha256("a()"));
  });

  /**
   * A 304 has no body to hash, and the browser would apply its hash-less CSP
   * to the cached page: the theme script was blocked on every reload of a
   * revalidated page until this was fixed.
   */
  it("never lets the page revalidate to a body-less 304", async () => {
    const conditional = new Request("http://localhost/settings", {
      headers: { "If-None-Match": '"abc"', "If-Modified-Since": "Sat, 24 Oct 2026 00:00:00 GMT" },
    });
    const forPage = spaAssetRequest(conditional, "/settings");
    expect(forPage.headers.get("If-None-Match")).toBeNull();
    expect(forPage.headers.get("If-Modified-Since")).toBeNull();

    const asset = new Request("http://localhost/assets/a.js", {
      headers: { "If-None-Match": '"abc"' },
    });
    expect(spaAssetRequest(asset, "/assets/a.js").headers.get("If-None-Match")).toBe('"abc"');

    const page = new Response("<script>a()</script>", {
      headers: { "Content-Type": "text/html", ETag: '"abc"', "Last-Modified": "x" },
    });
    const wrapped = await withSpaSecurityHeaders(page, "/settings");
    expect(wrapped.headers.get("ETag")).toBeNull();
    expect(wrapped.headers.get("Last-Modified")).toBeNull();
  });

  it("does not read or alter non-HTML assets", async () => {
    const wrapped = await withSpaSecurityHeaders(
      new Response("<script>x()</script>", { headers: { "Content-Type": "text/javascript" } }),
      "/assets/app.js"
    );
    expect(wrapped.headers.get("Content-Security-Policy")).toContain("script-src 'self';");
  });

  it("keeps the API's CSP free of the SPA's script hash", async () => {
    const api = new Hono();
    api.use("*", securityHeadersMiddleware);
    api.get("/test", (c) => c.json({ ok: true }));
    const res = await api.request("/test");
    expect(res.headers.get("Content-Security-Policy")).toContain("script-src 'self';");
  });

  it("sets Cache-Control to no-cache for non-asset paths", async () => {
    const original = new Response("html", { status: 200 });
    const wrapped = await withSpaSecurityHeaders(original, "/dashboard");

    expect(wrapped.headers.get("Cache-Control")).toBe("no-cache");
  });

  it("sets immutable cache for /assets/ paths", async () => {
    const original = new Response("js", { status: 200 });
    const wrapped = await withSpaSecurityHeaders(original, "/assets/style.abc123.css");

    expect(wrapped.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");
  });

  it("preserves original response status", async () => {
    const original = new Response("not found", { status: 404, statusText: "Not Found" });
    const wrapped = await withSpaSecurityHeaders(original, "/missing");

    expect(wrapped.status).toBe(404);
    expect(wrapped.statusText).toBe("Not Found");
  });
});

describe("requestIdMiddleware", () => {
  const app = new Hono<{ Variables: { requestId: string } }>();
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
    const body: any = await res.json();
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
    const body: any = await res.json();
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
    const app = new Hono<{ Variables: { requestId: string } }>();
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
    const body: any = await res.json();
    expect(body.error).toBe("Internal Server Error");
    expect(body.requestId).toBeTruthy();
    expect(body.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });
});
