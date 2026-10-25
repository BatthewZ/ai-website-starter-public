import { Spinner } from "@batthewz/r-ui-react-components";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useSession } from "@/web/lib/auth/auth-client";
import { postSignInPath } from "@/web/lib/auth/redirect";
import { sessionStatus } from "@/web/lib/auth/session";

/**
 * Renders a page only for a signed-out visitor (sign-in, sign-up, password
 * reset). A signed-in user is sent on to the page `AuthGuard` recorded, else
 * the dashboard.
 *
 * This is also what moves a user on after a successful sign-in or sign-up:
 * Better Auth updates the session store, this guard re-renders and redirects.
 * Reading the same `postSignInPath` as the sign-in page keeps the two from
 * racing to different destinations.
 */
export function GuestGuard({ children }: { children: ReactNode }) {
  const session = useSession();
  const location = useLocation();
  const status = sessionStatus(session);

  if (status === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center">
        {/* The label makes this the page's status region: it is the only thing on screen. */}
        <Spinner label="Checking your session…" className="size-control" />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to={postSignInPath(location.state)} replace />;
  }

  return <>{children}</>;
}
