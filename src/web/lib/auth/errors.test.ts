import { describe, expect, it } from "vitest";

import { authErrorMessage, RATE_LIMITED_MESSAGE } from "./errors";

/**
 * Our API's 429 and 500 bodies carry `error`, not the `message` Better Auth
 * reads, so these reach forms with no message. Sign-in used to show its
 * fallback, "Invalid email or password", for both: a rate-limited or broken
 * server looked like a wrong password.
 */
describe("authErrorMessage", () => {
  it("uses Better Auth's message when there is one", () => {
    expect(authErrorMessage({ message: "User already exists", status: 422 }, "x")).toBe(
      "User already exists"
    );
  });

  it("says 'wait' for a rate limit, whatever the caller's fallback", () => {
    expect(authErrorMessage({ status: 429 }, "Invalid email or password.")).toBe(
      RATE_LIMITED_MESSAGE
    );
    expect(authErrorMessage({ message: "Too many requests", status: 429 }, "x")).toBe(
      RATE_LIMITED_MESSAGE
    );
  });

  it("falls back for a message-less error, and for blank messages", () => {
    expect(authErrorMessage({ status: 500 }, "Sign-in failed.")).toBe("Sign-in failed.");
    expect(authErrorMessage({ message: "   ", status: 500 }, "Sign-in failed.")).toBe(
      "Sign-in failed."
    );
    expect(authErrorMessage(null, "Sign-in failed.")).toBe("Sign-in failed.");
  });
});
