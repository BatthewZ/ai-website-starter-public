# Auth Flows

### Sign Up

1. User submits name, email, and password on `/register`.
2. Frontend calls `signUp.email({ name, email, password })` from the auth client.
3. Better Auth creates a `user` record and an `account` record (with `providerId: "credential"` and a hashed password).
4. A `session` record is created and a session cookie is set.
5. The user is redirected to `/dashboard`.

### Sign In

1. User submits email and password on `/login`.
2. Frontend calls `signIn.email({ email, password })` from the auth client.
3. Better Auth verifies the credentials against the `account` table.
4. A new `session` record is created and a session cookie is set.
5. The user is redirected to the page `AuthGuard` recorded before sending them to `/login` (validated by `postSignInPath`), or to `/dashboard`.

### Sign Out

1. User clicks sign out.
2. Frontend calls `signOut()` from the auth client.
3. Better Auth deletes the session record and clears the session cookie.
4. The user is redirected to `/login`.

### Password Reset

1. User submits their email on `/forgot-password`.
2. Frontend calls `requestPasswordReset({ email, redirectTo: "/reset-password" })`. The page shows the same confirmation whether or not the address has an account.
3. Better Auth creates a `verification` record and calls the `sendResetPassword` callback with the reset URL.
4. The [email service](../api/email.md) sends a password reset email with the reset link (via Resend in production, or logged to console in development).
5. User clicks the link. Better Auth verifies it and redirects to `/reset-password?token=...`, or to `/reset-password?error=INVALID_TOKEN` for an expired or used link (the page then offers to request a new one).
6. User submits a new password.
7. Frontend calls `resetPassword({ newPassword, token })`.
8. Better Auth verifies the token, updates the password in the `account` table, and deletes the verification record.

### Email Verification

Verification is **soft**: it is requested, not required. A new user is signed in
straight away and can use the app; the dashboard asks them to verify until they do.

1. User signs up. The Register page passes `callbackURL: EMAIL_VERIFIED_CALLBACK`
   (`/dashboard?email-verified=1`, in `src/web/lib/auth/verification.ts`).
2. Because `emailVerification.sendOnSignUp` is on, Better Auth calls
   `sendVerificationEmail` with a link to `/api/auth/verify-email?token=…&callbackURL=…`.
   The send runs through the Worker's `waitUntil`, so sign-up does not wait on the
   email provider.
3. The [email service](../api/email.md) sends it (Resend in production; in development
   the whole email, link included, is printed to the `wrangler dev` log).
4. While `emailVerified` is false, the dashboard shows "Verify your email address" with
   a **Resend verification email** button (`sendVerificationEmail({ email, callbackURL })`).
   `POST /api/auth/send-verification-email` is limited to 3 requests an hour per IP.
5. The user clicks the link. Better Auth marks the email verified, signs them in
   (`autoSignInAfterVerification`) and redirects to the callback. On failure it appends
   `&error=<CODE>` (`TOKEN_EXPIRED`, `INVALID_TOKEN`, `USER_NOT_FOUND`, `INVALID_USER`).
6. The dashboard reads the result (`readVerificationResult`), shows a success or failure
   toast, and removes the parameters from the URL.

To make verification a gate instead, set `emailAndPassword.requireEmailVerification: true`
in `src/api/lib/auth.ts`. Sign-up then returns no session, so the Register page must show
"check your email" instead of navigating to the dashboard.

### Session Management

- **List sessions**: `listSessions()` returns all active sessions for the current user, including IP address and user agent.
- **Revoke a session**: `revokeSession({ token })` deletes a specific session by its token.
- **Revoke other sessions**: `revokeOtherSessions()` deletes all sessions for the current user except the current one.

### Account Deletion

- `deleteUser({ password })` permanently deletes the user's account and all associated data (sessions, accounts, etc.).
