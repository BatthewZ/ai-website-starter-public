import type { EmailMessage, EmailSendResult, EmailService } from "./types";

/**
 * The email service when no provider is configured (local dev): prints the
 * message to the Worker's log instead of sending it.
 *
 * It prints the WHOLE text body, not a preview. Verification and password
 * reset links carry long signed tokens; a truncated preview cut them off,
 * which left no way to finish either flow locally. Dev-only, so length does
 * not matter and the link is the whole point.
 */
export class ConsoleEmailService implements EmailService {
  send(message: EmailMessage): Promise<EmailSendResult> {
    const to = Array.isArray(message.to) ? message.to.join(", ") : message.to;
    const body = message.text ?? "(no text content)";

    console.log(
      [
        "",
        "=".repeat(60),
        "[DEV EMAIL] This is a dev-only fallback — no email was sent",
        "=".repeat(60),
        `  To:      ${to}`,
        `  Subject: ${message.subject}`,
        "",
        body,
        "=".repeat(60),
        "",
      ].join("\n")
    );

    return Promise.resolve({ id: `console-${Date.now()}` });
  }
}
