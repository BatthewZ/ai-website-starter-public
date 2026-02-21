import { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPasswordSchema } from "@/shared/schemas/auth";
import { Field, FieldError, Input, Label } from "@/web/components/form";
import { Center, Stack } from "@/web/components/layout";
import { Alert, Button, Card, Text } from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";
import { requestPasswordReset } from "@/web/lib/auth/auth-client";

export function ForgotPassword() {
  useDocumentTitle("Forgot Password");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (resetError) {
        setError(resetError.message ?? "Failed to send reset link");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center className="min-h-screen bg-surface-1">
      <Card className="w-full max-w-md" padding="r2">
        <Stack gap="r3">
          <Text variant="h4" as="h1" className="text-center">
            Forgot Password
          </Text>

          {submitted ? (
            <Stack gap="r4">
              <Alert variant="success">
                If an account exists with that email, we've sent a password reset link.
              </Alert>
              <Text variant="body-2" color="secondary" className="text-center">
                <Link to="/login" className="link">
                  Back to Sign In
                </Link>
              </Text>
            </Stack>
          ) : (
            <>
              <Text variant="body-2" color="secondary" className="text-center">
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <form onSubmit={(e) => void handleSubmit(e)}>
                <Stack gap="r4">
                  <Field>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
