import { Hono } from "hono";

import type { AppEnv } from "../../env";
import { rateLimit } from "../../middleware/rate-limit";
import { requireAuth } from "../../middleware/require-auth";
import { deleteUpload, removeAvatar, serveUpload, uploadAvatar } from "./uploads.handlers";

const app = new Hono<AppEnv>();

app.put(
  "/users/me/avatar",
  requireAuth,
  rateLimit({ max: 10, windowSeconds: 60, prefix: "avatar-upload" }),
  uploadAvatar
);

app.delete(
  "/users/me/avatar",
  requireAuth,
  rateLimit({ max: 10, windowSeconds: 60, prefix: "avatar-remove" }),
  removeAvatar
);

app.get("/uploads/:purpose/:userId/:filename", serveUpload);

app.delete("/uploads/:id", requireAuth, deleteUpload);

export default app;
