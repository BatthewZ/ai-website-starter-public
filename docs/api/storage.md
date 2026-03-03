# File Storage (R2)

## Overview

The file storage service (`src/api/lib/storage.ts`) provides an abstraction over Cloudflare R2 for storing and retrieving binary objects (images, documents, etc.). Upload endpoints return 503 when the R2 binding is not configured.

## Architecture

```
src/api/lib/storage.ts          # R2 storage helpers
src/api/routes/uploads/
├── uploads.routes.ts            # Route definitions
└── uploads.handlers.ts          # Handler implementations
src/shared/schemas/upload.ts     # Validation constants and Zod schemas
src/db/schema/uploads.ts         # Upload table schema
```

## Storage Helpers

**Source:** `src/api/lib/storage.ts`

### `generateObjectKey(purpose, userId, filename)`

Generates a unique R2 object key in the format `{purpose}/{userId}/{uuid}{ext}`.

### `putObject(storage, key, body, metadata)`

Stores a binary object in R2 with content type and filename metadata.

### `getObject(storage, key)`

Retrieves an object from R2. Returns `null` if not found.

### `deleteObject(storage, key)`

Deletes an object from R2.

## Upload Endpoints

### `PUT /api/users/me/avatar`

Uploads a user avatar image. Requires authentication. Rate-limited to 10 requests per minute.

**Request:** `multipart/form-data` with a `file` field.

**Constraints:**
- Allowed types: JPEG, PNG, GIF, WebP
- Maximum size: 2 MB

**Behavior:**
1. Validates the file type and size.
2. Looks up the user's previous avatar (if any) but does **not** delete it yet.
3. Uploads the new file to R2 under `avatar/{userId}/{uuid}{ext}`. If the R2 upload fails, returns 500 and the old avatar remains intact.
4. Creates a record in the `upload` table and updates the user's `image` field to the new avatar URL. If either DB write fails, the orphaned R2 object and any partial upload record are cleaned up before returning 500.
5. Deletes the old avatar from R2 and the database only **after** the new one is fully saved. Cleanup errors are swallowed to avoid failing the overall request.

**Response** (200):

```json
{
  "upload": {
    "id": "abc123",
    "url": "/api/uploads/avatar/userId/uuid.jpg",
    "filename": "photo.jpg",
    "mimeType": "image/jpeg",
    "size": 102400
  }
}
```

**Error responses:**

| Status | Condition |
| --- | --- |
| 400 | No file provided, invalid file type, or file too large |
| 401 | Not authenticated |
| 429 | Rate limit exceeded |
| 500 | R2 upload failed or database write failed (with automatic cleanup) |
| 503 | R2 storage binding not configured |

### `GET /api/uploads/:purpose/:userId/:filename`

Serves a stored file. No authentication required. Returns the file with `Cache-Control: public, max-age=31536000, immutable`.

**Error responses:**

| Status | Condition |
| --- | --- |
| 404 | File not found in R2 |
| 503 | R2 storage binding not configured |

### `DELETE /api/uploads/:id`

Deletes an upload. Requires authentication. Only the file owner can delete.

**Response** (200):

```json
{ "ok": true }
```

**Error responses:**

| Status | Condition |
| --- | --- |
| 401 | Not authenticated |
| 403 | Not the file owner |
| 404 | Upload record not found |
| 503 | R2 storage binding not configured |

## Validation Schemas

**Source:** `src/shared/schemas/upload.ts`

| Export | Description |
| --- | --- |
| `ALLOWED_IMAGE_TYPES` | `["image/jpeg", "image/png", "image/gif", "image/webp"]` |
| `MAX_AVATAR_SIZE` | `2 * 1024 * 1024` (2 MB) |
| `MAX_UPLOAD_SIZE` | `5 * 1024 * 1024` (5 MB) |
| `avatarUploadSchema` | Zod schema validating a `File` against `ALLOWED_IMAGE_TYPES` and `MAX_AVATAR_SIZE` |
| `uploadSchema` | Zod schema validating a `File` against `MAX_UPLOAD_SIZE` |

## Environment

The R2 bucket binding must be configured in `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "your-bucket-name"
```

The `STORAGE` binding is typed as `R2Bucket` in `src/api/env.ts` (`AppBindings.STORAGE`). When the binding is absent, all upload endpoints return 503.
