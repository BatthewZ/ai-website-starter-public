import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { INITIAL_THEME, THEME_NAMES, THEMES } from "./themes";

const styleDir = path.resolve(import.meta.dirname, "../style");
const themeFiles = readdirSync(path.join(styleDir, "themes"))
  .filter((f) => f.endsWith(".css"))
  .map((f) => f.replace(/\.css$/, ""));
const appCss = readFileSync(path.join(styleDir, "app.css"), "utf8");

/**
 * THEMES (what the switcher offers and the pre-paint script accepts) must
 * agree with the CSS that actually ships. If they drift, the failure is silent
 * in the browser: a listed theme with no stylesheet renders as the default
 * while the switcher claims otherwise; a stylesheet missing from the list can
 * never be chosen or restored.
 */
describe("THEMES", () => {
  it("starts with r-ui's default (:root) theme, which needs no stylesheet", () => {
    expect(THEMES[0].value).toBe("default");
    expect(themeFiles).not.toContain("default");
  });

  it("has a stylesheet, imported by app.css, for every other theme", () => {
    for (const name of THEME_NAMES.slice(1)) {
      expect(themeFiles).toContain(name);
      expect(appCss).toContain(`@import "./themes/${name}.css";`);
    }
  });

  it("lists every theme stylesheet that ships", () => {
    expect([...THEME_NAMES.slice(1)].sort()).toEqual([...themeFiles].sort());
  });

  it("scopes each stylesheet to its own data-theme name (r-ui's theme rule)", () => {
    for (const name of themeFiles) {
      const css = readFileSync(path.join(styleDir, "themes", `${name}.css`), "utf8");
      expect(css).toContain(`:root[data-theme="${name}"]`);
    }
  });

  it("gives every theme a distinct value and a label", () => {
    expect(new Set(THEME_NAMES).size).toBe(THEMES.length);
    for (const theme of THEMES) expect(theme.label.trim()).not.toBe("");
  });

  /**
   * The default a first visit opens in is shipped as <html data-theme>. If it
   * named a theme the list does not hold, the pre-paint script and the
   * switcher would ignore it; with no stylesheet it would render unthemed.
   */
  it("opens in an INITIAL_THEME that is listed and has a stylesheet", () => {
    expect(THEME_NAMES).toContain(INITIAL_THEME);
    if (INITIAL_THEME !== THEMES[0].value) expect(themeFiles).toContain(INITIAL_THEME);
  });
});
