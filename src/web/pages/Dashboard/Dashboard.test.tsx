import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const { useSession } = vi.hoisted(() => ({ useSession: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({
  useSession,
  signOut: vi.fn(),
  sendVerificationEmail: vi.fn(),
}));

import { Dashboard, type MeResponse } from "./Dashboard";

const me: MeResponse = {
  user: {
    id: "usr_123",
    name: "Ada Lovelace",
    email: "ada@example.com",
    emailVerified: false,
    createdAt: "2026-01-15T10:00:00.000Z",
  },
};

function respond(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: `Status ${status}`,
    json: () => Promise.resolve(body),
  };
}

/**
 * The dashboard's card is the starter's end-to-end smoke test (cookie ->
 * Worker -> auth -> D1 -> JSON), so a failure must be visible and retryable,
 * never a blank card. `fetch` is the mocked boundary; the hook and every r-ui
 * component are real.
 */
describe("Dashboard", () => {
  beforeEach(() => {
    useSession.mockReset();
    useSession.mockReturnValue({
      data: { user: { name: "Ada Lovelace", email: "ada@example.com" }, session: { id: "s" } },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the account from GET /api/me", async () => {
    const fetchMock = vi.fn().mockResolvedValue(respond(200, me));
    vi.stubGlobal("fetch", fetchMock);
    renderWithRouter(<Dashboard />, { route: "/dashboard" });

    expect(screen.getByText("Welcome back, Ada.", { exact: false })).toBeInTheDocument();
    expect(await screen.findByText("usr_123")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/me",
      expect.objectContaining({ credentials: "include" })
    );

    const details = screen.getByText("usr_123").closest("dl")!;
    expect(within(details).getByText("ada@example.com")).toBeInTheDocument();
    expect(within(details).getByText("Not verified")).toBeInTheDocument();
    expect(within(details).getByText("January 15, 2026")).toBeInTheDocument();
  });

  it("shows the API's error with a retry that refetches", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respond(500, { error: "Database unavailable" }))
      .mockResolvedValueOnce(respond(200, me));
    vi.stubGlobal("fetch", fetchMock);
    renderWithRouter(<Dashboard />, { route: "/dashboard" });

    expect(await screen.findByText("Database unavailable")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("usr_123")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("asks an unverified user to verify, and not a verified one", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respond(200, me)));
    const { unmount } = renderWithRouter(<Dashboard />, { route: "/dashboard" });
    expect(await screen.findByText("Verify your email address")).toBeInTheDocument();
    unmount();

    const verified = { user: { ...me.user, emailVerified: true } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respond(200, verified)));
    renderWithRouter(<Dashboard />, { route: "/dashboard" });
    expect(await screen.findByText("Verified")).toBeInTheDocument();
    expect(screen.queryByText("Verify your email address")).not.toBeInTheDocument();
  });

  /**
   * The verification link lands here. Its outcome is reported once and the
   * parameters removed, so a reload or a copied URL does not report it again.
   */
  it.each([
    ["/dashboard?email-verified=1", "Email verified"],
    ["/dashboard?email-verified=1&error=TOKEN_EXPIRED", "Couldn't verify your email"],
  ])("reports the result of %s and cleans the URL", async (route, title) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respond(200, me)));
    renderWithRouter(<Dashboard />, { route });

    expect(await screen.findByText(title)).toBeInTheDocument();
    expect(screen.getByTestId("location").textContent).toBe("/dashboard");
  });
});
