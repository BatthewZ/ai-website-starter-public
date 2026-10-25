import { Hono } from "hono";

import type { AppEnv } from "../../env";
import { createAuth } from "../../lib/auth";
import { deferWork } from "../../lib/defer";
import { rateLimit } from "../../middleware/rate-limit";

const app = new Hono<AppEnv>();

app.use("/auth/sign-in/*", rateLimit({ max: 10, windowSeconds: 60, prefix: "auth-signin" }));
app.use("/auth/sign-up/*", rateLimit({ max: 5, windowSeconds: 60, prefix: "auth-signup" }));
// Each call sends an email to an address the caller chooses, so it is held to
// a few an hour: enough for "I didn't get it", too few to use us as a spammer.
app.use(
  "/auth/send-verification-email",
  rateLimit({ max: 3, windowSeconds: 3600, prefix: "auth-verify-email" })
);
app.use("/auth/*", rateLimit({ max: 30, windowSeconds: 60, prefix: "auth-general" }));

app.on(["GET", "POST"], "/auth/*", (c) => {
  const auth = createAuth(c.env, { waitUntil: (task) => deferWork(c, () => task) });
  return auth.handler(c.req.raw);
});

export default app;
