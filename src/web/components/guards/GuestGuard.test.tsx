import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { useSession } = vi.hoisted(() => ({ useSession: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({ useSession }));

import { GuestGuard } from "./GuestGuard";

/**
 * GuestGuard is also what moves a user on after sign-in (the session store
 * updates, this redirects), so where it sends them is the post-sign-in
 * destination. These pin that it honours AuthGuard's remembered page and
 * refuses anything that would leave the site.
 */
describe("GuestGuard", () => {
  beforeEach(() => {
    useSession.mockReset();
  });

  it("renders the sign-in form for a signed-out visitor", () => {
    useSession.mockReturnValue({ data: null, isPending: false });
    renderWithRouter(
      <GuestGuard>
        <p>Sign-in form</p>
      </GuestGuard>,
      { route: "/login", path: "/login" }
    );
    expect(screen.getByText("Sign-in form")).toBeInTheDocument();
  });

  it("shows a status, not the form, while the session is loading", () => {
    useSession.mockReturnValue({ data: null, isPending: true });
    renderWithRouter(
      <GuestGuard>
        <p>Sign-in form</p>
      </GuestGuard>,
      { route: "/login", path: "/login" }
    );
    expect(screen.queryByText("Sign-in form")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Checking your session…");
  });

  it("sends a signed-in user to the dashboard by default", () => {
    useSession.mockReturnValue({ data: { user: { id: "1" } }, isPending: false });
    renderWithRouter(
      <GuestGuard>
        <p>Sign-in form</p>
      </GuestGuard>,
      { route: "/login", path: "/login" }
    );
    expect(screen.getByTestId("location")).toHaveTextContent("/dashboard");
  });

  it("returns a signed-in user to the page AuthGuard remembered", () => {
    useSession.mockReturnValue({ data: { user: { id: "1" } }, isPending: false });
    renderWithRouter(
      <GuestGuard>
        <p>Sign-in form</p>
      </GuestGuard>,
      {
        route: "/login",
        path: "/login",
        state: { from: "/settings?tab=security" },
      }
    );
    expect(screen.getByTestId("location")).toHaveTextContent("/settings?tab=security");
  });

  it("ignores a remembered page on another origin", () => {
    useSession.mockReturnValue({ data: { user: { id: "1" } }, isPending: false });
    renderWithRouter(
      <GuestGuard>
        <p>Sign-in form</p>
      </GuestGuard>,
      {
        route: "/login",
        path: "/login",
        state: { from: "//evil.example/phish" },
      }
    );
    expect(screen.getByTestId("location")).toHaveTextContent("/dashboard");
  });
});
