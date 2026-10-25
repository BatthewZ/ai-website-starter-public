import { describe, expect, it, vi } from "vitest";

import { createAuth, parseTrustedOrigins, resolveAllowedOrigin } from "./auth";

describe("parseTrustedOrigins", () => {
  it("returns [] for undefined input", () => {
    expect(parseTrustedOrigins(undefined)).toEqual([]);
  });

  it("returns [] for empty string", () => {
    expect(parseTrustedOrigins("")).toEqual([]);
  });

  it("returns [] for whitespace-only input", () => {
    expect(parseTrustedOrigins("   ")).toEqual([]);
  });

  it("parses a single origin", () => {
    expect(parseTrustedOrigins("https://a.com")).toEqual(["https://a.com"]);
  });

  it("parses comma-separated origins", () => {
    expect(parseTrustedOrigins("https://a.com,https://b.com")).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });

  it("trims whitespace around origins", () => {
    expect(parseTrustedOrigins("https://a.com , https://b.com")).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });

  it("handles trailing comma", () => {
    expect(parseTrustedOrigins("https://a.com,")).toEqual(["https://a.com"]);
  });

  it("handles double comma (empty segment)", () => {
    expect(parseTrustedOrigins("https://a.com,,https://b.com")).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });
});

describe("resolveAllowedOrigin", () => {
  const baseUrl = "http://localhost:8787";

  it("returns origin when it matches baseUrl", () => {
    expect(resolveAllowedOrigin(baseUrl, baseUrl)).toBe(baseUrl);
  });

  it("returns origin when it matches a trusted origin", () => {
    expect(resolveAllowedOrigin("https://trusted.com", baseUrl, "https://trusted.com")).toBe(
      "https://trusted.com"
    );
  });

  it("returns null for unlisted origin", () => {
    expect(resolveAllowedOrigin("https://evil.com", baseUrl)).toBeNull();
  });

  it("returns null for unlisted origin with trusted origins set", () => {
    expect(resolveAllowedOrigin("https://evil.com", baseUrl, "https://trusted.com")).toBeNull();
  });

  it("handles undefined trustedOrigins", () => {
    expect(resolveAllowedOrigin(baseUrl, baseUrl, undefined)).toBe(baseUrl);
  });
});

/**
 * Email verification is "soft": sent at sign-up, signs the user in when the
 * link is clicked, and is sent through the Worker's waitUntil so sign-up does
 * not wait on the email provider. These pin the three settings that make
 * that true; without `sendOnSignUp` no verification email is ever sent (the
 * state this starter shipped in before).
 */
describe("createAuth email verification", () => {
  const env = {
    DB: {} as D1Database,
    BETTER_AUTH_SECRET: "test-secret-at-least-32-characters-long",
    BETTER_AUTH_URL: "http://localhost:8787",
  } as Parameters<typeof createAuth>[0];

  it("sends the verification email on sign-up and signs in from the link", () => {
    const auth = createAuth(env);
    expect(auth.options.emailVerification?.sendOnSignUp).toBe(true);
    expect(auth.options.emailVerification?.autoSignInAfterVerification).toBe(true);
    expect(auth.options.emailAndPassword).not.toHaveProperty("requireEmailVerification");
  });

  it("hands in-request emails to the Worker's waitUntil when given one", () => {
    const waitUntil = vi.fn();
    const auth = createAuth(env, { waitUntil });
    expect(auth.options.advanced?.backgroundTasks?.handler).toBe(waitUntil);
  });

  it("awaits in-request emails when there is no waitUntil", () => {
    expect(createAuth(env).options.advanced?.backgroundTasks).toBeUndefined();
  });
});
