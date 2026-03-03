import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDb } from "../../db";
import * as schema from "../../db/schema";
import type { AppBindings } from "../env";
import { createEmailService } from "./email";
import { emailVerificationEmail } from "./email/templates/email-verification";
import { passwordResetEmail } from "./email/templates/password-reset";

export function createAuth(env: AppBindings) {
  const db = createDb(env.DB);
  const emailService = createEmailService(env);
  const fromAddress = env.EMAIL_FROM ?? "noreply@example.com";

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
      sendResetPassword: async ({ user, url }) => {
        try {
          const { subject, html, text } = passwordResetEmail({ url });
          await emailService.send({
            to: user.email,
            from: fromAddress,
            subject,
            html,
            text,
          });
        } catch (error) {
          console.error("Failed to send password reset email:", error);
        }
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        try {
          const { subject, html, text } = emailVerificationEmail({ url });
          await emailService.send({
            to: user.email,
            from: fromAddress,
            subject,
            html,
            text,
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
        }
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
