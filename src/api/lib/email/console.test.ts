import { describe, expect, it, vi } from "vitest";

import { ConsoleEmailService } from "./console";

describe("ConsoleEmailService", () => {
  it("returns an id matching the console-<timestamp> pattern", async () => {
    const service = new ConsoleEmailService();
    vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await service.send({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Hello</p>",
    });
    expect(result.id).toMatch(/^console-\d+$/);
    vi.restoreAllMocks();
  });

  it("logs email details to console", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const service = new ConsoleEmailService();
    await service.send({
      to: "user@example.com",
      subject: "Welcome",
      html: "<p>Hello</p>",
      text: "Hello plain text",
    });
    expect(logSpy).toHaveBeenCalledOnce();
    const loggedMessage = logSpy.mock.calls[0]![0] as string;
    expect(loggedMessage).toContain("user@example.com");
    expect(loggedMessage).toContain("Welcome");
    expect(loggedMessage).toContain("Hello plain text");
    logSpy.mockRestore();
  });

  it("joins multiple recipients with comma", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const service = new ConsoleEmailService();
    await service.send({
      to: ["a@example.com", "b@example.com"],
      subject: "Test",
      html: "<p>Hi</p>",
    });
    const loggedMessage = logSpy.mock.calls[0]![0] as string;
    expect(loggedMessage).toContain("a@example.com, b@example.com");
    logSpy.mockRestore();
  });

  it("shows '(no text content)' when text is not provided", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const service = new ConsoleEmailService();
    await service.send({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Hi</p>",
    });
    const loggedMessage = logSpy.mock.calls[0]![0] as string;
    expect(loggedMessage).toContain("(no text content)");
    logSpy.mockRestore();
  });

  /**
   * Local dev has no other way to receive these emails, so the link must
   * survive intact. A 200-character preview used to cut verification and
   * reset links (which carry long signed tokens) in half.
   */
  it("prints the full text body, so long links stay clickable", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const link = `http://localhost:8787/api/auth/verify-email?token=${"a".repeat(400)}&callbackURL=%2Fdashboard`;
    await new ConsoleEmailService().send({
      to: "test@example.com",
      subject: "Verify",
      html: "<p>Hi</p>",
      text: `Verify your email: ${link}`,
    });
    expect(logSpy.mock.calls[0]![0] as string).toContain(link);
    logSpy.mockRestore();
  });
});
