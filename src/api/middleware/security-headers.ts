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

/** Inline `<script>` elements (no `src`), capturing their exact text. */
const INLINE_SCRIPT = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;

async function sha256Source(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`;
}

/** One entry: index.html is the same bytes for every SPA route until the next deploy. */
let cached: { html: string; csp: string } | null = null;

/**
 * The CSP for an HTML page: the API's, plus a hash for each inline script the
 * page itself carries (today, r-ui's pre-paint theme script, injected by
 * vite.config.ts). Without it the browser blocks that script and every reload
 * flashes the default theme before React restores the saved one.
 *
 * Why hash at serve time rather than hard-code a hash: the script's text
 * changes whenever the theme list or the r-ui version does, and a hard-coded
 * hash would then silently block it until someone noticed the flash. Hashing
 * what is actually served needs no upkeep and covers any inline script the
 * build adds. (Before r-ui 0.1.1 it was also the only option: `themeScript`'s
 * text depended on the bundler.) The HTML comes from our own static assets, so this
 * trusts exactly what the JS bundle is already trusted for. Scripts injected
 * into the DOM at runtime are not in it, and stay blocked: this is a hash
 * list, never 'unsafe-inline'.
 */
export async function cspForHtml(html: string): Promise<string> {
  if (cached?.html === html) return cached.csp;
  const hashes = await Promise.all(
    [...html.matchAll(INLINE_SCRIPT)].map((m) => sha256Source(m[1]))
  );
  const csp = hashes.length
    ? SPA_CSP.replace("script-src 'self'", `script-src 'self' ${hashes.join(" ")}`)
    : SPA_CSP;
  cached = { html, csp };
  return csp;
}

export const securityHeadersMiddleware = createMiddleware(async (c, next) => {
  await next();
  for (const [key, value] of Object.entries(SHARED_HEADERS)) {
    c.header(key, value);
  }
  c.header("Content-Security-Policy", API_CSP);
});

/**
 * The request to pass to the assets binding. Hashed assets (`/assets/…`) go
 * as they are, conditional headers included, so they can still revalidate.
 * Every other path is the HTML page, whose CSP is built from its body (see
 * `cspForHtml`), so it is always fetched in full: on a `304 Not Modified` there
 * is no body to hash, and the browser would merge that response's hash-less
 * CSP into its cached copy and block the theme script on the next load. The
 * page is a few KB and already `no-cache`, so this costs almost nothing.
 */
export function spaAssetRequest(request: Request, requestPath: string): Request {
  if (requestPath.startsWith("/assets/")) return request;
  const headers = new Headers(request.headers);
  headers.delete("If-None-Match");
  headers.delete("If-Modified-Since");
  return new Request(request, { headers });
}

export async function withSpaSecurityHeaders(
  response: Response,
  requestPath: string
): Promise<Response> {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SHARED_HEADERS)) {
    headers.set(key, value);
  }
  const isHtml = headers.get("Content-Type")?.includes("text/html") ?? false;
  // Only HTML is read (to hash its inline scripts); every other asset streams through.
  const html = isHtml ? await response.text() : null;
  // The body is re-emitted from the decoded text, so the original length no longer applies.
  if (html !== null) {
    headers.delete("Content-Length");
    // No validators: the page is always served in full (see `spaAssetRequest`).
    headers.delete("ETag");
    headers.delete("Last-Modified");
  }
  headers.set("Content-Security-Policy", html === null ? SPA_CSP : await cspForHtml(html));

  if (requestPath.startsWith("/assets/")) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    headers.set("Cache-Control", "no-cache");
  }

  return new Response(html ?? response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
