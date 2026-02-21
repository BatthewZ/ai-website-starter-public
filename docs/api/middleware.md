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
4. CORS                    -- validates origin, sets CORS headers
  |
  v
5. authSessionMiddleware   -- extracts user/session from cookies
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

| Field | Source |
|---|---|
| `method` | `c.req.method` |
| `path` | `c.req.path` |
| `status` | `c.res.status` |
| `duration` | Elapsed time in milliseconds |
| `requestId` | From context (set by request ID middleware) |
| `ip` | `cf-connecting-ip` header |
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

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing. |
| `X-Frame-Options` | `DENY` | Prevents the page from being embedded in iframes. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer information sent with requests. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables camera, microphone, and geolocation APIs. |
| `X-XSS-Protection` | `0` | Disables the legacy XSS filter (modern CSP is preferred). |
| `Content-Security-Policy` | See below | Controls which resources can be loaded. |

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

### 4. CORS

CORS is configured using Hono's built-in `cors()` middleware. See [CORS](./cors.md) for full details.

### 5. Auth Session (`src/api/middleware/auth.ts`)

Extracts the user session from cookies on every request. Sets `c.get("user")` and `c.get("session")` -- either with valid session data or `null`. Does not block unauthenticated requests. See the [Auth documentation](../auth/auth.md) for details.
