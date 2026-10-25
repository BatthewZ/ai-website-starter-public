# Changelog

## [2026-10-25]

### Action required

- **Run `bun run db:migrate:remote` before deploying.** Better Auth 1.7 requires an `account.idToken` column (migration `migrations/0002_smart_omega_sentinel.sql`). It validates the Drizzle schema when the Worker starts, so deploying without the migration makes every request return 500 with "Drizzle schema mismatch". Local databases need `bun run db:migrate:local`. See [Redeploying](docs/deployment/redeploying.md).

### Changed

- **UI library: response-ui → r-ui.** `@batthewz/response-ui-*` is replaced by `@batthewz/r-ui-css`, `@batthewz/r-ui-react-components` and `@batthewz/r-ui-tw-merge` (^0.1.0). r-ui-css removes Tailwind's default scales (`text-sm`, `bg-blue-500`, `rounded`, `shadow-xl` generate nothing); only token utilities work (`p-r3`, `text-body-2`, `bg-surface-0`, `h-control`). The CSS entry is `src/web/style/app.css`. [`docs/app-frontend.md`](docs/app-frontend.md) was rewritten for r-ui; the component reference is the hosted [r-ui showcase](https://batthewz.github.io/r-ui/showcase/).
- **r-ui 0.1.1.** `@batthewz/r-ui-css` and `@batthewz/r-ui-react-components` 0.1.1: theme checks run under Bun's symlinked installs, `themeScript` text is the same under every bundler, toasts slide in, `Button` takes `href`, plus Tooltip, nested AppShell, chart and Table fixes.
- **Themes.** Harbour is the default theme: a first visit opens in it (`INITIAL_THEME`, shipped as `<html data-theme="harbour">` because r-ui reserves the first list entry for its `:root` palette). Light (r-ui's `:root`) and Dark remain selectable. Harbour and Dark are app-owned copies (`src/web/style/themes/`) of r-ui's `harbour` and `nightfall` examples, since examples are outside semver. The theme list is `src/web/lib/themes.ts`, kept in sync with the CSS by `themes.test.ts`. New `bun run check:themes` runs r-ui's contrast, theme-rule and domain-contrast checks (a wrapper that finds every theme file and fails if a check prints nothing).
- **Preferences without a flash.** `vite.config.ts` injects r-ui's pre-paint `themeScript` (theme, density, input from `localStorage` `r-ui:preferences`) into `<head>`; `PreferencesMenu` is in both layouts.
- **CSP allows the theme script by hash.** HTML responses get `script-src 'self' 'sha256-…'`, hashed from the served `index.html` at request time, so changing the theme list or the r-ui version needs no CSP edit. HTML is always served in full (conditional request headers stripped, `ETag` removed), because a 304 has no body to hash. No `'unsafe-inline'`.
- **Auth and settings rebuilt on r-ui.** New `AuthLayout` (signed-out card page) and `AuthenticatedLayout` on r-ui `AppShell` (sidebar / rail / bottom nav, account menu). `AuthGuard` wraps r-ui `RequireAuth` and returns users to the page they asked for after sign-in (`postSignInPath`, validated against open redirects). All forms use r-ui `useForm` with the shared Zod schemas. Register has a password strength meter; ResetPassword handles `?error=INVALID_TOKEN`; Settings gained avatar crop / upload progress / remove, "sign out of other devices" on password change, a device list and password-confirmed account deletion. The router is handed to r-ui once via `RouterProvider`; document titles come from `DocumentTitleProvider` (`APP_NAME` in `src/web/lib/app.ts`).
- **`react-router-dom` → `react-router` 7.** Imports now come from `react-router`.
- **Web tests render real r-ui components** and mock only the Better Auth client and `fetch` (`src/web/test-utils.tsx`: `renderWithRouter`, `LocationProbe`).

### Added

- **Email verification (soft).** A verification email is now actually sent at sign-up (`sendOnSignUp`, via the Worker's `waitUntil`). The dashboard shows "Verify your email address" with a resend button until the link is clicked; the link signs the user in (`autoSignInAfterVerification`) and lands on the dashboard with a success or failure toast. Resend is limited to 3 requests an hour per IP. Set `requireEmailVerification` to make it a gate; see [Auth flows](docs/auth/flows.md#email-verification).
- `DELETE /api/users/me/avatar`: clears `user.image`, then deletes the stored R2 objects. Idempotent. See [Endpoints](docs/api/endpoints.md).
- `apiUpload()` in `src/web/lib/api/client.ts`: `FormData` upload over XHR with progress and `AbortSignal`, same error contract as `api()`.
- `src/web/vite-env.d.ts`: Vite client types, needed because TypeScript 6 type-checks CSS side-effect imports.

### Removed

- The `/demo`, `/showcase` and `/theme-editor` routes. Use the [r-ui showcase](https://batthewz.github.io/r-ui/showcase/) instead.
- Dependencies `miniflare`, `@cloudflare/vitest-pool-workers`, `uuid`, `culori`, `clsx` and `tailwind-merge` (the last two now come with `@batthewz/r-ui-tw-merge`).

### Fixed

- **Local dev emails printed truncated links.** `ConsoleEmailService` printed a 200-character preview, which cut verification and password-reset links (long signed tokens) in half, so neither flow could be finished locally. It now prints the whole text body. Its `eslint-disable` comment is gone too.
- The "session ended" toast on a 401 was lost to a hard reload to `/login`. The app now shows the toast and refetches the session; `AuthGuard` redirects and remembers the page.
- Session device labels on mobile: iPhone / iPad showed as macOS and Android as Linux, because user-agent strings impersonate each other. `describeUserAgent` tests the most specific token first (and recognises CriOS, FxiOS, Edge, Opera, HeadlessChrome).
- Sign-in no longer applies the sign-up password-length rule: a short mistyped password gets "invalid email or password", and accounts created under an older policy are not locked out.

### Upgraded (security-driven)

- **vitest 4.1.12 → 5.0.5** (5.0.0–5.0.4 carry GHSA-p458-7748-mcp3). No test changes were needed.
- **undici inside miniflare → 7.30.1** via a scoped `overrides` entry: wrangler's miniflare pins 7.29.1 (three advisories, one high). Scoped so jsdom keeps undici 8. Remove it once wrangler ships a fixed miniflare.
- **`bun run audit`** runs `bun audit` with the one accepted, unreachable advisory (esbuild `serve`, GHSA-67mh-4wv8-2f99) ignored; it now passes clean. Policy, exceptions and deferred upgrades (better-auth 1.7.12 from 2026-10-27, TypeScript 7) are in [docs/guides/dependencies.md](docs/guides/dependencies.md).
- **Dependency policy, stated correctly:** third-party packages are pinned exactly; the first-party `@batthewz/r-ui-*` packages use caret ranges so their patch releases flow in. (The 2026-02 entry below said every dependency was pinned.)
  Dependencies were bumped for security fixes, respecting a 7-day minimum release age (`minimumReleaseAge` in `~/.bunfig.toml`; the `@batthewz/r-ui-*` packages are excluded). Notable: wrangler 4.151.1, `@cloudflare/workers-types` 5, hono 4.13.13, better-auth 1.7.10, vite 8.3.4, vitest 4.1.12, react 19.3.1, react-router 7.18.4, zod 4.6.7, TypeScript 6.0.3, eslint 10, lucide-react 1.59, jsdom 30. `package.json` is the source of truth.

## [Unreleased]

### Changed

- **Frontend extracted to packages**: UI components, layout primitives, form controls, animations, shared UI hooks, and design-system tokens/themes are now consumed from the published `@batthewz/response-ui-react-components`, `@batthewz/response-ui-css`, and `@batthewz/response-ui-tw-merge` packages instead of being maintained locally. App-specific frontend (`AuthenticatedLayout`, route guards, `useApi`, `useFileUpload`, the ThemeEditor page) remains in-repo. The per-component `docs/ui/` and `docs/design-system/` references were consolidated into [`docs/app-frontend.md`](docs/app-frontend.md).
- **px → rem units**: All hardcoded `px` values in CSS tokens, responsive utilities, component styles, and Tailwind arbitrary values converted to `rem` for better accessibility and user font-size scaling. Affected: radius, motion, overlay, media, spacing, typography tokens; component styles; theme overrides.
- **Zod v3 → v4**: Migrated to Zod 4. Frontend validation error access updated from `.error.errors` to `.error.issues`. Validation middleware updated to use `ZodType` instead of `ZodSchema`.
- **Password hashing**: Auth now uses bcryptjs for explicit password hashing and verification instead of Better Auth's default hasher.
- **Dependency pinning**: All dependency versions are now pinned (removed `^` ranges) for deterministic installs.
- **Parallel type-checking**: The `typecheck` script now runs backend, web, and test checks in parallel via `concurrently`.
- **TypeScript project references**: Added `tsconfig.test.json` as a third project reference for test file type-checking.

### Upgraded

- Major dependency updates including React 19.2, Better Auth 1.5, Drizzle ORM 0.45, Hono 4.12, Vite 8, TypeScript 5.9, and Zod 4.

### Added

- `bcryptjs` dependency for cross-platform password hashing.
- `tsconfig.test.json` for dedicated test type-checking.
- **ThemeEditor page** (`/theme-editor`): Live CSS variable editor with per-token color/text inputs, theme loading, live preview panel, and CSS export.
- **API utility libraries**: `error-response.ts` (standardized error JSON), `pagination.ts` (cursor-based pagination), `params.ts` (path parameter helpers), `defer.ts` (deferred work via `waitUntil`), `validated.ts` (typed validated-data accessors), `cache-control.ts` (cache-control middleware).
- **SPA security headers**: Frontend HTML and assets now receive the same security headers (including HSTS and CSP) as API responses, with appropriate cache-control for hashed assets.
- **Database middleware**: Drizzle DB instance is now created per-request and available on the Hono context via `c.get("db")`.
- **Mobile-friendly tabs**: Tab lists now scroll horizontally on narrow viewports.
