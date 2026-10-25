import {
  Card,
  Checkbox,
  Field,
  Form,
  FormActions,
  PasswordInput,
  Stack,
  useForm,
  useToast,
} from "@batthewz/r-ui-react-components";

import { changePasswordSchema } from "@/shared/schemas/user";
import { FormAlert } from "@/web/components/forms/FormAlert";
import { UsernameHint } from "@/web/components/forms/UsernameHint";
import { changePassword } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";

interface PasswordSectionProps {
  /** Called after a change that signed other devices out, so the session list can reload. */
  onOtherSessionsRevoked: () => void;
}

const DEFAULTS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  revokeOtherSessions: true,
};

/**
 * Changes the password. "Sign out of other devices" is on by default: the most
 * common reason to change a password is suspecting someone else has it, and
 * then leaving their session alive defeats the point.
 *
 * Better Auth's INVALID_PASSWORD is shown on the current-password field (it is
 * the only field it can be about), every other failure on the form.
 */
export function PasswordSection({ onOtherSessionsRevoked }: PasswordSectionProps) {
  const { toast } = useToast();

  const form = useForm({
    schema: changePasswordSchema,
    defaultValues: DEFAULTS,
    onSubmit: async (
      { currentPassword, newPassword, revokeOtherSessions },
      { setErrors, reset }
    ) => {
      try {
        const { error } = await changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions,
        });
        if (error) {
          if (error.code === "INVALID_PASSWORD") {
            setErrors({ currentPassword: "That isn't your current password." });
          } else {
            setErrors({
              "": authErrorMessage(error, "We couldn't change your password. Please try again."),
            });
          }
          return;
        }
        reset(DEFAULTS);
        toast({
          title: "Password changed",
          description: revokeOtherSessions ? "Your other devices have been signed out." : undefined,
          tone: "success",
        });
        if (revokeOtherSessions) onOtherSessionsRevoked();
      } catch {
        setErrors({ "": NETWORK_ERROR_MESSAGE });
      }
    },
  });

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">Password</Card.Title>
        <Card.Description>
          Use at least 8 characters. A passphrase is easier to remember.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Form form={form}>
          <Stack gap="r3">
            <FormAlert form={form} />
            <UsernameHint />

            <Field name="currentPassword" required>
              <Field.Label>Current password</Field.Label>
              <PasswordInput autoComplete="current-password" />
              <Field.Error />
            </Field>

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

            <Field name="revokeOtherSessions">
              <Checkbox>Sign out of other devices</Checkbox>
            </Field>

            <FormActions>
              <FormActions.Submit>Change password</FormActions.Submit>
            </FormActions>
          </Stack>
        </Form>
      </Card.Body>
    </Card>
  );
}
