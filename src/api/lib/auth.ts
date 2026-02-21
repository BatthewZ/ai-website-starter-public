import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDb } from "../../db";
import * as schema from "../../db/schema";
import type { AppBindings } from "../env";

export function createAuth(env: AppBindings) {
  const db = createDb(env.DB);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    basePath: "/api/auth",
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.BETTER_AUTH_URL, ...parseTrustedOrigins(env.TRUSTED_ORIGINS)],
    emailAndPassword: {
      enabled: true,
      // eslint-disable-next-line @typescript-eslint/require-await
      sendResetPassword: async ({ user, url }) => {
        // Replace with a real email service (Resend, Mailchannels, etc.)
        console.warn(`[Auth] Password reset email NOT sent for ${user.email}. URL: ${url}`);
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;

export function parseTrustedOrigins(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function resolveAllowedOrigin(
  origin: string,
  baseUrl: string,
  trustedOrigins?: string
): string | null {
  const allowed = [baseUrl, ...parseTrustedOrigins(trustedOrigins)];
  return allowed.includes(origin) ? origin : null;
}
