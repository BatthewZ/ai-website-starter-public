import {
  Button,
  Card,
  Dialog,
  Field,
  Form,
  PasswordInput,
  Stack,
  useForm,
  useToast,
} from "@batthewz/r-ui-react-components";
import { useState } from "react";
import { useNavigate } from "react-router";

import { deleteAccountSchema } from "@/shared/schemas/user";
import { FormAlert } from "@/web/components/forms/FormAlert";
import { UsernameHint } from "@/web/components/forms/UsernameHint";
import { deleteUser } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";

/**
 * Permanent account deletion, behind an `alertdialog` (no light dismiss, no
 * corner close: the reader must answer it) that asks for the password. Cancel
 * takes focus on open, so a stray Enter cannot delete anything.
 */
export function DangerZoneSection() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-status-error">
      <Card.Header>
        <Card.Title as="h2" className="text-fg-error">
          Delete account
        </Card.Title>
        <Card.Description>
          Permanently delete your account and everything in it. This cannot be undone.
        </Card.Description>
        <Card.Actions>
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger variant="danger">Delete account…</Dialog.Trigger>
            <Dialog.Content role="alertdialog">
              <DeleteAccountForm onCancel={() => setOpen(false)} />
            </Dialog.Content>
          </Dialog>
        </Card.Actions>
      </Card.Header>
    </Card>
  );
}

const DELETE_FORM_ID = "delete-account-form";

/**
 * Mounted only while the dialog is open (r-ui's Dialog), so every open starts
 * with an empty form.
 *
 * The `<form>` sits inside `Dialog.Body` and the footer's submit button joins
 * it through the `form` attribute: wrapping header, body and footer in the
 * form would make it the dialog's only child and break the dialog's layout
 * (the body is what scrolls; header and footer stay put). Validation waits
 * for submit: with one field, a message appearing because focus moved during
 * the dialog's opening would only be noise.
 */
function DeleteAccountForm({ onCancel }: { onCancel: () => void }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    schema: deleteAccountSchema,
    defaultValues: { password: "" },
    validateOn: "submit",
    onSubmit: async ({ password }, { setErrors }) => {
      try {
        const { error } = await deleteUser({ password });
        if (error) {
          if (error.code === "INVALID_PASSWORD")
            setErrors({ password: "That password is incorrect." });
          else
            setErrors({
              "": authErrorMessage(error, "We couldn't delete your account. Please try again."),
            });
          return;
        }
        toast({ title: "Your account has been deleted", tone: "success" });
        void navigate("/login", { replace: true });
      } catch {
        setErrors({ "": NETWORK_ERROR_MESSAGE });
      }
    },
  });

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Delete your account?</Dialog.Title>
        <Dialog.Description>
          Your profile, photo and sessions will be removed permanently. Enter your password to
          confirm.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <Form form={form} id={DELETE_FORM_ID}>
          <Stack gap="r3">
            <FormAlert form={form} />
            <UsernameHint />
            <Field name="password" required>
              <Field.Label>Password</Field.Label>
              <PasswordInput autoComplete="current-password" />
              <Field.Error />
            </Field>
          </Stack>
        </Form>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="ghost" autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          form={DELETE_FORM_ID}
          variant="danger"
          loading={form.state.submitting}
        >
          Delete account
        </Button>
      </Dialog.Footer>
    </>
  );
}
