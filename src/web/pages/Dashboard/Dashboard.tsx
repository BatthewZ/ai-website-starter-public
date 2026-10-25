import {
  Badge,
  Card,
  CopyButton,
  DescriptionList,
  ErrorFallback,
  Inline,
  MISSING,
  Skeleton,
  Stack,
  useLocale,
  useToast,
} from "@batthewz/r-ui-react-components";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { AuthenticatedLayout } from "@/web/components/layout";
import { useApi } from "@/web/hooks/use-api";
import { useSession } from "@/web/lib/auth/auth-client";
import { EMAIL_VERIFIED_PARAM, readVerificationResult } from "@/web/lib/auth/verification";

import { VerifyEmailAlert } from "./components/VerifyEmailAlert";

/** `GET /api/me`: the signed-in user as the API sees them (JSON, so dates are strings). */
export interface MeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

/**
 * The signed-in landing page. Its account card is read from our own protected
 * API (`/api/me`, behind `requireAuth`) rather than from the session already in
 * memory, so a new deployment proves the whole path at a glance: cookie ->
 * Worker -> auth middleware -> D1 -> JSON. A failure shows here with a retry
 * instead of a blank card.
 */
export function Dashboard() {
  const { data: session } = useSession();
  const { data: me, error, loading, refetch } = useApi<MeResponse>("/api/me");
  const firstName = session?.user.name.split(" ")[0];
  useVerificationLinkResult();

  return (
    <AuthenticatedLayout title="Dashboard">
      <Stack gap="r2">
        <p className="text-body-1 text-fg-secondary">
          {firstName ? `Welcome back, ${firstName}.` : "Welcome back."} This is your starting point:
          replace this page with your app.
        </p>

        {me && !me.user.emailVerified && <VerifyEmailAlert email={me.user.email} />}

        <Card>
          <Card.Header>
            <Card.Title as="h2">Your account</Card.Title>
            <Card.Description>Loaded from the protected API route GET /api/me.</Card.Description>
          </Card.Header>
          <Card.Body>
            {error ? (
              <ErrorFallback onRetry={refetch}>{error}</ErrorFallback>
            ) : loading || !me ? (
              <Skeleton lines={5} label="Loading your account" />
            ) : (
              <AccountDetails user={me.user} />
            )}
          </Card.Body>
        </Card>
      </Stack>
    </AuthenticatedLayout>
  );
}

/**
 * Reports the outcome of an email verification link, which lands here
 * (`EMAIL_VERIFIED_CALLBACK`), as a toast, then removes the parameters so a
 * reload or a shared URL does not report it again. The toast id makes the
 * report idempotent (StrictMode runs effects twice in development).
 */
function useVerificationLinkResult() {
  const [params, setParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const result = readVerificationResult(params);
    if (!result) return;
    toast(
      result.ok
        ? {
            id: "email-verification",
            title: "Email verified",
            description: "Thanks for confirming your address.",
            tone: "success",
          }
        : {
            id: "email-verification",
            title: "Couldn't verify your email",
            description: result.message,
            tone: "error",
          }
    );
    const rest = new URLSearchParams(params);
    rest.delete(EMAIL_VERIFIED_PARAM);
    rest.delete("error");
    setParams(rest, { replace: true });
  }, [params, setParams, toast]);
}

function AccountDetails({ user }: MeResponse) {
  const locale = useLocale();
  const created = new Date(user.createdAt);
  const memberSince = Number.isNaN(created.getTime())
    ? MISSING
    : new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(created);

  return (
    <DescriptionList variant="divided">
      <DescriptionList.Item term="Name">{user.name}</DescriptionList.Item>
      <DescriptionList.Item term="Email">
        <Inline gap="r5">
          <span className="min-w-0 break-all">{user.email}</span>
          {user.emailVerified ? (
            <Badge tone="success">Verified</Badge>
          ) : (
            <Badge tone="warning">Not verified</Badge>
          )}
        </Inline>
      </DescriptionList.Item>
      <DescriptionList.Item term="User ID">
        <Inline gap="r5" wrap={false}>
          <code className="min-w-0 truncate font-mono text-body-2">{user.id}</code>
          <CopyButton value={user.id} labels={{ copy: "Copy user ID" }} />
        </Inline>
      </DescriptionList.Item>
      <DescriptionList.Item term="Member since">{memberSince}</DescriptionList.Item>
    </DescriptionList>
  );
}

export default Dashboard;
