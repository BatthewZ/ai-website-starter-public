import { Layers } from "lucide-react";

/**
 * The product mark: the glyph beside the name in the shell and on the auth
 * pages, and the only thing shown when the sidebar collapses to its rail.
 * Drawn with the primary fill pair, so it follows every theme. Decorative:
 * the product name next to it is the accessible name. Swap the glyph (or the
 * whole element) for your logo.
 */
export function BrandMark() {
  return (
    <span
      aria-hidden
      className="grid size-control shrink-0 place-items-center rounded-md bg-primary text-fg-on-primary"
    >
      <Layers className="size-icon" />
    </span>
  );
}
