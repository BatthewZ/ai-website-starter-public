# Endpoints

## Available Endpoints

### `GET /api/health`

Health check endpoint. No authentication required.

**Response**:

```json
{ "ok": true }
```

### `POST /api/auth/**` and `GET /api/auth/**`

All Better Auth endpoints are delegated to the Better Auth handler. These include:

- `POST /api/auth/sign-in/email` -- sign in with email/password
- `POST /api/auth/sign-up/email` -- register with email/password
- `POST /api/auth/sign-out` -- sign out (clear session)
- `GET /api/auth/session` -- get current session
- `POST /api/auth/forget-password` -- request password reset
- `POST /api/auth/reset-password` -- reset password with token
- `POST /api/auth/change-password` -- change password (authenticated)
- `GET /api/auth/list-sessions` -- list active sessions
- `POST /api/auth/revoke-session` -- revoke a specific session
- `POST /api/auth/revoke-other-sessions` -- revoke all other sessions
- `POST /api/auth/delete-user` -- delete account

See the [Better Auth documentation](https://www.better-auth.com/docs) for the full list of supported endpoints.

### `GET /api/me`

Returns the authenticated user's data. Requires authentication (uses `requireAuth` middleware).

**Response** (200):

```json
{
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "emailVerified": false,
    "image": null,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Response** (401, unauthenticated):

```json
{ "error": "Unauthorized" }
```

### `* /api/*` (404 catch-all)

Any `/api/*` request that does not match a defined route returns a 404:

```json
{
  "error": "Not Found",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Request/Response Formats

### Requests

- API requests should use `Content-Type: application/json`.
- Session cookies are included automatically by the browser (`credentials: "include"`).
- An optional `x-request-id` header can be sent to correlate requests; if omitted, one is generated.

### Responses

All API responses are JSON. Successful responses vary by endpoint. Error responses follow a consistent format:

```json
{
  "error": "Human-readable error message",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Validation errors include additional detail:

```json
{
  "error": "Validation failed",
  "details": [
    { "path": "email", "message": "Invalid email" },
    { "path": "password", "message": "Password must be at least 8 characters" }
  ]
}
```
