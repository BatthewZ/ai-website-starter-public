import { themeScript } from "@batthewz/r-ui-react-components/theme-script";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type Plugin } from "vite";

import { INITIAL_THEME, THEME_NAMES, THEMES } from "./src/web/lib/themes.ts";

/**
 * Inlines r-ui's pre-paint preferences script as the first thing in <head>.
 * This is a client-only SPA with no server render, so without it a reload
 * paints the default theme/density first and then flips once React mounts.
 * The script is generated from the same THEME_NAMES the switcher uses, so the
 * two never disagree about which saved values are valid. The Worker's CSP
 * allows it by the hash of the bytes actually served (see
 * src/api/middleware/security-headers.ts), so changing the theme list needs
 * no CSP edit.
 */
const preferencesScript = (): Plugin => ({
  name: "r-ui-preferences-script",
  transformIndexHtml: (html) => ({
    html: withInitialTheme(html),
    tags: [
      { tag: "script", children: themeScript({ themes: THEME_NAMES }), injectTo: "head-prepend" },
    ],
  }),
});

/**
 * Ships the page in the app's default theme (`INITIAL_THEME`) as
 * `<html data-theme="…">`. r-ui's first theme is the one that removes the
 * attribute, so a default other than `:root` is set here rather than by list
 * order; the pre-paint script above leaves it alone unless a choice is saved.
 */
function withInitialTheme(html: string): string {
  if (INITIAL_THEME === THEMES[0].value) return html;
  if (!/<html\b/.test(html))
    throw new Error("index.html has no <html> element to set data-theme on");
  return html.replace(/<html\b/, `<html data-theme="${INITIAL_THEME}"`);
}

export default defineConfig({
  root: "src/web",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  plugins: [preferencesScript(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});
