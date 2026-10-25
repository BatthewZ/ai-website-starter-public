import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { resetPassword } = vi.hoisted(() => ({ resetPassword: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({ resetPassword }));

import { ResetPassword } from "./ResetPassword";

/**
 * Better Auth sends people here three ways (good token, INVALID_TOKEN, or a
 * hand-typed URL with nothing); each must leave them a way forward.
 */
describe("ResetPassword", () => {
  beforeEach(() => {
    resetPassword.mockReset();
  });

  it.each([
    ["no token", "/reset-password"],
    ["an expired or used link", "/reset-password?error=INVALID_TOKEN"],
  ])("offers a new link for %s", (_label, route) => {
    renderWithRouter(<ResetPassword />, { route, path: "/reset-password" });
    expect(screen.getByRole("alert")).toHaveTextContent("This link can't be used");
    expect(screen.getByRole("link", { name: "Request a new link" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
    expect(screen.queryByLabelText(/^New password/)).not.toBeInTheDocument();
  });

  it("requires the two passwords to match", async () => {
    renderWithRouter(<ResetPassword />, {
      route: "/reset-password?token=abc",
      path: "/reset-password",
    });
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^New password/), "a new passphrase");
    await user.type(screen.getByLabelText(/^Confirm new password/), "a different one");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("resets with the token from the link and confirms", async () => {
    resetPassword.mockResolvedValue({ data: {}, error: null });
    renderWithRouter(<ResetPassword />, {
      route: "/reset-password?token=abc",
      path: "/reset-password",
    });
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^New password/), "a new passphrase");
    await user.type(screen.getByLabelText(/^Confirm new password/), "a new passphrase");
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByText("Your password has been changed.")).toBeInTheDocument();
    expect(resetPassword).toHaveBeenCalledWith({ newPassword: "a new passphrase", token: "abc" });
    expect(screen.getByRole("link", { name: "Sign in with your new password" })).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
