import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { resetPasswordSchema } from "@/shared/schemas/auth";
import { Field, FieldError, Input, Label } from "@/web/components/form";
import { Center, Stack } from "@/web/components/layout";
import { Alert, Button, Card, Text } from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";
import { resetPassword } from "@/web/lib/auth/auth-client";

export function ResetPassword() {
  useDocumentTitle("Reset Password");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = resetPasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await resetPassword({
        newPassword,
        token,
      });

      if (resetError) {
        setError(resetError.message ?? "Failed to reset password");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Center className="min-h-screen bg-surface-1">
        <Card className="w-full max-w-md" padding="r2">
          <Stack gap="r3">
            <Text variant="h4" as="h1" className="text-center">
              Reset Password
            </Text>
            <Alert variant="error">
              Invalid or expired reset link. Please request a new one.
            </Alert>
            <Text variant="body-2" color="secondary" className="text-center">
              <Link to="/forgot-password" className="link">
                Request new reset link
              </Link>
            </Text>
          </Stack>
        </Card>
      </Center>
    );
  }

  return (
    <Center className="min-h-screen bg-surface-1">
      <Card className="w-full max-w-md" padding="r2">
        <Stack gap="r3">
          <Text variant="h4" as="h1" className="text-center">
            Reset Password
          </Text>

          {success ? (
            <Stack gap="r4">
              <Alert variant="success">
                Your password has been reset successfully.
              </Alert>
              <Text variant="body-2" color="secondary" className="text-center">
                <Link to="/login" className="link">
                  Sign in with your new password
                </Link>
              </Text>
            </Stack>
          ) : (
            <>
              <form onSubmit={(e) => void handleSubmit(e)}>
                <Stack gap="r4">
                  <Field>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      error={!!error}
                      required
                    />
                  </Field>

                  <Field>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={!!error}
                      required
                    />
                  </Field>

                  <FieldError>{error}</FieldError>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Stack>
              </form>

              <Text variant="body-2" color="secondary" className="text-center">
                <Link to="/login" className="link">
                  Back to Sign In
                </Link>
              </Text>
            </>
          )}
        </Stack>
      </Card>
    </Center>
  );
}

export default ResetPassword;
