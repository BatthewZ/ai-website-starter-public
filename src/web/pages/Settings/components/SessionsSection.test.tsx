import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithRouter } from "@/web/test-utils";

const auth = vi.hoisted(() => ({
  useSession: vi.fn(),
  listSessions: vi.fn(),
  revokeSession: vi.fn(),
  revokeOtherSessions: vi.fn(),
}));
vi.mock("@/web/lib/auth/auth-client", () => auth);

import { SessionsSection } from "./SessionsSection";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const LINUX_FIREFOX = "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0";

const rows = [
  {
    id: "current",
    token: "t-current",
    createdAt: new Date(Date.now() - 60_000),
    userAgent: LINUX_FIREFOX,
    ipAddress: "10.0.0.1",
  },
  {
    id: "phone",
    token: "t-phone",
    createdAt: new Date(Date.now() - 3 * 86_400_000),
    userAgent: IPHONE,
    ipAddress: "10.0.0.2",
  },
];

describe("SessionsSection", () => {
  beforeEach(() => {
    for (const fn of Object.values(auth)) fn.mockReset();
    auth.useSession.mockReturnValue({ data: { session: { id: "current" } } });
    auth.listSessions.mockResolvedValue({ data: rows, error: null });
  });

  it("lists devices, marks this one, and only offers to sign out the others", async () => {
    renderWithRouter(<SessionsSection refreshKey={0} />);
    const list = await screen.findByRole("list", { name: "Sessions" });
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Firefox on Linux");
    expect(items[0]).toHaveTextContent("This device");
    expect(within(items[0]).queryByRole("button")).not.toBeInTheDocument();
    expect(items[1]).toHaveTextContent("Safari on iOS");
    expect(items[1]).toHaveTextContent("3 days ago");
    expect(
      within(items[1]).getByRole("button", { name: "Sign out Safari on iOS" })
    ).toBeInTheDocument();
  });

  it("signs one device out by its token and drops it from the list", async () => {
    auth.revokeSession.mockResolvedValue({ data: {}, error: null });
    renderWithRouter(<SessionsSection refreshKey={0} />);
    await userEvent
      .setup()
      .click(await screen.findByRole("button", { name: "Sign out Safari on iOS" }));

    await waitFor(() => expect(screen.queryByText("Safari on iOS")).not.toBeInTheDocument());
    expect(auth.revokeSession).toHaveBeenCalledWith({ token: "t-phone" });
  });

  it("keeps the list and explains when a sign-out fails", async () => {
    auth.revokeSession.mockResolvedValue({
      data: null,
      error: { message: "Session not found", status: 404 },
    });
    renderWithRouter(<SessionsSection refreshKey={0} />);
    await userEvent
      .setup()
      .click(await screen.findByRole("button", { name: "Sign out Safari on iOS" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Session not found");
    expect(screen.getByText("Safari on iOS")).toBeInTheDocument();
  });

  it("shows a load failure in place, with a retry that loads again", async () => {
    auth.listSessions.mockResolvedValueOnce({
      data: null,
      error: { message: "Too many requests", status: 429 },
    });
    renderWithRouter(<SessionsSection refreshKey={0} />);

    expect(await screen.findByText(/Too many attempts/)).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Safari on iOS")).toBeInTheDocument();
    expect(auth.listSessions).toHaveBeenCalledTimes(2);
  });

  it("reloads, in place, when the refresh key changes", async () => {
    // Bumped by state in a parent, as Settings does, so the section stays
    // mounted: a remount would refetch anyway and prove nothing.
    function Harness() {
      const [key, setKey] = useState(0);
      return (
        <>
          <button onClick={() => setKey((k) => k + 1)}>bump</button>
          <SessionsSection refreshKey={key} />
        </>
      );
    }
    renderWithRouter(<Harness />);
    await screen.findByText("Safari on iOS");
    expect(auth.listSessions).toHaveBeenCalledTimes(1);

    auth.listSessions.mockResolvedValue({ data: [rows[0]], error: null });
    await userEvent.setup().click(screen.getByRole("button", { name: "bump" }));

    await waitFor(() => expect(screen.queryByText("Safari on iOS")).not.toBeInTheDocument());
    expect(auth.listSessions).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Firefox on Linux")).toBeInTheDocument();
  });
});
