# Schema

All table definitions live in `src/db/schema/`. The barrel file `src/db/schema/index.ts` re-exports everything:

```ts
export * from "./auth";
```

### Tables

#### `user`

**File:** `src/db/schema/auth.ts`

| Column          | Type                          | Constraints              | Description                          |
| --------------- | ----------------------------- | ------------------------ | ------------------------------------ |
| `id`            | `text`                        | **Primary key**          | Unique user identifier               |
| `name`          | `text`                        | `NOT NULL`               | Display name                         |
| `email`         | `text`                        | `NOT NULL`, `UNIQUE`     | User email address                   |
| `emailVerified` | `integer` (mode: `boolean`)   |                          | Whether the email has been verified  |
| `image`         | `text`                        |                          | Profile image URL                    |
| `createdAt`     | `integer` (mode: `timestamp`) | `NOT NULL`               | Account creation timestamp           |
| `updatedAt`     | `integer` (mode: `timestamp`) | `NOT NULL`               | Last update timestamp                |

#### `session`

| Column      | Type                          | Constraints                          | Description                          |
| ----------- | ----------------------------- | ------------------------------------ | ------------------------------------ |
| `id`        | `text`                        | **Primary key**                      | Unique session identifier            |
| `userId`    | `text`                        | `NOT NULL`, **FK** -> `user.id`      | References the owning user           |
| `token`     | `text`                        | `NOT NULL`, `UNIQUE`                 | Session token                        |
| `expiresAt` | `integer` (mode: `timestamp`) | `NOT NULL`                           | Session expiration time              |
| `ipAddress` | `text`                        |                                      | Client IP address                    |
| `userAgent` | `text`                        |                                      | Client user agent string             |
| `createdAt` | `integer` (mode: `timestamp`) | `NOT NULL`                           | Session creation timestamp           |
| `updatedAt` | `integer` (mode: `timestamp`) | `NOT NULL`                           | Last update timestamp                |

#### `account`

| Column                  | Type                          | Constraints                          | Description                               |
| ----------------------- | ----------------------------- | ------------------------------------ | ----------------------------------------- |
| `id`                    | `text`                        | **Primary key**                      | Unique account identifier                 |
| `userId`                | `text`                        | `NOT NULL`, **FK** -> `user.id`      | References the owning user                |
| `accountId`             | `text`                        | `NOT NULL`                           | External account ID (e.g. OAuth provider) |
| `providerId`            | `text`                        | `NOT NULL`                           | Auth provider name (e.g. `"credential"`)  |
| `accessToken`           | `text`                        |                                      | OAuth access token                        |
| `refreshToken`          | `text`                        |                                      | OAuth refresh token                       |
| `accessTokenExpiresAt`  | `integer` (mode: `timestamp`) |                                      | Access token expiration                   |
| `refreshTokenExpiresAt` | `integer` (mode: `timestamp`) |                                      | Refresh token expiration                  |
| `scope`                 | `text`                        |                                      | OAuth scope                               |
| `password`              | `text`                        |                                      | Hashed password (for email/password auth) |
| `createdAt`             | `integer` (mode: `timestamp`) | `NOT NULL`                           | Account creation timestamp                |
| `updatedAt`             | `integer` (mode: `timestamp`) | `NOT NULL`                           | Last update timestamp                     |

#### `verification`

| Column       | Type                          | Constraints  | Description                                     |
| ------------ | ----------------------------- | ------------ | ----------------------------------------------- |
| `id`         | `text`                        | **Primary key** | Unique verification identifier               |
| `identifier` | `text`                        | `NOT NULL`   | What is being verified (e.g. email address)     |
| `value`      | `text`                        | `NOT NULL`   | Verification token/code                         |
| `expiresAt`  | `integer` (mode: `timestamp`) | `NOT NULL`   | Expiration time                                 |
| `createdAt`  | `integer` (mode: `timestamp`) | `NOT NULL`   | Creation timestamp                              |
| `updatedAt`  | `integer` (mode: `timestamp`) | `NOT NULL`   | Last update timestamp                           |

### Relationships

- `session.userId` -> `user.id` (foreign key)
- `account.userId` -> `user.id` (foreign key)

All four tables are managed by **Better Auth** and follow its expected schema conventions.
