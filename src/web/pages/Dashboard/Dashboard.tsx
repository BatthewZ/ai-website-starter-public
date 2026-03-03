import { AuthenticatedLayout, Container, Divider, Row, Stack } from "@/web/components/layout";
import { Alert, Badge, Card, Skeleton, Text } from "@/web/components/ui";
import { useApi } from "@/web/hooks/use-api";
import { useDocumentTitle } from "@/web/hooks/use-document-title";
import { useSession } from "@/web/lib/auth/auth-client";

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
  const { data: session } = useSession();
  const { data: me, error: apiError, loading: apiLoading } = useApi<MeResponse>("/api/me");

  return (
    <AuthenticatedLayout>
      <Container size="lg">
        <Stack gap="r3" className="py-r2">
          <Text variant="h3">Hello, {session?.user?.name}!</Text>
          <Text variant="body-1" color="secondary">
            {session?.user?.email}
          </Text>

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
    </AuthenticatedLayout>
  );
}

export default Dashboard;
