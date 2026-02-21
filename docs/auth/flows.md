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
5. The user is redirected to `/dashboard`.

### Sign Out

1. User clicks sign out.
2. Frontend calls `signOut()` from the auth client.
3. Better Auth deletes the session record and clears the session cookie.
4. The user is redirected to `/login`.

### Password Reset

1. User submits their email on `/forgot-password`.
2. Frontend calls `requestPasswordReset({ email })`.
3. Better Auth creates a `verification` record and calls the `sendResetPassword` callback with the reset URL.
4. (In production, this sends an email with the reset link. Currently it logs to console.)
5. User clicks the link, which opens `/reset-password?token=...`.
6. User submits a new password.
7. Frontend calls `resetPassword({ newPassword, token })`.
8. Better Auth verifies the token, updates the password in the `account` table, and deletes the verification record.

### Session Management

- **List sessions**: `listSessions()` returns all active sessions for the current user, including IP address and user agent.
- **Revoke a session**: `revokeSession({ id })` deletes a specific session by its ID.
- **Revoke other sessions**: `revokeOtherSessions()` deletes all sessions for the current user except the current one.

### Account Deletion

- `deleteUser()` permanently deletes the user's account and all associated data (sessions, accounts, etc.).
