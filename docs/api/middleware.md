# Middleware

## Middleware Stack

Middleware is applied to all `/api/*` routes **in this exact order**. Order matters because each middleware depends on the context set by previous ones.

```
Request
  |
  v
1. requestIdMiddleware     -- assigns a unique request ID
  |
  v
2. requestLogger           -- logs method, path, status, duration, requestId
  |
  v
3. securityHeadersMiddleware -- sets security response headers
  |
  v
4. db middleware            -- creates Drizzle DB instance from D1 binding
  |
  v
5. CORS                    -- validates origin, sets CORS headers
  |
  v
6. authSessionMiddleware   -- extracts user/session from cookies
  |
  v
Route Handler (or 404 catch-all)
  |
  v
Response
```

This is registered in `src/api/index.ts`:

```ts
app.use("/api/*", requestIdMiddleware);
app.use("/api/*", requestLogger);
app.use("/api/*", securityHeadersMiddleware);
app.use("/api/*", async (c, next) => { c.set("db", createDb(c.env.DB)); await next(); });
app.use("/api/*", cors({ ... }));
app.use("/api/*", authSessionMiddleware);
```

---

## Middleware Details

### 1. Request ID (`src/api/middleware/request-id.ts`)

Assigns a unique identifier to every request. If the incoming request has an `x-request-id` header, that value is reused. Otherwise, a new UUID is generated via `crypto.randomUUID()`.

The request ID is:

- Stored in the Hono context as `requestId` (available via `c.get("requestId")`).
- Set as the `X-Request-Id` response header.
- Included in error responses (see [Error Handling](./error-handling.md)).

```ts
export const requestIdMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const requestId = c.req.header("x-request-id") || crypto.randomUUID();
  c.set("requestId", requestId);
  await next();
  c.header("X-Request-Id", requestId);
});
```

### 2. Request Logger (`src/api/middleware/logger.ts`)

Logs every request as a structured JSON object to `console.log`. The log is written **after** the response is generated, so it includes the response status and duration.

Fields logged:

| Field       | Source                                      |
| ----------- | ------------------------------------------- |
| `method`    | `c.req.method`                              |
| `path`      | `c.req.path`                                |
| `status`    | `c.res.status`                              |
| `duration`  | Elapsed time in milliseconds                |
| `requestId` | From context (set by request ID middleware) |
| `ip`        | `cf-connecting-ip` header                   |
| `userAgent` | First 128 characters of `user-agent` header |

```ts
export const requestLogger = createMiddleware<AppEnv>(async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  console.log(
    JSON.stringify({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration,
      requestId: c.get("requestId") ?? null,
      ip: c.req.header("cf-connecting-ip") ?? null,
      userAgent: c.req.header("user-agent")?.slice(0, 128) ?? null,
    })
  );
});
```

### 3. Security Headers (`src/api/middleware/security-headers.ts`)

Sets security-related response headers on all API responses. These headers are applied **after** `await next()`, so they are set on the final response.

| Header                      | Value                                      | Purpose                                                   |
| --------------------------- | ------------------------------------------ | --------------------------------------------------------- |
| `X-Content-Type-Options`    | `nosniff`                                  | Prevents MIME-type sniffing.                              |
| `X-Frame-Options`           | `DENY`                                     | Prevents the page from being embedded in iframes.         |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`          | Limits referrer information sent with requests.           |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()` | Disables camera, microphone, and geolocation APIs.        |
| `X-XSS-Protection`          | `0`                                        | Disables the legacy XSS filter (modern CSP is preferred). |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`      | Enforces HTTPS for one year, including subdomains.        |
| `Content-Security-Policy`   | See below                                  | Controls which resources can be loaded.                   |

**CSP directives**:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self'
```

API responses use exactly this policy. HTML pages served by the Worker extend `script-src` with the hashes of their own inline scripts (below).

#### SPA Security Headers

The same security headers are applied to **SPA (non-API) responses** by `withSpaSecurityHeaders`, with two differences: cache headers, and a CSP for HTML that allows the page's own inline scripts by hash.

Cache headers:

- `/assets/*` paths: `Cache-Control: public, max-age=31536000, immutable` (Vite hashed assets).
- All other paths: `Cache-Control: no-cache` (the HTML shell).

**Inline script hashes (`cspForHtml`).** The built `index.html` carries one inline script: r-ui's pre-paint `themeScript`, injected by `vite.config.ts`, which restores the saved theme / density / input before first paint (see [Frontend](../app-frontend.md#preferences-and-the-pre-paint-script)). `script-src 'self'` alone would block it and every reload would flash the default theme. So for an HTML response the Worker reads the body, computes a `'sha256-…'` source for each inline `<script>` without a `src`, and serves `script-src 'self' 'sha256-…'`. The result is cached per HTML body (index.html is identical for every route until the next deploy).

Why the hash is computed at request time instead of being hard-coded: the script's text changes whenever the theme list or the r-ui version does, and a stale hard-coded hash would silently block it. Hashing what is served needs no upkeep. (Before r-ui 0.1.1 it was the only option, because `themeScript`'s text depended on the bundler.) This trusts exactly what the JS bundle is already trusted for (our own static assets), and it is a hash list, never `'unsafe-inline'`: scripts injected into the DOM at runtime stay blocked.

**HTML is always served in full (`spaAssetRequest`).** For every non-`/assets/` path, the Worker strips `If-None-Match` / `If-Modified-Since` before asking the assets binding, and removes `ETag`, `Last-Modified` and `Content-Length` from the HTML response. A `304 Not Modified` has no body to hash, and the browser would merge that response's hash-less CSP into its cached copy and block the theme script on the next load. The page is a few KB and already `no-cache`, so the cost is negligible. Hashed assets under `/assets/` keep their conditional headers and revalidate normally.

If you add another inline script to `index.html`, it is hashed automatically; no CSP edit is needed.

### 4. Database Middleware (inline in `src/api/index.ts`)

Creates a Drizzle ORM database instance from the D1 binding and stores it on the Hono context as `db`. This makes the database available to all downstream handlers via `c.get("db")`.

### 5. CORS

CORS is configured using Hono's built-in `cors()` middleware. See [CORS](./cors.md) for full details.

### 6. Auth Session (`src/api/middleware/auth.ts`)

Extracts the user session from cookies on every request. Sets `c.get("user")` and `c.get("session")` -- either with valid session data or `null`. Does not block unauthenticated requests. See the [Auth documentation](../auth/auth.md) for details.
