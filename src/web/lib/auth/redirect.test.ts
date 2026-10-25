import { describe, expect, it } from "vitest";

import { AUTHENTICATED_HOME, postSignInPath, signInRedirectState } from "./redirect";
import { sessionStatus } from "./session";

/**
 * `postSignInPath` reads browser history state, which page scripts can
 * write, and its result is navigated to right after a successful sign-in.
 * Each rejected case below is a way to turn sign-in into an open redirect or
 * a redirect loop.
 */
describe("postSignInPath", () => {
  it.each([
    ["/settings", "/settings"],
    ["/settings?tab=security#password", "/settings?tab=security#password"],
  ])("returns the remembered in-app path %s", (from, expected) => {
    expect(postSignInPath({ from })).toBe(expected);
  });

  it.each([
    ["no state", null],
    ["state without from", {}],
    ["a non-string from", { from: 42 }],
    ["an absolute URL", { from: "https://evil.example/" }],
    ["a protocol-relative URL", { from: "//evil.example/" }],
    ["a backslash host", { from: "/\\evil.example/" }],
    ["a relative path", { from: "settings" }],
    ["a guest page (would bounce back to sign-in)", { from: "/login" }],
    ["a guest page with a query", { from: "/reset-password?token=x" }],
  ])("falls back to the dashboard for %s", (_label, state) => {
    expect(postSignInPath(state)).toBe(AUTHENTICATED_HOME);
  });

  it("round-trips what AuthGuard records", () => {
    const state = signInRedirectState({ pathname: "/settings", search: "?a=1", hash: "#x" });
    expect(postSignInPath(state)).toBe("/settings?a=1#x");
  });
});

describe("sessionStatus", () => {
  it("is loading while pending, even with no data yet", () => {
    expect(sessionStatus({ isPending: true, data: null })).toBe("loading");
  });

  it("is authenticated with a session and unauthenticated without", () => {
    expect(sessionStatus({ isPending: false, data: { user: {} } })).toBe("authenticated");
    expect(sessionStatus({ isPending: false, data: null })).toBe("unauthenticated");
  });
});
