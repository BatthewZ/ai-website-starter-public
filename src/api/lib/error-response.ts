import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { AppEnv } from "../env";

export function errorResponse(
  c: Context<AppEnv>,
  message: string,
  status: ContentfulStatusCode,
  extra?: Record<string, unknown>,
) {
  const requestId = c.get("requestId") ?? "unknown";
  return c.json({ error: message, requestId, ...extra }, status);
}

export function throwWithContext(error: unknown, context: string): never {
  if (error instanceof Error) {
    error.message = `[${context}] ${error.message}`;
  }
  throw error;
}
