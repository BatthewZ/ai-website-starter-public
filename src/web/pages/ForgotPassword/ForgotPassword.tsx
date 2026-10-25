import {
  Alert,
  Field,
  Form,
  FormActions,
  Input,
  Link,
  Stack,
  useForm,
} from "@batthewz/r-ui-react-components";
import { useState } from "react";

import { forgotPasswordSchema } from "@/shared/schemas/auth";
import { FormAlert } from "@/web/components/forms/FormAlert";
import { AuthLayout } from "@/web/components/layout";
import { requestPasswordReset } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";

/**
 * Requests a reset email. The confirmation is the same whether or not the
 * address has an account (Better Auth answers the same way too), so this page
 * cannot be used to find out who is registered.
 */
export function ForgotPassword() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm({
    schema: forgotPasswordSchema,
    defaultValues: { email: "" },
    onSubmit: async ({ email }, { setErrors }) => {
      try {
        const { error } = await requestPasswordReset({ email, redirectTo: "/reset-password" });
        if (error) {
          setErrors({
            "": authErrorMessage(error, "We couldn't send the reset link. Please try again."),
          });
          return;
        }
        setSentTo(email);
      } catch {
        setErrors({ "": NETWORK_ERROR_MESSAGE });
      }
    },
  });

  return (
    <AuthLayout
      title="Reset your password"
      description={
        sentTo ? undefined : "Enter your email and we'll send you a link to choose a new password."
      }
      footer={<Link href="/login">Back to sign in</Link>}
    >
      {sentTo ? (
        <Alert tone="success" title="Check your email">
          If an account exists for {sentTo}, a password reset link is on its way.
        </Alert>
      ) : (
        <Form form={form}>
          <Stack gap="r3">
            <FormAlert form={form} />

            <Field name="email" required>
              <Field.Label>Email</Field.Label>
              <Input type="email" autoComplete="email" inputMode="email" />
              <Field.Error />
            </Field>

            <FormActions>
              <FormActions.Submit className="w-full">Send reset link</FormActions.Submit>
            </FormActions>
          </Stack>
        </Form>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
