/**
 * The message to show for a failed Better Auth call.
 *
 * Better Auth resolves HTTP failures as `{ error: { message, status } }` but a
 * network failure (offline, DNS, CORS) REJECTS instead, so callers must handle
 * both.
 *
 * Two kinds of failure arrive with no `message`, because our own API answers
 * them as `{ error: "…" }` (Better Auth reads `message`): our rate limiter's
 * 429 and our error handler's 500. A 429 gets its own wording here, for every
 * form, because the caller's fallback would otherwise blame the user's input
 * ("Invalid email or password") when the real answer is "wait a minute". So
 * each caller's fallback must describe failure in general, never one cause.
 */
export function authErrorMessage(
  error: { message?: string | null; status?: number } | null | undefined,
  fallback: string
): string {
  if (error?.status === 429) return RATE_LIMITED_MESSAGE;
  const message = error?.message?.trim();
  return message ? message : fallback;
}

export const RATE_LIMITED_MESSAGE = "Too many attempts. Please wait a minute and try again.";

export const NETWORK_ERROR_MESSAGE =
  "We couldn't reach the server. Check your connection and try again.";
