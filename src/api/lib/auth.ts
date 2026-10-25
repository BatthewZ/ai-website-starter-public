import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDb } from "../../db";
import * as schema from "../../db/schema";
import type { AppBindings } from "../env";
import { createEmailService } from "./email";
import { emailVerificationEmail } from "./email/templates/email-verification";
import { passwordResetEmail } from "./email/templates/password-reset";

export interface CreateAuthOptions {
  /**
   * Runs work after the response is sent (the Worker's `ctx.waitUntil`).
   * Better Auth uses it for emails it sends inside a request (verification
   * on sign-up and on resend), so sign-up does not wait on the email
   * provider. Without it, Better Auth awaits the send in the request.
   */
  waitUntil?: (task: Promise<unknown>) => void;
}

export function createAuth(env: AppBindings, options: CreateAuthOptions = {}) {
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
      password: {
        hash: (password) => bcrypt.hash(password, 10),
        verify: ({ hash, password }) => bcrypt.compare(password, hash),
      },
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
    /**
     * Soft verification: a verification email goes out at sign-up and the
     * user is signed in straight away; the dashboard shows "Not verified"
     * with a resend button until they click the link. To make verification
     * a gate instead (no sign-in until verified), set
     * `emailAndPassword.requireEmailVerification: true`; sign-up then returns
     * no session, so the Register page must show "check your email" rather
     * than navigate to the dashboard.
     */
    emailVerification: {
      sendOnSignUp: true,
      // Clicking the link signs the user in, so it works from another
      // browser or after their session has expired.
      autoSignInAfterVerification: true,
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
    advanced: options.waitUntil ? { backgroundTasks: { handler: options.waitUntil } } : undefined,
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
