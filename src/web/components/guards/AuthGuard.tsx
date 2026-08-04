import { Center, Spinner } from "@batthewz/response-ui-react-components";
import { Navigate } from "react-router-dom";

import { useSession } from "@/web/lib/auth/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Center className="min-h-screen">
        {/*
          The children are what make this spinner announce. As of
          @batthewz/response-ui-react-components 0.15.0 a bare <Spinner /> is
          decoration — aria-hidden, no role — because N spinners on a page would
          otherwise be N role="status" live regions. This is the whole screen's
          only content while the session resolves, so it is exactly the case
          that should be the status region, in our own words.
        */}
        <Spinner size="lg">Checking your session…</Spinner>
      </Center>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
