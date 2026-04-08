import { createMiddleware } from "hono/factory";

const SHARED_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-XSS-Protection": "0",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

const API_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SPA_CSP = API_CSP;

export const securityHeadersMiddleware = createMiddleware(async (c, next) => {
  await next();
  for (const [key, value] of Object.entries(SHARED_HEADERS)) {
    c.header(key, value);
  }
  c.header("Content-Security-Policy", API_CSP);
});

export function withSpaSecurityHeaders(response: Response, requestPath: string): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SHARED_HEADERS)) {
    headers.set(key, value);
  }
  headers.set("Content-Security-Policy", SPA_CSP);

  if (requestPath.startsWith("/assets/")) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    headers.set("Cache-Control", "no-cache");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
