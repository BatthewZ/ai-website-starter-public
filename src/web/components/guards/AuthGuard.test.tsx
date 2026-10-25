import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { useSession } = vi.hoisted(() => ({ useSession: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({ useSession }));

import { AuthGuard } from "./AuthGuard";

/**
 * AuthGuard is the only thing between a signed-out visitor and every
 * signed-in page, so each of its three states is pinned here against the real
 * r-ui `RequireAuth` and a real router.
 */
describe("AuthGuard", () => {
  beforeEach(() => {
    useSession.mockReset();
  });

  it("renders the page for a signed-in user", () => {
    useSession.mockReturnValue({ data: { user: { id: "1" } }, isPending: false });
    renderWithRouter(
      <AuthGuard>
        <p>Protected</p>
      </AuthGuard>,
      { route: "/settings", path: "/settings" }
    );
    expect(screen.getByText("Protected")).toBeInTheDocument();
  });

  it("never renders the page while the session is loading, and says why", () => {
    useSession.mockReturnValue({ data: null, isPending: true });
    renderWithRouter(
      <AuthGuard>
        <p>Protected</p>
      </AuthGuard>,
      { route: "/settings", path: "/settings" }
    );
    expect(screen.queryByText("Protected")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Checking your session…");
  });

  it("sends a signed-out visitor to /login, remembering the page they asked for", async () => {
    useSession.mockReturnValue({ data: null, isPending: false });
    renderWithRouter(
      <AuthGuard>
        <p>Protected</p>
      </AuthGuard>,
      { route: "/settings?tab=security", path: "/settings" }
    );

    const location = await screen.findByTestId("location");
    expect(location).toHaveTextContent("/login");
    expect(JSON.parse(location.dataset.state ?? "null")).toEqual({
      from: "/settings?tab=security",
    });
    expect(screen.queryByText("Protected")).not.toBeInTheDocument();
  });
});
