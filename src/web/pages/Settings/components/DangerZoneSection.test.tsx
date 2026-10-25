import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { deleteUser } = vi.hoisted(() => ({ deleteUser: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({
  deleteUser,
  useSession: () => ({ data: { user: { email: "ada@example.com" } } }),
}));

import { DangerZoneSection } from "./DangerZoneSection";

/**
 * Account deletion is irreversible, so the path to it is pinned: it takes an
 * explicit dialog, the password, and a deliberate press of the danger button.
 */
describe("DangerZoneSection", () => {
  beforeEach(() => {
    deleteUser.mockReset();
  });

  async function openDialog() {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Delete account…" }));
    const dialog = await screen.findByRole("alertdialog", { name: "Delete your account?" });
    return { user, dialog };
  }

  it("asks in an alert dialog with Cancel focused, so Enter cannot delete", async () => {
    renderWithRouter(<DangerZoneSection />, { route: "/settings" });
    await openDialog();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("requires the password before calling the server", async () => {
    renderWithRouter(<DangerZoneSection />, { route: "/settings" });
    const { user } = await openDialog();
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    expect(await screen.findByText("Enter your password to confirm")).toBeInTheDocument();
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it("shows a wrong password on the field and keeps the account", async () => {
    deleteUser.mockResolvedValue({
      data: null,
      error: { code: "INVALID_PASSWORD", message: "Invalid password", status: 400 },
    });
    renderWithRouter(<DangerZoneSection />, { route: "/settings" });
    const { user } = await openDialog();
    await user.type(screen.getByLabelText(/^Password/), "wrong");
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    expect(await screen.findByText("That password is incorrect.")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/settings");
  });

  it("deletes with the password and leaves for /login", async () => {
    deleteUser.mockResolvedValue({ data: {}, error: null });
    renderWithRouter(<DangerZoneSection />, { route: "/settings" });
    const { user } = await openDialog();
    await user.type(screen.getByLabelText(/^Password/), "my password");
    await user.click(screen.getByRole("button", { name: "Delete account" }));

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/login"));
    expect(deleteUser).toHaveBeenCalledWith({ password: "my password" });
  });
});
