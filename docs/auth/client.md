# Frontend Auth Client

The frontend auth client is defined in `src/web/lib/auth/auth-client.ts`. It wraps Better Auth's React client and exports individual functions:

```ts
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: window.location.origin,
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  updateUser,
  changePassword,
  deleteUser,
  listSessions,
  revokeSession,
  revokeOtherSessions,
  requestPasswordReset,
  resetPassword,
} = authClient;
```

### Exported Functions

| Export                 | Type       | Purpose                                                                                                                                                                                                     |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useSession`           | React hook | Returns `{ data: session, isPending, error, refetch }`. Guards read it through `sessionStatus()`; `refetch()` updates the header after a profile change and lets the 401 handler discover an ended session. |
| `signIn`               | Function   | `signIn.email({ email, password })` -- authenticates with credentials.                                                                                                                                      |
| `signUp`               | Function   | `signUp.email({ name, email, password })` -- creates a new account.                                                                                                                                         |
| `signOut`              | Function   | `signOut()` -- ends the current session.                                                                                                                                                                    |
| `updateUser`           | Function   | `updateUser({ name, image })` -- updates user profile fields.                                                                                                                                               |
| `changePassword`       | Function   | `changePassword({ currentPassword, newPassword, revokeOtherSessions })` -- changes the password; `revokeOtherSessions: true` signs every other device out.                                                  |
| `deleteUser`           | Function   | `deleteUser({ password })` -- permanently deletes the user's account after re-checking the password.                                                                                                        |
| `listSessions`         | Function   | `listSessions()` -- returns all active sessions for the current user.                                                                                                                                       |
| `revokeSession`        | Function   | `revokeSession({ token })` -- deletes a specific session.                                                                                                                                                   |
| `revokeOtherSessions`  | Function   | `revokeOtherSessions()` -- deletes all sessions except the current one.                                                                                                                                     |
| `requestPasswordReset` | Function   | `requestPasswordReset({ email, redirectTo })` -- sends a password reset email.                                                                                                                              |
| `resetPassword`        | Function   | `resetPassword({ newPassword, token })` -- sets a new password using a reset token.                                                                                                                         |
