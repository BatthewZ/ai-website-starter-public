import { RequireAuth } from "@batthewz/r-ui-react-components";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";

import { useSession } from "@/web/lib/auth/auth-client";
import { signInRedirectState } from "@/web/lib/auth/redirect";
import { sessionStatus } from "@/web/lib/auth/session";

/**
 * Renders a page only for a signed-in user.
 *
 * r-ui's `RequireAuth` owns the states (it never renders `children` while the
 * session is loading, so protected content cannot flash), and this binds it to
 * Better Auth and the router: signed out, it replaces the history entry with
 * /login and records where the user was going, so sign-in returns them there
 * (see `postSignInPath`). The fallback with a sign-in link still renders for
 * the moment before the redirect lands, so the page is never blank.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <RequireAuth
      status={sessionStatus(session)}
      signInHref="/login"
      onUnauthenticated={() =>
        void navigate("/login", { replace: true, state: signInRedirectState(location) })
      }
      className="min-h-dvh content-center"
    >
      {children}
    </RequireAuth>
  );
}
