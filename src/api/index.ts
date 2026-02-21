import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import type { AppBindings, AppEnv } from "./env";
import { resolveAllowedOrigin } from "./lib/auth";
import { authSessionMiddleware } from "./middleware/auth";
import { requestLogger } from "./middleware/logger";
import { requestIdMiddleware } from "./middleware/request-id";
import { securityHeadersMiddleware } from "./middleware/security-headers";
import routes from "./routes";

const app = new Hono<AppEnv>();

app.onError((err, c) => {
  const requestId = c.get("requestId") ?? "unknown";

  if (err instanceof HTTPException) {
    return c.json({ error: err.message, requestId }, err.status);
  }

  console.error(
    JSON.stringify({
      level: "error",
      method: c.req.method,
      path: c.req.path,
      error: err.message,
      stack: err.stack,
      requestId,
    })
  );
  return c.json({ error: "Internal Server Error", requestId }, 500);
});

app.use("/api/*", requestIdMiddleware);
app.use("/api/*", requestLogger);
app.use("/api/*", securityHeadersMiddleware);

app.use(
  "/api/*",
  cors({
    origin: (origin, c) => {
      const env = c.env as AppBindings;
      return resolveAllowedOrigin(origin, env.BETTER_AUTH_URL, env.TRUSTED_ORIGINS);
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/*", authSessionMiddleware);

app.get("/api/health", (c) => c.json({ ok: true }));

app.route("/api", routes);

app.all("/api/*", (c) => {
  const requestId = c.get("requestId") ?? "unknown";
  return c.json({ error: "Not Found", requestId }, 404);
});

app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
