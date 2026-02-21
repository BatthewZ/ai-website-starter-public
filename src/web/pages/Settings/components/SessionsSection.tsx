import { useCallback, useEffect, useState } from "react";

import { Row, Stack } from "@/web/components/layout";
import { Alert, Badge, Button, Card, Skeleton, Text } from "@/web/components/ui";
import {
  listSessions,
  revokeOtherSessions,
  revokeSession,
  useSession,
} from "@/web/lib/auth/auth-client";

interface Session {
  id: string;
  token: string;
  createdAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function parseUserAgent(ua: string | null | undefined): string {
  if (!ua) return "Unknown device";

  let browser = "Unknown browser";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return `${browser} on ${os}`;
}

export function SessionsSection() {
  const { data: sessionData } = useSession();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const currentSessionId = sessionData?.session?.id;

  const fetchSessions = useCallback(async () => {
    setError("");
    try {
      const { data, error: fetchError } = await listSessions();
      if (fetchError) {
        setError(fetchError.message ?? "Failed to load sessions");
        return;
      }
      setSessions((data as Session[]) ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  async function handleRevoke(token: string) {
    setRevokingToken(token);
    setError("");
    try {
      const { error: revokeError } = await revokeSession({ token });
      if (revokeError) {
        setError(revokeError.message ?? "Failed to revoke session");
        return;
      }
      setSessions((prev) => prev.filter((s) => s.token !== token));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setRevokingToken(null);
    }
  }

  async function handleRevokeAll() {
    setRevokingAll(true);
    setError("");
    try {
      const { error: revokeError } = await revokeOtherSessions();
      if (revokeError) {
        setError(revokeError.message ?? "Failed to revoke sessions");
        return;
      }
      setSessions((prev) => prev.filter((s) => s.id === currentSessionId));
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setRevokingAll(false);
    }
  }

  const otherSessions = sessions.filter((s) => s.id !== currentSessionId);

  return (
    <Card>
      <Stack gap="r4">
        <Row className="items-center">
          <Text variant="h5">Active Sessions</Text>
        </Row>

        {loading ? (
          <Stack gap="r5">
            {[0, 1, 2].map((i) => (
              <Row
                key={i}
                className="items-center rounded-md border border-border-default px-r4 py-r4"
              >
                <Stack gap="r6" className="min-w-0 flex-1">
                  <Skeleton variant="text" width="14ch" />
                  <Skeleton variant="text" width="20ch" height="0.75em" />
                </Stack>
              </Row>
            ))}
          </Stack>
        ) : (
          <Stack gap="r4">
            {error && <Alert variant="error">{error}</Alert>}

            <Stack gap="r5">
              {sessions.map((session) => {
                const isCurrent = session.id === currentSessionId;
                return (
                  <Row
                    key={session.id}
                    className="items-center rounded-md border border-border-default px-r4 py-r4"
                  >
                    <Stack gap="r6" className="min-w-0 flex-1">
                      <Row gap="r5" className="items-center">
                        <Text variant="body-2" className="font-medium">
                          {parseUserAgent(session.userAgent)}
                        </Text>
                        {isCurrent && <Badge variant="success">Current</Badge>}
                      </Row>
                      <Row gap="r4" className="flex-wrap">
                        {session.ipAddress && (
                          <Text variant="body-3" color="secondary">
                            {session.ipAddress}
                          </Text>
                        )}
                        <Text variant="body-3" color="secondary">
                          Created {formatDate(session.createdAt)}
                        </Text>
                      </Row>
                    </Stack>
                    {!isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleRevoke(session.token)}
                        disabled={revokingToken === session.token}
                      >
                        {revokingToken === session.token ? "Revoking..." : "Revoke"}
                      </Button>
                    )}
                  </Row>
                );
              })}
            </Stack>

            {otherSessions.length === 0 && !loading && (
              <Text variant="body-2" color="secondary">
                No other active sessions.
              </Text>
            )}

            {otherSessions.length > 0 && (
              <div>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => void handleRevokeAll()}
                  disabled={revokingAll}
                >
                  {revokingAll ? "Revoking..." : "Revoke All Other Sessions"}
                </Button>
              </div>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
