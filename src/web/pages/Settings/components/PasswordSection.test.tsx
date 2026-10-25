import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { changePassword } = vi.hoisted(() => ({ changePassword: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({
  changePassword,
  useSession: () => ({ data: { user: { email: "ada@example.com" } } }),
}));

import { PasswordSection } from "./PasswordSection";

describe("PasswordSection", () => {
  beforeEach(() => {
    changePassword.mockReset();
  });

  async function submit(current: string, next: string, confirm = next) {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Current password/), current);
    await user.type(screen.getByLabelText(/^New password/), next);
    await user.type(screen.getByLabelText(/^Confirm new password/), confirm);
    await user.click(screen.getByRole("button", { name: "Change password" }));
    return user;
  }

  it("signs other devices out by default, and asks the session list to reload", async () => {
    changePassword.mockResolvedValue({ data: {}, error: null });
    const onRevoked = vi.fn();
    renderWithRouter(<PasswordSection onOtherSessionsRevoked={onRevoked} />);

    expect(screen.getByRole("checkbox", { name: "Sign out of other devices" })).toBeChecked();
    await submit("old password", "new passphrase");

    expect(await screen.findByText("Password changed")).toBeInTheDocument();
    expect(changePassword).toHaveBeenCalledWith({
      currentPassword: "old password",
      newPassword: "new passphrase",
      revokeOtherSessions: true,
    });
    expect(onRevoked).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByLabelText(/^Current password/)).toHaveValue(""));
  });

  it("keeps other devices signed in when unticked", async () => {
    changePassword.mockResolvedValue({ data: {}, error: null });
    const onRevoked = vi.fn();
    renderWithRouter(<PasswordSection onOtherSessionsRevoked={onRevoked} />);

    await userEvent
      .setup()
      .click(screen.getByRole("checkbox", { name: "Sign out of other devices" }));
    await submit("old password", "new passphrase");

    await screen.findByText("Password changed");
    expect(changePassword).toHaveBeenCalledWith(
      expect.objectContaining({ revokeOtherSessions: false })
    );
    expect(onRevoked).not.toHaveBeenCalled();
  });

  it("pins a wrong current password to that field, not the form", async () => {
    changePassword.mockResolvedValue({
      data: null,
      error: { code: "INVALID_PASSWORD", message: "Invalid password", status: 400 },
    });
    renderWithRouter(<PasswordSection onOtherSessionsRevoked={vi.fn()} />);
    await submit("wrong", "new passphrase");

    expect(await screen.findByText("That isn't your current password.")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(/^Current password/)).toHaveFocus());
    expect(screen.getByLabelText(/^Current password/)).toHaveAttribute("aria-invalid", "true");
  });
});
