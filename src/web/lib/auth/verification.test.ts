import { describe, expect, it } from "vitest";

import { EMAIL_VERIFIED_CALLBACK, readVerificationResult } from "./verification";

/**
 * Better Auth reports a verification link's outcome only through the URL it
 * redirects to: the callback as given on success, `&error=<CODE>` appended on
 * failure. These pin the reading of that URL, which decides whether the user
 * is told "verified" or "send a new link".
 */
describe("readVerificationResult", () => {
  const params = (query: string) => new URLSearchParams(query);

  it("is null on an ordinary visit", () => {
    expect(readVerificationResult(params(""))).toBeNull();
    expect(readVerificationResult(params("error=INVALID_TOKEN"))).toBeNull();
  });

  it("is a success when the callback arrives without an error", () => {
    const callback = new URL(EMAIL_VERIFIED_CALLBACK, "http://x");
    expect(readVerificationResult(callback.searchParams)).toEqual({ ok: true });
  });

  it.each([
    [
      "TOKEN_EXPIRED",
      /expired.*If your email still shows as not verified, send yourself a new link/,
    ],
    [
      "INVALID_TOKEN",
      /isn't valid.*If your email still shows as not verified, send yourself a new link/,
    ],
    [
      "USER_NOT_FOUND",
      /isn't valid.*If your email still shows as not verified, send yourself a new link/,
    ],
    ["INVALID_USER", /different account\. Sign in as that account/],
  ])("explains %s", (code, text) => {
    const result = readVerificationResult(params(`email-verified=1&error=${code}`));
    expect(result).toMatchObject({ ok: false });
    expect(result && !result.ok && result.message).toMatch(text);
  });
});
