import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Container, Divider, Row, Spacer, Stack } from "@/web/components/layout";
import { Alert, Badge, Button, Card, Skeleton, Text } from "@/web/components/ui";
import { useApi } from "@/web/hooks/use-api";
import { useDocumentTitle } from "@/web/hooks/use-document-title";
import { signOut, useSession } from "@/web/lib/auth/auth-client";

/** TODO: Replace with your app name */
const APP_NAME = "App Name";

interface MeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

export function Dashboard() {
  useDocumentTitle("Dashboard");
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { data: me, error: apiError, loading: apiLoading } = useApi<MeResponse>("/api/me");
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      void navigate("/login");
    } catch (e) {
      console.error(e);
      setSignOutError("Failed to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Stack className="min-h-screen bg-surface-1">
      <Row className="px-r3 py-r5 bg-surface-0 border-b border-border-default">
        <Text variant="h6">{APP_NAME}</Text>
        <Spacer />
        <Button as={Link} to="/settings" variant="ghost" size="sm">
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
        >
          {signingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </Row>

      <Container size="lg">
        <Stack gap="r3" className="py-r2">
          <Text variant="h3">Hello, {session?.user?.name}!</Text>
          <Text variant="body-1" color="secondary">
            {session?.user?.email}
          </Text>

          {signOutError && <Alert variant="error">{signOutError}</Alert>}
          {apiError && <Alert variant="error">{apiError}</Alert>}

          <Card>
            <Stack gap="r4">
              <Text variant="h5">Your Account</Text>
              <Divider />
              <Row justify="between">
                <Text variant="body-2" color="secondary">
                  Status
                </Text>
                <Badge variant="success">Active</Badge>
              </Row>
              <Row justify="between">
                <Text variant="body-2" color="secondary">
                  User ID
                </Text>
                <Text variant="body-2">{apiLoading ? <Skeleton variant="text" width="10ch" /> : (me?.user?.id ?? "—")}</Text>
              </Row>
              <Row justify="between">
                <Text variant="body-2" color="secondary">
                  Member since
                </Text>
                <Text variant="body-2">
                  {apiLoading
                    ? <Skeleton variant="text" width="10ch" />
                    : me?.user?.createdAt
                      ? new Date(me.user.createdAt).toLocaleDateString()
                      : "—"}
                </Text>
              </Row>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Stack>
  );
}

export default Dashboard;
