# Per-Request Auth Factory

## Per-Request Auth Factory Pattern

### The Problem

Cloudflare Workers provide bindings (D1, KV, R2, etc.) through the request context -- they are **not available at module scope**. This means you cannot create a singleton auth instance at import time:

```ts
// THIS DOES NOT WORK in Workers
import { betterAuth } from "better-auth";
const auth = betterAuth({ database: db }); // db is not available yet
```

The D1 database binding (`c.env.DB`) only exists inside a request handler, after the Worker receives a request.

### The Solution

The project uses a **factory function** that creates a fresh Better Auth instance on every request, receiving the D1 binding from the request context:

```ts
// src/api/lib/auth.ts
export function createAuth(d1: D1Database, env: AppBindings) {
  return betterAuth({
    database: drizzleAdapter(createDb(d1), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: { enabled: true },
    basePath: "/api/auth",
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    // ...
  });
}
```

This pattern is used in two places:

1. **Session middleware** (`src/api/middleware/auth.ts`) -- creates auth to extract the session from cookies on every `/api/*` request.
2. **Auth routes** (`src/api/routes/auth/auth.routes.ts`) -- creates auth to delegate sign-in/sign-up/etc. to Better Auth's handler.

Both call `createAuth(c.env.DB, c.env)` inside a request handler where `c.env.DB` is available.

### Why Not Cache the Instance?

The factory runs on every request because Workers may handle requests across different isolates, and bindings are tied to a specific request context. The overhead is minimal -- Better Auth's constructor is lightweight, and the D1 binding is just a proxy object.
