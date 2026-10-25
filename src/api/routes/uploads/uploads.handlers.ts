import { and, eq } from "drizzle-orm";
import type { Context } from "hono";

import { createDb } from "../../../db";
import { user as userTable } from "../../../db/schema/auth";
import { upload } from "../../../db/schema/uploads";
import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE } from "../../../shared/schemas/upload";
import type { AppEnv } from "../../env";
import { deleteObject, generateObjectKey, getObject, putObject } from "../../lib/storage";

export async function uploadAvatar(c: Context<AppEnv>) {
  const storage = c.env.STORAGE;
  if (!storage) return c.json({ error: "File storage is not configured" }, 503);

  const user = c.get("user")!;

  const formData = await c.req.parseBody();
  const file = formData["file"];

  if (!(file instanceof File)) {
    return c.json({ error: "No file provided" }, 400);
  }

  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return c.json({ error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" }, 400);
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return c.json({ error: "File too large. Maximum size is 2MB" }, 400);
  }

  const db = createDb(c.env.DB);

  // Find old avatar first (before uploading new one)
  const [oldAvatar] = await db
    .select()
    .from(upload)
    .where(and(eq(upload.userId, user.id), eq(upload.purpose, "avatar")))
    .limit(1);

  // Upload new file FIRST — if this fails, old avatar is still intact
  const key = generateObjectKey("avatar", user.id, file.name);
  const arrayBuffer = await file.arrayBuffer();

  try {
    await putObject(storage, key, arrayBuffer, {
      mimeType: file.type,
      filename: file.name,
    });
  } catch (error) {
    console.error("Failed to upload file to R2:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }

  const id = crypto.randomUUID();
  const now = new Date();

  const record = {
    id,
    userId: user.id,
    key,
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    purpose: "avatar" as const,
    createdAt: now,
  };

  const avatarUrl = `/api/uploads/${key}`;

  try {
    await db.insert(upload).values(record);
    await db
      .update(userTable)
      .set({ image: avatarUrl, updatedAt: now })
      .where(eq(userTable.id, user.id));
  } catch (error) {
    // Clean up orphaned R2 object and any partially-inserted upload record
    await deleteObject(storage, key).catch(() => {});
    await db
      .delete(upload)
      .where(eq(upload.id, id))
      .catch(() => {});
    console.error("Failed to save upload record:", error);
    return c.json({ error: "Failed to save upload" }, 500);
  }

  // Clean up old avatar AFTER new one is fully saved
  if (oldAvatar) {
    await deleteObject(storage, oldAvatar.key).catch(() => {});
    await db
      .delete(upload)
      .where(eq(upload.id, oldAvatar.id))
      .catch(() => {});
  }

  return c.json({
    upload: {
      id: record.id,
      url: avatarUrl,
      filename: record.filename,
      mimeType: record.mimeType,
      size: record.size,
    },
  });
}

/**
 * `DELETE /api/users/me/avatar`: removes the signed-in user's photo, so the
 * app falls back to their initials (the Settings page's "Remove" action).
 *
 * The user row is cleared FIRST and the stored object deleted after: if the
 * R2 delete fails the user still sees the change and only an unreferenced
 * object is left behind (logged), whereas the reverse order could leave the
 * user pointing at an image that no longer exists. Idempotent: a user with no
 * avatar gets the same 200, so a double-click or a retry is harmless.
 */
export async function removeAvatar(c: Context<AppEnv>) {
  const storage = c.env.STORAGE;
  if (!storage) return c.json({ error: "File storage is not configured" }, 503);

  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const db = createDb(c.env.DB);

  const avatars = await db
    .select()
    .from(upload)
    .where(and(eq(upload.userId, user.id), eq(upload.purpose, "avatar")));

  await db
    .update(userTable)
    .set({ image: null, updatedAt: new Date() })
    .where(eq(userTable.id, user.id));

  for (const avatar of avatars) {
    try {
      await deleteObject(storage, avatar.key);
      await db.delete(upload).where(eq(upload.id, avatar.id));
    } catch (error) {
      console.error(`Failed to delete avatar object ${avatar.key}:`, error);
    }
  }

  return c.json({ ok: true });
}

export async function serveUpload(c: Context<AppEnv>) {
  const storage = c.env.STORAGE;
  if (!storage) return c.json({ error: "File storage is not configured" }, 503);

  const { purpose, userId, filename } = c.req.param();
  const key = `${purpose}/${userId}/${filename}`;

  const object = await getObject(storage, key);
  if (!object) {
    return c.json({ error: "File not found" }, 404);
  }

  c.header("Cache-Control", "public, max-age=31536000, immutable");
  c.header("Content-Type", object.httpMetadata?.contentType ?? "application/octet-stream");

  return c.body(object.body);
}

export async function deleteUpload(c: Context<AppEnv>) {
  const storage = c.env.STORAGE;
  if (!storage) return c.json({ error: "File storage is not configured" }, 503);

  const user = c.get("user")!;
  const { id } = c.req.param();
  const db = createDb(c.env.DB);

  const [record] = await db.select().from(upload).where(eq(upload.id, id)).limit(1);

  if (!record) {
    return c.json({ error: "Upload not found" }, 404);
  }

  if (record.userId !== user.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await deleteObject(storage, record.key);
  await db.delete(upload).where(eq(upload.id, id));

  return c.json({ ok: true });
}
