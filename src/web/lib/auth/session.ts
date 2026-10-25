import type { AuthStatus } from "@batthewz/r-ui-react-components";

/** The two fields of Better Auth's `useSession()` that decide who may see a page. */
export interface SessionState {
  isPending: boolean;
  data: unknown;
}

/**
 * Better Auth's session hook, in the vocabulary of r-ui's `RequireAuth`.
 *
 * `isPending` wins over `data` deliberately: while the first fetch is in flight
 * `data` is `null`, and reading that as "signed out" would bounce a signed-in
 * user to /login on every hard reload.
 */
export function sessionStatus({ isPending, data }: SessionState): AuthStatus {
  if (isPending) return "loading";
  return data ? "authenticated" : "unauthenticated";
}
