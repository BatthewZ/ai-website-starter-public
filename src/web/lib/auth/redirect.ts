/**
 * Where people land around sign-in, kept in one place so the guards, the auth
 * pages and the 401 handler agree.
 */

/** Signed-in home: where sign-in goes when nothing asked for a page. */
export const AUTHENTICATED_HOME = "/dashboard";

/** Pages for signed-out visitors. A signed-in visitor is sent on from these. */
export const GUEST_PATHS: readonly string[] = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

/**
 * What `AuthGuard` puts in the router's location state when it sends someone
 * to /login, so sign-in can return them to the page they asked for.
 */
export interface SignInRedirectState {
  from: string;
}

export function signInRedirectState(location: {
  pathname: string;
  search: string;
  hash: string;
}): SignInRedirectState {
  return { from: `${location.pathname}${location.search}${location.hash}` };
}

/**
 * The page to open after sign-in: the `from` the guard recorded, if it is a
 * same-origin, non-guest path; otherwise the signed-in home.
 *
 * Location state comes from history, which any script on the page (or a
 * crafted `history.pushState`) can write, so it is validated rather than
 * trusted: an absolute or protocol-relative value (`https://evil`, `//evil`,
 * `/\evil`) would turn sign-in into an open redirect, and a guest path would
 * bounce the user straight back to a sign-in form.
 */
export function postSignInPath(state: unknown): string {
  const from = (state as Partial<SignInRedirectState> | null)?.from;
  if (typeof from !== "string" || !from.startsWith("/")) return AUTHENTICATED_HOME;

  const url = new URL(from, window.location.origin);
  if (url.origin !== window.location.origin) return AUTHENTICATED_HOME;
  if (GUEST_PATHS.includes(url.pathname)) return AUTHENTICATED_HOME;

  return `${url.pathname}${url.search}${url.hash}`;
}
