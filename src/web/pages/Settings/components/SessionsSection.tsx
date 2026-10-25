import {
  Alert,
  Badge,
  Button,
  Card,
  ErrorFallback,
  Skeleton,
  useLocale,
} from "@batthewz/r-ui-react-components";
import { Monitor } from "lucide-react";
import { useEffect, useState } from "react";

import {
  listSessions,
  revokeOtherSessions,
  revokeSession,
  useSession,
} from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";
import { relativeTime } from "@/web/lib/relative-time";
import { describeUserAgent } from "@/web/lib/user-agent";

interface SessionRow {
  id: string;
  token: string;
  createdAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}

interface SessionsSectionProps {
  /** Bump to reload the list (e.g. after a password change signed other devices out). */
  refreshKey: number;
}

/**
 * Every signed-in device, newest first, with a way to sign each one out. The
 * current device is marked and cannot be revoked here (that is "Sign out").
 * Load failures show in place with a retry; revoke failures as an alert above
 * the list, leaving the list as it was.
 */
export function SessionsSection({ refreshKey }: SessionsSectionProps) {
  const locale = useLocale();
  const { data: current } = useSession();
  const currentId = current?.session.id;

  const [sessions, setSessions] = useState<SessionRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  /** What is being signed out: one session's token, every other session, or nothing. */
  const [revoking, setRevoking] = useState<{ token: string } | "others" | null>(null);

  // Bumped by the error fallback's "Try again".
  const [attempt, setAttempt] = useState(0);

  // State is only set in the request's callbacks, and `ignore` drops a
  // response that arrives after unmount or after a newer load started (a
  // refresh racing a retry), so the list never shows an older answer.
  useEffect(() => {
    let ignore = false;
    listSessions()
      .then(({ data, error }) => {
        if (ignore) return;
        if (error) {
          setLoadError(authErrorMessage(error, "We couldn't load your sessions."));
          return;
        }
        const rows = (data ?? []) as SessionRow[];
        setLoadError(null);
        setSessions(
          [...rows].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      })
      .catch(() => {
        if (!ignore) setLoadError(NETWORK_ERROR_MESSAGE);
      });
    return () => {
      ignore = true;
    };
  }, [refreshKey, attempt]);

  function retry() {
    setLoadError(null);
    setSessions(null);
    setAttempt((n) => n + 1);
  }

  async function revoke(target: SessionRow | "others") {
    setRevoking(target === "others" ? "others" : { token: target.token });
    setActionError(null);
    try {
      const { error } =
        target === "others"
          ? await revokeOtherSessions()
          : await revokeSession({ token: target.token });
      if (error) {
        setActionError(
          authErrorMessage(error, "We couldn't sign that device out. Please try again.")
        );
        return;
      }
      setSessions((rows) =>
        (rows ?? []).filter((row) =>
          target === "others" ? row.id === currentId : row.token !== target.token
        )
      );
    } catch {
      setActionError(NETWORK_ERROR_MESSAGE);
    } finally {
      setRevoking(null);
    }
  }

  const others = (sessions ?? []).filter((row) => row.id !== currentId);

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Signed-in devices</Card.Title>
        <Card.Description>Sign out anywhere you don&apos;t recognise.</Card.Description>
        {others.length > 0 && (
          <Card.Actions>
            <Button
              variant="secondary"
              loading={revoking === "others"}
              onClick={() => void revoke("others")}
            >
              Sign out other devices
            </Button>
          </Card.Actions>
        )}
      </Card.Header>
      <Card.Body>
        {loadError ? (
          <ErrorFallback onRetry={retry}>{loadError}</ErrorFallback>
        ) : sessions === null ? (
          <Skeleton lines={4} label="Loading your sessions" />
        ) : (
          <div className="grid gap-r3">
            {actionError && (
              <Alert tone="error" onDismiss={() => setActionError(null)}>
                {actionError}
              </Alert>
            )}
            <ul className="divide-y rounded-md border" aria-label="Sessions">
              {sessions.map((row) => {
                const isCurrent = row.id === currentId;
                const details = [
                  row.ipAddress,
                  `signed in ${relativeTime(new Date(row.createdAt), locale)}`,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <li key={row.id} className="flex min-h-row items-center gap-r3 px-r3 py-r4">
                    <Monitor aria-hidden className="size-icon shrink-0 text-fg-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-x-r4 text-body-2 font-medium">
                        {describeUserAgent(row.userAgent)}
                        {isCurrent && <Badge tone="accent">This device</Badge>}
                      </p>
                      <p className="truncate text-body-3 text-fg-secondary">{details}</p>
                    </div>
                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        loading={
                          revoking !== null && revoking !== "others" && revoking.token === row.token
                        }
                        disabled={revoking === "others"}
                        onClick={() => void revoke(row)}
                        aria-label={`Sign out ${describeUserAgent(row.userAgent)}`}
                      >
                        Sign out
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
