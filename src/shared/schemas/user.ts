import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
    /** Better Auth's `revokeOtherSessions`: sign out every other device on success. */
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Deleting an account asks for the password, not a typed "DELETE": it proves
 * the person at the keyboard owns the account (a borrowed, still-signed-in
 * laptop is not enough), and Better Auth skips its "fresh session" check when
 * a password is given, so a long-lived session can still delete.
 */
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm"),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
