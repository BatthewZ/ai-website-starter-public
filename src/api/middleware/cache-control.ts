import type { MiddlewareHandler } from "hono";

import type { AppEnv } from "../env";

export function cacheControl(maxAge: number): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    await next();
    if (c.req.method === "GET" && c.res.status >= 200 && c.res.status < 300) {
      c.res.headers.set("Cache-Control", `private, max-age=${maxAge}`);
    }
  };
}
