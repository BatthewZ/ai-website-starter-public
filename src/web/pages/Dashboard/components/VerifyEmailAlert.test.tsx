import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { sendVerificationEmail } = vi.hoisted(() => ({ sendVerificationEmail: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({ sendVerificationEmail }));

import { VerifyEmailAlert } from "./VerifyEmailAlert";

describe("VerifyEmailAlert", () => {
  beforeEach(() => {
    sendVerificationEmail.mockReset();
  });

  it("resends to the user's address with the dashboard as the link target", async () => {
    sendVerificationEmail.mockResolvedValue({ data: { status: true }, error: null });
    renderWithRouter(<VerifyEmailAlert email="ada@example.com" />);
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Resend verification email" }));

    expect(await screen.findByText("Verification email sent")).toBeInTheDocument();
    expect(sendVerificationEmail).toHaveBeenCalledWith({
      email: "ada@example.com",
      callbackURL: "/dashboard?email-verified=1",
    });
  });

  /** "Try again" would only fail again inside the hour, so a 429 says when. */
  it("explains the hourly limit when rate-limited", async () => {
    sendVerificationEmail.mockResolvedValue({ data: null, error: { status: 429, message: "" } });
    renderWithRouter(<VerifyEmailAlert email="ada@example.com" />);
    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Resend verification email" }));

    expect(await screen.findByText(/try again in an hour/)).toBeInTheDocument();
  });
});
