# Auth Configuration

## Better Auth Setup and Configuration

The auth configuration lives in `src/api/lib/auth.ts`. It uses a **factory function** rather than a singleton because of the Cloudflare Workers execution model (see below).

```ts
// src/api/lib/auth.ts
export function createAuth(d1: D1Database, env: AppBindings) {
  return betterAuth({
    database: drizzleAdapter(createDb(d1), {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        // Replace with a real email service in production
        console.log(`[Auth] Password reset requested for ${user.email}: ${url}`);
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    basePath: "/api/auth",
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [
      env.BETTER_AUTH_URL,
      ...parseTrustedOrigins(env.TRUSTED_ORIGINS),
    ],
  });
}
```

### Configuration Details

| Option | Value | Purpose |
|---|---|---|
| `database` | Drizzle adapter with D1 + SQLite provider | Stores users, sessions, accounts, and verification tokens in D1. |
| `emailAndPassword.enabled` | `true` | Enables email/password sign-up and sign-in. |
| `emailAndPassword.sendResetPassword` | Console log (placeholder) | Called when a password reset is requested. Replace with Resend, Mailchannels, or another email service. |
| `user.deleteUser.enabled` | `true` | Enables the account deletion endpoint. |
| `basePath` | `/api/auth` | All Better Auth endpoints are mounted under this path. |
| `secret` | `env.BETTER_AUTH_SECRET` | Secret key for signing session tokens. |
| `baseURL` | `env.BETTER_AUTH_URL` | The application's base URL (used for CORS, redirects, etc.). |
| `trustedOrigins` | Base URL + parsed `TRUSTED_ORIGINS` | Origins allowed to make authenticated requests. |

---

## Per-Request Auth Factory

### Why a Factory?

In Cloudflare Workers, bindings like `D1Database` are only available inside request handlers -- they do not exist at module scope. This means you cannot create a Better Auth instance at import time:

```ts
// DOES NOT WORK in Workers:
const auth = betterAuth({ database: drizzleAdapter(someDb, ...) });
```

Instead, the project calls `createAuth(c.env.DB, c.env)` inside every request handler and middleware that needs auth functionality. The factory creates a new Better Auth instance each time, passing in the D1 binding from the current request context.

### Where It Is Called

1. **`src/api/middleware/auth.ts`** (session middleware) -- creates auth to extract the user session from cookies on every `/api/*` request.
2. **`src/api/routes/auth/auth.routes.ts`** (auth routes) -- creates auth to delegate sign-in, sign-up, password reset, and other auth operations to Better Auth's built-in handler.
