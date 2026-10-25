/**
 * The message to show for a failed Better Auth call.
 *
 * Better Auth resolves HTTP failures as `{ error: { message, status } }` but a
 * network failure (offline, DNS, CORS) REJECTS instead, so callers must handle
 * both. `message` can also be empty for some statuses; the fallback keeps the
 * form from showing a blank alert.
 */
export function authErrorMessage(
  error: { message?: string | null } | null | undefined,
  fallback: string
): string {
  const message = error?.message?.trim();
  return message ? message : fallback;
}

export const NETWORK_ERROR_MESSAGE =
  "We couldn't reach the server. Check your connection and try again.";
