import {
  Alert,
  Field,
  Form,
  FormActions,
  Link,
  PasswordInput,
  Stack,
  useForm,
} from "@batthewz/r-ui-react-components";
import { useState } from "react";
import { useSearchParams } from "react-router";

import { resetPasswordSchema } from "@/shared/schemas/auth";
import { FormAlert } from "@/web/components/forms/FormAlert";
import { AuthLayout } from "@/web/components/layout";
import { resetPassword } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";

/**
 * The page the reset email links to. Better Auth verifies the link before it
 * redirects here: a good link arrives as `?token=…`, an expired or used one as
 * `?error=INVALID_TOKEN`. Both cases (and a hand-typed URL with neither) get a
 * way forward rather than a form that can only fail.
 */
export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const linkError = searchParams.get("error");
  const [done, setDone] = useState(false);

  const form = useForm({
    schema: resetPasswordSchema,
    defaultValues: { newPassword: "", confirmPassword: "" },
    onSubmit: async ({ newPassword }, { setErrors }) => {
      if (!token) return;
      try {
        const { error } = await resetPassword({ newPassword, token });
        if (error) {
          setErrors({
            "": authErrorMessage(
              error,
              "We couldn't reset your password. Request a new link and try again."
            ),
          });
          return;
        }
        setDone(true);
      } catch {
        setErrors({ "": NETWORK_ERROR_MESSAGE });
      }
    },
  });

  if (!token || linkError) {
    return (
      <AuthLayout title="Reset your password" footer={<Link href="/login">Back to sign in</Link>}>
        <Alert
          tone="error"
          title="This link can't be used"
          actions={<Link href="/forgot-password">Request a new link</Link>}
        >
          Reset links work once and expire after a while. Request a new one to continue.
        </Alert>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password updated">
        <Alert tone="success" actions={<Link href="/login">Sign in with your new password</Link>}>
          Your password has been changed.
        </Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password"
      description="Use at least 8 characters."
      footer={<Link href="/login">Back to sign in</Link>}
    >
      <Form form={form}>
        <Stack gap="r3">
          <FormAlert form={form} />

          <Field name="newPassword" required>
            <Field.Label>New password</Field.Label>
            <PasswordInput autoComplete="new-password" strength />
            <Field.Error />
          </Field>

          <Field name="confirmPassword" required>
            <Field.Label>Confirm new password</Field.Label>
            <PasswordInput autoComplete="new-password" />
            <Field.Error />
          </Field>

          <FormActions>
            <FormActions.Submit className="w-full">Update password</FormActions.Submit>
          </FormActions>
        </Stack>
      </Form>
    </AuthLayout>
  );
}

export default ResetPassword;
