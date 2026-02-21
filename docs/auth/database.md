# Auth Database Schema

Auth-related tables are defined in `src/db/schema/auth.ts` using Drizzle ORM:

| Table | Columns | Purpose |
|---|---|---|
| `user` | `id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt` | User accounts. |
| `session` | `id`, `userId`, `token`, `expiresAt`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt` | Active sessions. Tracks IP and user agent for session management UI. |
| `account` | `id`, `userId`, `accountId`, `providerId`, `accessToken`, `refreshToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `scope`, `password`, `createdAt`, `updatedAt` | Auth provider accounts. For email/password, `providerId` is `"credential"` and `password` holds the hash. |
| `verification` | `id`, `identifier`, `value`, `expiresAt`, `createdAt`, `updatedAt` | Verification tokens (password reset, email verification). |
