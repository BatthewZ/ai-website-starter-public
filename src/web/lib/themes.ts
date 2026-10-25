/**
 * The themes this app ships, in the order the switcher shows them.
 *
 * The FIRST entry is r-ui's `:root` palette and must stay first: r-ui treats
 * the first theme as the one that REMOVES `data-theme` (it has no stylesheet
 * of its own). That is why the default theme is not simply listed first:
 * Harbour first would mean "remove the attribute", and picking it would
 * render the plain `:root` palette instead. The default a visitor sees is
 * `INITIAL_THEME`, below. Every other `value` is a `data-theme` name with a
 * matching `src/web/style/themes/<value>.css` imported by `app.css`.
 *
 * One list, read in two places that must agree:
 *   - the ThemeSwitcher / PreferencesMenu, which offer these choices, and
 *   - the pre-paint script vite.config.ts inlines into index.html, which
 *     restores a saved choice before first paint (no flash of the default).
 * If they disagree, a saved theme is either offered but never restored, or
 * restored but never offered. `themes.test.ts` also checks the list against
 * the CSS on disk, so a theme without a stylesheet (it would render unthemed)
 * fails the test suite rather than shipping.
 *
 * Plain data, no React: vite.config.ts imports this at build time.
 * Module scope is load-bearing: the preference hooks memoise on the array's
 * identity, so an inline literal at a call site would rebuild them each render.
 */
export const THEMES = [
  { value: "default", label: "Light" },
  { value: "harbour", label: "Harbour" },
  { value: "dark", label: "Dark" },
] as const satisfies readonly { value: string; label: string }[];

export type AppTheme = (typeof THEMES)[number]["value"];

/** The `data-theme` names, for the pre-paint script. */
export const THEME_NAMES: readonly AppTheme[] = THEMES.map((t) => t.value);

/**
 * The theme a first visit opens in: the app's default look.
 *
 * vite.config.ts ships index.html as `<html data-theme="harbour">`. With
 * nothing saved, the pre-paint script leaves that attribute alone; a saved
 * choice (including "Light", which removes the attribute) replaces it before
 * the first paint. This is the mechanism r-ui's own showcase uses for its
 * default. Set it to `THEMES[0].value` to open in the plain `:root` palette.
 */
export const INITIAL_THEME: AppTheme = "harbour";
