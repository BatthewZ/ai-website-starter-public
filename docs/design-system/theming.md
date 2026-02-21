# Theming

The entire design system is re-themeable by overriding `:root` variables. No component code changes are needed.

### How it works

1. Theme files live in `src/web/style/themes/` (e.g. `events.css`, `grimdark.css`, `tech.css`).
2. Each theme scopes overrides to a data attribute selector: `:root[data-theme="theme-name"]`.
3. To activate a theme, set `data-theme` on the root `<html>` element and import the theme CSS file after the token imports.
4. Themes can override any combination of `--C-*`, `--MOTION-*`, `--OVERLAY-*`, `--MEDIA-*`, `--RADIUS-*`, `--SHADOW-*`, `--DURATION-*`, and font variables.

### Token categories by "feel"

| Category      | Variables                                  | What it controls            |
| ------------- | ------------------------------------------ | --------------------------- |
| **Look**      | `--C-*` (colors), `--SHADOW-*`, `--RADIUS-*` | Brand identity              |
| **Feel**      | `--MOTION-*` (durations, easing, distances, scale) | Personality and weight |
| **Atmosphere**| `--OVERLAY-*` (scrims, blurs, gradients)   | Mood and depth              |

### Creating a new theme

1. Create a new CSS file in `src/web/style/themes/` (e.g. `my-theme.css`).
2. Define all overrides under `:root[data-theme="my-theme"]`:

```css
:root[data-theme="my-theme"] {
  /* Fonts */
  --DEFAULT-FONT: "Your Body Font", sans-serif;
  --HEADING-FONT: "Your Heading Font", serif;
  --HEADING-LETTER-SPACING: -0.01em;
  --HEADING-TEXT-TRANSFORM: none;

  /* Brand colors */
  --C-PRIMARY: #your-primary;
  --C-PRIMARY-HOVER: #your-primary-hover;
  --C-PRIMARY-ACTIVE: #your-primary-active;
  --C-SECONDARY: #your-secondary;
  --C-SECONDARY-HOVER: #your-secondary-hover;
  --C-ACCENT: #your-accent;
  --C-ACCENT-HOVER: #your-accent-hover;

  /* Surface colors */
  --C-SURFACE-0: #...;
  --C-SURFACE-1: #...;
  --C-SURFACE-2: #...;
  --C-SURFACE-3: #...;

  /* Text colors */
  --C-TEXT-PRIMARY: #...;
  --C-TEXT-SECONDARY: #...;
  --C-TEXT-MUTED: #...;
  --C-TEXT-INVERSE: #...;
  --C-TEXT-ON-PRIMARY: #...;
  --C-TEXT-ON-ACCENT: #...;

  /* Border colors */
  --C-BORDER-DEFAULT: #...;
  --C-BORDER-STRONG: #...;
  --C-BORDER-FOCUS: #...;

  /* Radius */
  --RADIUS-SM: ...;
  --RADIUS-MD: ...;
  --RADIUS-LG: ...;
  --RADIUS-XL: ...;

  /* Shadows */
  --SHADOW-SM: ...;
  --SHADOW-MD: ...;
  --SHADOW-LG: ...;

  /* Motion */
  --MOTION-DURATION-ENTER: ...;
  --MOTION-EASE-ENTER: ...;
  /* ... */

  /* Overlay */
  --OVERLAY-SCRIM-COLOR: ...;
  --OVERLAY-GRADIENT-START: ...;
  --OVERLAY-GRADIENT-END: ...;
}
```

3. Import the theme file in your app CSS (after token imports).
4. Set `data-theme="my-theme"` on the `<html>` element.

---

## Built-in Themes

### Default (no theme attribute)

The base light theme. Clean, neutral slate/gray palette. Standard border radii and shadows. Moderate animation timing. Suitable for general-purpose applications.

### Events (`data-theme="events"`)

**File:** `src/web/style/themes/events.css`

Warm, editorial, celebratory. Think event ticketing, lifestyle magazines, cultural platforms.

| Aspect | Details |
| ------ | ------- |
| **Fonts** | Playfair Display (headings), Nunito (body), Fira Code (mono) |
| **Colors** | Purple primary (`#7c3aed`), orange accent (`#f97316`), golden secondary (`#fde68a`), warm cream surfaces |
| **Radius** | Large and rounded (SM: 8px, MD: 14px, LG: 20px, XL: 28px) |
| **Shadows** | Warm-toned with purple/orange tint |
| **Motion** | Bouncy, energetic (350ms enter with overshoot easing, 60ms stagger) |
| **Typography** | Bold weight 800, generous line-heights, editorial feel |

### Grimdark (`data-theme="grimdark"`)

**File:** `src/web/style/themes/grimdark.css`

Gothic, oppressive, heavy. Think dark fantasy, tabletop gaming, mature content.

| Aspect | Details |
| ------ | ------- |
| **Fonts** | Cinzel (headings), Source Serif 4 (body), IBM Plex Mono (mono) |
| **Colors** | Near-black primary (`#1a1a1a`), blood-red accent (`#b91c1c`), charcoal surfaces, parchment text (`#d4c5a9`) |
| **Radius** | Sharp, brutal -- no rounding (SM: 0px, MD: 0px, LG: 2px, XL: 2px) |
| **Shadows** | Deep voids, inky black with high opacity |
| **Motion** | Slow, weighty, deliberate (500ms enter, 600ms shift, 80ms stagger) |
| **Typography** | Bold weight 900, uppercase headings with wide letter-spacing (`0.06em`) |
| **Headings** | `text-transform: uppercase` via `--HEADING-TEXT-TRANSFORM` |

### Tech (`data-theme="tech"`)

**File:** `src/web/style/themes/tech.css`

Terminal, precise, futuristic. Think developer tools, SaaS dashboards, cyberpunk interfaces.

| Aspect | Details |
| ------ | ------- |
| **Fonts** | Space Grotesk (headings), Inter (body), JetBrains Mono (mono) |
| **Colors** | Near-black primary (`#09090b`), neon green accent (`#00ff88`), deep black surfaces with blue undertone, high-contrast text |
| **Radius** | Tight, geometric (SM: 2px, MD: 4px, LG: 6px, XL: 8px) |
| **Shadows** | Neon glow effect using accent color with low opacity |
| **Motion** | Fast, snappy, precise (180ms enter, 250ms shift, 30ms stagger) |
| **Typography** | Clean, tight (Body-1: 15px, Body-3: 11px), tight letter-spacing on headings (`-0.03em`) |
