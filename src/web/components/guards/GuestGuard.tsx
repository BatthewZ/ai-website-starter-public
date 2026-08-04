import { Center, Spinner } from "@batthewz/response-ui-react-components";
import { Navigate } from "react-router-dom";

import { useSession } from "@/web/lib/auth/auth-client";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Center className="min-h-screen">
        {/*
          Children make this spinner announce — see AuthGuard for the reasoning.
          A bare <Spinner /> has been decoration since 0.15.0, and this one is
          the entire screen while the session resolves.
        */}
        <Spinner size="lg">Checking your session…</Spinner>
      </Center>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
