import {
  Field,
  Form,
  FormActions,
  Input,
  Link,
  PasswordInput,
  Stack,
  useForm,
} from "@batthewz/r-ui-react-components";
import { useLocation, useNavigate } from "react-router";

import { loginSchema } from "@/shared/schemas/auth";
import { FormAlert } from "@/web/components/forms/FormAlert";
import { AuthLayout } from "@/web/components/layout";
import { signIn } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";
import { postSignInPath } from "@/web/lib/auth/redirect";

/**
 * Email + password sign-in. Validation is the shared `loginSchema` through
 * r-ui's `useForm` (errors appear on blur, then clear as they are fixed; a
 * failed submit focuses the first invalid field). A rejection from Better
 * Auth is a form-level error: it says nothing about WHICH field was wrong, on
 * purpose, so it is not pinned to one.
 */
export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
    onSubmit: async (values, { setErrors }) => {
      try {
        const { error } = await signIn.email(values);
        if (error) {
          // Wrong credentials arrive WITH Better Auth's message; a message-less
          // error is something else (a server fault), so the fallback must not
          // blame the password.
          setErrors({
            "": authErrorMessage(error, "We couldn't sign you in. Please try again in a moment."),
          });
          return;
        }
        void navigate(postSignInPath(location.state), { replace: true });
      } catch {
        setErrors({ "": NETWORK_ERROR_MESSAGE });
      }
    },
  });

  return (
    <AuthLayout
      title="Sign in"
      description="Welcome back. Sign in to your account."
      footer={
        <span>
          Don&apos;t have an account? <Link href="/register">Create one</Link>
        </span>
      }
    >
      <Form form={form}>
        <Stack gap="r3">
          <FormAlert form={form} />

          <Field name="email" required>
            <Field.Label>Email</Field.Label>
            <Input type="email" autoComplete="email" inputMode="email" />
            <Field.Error />
          </Field>

          <Field name="password" required>
            <Field.Label>Password</Field.Label>
            <PasswordInput autoComplete="current-password" />
            <Field.Error />
            <Field.Description>
              <Link href="/forgot-password">Forgot your password?</Link>
            </Field.Description>
          </Field>

          <FormActions>
            <FormActions.Submit className="w-full">Sign in</FormActions.Submit>
          </FormActions>
        </Stack>
      </Form>
    </AuthLayout>
  );
}

export default Login;
