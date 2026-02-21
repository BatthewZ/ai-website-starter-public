import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerSchema } from "@/shared/schemas/auth";
import { Field, FieldError, Input, Label } from "@/web/components/form";
import { Center, Stack } from "@/web/components/layout";
import { Button, Card, Text } from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";
import { signUp } from "@/web/lib/auth/auth-client";

export function Register() {
  useDocumentTitle("Create Account");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await signUp.email({
        name,
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message ?? "Failed to register");
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
            Register
          </Text>

          <form onSubmit={(e) => void handleSubmit(e)}>
            <Stack gap="r4">
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Creating account..." : "Register"}
              </Button>
            </Stack>
          </form>

          <Text variant="body-2" color="secondary" className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Log in
            </Link>
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}

export default Register;
