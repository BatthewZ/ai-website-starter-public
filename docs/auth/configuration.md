# Auth Configuration

## Better Auth Setup and Configuration

The auth configuration lives in `src/api/lib/auth.ts`. It uses a **factory function** rather than a singleton because of the Cloudflare Workers execution model (see below).

```ts
// src/api/lib/auth.ts
export function createAuth(env: AppBindings) {
  const db = createDb(env.DB);
  const emailService = createEmailService(env);
  const fromAddress = env.EMAIL_FROM ?? "noreply@example.com";

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        try {
          const { subject, html, text } = passwordResetEmail({ url });
          await emailService.send({ to: user.email, from: fromAddress, subject, html, text });
        } catch (error) {
          console.error("Failed to send password reset email:", error);
        }
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        try {
          const { subject, html, text } = emailVerificationEmail({ url });
          await emailService.send({ to: user.email, from: fromAddress, subject, html, text });
        } catch (error) {
          console.error("Failed to send verification email:", error);
        }
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
| `emailAndPassword.sendResetPassword` | Email service (Resend or console fallback) | Sends a password reset email via the configured email service. Failures are caught and logged so they do not crash the auth flow. See [Email Service](../api/email.md). |
| `emailVerification.sendVerificationEmail` | Email service (Resend or console fallback) | Sends an email verification link after sign-up. Failures are caught and logged so they do not crash the auth flow. See [Email Service](../api/email.md). |
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

Instead, the project calls `createAuth(c.env)` inside every request handler and middleware that needs auth functionality. The factory creates a new Better Auth instance each time, receiving the full `AppBindings` object which includes the D1 binding and other environment variables.

### Where It Is Called

1. **`src/api/middleware/auth.ts`** (session middleware) -- creates auth to extract the user session from cookies on every `/api/*` request.
2. **`src/api/routes/auth/auth.routes.ts`** (auth routes) -- creates auth to delegate sign-in, sign-up, password reset, and other auth operations to Better Auth's built-in handler.
