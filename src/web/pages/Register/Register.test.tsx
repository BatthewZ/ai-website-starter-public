import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { signUpEmail } = vi.hoisted(() => ({ signUpEmail: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({ signUp: { email: signUpEmail } }));

import { Register } from "./Register";

describe("Register", () => {
  beforeEach(() => {
    signUpEmail.mockReset();
  });

  async function fill(name: string, email: string, password: string) {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Name/), name);
    await user.type(screen.getByLabelText(/^Email/), email);
    await user.type(screen.getByLabelText(/^Password/), password);
    return user;
  }

  it("enforces the 8-character minimum before calling the server", async () => {
    renderWithRouter(<Register />, { route: "/register", path: "/register" });
    const user = await fill("Ada", "ada@example.com", "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Password must be at least 8 characters")).toBeInTheDocument();
    expect(signUpEmail).not.toHaveBeenCalled();
  });

  it("shows a strength meter while a password is typed", async () => {
    renderWithRouter(<Register />, { route: "/register", path: "/register" });
    await fill("Ada", "ada@example.com", "a much longer passphrase 42");
    expect(screen.getByRole("meter")).toBeInTheDocument();
  });

  it("creates the account with trimmed values and goes to the dashboard", async () => {
    signUpEmail.mockResolvedValue({ data: {}, error: null });
    renderWithRouter(<Register />, { route: "/register", path: "/register" });
    const user = await fill("  Ada Lovelace  ", "ada@example.com", "analytical engine");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/dashboard"));
    expect(signUpEmail).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "analytical engine",
      // The verification email's link must come back to the dashboard.
      callbackURL: "/dashboard?email-verified=1",
    });
  });

  it("shows the server's reason when the email is taken", async () => {
    signUpEmail.mockResolvedValue({
      data: null,
      error: { message: "User already exists", status: 422 },
    });
    renderWithRouter(<Register />, { route: "/register", path: "/register" });
    const user = await fill("Ada", "ada@example.com", "analytical engine");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("User already exists");
  });
});
