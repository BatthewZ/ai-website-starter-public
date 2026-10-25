import { Card, Link, PreferencesMenu, useDocumentTitle } from "@batthewz/r-ui-react-components";
import { cn } from "@batthewz/r-ui-tw-merge";
import type { ReactNode } from "react";

import { BrandMark } from "@/web/components/brand/BrandMark";
import { APP_NAME } from "@/web/lib/app";
import { THEMES } from "@/web/lib/themes";

interface AuthLayoutProps {
  /** The page's heading (the card's `h1`) and document title. */
  title: string;
  /** One line under the heading: what this page is for. */
  description?: ReactNode;
  /** The form or message. */
  children: ReactNode;
  /** Links to the neighbouring auth pages, under a hairline. */
  footer?: ReactNode;
  /** Merged onto the card, e.g. a wider `max-w-*` for a longer form. */
  className?: string;
}

/**
 * The frame of every signed-out page: brand and preferences across the top, one
 * card centred in the remaining space. It owns the page's `<main>` landmark
 * and its document title, so each auth page is just its form.
 *
 * The preferences menu is here too, not only in the signed-in shell: a visitor
 * who needs the dark theme or a coarser hit size needs it on the sign-in form.
 */
export function AuthLayout({ title, description, children, footer, className }: AuthLayoutProps) {
  useDocumentTitle(title);

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] bg-canvas">
      <header className="flex items-center justify-between gap-r3 px-gutter py-r3">
        <Link
          href="/"
          variant="inherit"
          className="inline-flex items-center gap-r4 text-h6 no-underline hover:no-underline"
        >
          <BrandMark />
          {APP_NAME}
        </Link>
        <PreferencesMenu themes={THEMES} />
      </header>

      <main className="grid place-items-center px-gutter pb-r1">
        <Card className={cn("w-full max-w-[calc(var(--COLUMN-MD)*1.5)]", className)}>
          <Card.Header>
            {/* Card.Title stops at h2 (a card is a section of a page); here the card IS
                the page, so its heading is the h1, in Card.Title's look. */}
            <h1 className="min-w-0 break-words text-h4 text-fg-primary">{title}</h1>
            {description && <Card.Description>{description}</Card.Description>}
          </Card.Header>
          <Card.Body>{children}</Card.Body>
          {footer && (
            <Card.Footer className="justify-center text-body-2 text-fg-secondary">
              {footer}
            </Card.Footer>
          )}
        </Card>
      </main>
    </div>
  );
}
