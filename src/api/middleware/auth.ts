import { createMiddleware } from "hono/factory";

import type { AppBindings, AuthVariables } from "../env";
import { createAuth } from "../lib/auth";

export const authSessionMiddleware = createMiddleware<{
  Bindings: AppBindings;
  Variables: AuthVariables;
}>(async (c, next) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (session) {
    c.set("user", session.user);
    c.set("session", session.session);
  } else {
    c.set("user", null);
    c.set("session", null);
  }

  await next();
});
