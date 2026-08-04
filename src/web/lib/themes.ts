import { EXAMPLE_THEMES, type ExampleTheme } from "@batthewz/response-ui-react-components";

/**
 * The themes this app offers, and their display names.
 *
 * One list, imported everywhere a theme is selected. It exists because the
 * theme names have to be stated by the *app*, not the library: as of
 * `@batthewz/response-ui-css` 0.13.0 the example themes are no longer carried
 * by the package's public entry, and `ThemeSwitcher` / `useTheme` offer only
 * `default` unless handed a list — "this package does not know your themes and
 * will not guess". Before this module the list was restated in three places
 * (two `ThemeSwitcher` call sites and the mobile bubble), which is exactly how
 * a switcher ends up offering a theme whose CSS nobody imported.
 *
 * `APP_THEMES` is re-exported from the library's `EXAMPLE_THEMES` rather than
 * retyped, so the ids cannot drift from the stylesheets `src/web/style/app.css`
 * actually imports. Swap this for your own ids when you replace the example
 * themes — that is the one edit, and the labels below move with it.
 *
 * Module scope is load-bearing, not stylistic: `useTheme` memoises its snapshot
 * reader on the array's identity, so an inline literal would rebuild the reader
 * every render.
 */
export const APP_THEMES = EXAMPLE_THEMES;

export type AppTheme = ExampleTheme;

/** Display names. A theme with no entry would be labelled by its raw id. */
export const THEME_LABELS: Record<AppTheme, string> = {
  default: "Default",
  events: "Events",
  grimdark: "Grimdark",
  tech: "Tech",
};

/**
 * Swatch colours for the mobile theme bubble, which paints a preview dot per
 * theme before that theme is applied — so it cannot read the live tokens and
 * has to carry its own values.
 */
export const THEME_COLORS: Record<AppTheme, { bg: string; border: string }> = {
  default: { bg: "oklch(0.2795 0.0368 260.03)", border: "oklch(0.5544 0.0407 257.42)" },
  events: { bg: "oklch(0.5413 0.2466 293.01)", border: "oklch(0.7049 0.1867 47.6)" },
  grimdark: { bg: "oklch(0.2178 0 0)", border: "oklch(0.5054 0.1905 27.52)" },
  tech: { bg: "oklch(0.1408 0.0044 285.82)", border: "oklch(0.8763 0.2278 152.55)" },
};
