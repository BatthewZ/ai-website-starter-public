import { useSession } from "@/web/lib/auth/auth-client";

/**
 * A hidden, read-only `username` field for forms that only ask for a password
 * (change password, confirm deletion). Password managers pair a password with
 * the username in the same form; without one they can save the new password
 * against the wrong account or not offer to save it at all, and Chrome warns
 * in the console. It is `hidden`, so it is not focusable, not announced and
 * not submitted by our handlers (they read the form's values, not the DOM).
 */
export function UsernameHint() {
  const { data } = useSession();
  return (
    <input
      type="text"
      name="username"
      autoComplete="username"
      value={data?.user.email ?? ""}
      readOnly
      hidden
    />
  );
}
