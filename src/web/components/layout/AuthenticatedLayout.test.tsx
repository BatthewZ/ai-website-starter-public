import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NAV_ITEMS } from "@/web/lib/navigation";
import { THEMES } from "@/web/lib/themes";
import { renderWithRouter } from "@/web/test-utils";

const { useSession, signOut } = vi.hoisted(() => ({ useSession: vi.fn(), signOut: vi.fn() }));
vi.mock("@/web/lib/auth/auth-client", () => ({ useSession, signOut }));

import { AuthenticatedLayout } from "./AuthenticatedLayout";

const session = {
  data: {
    user: { name: "Ada Lovelace", email: "ada@example.com", image: null },
    session: { id: "s1" },
  },
  isPending: false,
};

/**
 * The signed-in shell, rendered with the real r-ui AppShell, menus and
 * router wiring. It is on every signed-in page, so a regression here (a nav
 * link that stops navigating, a theme the menu stops offering, a sign-out that
 * fails silently) reaches every user.
 */
describe("AuthenticatedLayout", () => {
  beforeEach(() => {
    useSession.mockReset();
    signOut.mockReset();
    useSession.mockReturnValue(session);
  });

  it("renders the page title as the h1 and the content in the main landmark", () => {
    renderWithRouter(
      <AuthenticatedLayout title="Dashboard">
        <p>Page content</p>
      </AuthenticatedLayout>
    );
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(screen.getByText("Page content"));
  });

  it("links every destination and marks the current page", () => {
    renderWithRouter(<AuthenticatedLayout title="Settings">x</AuthenticatedLayout>, {
      route: "/settings",
    });
    const nav = screen.getAllByRole("navigation", { name: "Primary" })[0];
    for (const item of NAV_ITEMS) {
      expect(within(nav).getByRole("link", { name: item.label })).toHaveAttribute(
        "href",
        item.href
      );
    }
    expect(within(nav).getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(within(nav).getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  /**
   * r-ui offers only the themes it is handed and ships no list of its own, so
   * a menu that silently lost the list still renders. Asserting every theme by
   * name is what distinguishes a working switcher from a switcher-shaped one.
   */
  it("offers every app theme in the preferences menu", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AuthenticatedLayout title="Dashboard">x</AuthenticatedLayout>);
    // "View" is r-ui's default trigger label for the preferences menu.
    await user.click(screen.getByRole("button", { name: "View" }));
    const menu = await screen.findByRole("menu");
    for (const theme of THEMES) {
      expect(within(menu).getByRole("menuitemradio", { name: theme.label })).toBeInTheDocument();
    }
  });

  it("signs out from the account menu and goes to /login", async () => {
    signOut.mockResolvedValue({ data: {}, error: null });
    const user = userEvent.setup();
    renderWithRouter(<AuthenticatedLayout title="Dashboard">x</AuthenticatedLayout>, {
      route: "/dashboard",
    });

    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    expect(await screen.findByText("ada@example.com")).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));

    await waitFor(() => expect(screen.getByTestId("location")).toHaveTextContent("/login"));
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("says so when sign-out fails, and stays put", async () => {
    signOut.mockResolvedValue({
      data: null,
      error: { message: "Server unavailable", status: 503 },
    });
    const user = userEvent.setup();
    renderWithRouter(<AuthenticatedLayout title="Dashboard">x</AuthenticatedLayout>, {
      route: "/dashboard",
    });

    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));

    expect(await screen.findByText("Sign-out failed")).toBeInTheDocument();
    expect(screen.getByText("Server unavailable")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/dashboard");
  });
});
