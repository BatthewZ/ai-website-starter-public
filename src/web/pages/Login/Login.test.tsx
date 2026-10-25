import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { signInEmail } = vi.hoisted(() => ({ signInEmail: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({ signIn: { email: signInEmail } }));

import { Login } from "./Login";

/**
 * The sign-in form against real r-ui form controls. Better Auth is the only
 * mock: it is the network boundary. These pin what a user sees in each
 * outcome, because each one has failed silently before in some app: a blank
 * alert, a stuck spinner, a redirect to the wrong page.
 */
describe("Login", () => {
  beforeEach(() => {
    signInEmail.mockReset();
  });

  async function fillAndSubmit(email: string, password: string) {
    const user = userEvent.setup();
    if (email) await user.type(screen.getByLabelText(/^Email/), email);
    if (password) await user.type(screen.getByLabelText(/^Password/), password);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    return user;
  }

  it("validates before calling the server, and focuses the first invalid field", async () => {
    renderWithRouter(<Login />, { route: "/login", path: "/login" });
    await fillAndSubmit("not-an-email", "");

    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Enter your password")).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toHaveFocus();
    expect(signInEmail).not.toHaveBeenCalled();
  });

  it("signs in and goes to the dashboard", async () => {
    signInEmail.mockResolvedValue({ data: {}, error: null });
    renderWithRouter(<Login />, { route: "/login", path: "/login" });
    await fillAndSubmit("ada@example.com", "correct horse");

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/dashboard"));
    expect(signInEmail).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "correct horse",
    });
  });

  it("returns to the page the guard remembered", async () => {
    signInEmail.mockResolvedValue({ data: {}, error: null });
    renderWithRouter(<Login />, { route: "/login", path: "/login", state: { from: "/settings" } });
    await fillAndSubmit("ada@example.com", "correct horse");

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/settings"));
  });

  it("shows Better Auth's rejection as a focused form-level alert", async () => {
    signInEmail.mockResolvedValue({
      data: null,
      error: { message: "Invalid email or password", status: 401 },
    });
    renderWithRouter(<Login />, { route: "/login", path: "/login" });
    await fillAndSubmit("ada@example.com", "wrong password");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Invalid email or password");
    await waitFor(() => expect(alert).toHaveFocus());
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
  });

  it("falls back to a readable message when the server sends none", async () => {
    signInEmail.mockResolvedValue({ data: null, error: { message: "", status: 500 } });
    renderWithRouter(<Login />, { route: "/login", path: "/login" });
    await fillAndSubmit("ada@example.com", "whatever1");

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid email or password.");
  });

  it("reports a network failure instead of hanging", async () => {
    signInEmail.mockImplementation(() => Promise.reject(new TypeError("Failed to fetch")));
    renderWithRouter(<Login />, { route: "/login", path: "/login" });
    await fillAndSubmit("ada@example.com", "whatever1");

    expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't reach the server");
    expect(screen.getByRole("button", { name: "Sign in" })).not.toHaveAttribute(
      "aria-busy",
      "true"
    );
  });

  it("links to registration and password reset", () => {
    renderWithRouter(<Login />, { route: "/login", path: "/login" });
    expect(screen.getByRole("link", { name: "Create one" })).toHaveAttribute("href", "/register");
    expect(screen.getByRole("link", { name: "Forgot your password?" })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });
});
