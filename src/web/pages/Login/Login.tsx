import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginSchema } from "@/shared/schemas/auth";
import { Field, FieldError, Input, Label } from "@/web/components/form";
import { Center, Stack } from "@/web/components/layout";
import { Button, Card, Text } from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";
import { signIn } from "@/web/lib/auth/auth-client";

export function Login() {
  useDocumentTitle("Log In");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message ?? "Failed to sign in");
        return;
      }

      void navigate("/dashboard");
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
            Sign In
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

              <Field>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error}
                  required
                />
              </Field>

              <Text variant="body-2" color="secondary" className="text-right">
                <Link to="/forgot-password" className="link">
                  Forgot password?
                </Link>
              </Text>

              <FieldError>{error}</FieldError>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>
          </form>

          <Text variant="body-2" color="secondary" className="text-center">
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Register
            </Link>
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}

export default Login;
