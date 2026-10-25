import { Button, Stack, useDocumentTitle } from "@batthewz/r-ui-react-components";
import { Compass } from "lucide-react";
import { useNavigate } from "react-router";

import { AUTHENTICATED_HOME } from "@/web/lib/auth/redirect";

/**
 * Any unmatched path. Rendered outside both guards, so it works signed in or
 * out; the dashboard button then lands a signed-out visitor on sign-in.
 *
 * Not r-ui's `EmptyState`: that heads its title at level 2 at most, and this
 * is a whole page, so its heading is the page's `h1`.
 */
export function NotFound() {
  useDocumentTitle("Page not found");
  const navigate = useNavigate();

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-gutter">
      <Stack gap="r3" align="center" className="text-center">
        <Compass aria-hidden className="size-control text-fg-muted" />
        <h1 className="text-h2">Page not found</h1>
        <p className="max-w-measure text-body-1 text-fg-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button variant="primary" onClick={() => void navigate(AUTHENTICATED_HOME)}>
          Go to dashboard
        </Button>
      </Stack>
    </main>
  );
}

export default NotFound;
