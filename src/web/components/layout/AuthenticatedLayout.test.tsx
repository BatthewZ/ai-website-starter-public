import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockUseSession = vi.fn();
const mockSignOut = vi.fn();

vi.mock("@/web/lib/auth/auth-client", () => ({
  useSession: () => mockUseSession(),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

// AuthenticatedLayout now consumes AppShell/Button/Text/ThemeSwitcher from the
// npm package. Mock the WHOLE module path once with every export the component
// uses (vitest honors only the last vi.mock per module path).
vi.mock("@batthewz/response-ui-react-components", () => {
  const AppShell = ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="app-shell" {...props}>
      {children as React.ReactNode}
    </div>
  );
  AppShell.Navbar = ({ children }: { children: React.ReactNode }) => (
    <nav>{children}</nav>
  );
  AppShell.Toggle = () => <button>Toggle</button>;
  AppShell.Brand = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  AppShell.NavbarActions = ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  );
  AppShell.Sidebar = ({ children }: { children: React.ReactNode }) => (
    <aside>{children}</aside>
  );
  AppShell.SidebarSection = ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) => (
    <div>
      {title && <div>{title}</div>}
      {children}
    </div>
  );
  AppShell.SidebarLink = ({
    children,
    to,
  }: {
    children: React.ReactNode;
    to: string;
  }) => <a href={to}>{children}</a>;
  AppShell.Main = ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  );
  const Button = ({ children, onClick, disabled }: Record<string, unknown>) => (
    <button onClick={onClick as React.MouseEventHandler} disabled={disabled as boolean}>
      {children as React.ReactNode}
    </button>
  );
  const Text = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;
  /**
   * The mock renders the themes it was handed, rather than swallowing props.
   * That is the point of it: the real ThemeSwitcher offers *only* `default`
   * when `themes` is omitted — "this package does not know your themes and
   * will not guess" — so a switcher that silently lost its list still renders
   * fine and still passes any test that only checks it exists. Exposing the
   * count is what makes that failure visible here.
   */
  const ThemeSwitcher = ({ themes }: { themes?: readonly string[] }) => (
    <div data-testid="theme-switcher" data-theme-count={themes?.length ?? 0}>
      ThemeSwitcher
    </div>
  );
  /**
   * Re-exported because src/web/lib/themes.ts builds APP_THEMES from it, and
   * AuthenticatedLayout imports that module. A partial mock of a barrel breaks
   * every transitive importer, not just the file under test.
   */
  const EXAMPLE_THEMES = ["default", "events", "grimdark", "tech"] as const;
  return { AppShell, Button, Text, ThemeSwitcher, EXAMPLE_THEMES };
});

import { APP_THEMES } from "@/web/lib/themes";

import { AuthenticatedLayout } from "./AuthenticatedLayout";

describe("AuthenticatedLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: { user: { name: "Test User", email: "test@example.com" } },
    });
    mockSignOut.mockResolvedValue(undefined);
  });

  it("renders the app name", () => {
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);
    expect(screen.getByText("App Name")).toBeInTheDocument();
  });

  /**
   * Guards a real regression rather than a hypothetical one. The
   * @batthewz/response-ui-* 0.15.0 upgrade made `themes` effectively required:
   * omitted, ThemeSwitcher offers only `default`, so the navbar switcher went
   * from four themes to one while still rendering perfectly and still passing
   * a presence-only assertion. Asserting the *count* is what distinguishes a
   * working switcher from a switcher-shaped div.
   */
  it("hands the theme switcher every app theme, not just the default", () => {
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);
    const switcher = screen.getByTestId("theme-switcher");
    expect(switcher).toBeInTheDocument();
    expect(Number(switcher.getAttribute("data-theme-count"))).toBe(APP_THEMES.length);
    expect(APP_THEMES.length).toBeGreaterThan(1);
  });

  it("renders Dashboard and Settings navigation links", () => {
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);
    const dashboardLink = screen.getByText("Dashboard");
    const settingsLink = screen.getByText("Settings");

    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.closest("a")).toHaveAttribute("href", "/dashboard");
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink.closest("a")).toHaveAttribute("href", "/settings");
  });

  it("renders user name and email from session", () => {
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("does not render user info when session has no user", () => {
    mockUseSession.mockReturnValue({ data: null });
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("renders Sign Out button", () => {
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);
    expect(
      screen.getByRole("button", { name: "Sign Out" }),
    ).toBeInTheDocument();
  });

  it("calls signOut when Sign Out button is clicked", async () => {
    const user = userEvent.setup();
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);

    await user.click(screen.getByRole("button", { name: "Sign Out" }));

    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it("navigates to /login after successful sign out", async () => {
    const user = userEvent.setup();
    render(<AuthenticatedLayout>Content</AuthenticatedLayout>);

    await user.click(screen.getByRole("button", { name: "Sign Out" }));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders children content", () => {
    render(
      <AuthenticatedLayout>
        <div>Page Content</div>
      </AuthenticatedLayout>,
    );
    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });

  it("renders children inside main element", () => {
    render(
      <AuthenticatedLayout>
        <div data-testid="child">Child</div>
      </AuthenticatedLayout>,
    );
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("child"));
  });
});
