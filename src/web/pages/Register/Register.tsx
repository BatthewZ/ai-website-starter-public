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
import { useNavigate } from "react-router";

import { registerSchema } from "@/shared/schemas/auth";
import { FormAlert } from "@/web/components/forms/FormAlert";
import { AuthLayout } from "@/web/components/layout";
import { signUp } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";
import { AUTHENTICATED_HOME } from "@/web/lib/auth/redirect";
import { EMAIL_VERIFIED_CALLBACK } from "@/web/lib/auth/verification";

/**
 * Account creation. Better Auth signs the new user in on success (its
 * `autoSignIn` default), so this lands on the dashboard, and emails a
 * verification link that also leads back there (`EMAIL_VERIFIED_CALLBACK`). The password field's
 * strength meter is a nudge only; the enforced rule is `registerSchema`'s
 * minimum length, checked here and again by Better Auth.
 */
export function Register() {
  const navigate = useNavigate();

  const form = useForm({
    schema: registerSchema,
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async (values, { setErrors }) => {
      try {
        // The verification email sent at sign-up links back to the dashboard.
        const { error } = await signUp.email({ ...values, callbackURL: EMAIL_VERIFIED_CALLBACK });
        if (error) {
          setErrors({
            "": authErrorMessage(error, "We couldn't create your account. Please try again."),
          });
          return;
        }
        void navigate(AUTHENTICATED_HOME, { replace: true });
      } catch {
        setErrors({ "": NETWORK_ERROR_MESSAGE });
      }
    },
  });

  return (
    <AuthLayout
      title="Create an account"
      description="It takes less than a minute."
      footer={
        <span>
          Already have an account? <Link href="/login">Sign in</Link>
        </span>
      }
    >
      <Form form={form}>
        <Stack gap="r3">
          <FormAlert form={form} />

          <Field name="name" required>
            <Field.Label>Name</Field.Label>
            <Input autoComplete="name" />
            <Field.Error />
          </Field>

          <Field name="email" required>
            <Field.Label>Email</Field.Label>
            <Input type="email" autoComplete="email" inputMode="email" />
            <Field.Error />
          </Field>

          <Field name="password" required>
            <Field.Label>Password</Field.Label>
            <PasswordInput autoComplete="new-password" strength />
            <Field.Description>At least 8 characters.</Field.Description>
            <Field.Error />
          </Field>

          <FormActions>
            <FormActions.Submit className="w-full">Create account</FormActions.Submit>
          </FormActions>
        </Stack>
      </Form>
    </AuthLayout>
  );
}

export default Register;
