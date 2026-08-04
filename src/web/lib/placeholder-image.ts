/**
 * A 1×1 fully transparent GIF, inline as a data URI.
 *
 * The demo and showcase pages illustrate image components without shipping
 * stock photography, so their "images" are CSS gradients painted through the
 * theme's own tokens — which is also why they re-tint when you switch theme.
 * But `MediaCard.Image` / `Spotlight.Image` render a real `<img>`, and an
 * `<img>` still needs a `src`.
 *
 * `src=""` is the trap this constant exists to avoid, and it is not cosmetic.
 * The empty string resolves against the document's base URL, so the browser
 * re-requests the PAGE as though it were an image — React warns about exactly
 * this: "An empty string was passed to the src attribute. This may cause the
 * browser to download the whole page again over the network." Two of those
 * were firing on /demo. `src={undefined}` is no better: React then omits the
 * attribute and the element is a broken image.
 *
 * A transparent pixel is the honest answer — a real, valid, cacheless image
 * that paints nothing, letting the gradient behind it show through. Keep the
 * `alt` meaningful at the call site; the pixel carries no meaning of its own.
 */
export const TRANSPARENT_PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
