import { describe, expect, it } from "vitest";

import { parseTrustedOrigins, resolveAllowedOrigin } from "./auth";

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
    expect(
      resolveAllowedOrigin("https://trusted.com", baseUrl, "https://trusted.com")
    ).toBe("https://trusted.com");
  });

  it("returns null for unlisted origin", () => {
    expect(resolveAllowedOrigin("https://evil.com", baseUrl)).toBeNull();
  });

  it("returns null for unlisted origin with trusted origins set", () => {
    expect(
      resolveAllowedOrigin("https://evil.com", baseUrl, "https://trusted.com")
    ).toBeNull();
  });

  it("handles undefined trustedOrigins", () => {
    expect(resolveAllowedOrigin(baseUrl, baseUrl, undefined)).toBe(baseUrl);
  });
});
