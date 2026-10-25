import { Alert, Button, useToast } from "@batthewz/r-ui-react-components";
import { useState } from "react";

import { sendVerificationEmail } from "@/web/lib/auth/auth-client";
import { authErrorMessage, NETWORK_ERROR_MESSAGE } from "@/web/lib/auth/errors";
import { EMAIL_VERIFIED_CALLBACK } from "@/web/lib/auth/verification";

/**
 * Shown while the signed-in user's email is unverified: says where the link
 * went and lets them send another. Verification is soft in this starter (see
 * `createAuth`), so this is a nudge, not a gate.
 *
 * The resend endpoint allows three requests an hour per IP (auth.routes.ts);
 * a 429 is explained in those terms rather than as a generic failure, because
 * "try again" would only fail again.
 */
export function VerifyEmailAlert({ email }: { email: string }) {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  async function resend() {
    setSending(true);
    try {
      const { error } = await sendVerificationEmail({
        email,
        callbackURL: EMAIL_VERIFIED_CALLBACK,
      });
      if (error) {
        toast({
          title: "Couldn't send the email",
          description:
            error.status === 429
              ? "You've asked for several emails recently. Please try again in an hour."
              : authErrorMessage(error, "Please try again in a moment."),
          tone: "error",
        });
        return;
      }
      toast({
        title: "Verification email sent",
        description: `Check ${email} for the link.`,
        tone: "success",
      });
    } catch {
      toast({
        title: "Couldn't send the email",
        description: NETWORK_ERROR_MESSAGE,
        tone: "error",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <Alert
      tone="warning"
      title="Verify your email address"
      actions={
        <Button variant="secondary" loading={sending} onClick={() => void resend()}>
          Resend verification email
        </Button>
      }
    >
      We sent a link to {email} when you signed up. Click it to confirm this address is yours.
    </Alert>
  );
}
