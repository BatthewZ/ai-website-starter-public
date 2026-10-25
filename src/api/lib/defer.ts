import type { Context } from "hono";

import type { AppEnv } from "../env";

export function deferWork(c: Context<AppEnv>, work: () => Promise<unknown>): void {
  // Hono's own execution-context type, not the global one from workers-types:
  // the two differ (v5 of workers-types adds `tracing` / `abort`), and this is
  // the value Hono hands us.
  let ctx: Context<AppEnv>["executionCtx"];
  try {
    ctx = c.executionCtx;
  } catch {
    void work().catch((err) => console.error("[defer] deferred work failed:", err));
    return;
  }
  ctx.waitUntil(work().catch((err) => console.error("[defer] deferred work failed:", err)));
}
