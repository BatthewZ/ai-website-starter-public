import { z } from "zod";

/**
 * Auth form schemas, shared by the auth pages (validated client-side through
 * r-ui's `useForm`, which accepts any Standard Schema) and their tests.
 * Better Auth enforces the same rules server-side; these give the user the
 * message before a round trip.
 */

const email = z.email({ error: "Enter a valid email address" });
const newPassword = z.string().min(8, "Password must be at least 8 characters");

/**
 * Sign-in only asks that a password was typed. Re-stating the sign-up length
 * rule here would reject a mistyped short password with a policy message
 * instead of "invalid email or password", and would lock out any account
 * created before a policy change.
 */
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email,
  password: newPassword,
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    newPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
