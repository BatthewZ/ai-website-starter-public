/**
 * Email verification, as the app sees it.
 *
 * The link in the email goes to Better Auth's /api/auth/verify-email, which
 * redirects to `EMAIL_VERIFIED_CALLBACK`. On success it redirects there as
 * given; on failure it appends `error=<CODE>`. So the marker parameter says
 * "you came from a verification link" and `error` says whether it worked.
 */

/** Marker the dashboard reads (and then removes from the URL). */
export const EMAIL_VERIFIED_PARAM = "email-verified";

/** Where the verification link lands, for sign-up and for every resend. */
export const EMAIL_VERIFIED_CALLBACK = `/dashboard?${EMAIL_VERIFIED_PARAM}=1`;

export type VerificationResult = { ok: true } | { ok: false; message: string };

/*
 * The result toast cannot know yet whether the account is verified (that
 * loads separately), and an old link can fail for a user who has since
 * verified. So the advice is conditional on what the dashboard shows, and
 * the resend button only exists while it says "Not verified".
 */
const RESEND_HINT = "If your email still shows as not verified, send yourself a new link.";

const ERROR_MESSAGES: Record<string, string> = {
  TOKEN_EXPIRED: `That verification link has expired. ${RESEND_HINT}`,
  INVALID_USER:
    "That verification link belongs to a different account. Sign in as that account to use it.",
};

const FALLBACK_ERROR = `That verification link isn't valid. ${RESEND_HINT}`;

/** The outcome of a verification link, or null when the page was not reached from one. */
export function readVerificationResult(params: URLSearchParams): VerificationResult | null {
  if (!params.has(EMAIL_VERIFIED_PARAM)) return null;
  const error = params.get("error");
  if (!error) return { ok: true };
  return { ok: false, message: ERROR_MESSAGES[error] ?? FALLBACK_ERROR };
}
