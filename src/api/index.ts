import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";

import { createDb } from "../db";
import type { AppBindings, AppEnv } from "./env";
import { resolveAllowedOrigin } from "./lib/auth";
import { errorResponse } from "./lib/error-response";
import { authSessionMiddleware } from "./middleware/auth";
import { requestLogger } from "./middleware/logger";
import { requestIdMiddleware } from "./middleware/request-id";
import { securityHeadersMiddleware, withSpaSecurityHeaders } from "./middleware/security-headers";
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
  return errorResponse(c, "Internal Server Error", 500);
});

app.use("/api/*", requestIdMiddleware);
app.use("/api/*", requestLogger);
app.use("/api/*", securityHeadersMiddleware);

app.use("/api/*", async (c, next) => {
  c.set("db", createDb(c.env.DB));
  await next();
});

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
  return errorResponse(c, "Not Found", 404);
});

app.all("*", async (c) => {
  const response = await c.env.ASSETS.fetch(c.req.raw);
  return withSpaSecurityHeaders(response, c.req.path);
});

export default app;
