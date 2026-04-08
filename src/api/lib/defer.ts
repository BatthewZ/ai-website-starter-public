import type { Context } from "hono";

import type { AppEnv } from "../env";

export function deferWork(
  c: Context<AppEnv>,
  work: () => Promise<unknown>,
): void {
  let ctx: ExecutionContext;
  try {
    ctx = c.executionCtx;
  } catch {
    void work().catch((err) => console.error("[defer] deferred work failed:", err));
    return;
  }
  ctx.waitUntil(work().catch((err) => console.error("[defer] deferred work failed:", err)));
}
