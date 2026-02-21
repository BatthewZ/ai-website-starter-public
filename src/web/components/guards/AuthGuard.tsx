import { Navigate } from "react-router-dom";

import { Center } from "@/web/components/layout";
import { Spinner } from "@/web/components/ui";
import { useSession } from "@/web/lib/auth/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Center className="min-h-screen">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
