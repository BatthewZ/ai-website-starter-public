# Validation Schemas

Zod schemas live in `src/shared/schemas/`. Most are re-exported from the barrel
`src/shared/schemas/index.ts` (`@/shared/schemas`); the pages import from the module files
(`@/shared/schemas/auth`, `@/shared/schemas/user`), and `deleteAccountSchema` is only
available there. The frontend passes them straight to r-ui's `useForm` (which accepts any
[Standard Schema](https://standardschema.dev)); Better Auth enforces the same rules
server-side, so these give the user the message before a round trip.

## `auth.ts`

```ts
const email = z.email({ error: "Enter a valid email address" });
const newPassword = z.string().min(8, "Password must be at least 8 characters");
```

### `loginSchema`

```ts
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});
```

Sign-in only checks that a password was typed. Re-stating the sign-up length rule would
answer a mistyped short password with a policy message instead of "invalid email or
password", and would lock out accounts created before a policy change.

### `registerSchema`

```ts
export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email,
  password: newPassword,
});
```

### `forgotPasswordSchema`

```ts
export const forgotPasswordSchema = z.object({ email });
```

### `resetPasswordSchema`

```ts
export const resetPasswordSchema = z
  .object({
    newPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
```

## `user.ts`

| Schema                 | Fields                                                                                       | Notes                                                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `updateProfileSchema`  | `name` (trimmed, required)                                                                   | Settings → Profile.                                                                                                                                                     |
| `changePasswordSchema` | `currentPassword`, `newPassword` (min 8), `confirmPassword`, `revokeOtherSessions` (boolean) | Refines that the two new passwords match. `revokeOtherSessions` is passed to Better Auth's `changePassword`.                                                            |
| `deleteAccountSchema`  | `password` (required)                                                                        | A password rather than a typed "DELETE": it proves the person at the keyboard owns the account, and Better Auth skips its fresh-session check when a password is given. |

### Exported Types

Each schema has an inferred type: `LoginInput`, `RegisterInput`, `ForgotPasswordInput`,
`ResetPasswordInput`, `UpdateProfileInput`, `ChangePasswordInput`, `DeleteAccountInput`.
