# Frontend

The SPA in `src/web/` is React 19 + React Router 7, styled and built from the **r-ui**
design system. r-ui owns every generic piece (components, hooks, tokens, themes, the
preference switchers, the pre-paint script). This app owns only what is specific to it:
the auth-aware layouts and guards, the pages, the API client and its own themes.

Before writing UI, look the component up in the
**[r-ui showcase](https://batthewz.github.io/r-ui/showcase/)** (every component, every
state, with theme / density / input switchable). Reach for an existing component before
writing markup of your own.

## Stack

| Package                           | What it gives the app                                                                                                                                         | Read                                                                                                                                                                                                                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@batthewz/r-ui-css`              | Tailwind v4 + the token contract (colour, type, space, shape, motion), base and prose styles, the default `:root` theme, the theme template and check scripts | [README](../node_modules/@batthewz/r-ui-css/README.md) · [AGENTS.md](../node_modules/@batthewz/r-ui-css/AGENTS.md) (every token and utility) · [axes](../node_modules/@batthewz/r-ui-css/docs/axes.md) · [theme contract](../node_modules/@batthewz/r-ui-css/docs/theme-contract.md) |
| `@batthewz/r-ui-react-components` | Components, `useForm`, toasts, `AppShell`, `RequireAuth`, `RouterProvider`, preference switchers, `themeScript`                                               | [README](../node_modules/@batthewz/r-ui-react-components/README.md) · [AGENTS.md](../node_modules/@batthewz/r-ui-react-components/AGENTS.md)                                                                                                                                         |
| `@batthewz/r-ui-tw-merge`         | `cn()`: tailwind-merge (+ clsx) taught r-ui's utility names                                                                                                   | [README](../node_modules/@batthewz/r-ui-tw-merge/README.md)                                                                                                                                                                                                                          |

```tsx
import { Button, Card, Stack } from "@batthewz/r-ui-react-components";
import { cn } from "@batthewz/r-ui-tw-merge";
```

Icons are `lucide-react`. There is no local copy of any r-ui component; if one is missing
or wrong, that is a change to r-ui, not a fork here.

## CSS and tokens

The one CSS entry is [`src/web/style/app.css`](../src/web/style/app.css), imported by
`main.tsx`. Its order is load-bearing:

```css
@import "@batthewz/r-ui-css"; /* Tailwind + tokens + base */
@import "@batthewz/r-ui-react-components/styles"; /* component CSS, reads the tokens */
@import "./themes/harbour.css"; /* app themes override :root */
@import "./themes/dark.css";
```

**r-ui-css removes Tailwind's default scales.** `text-sm`, `bg-blue-500`, `rounded`,
`shadow-xl`, `font-bold`, `leading-tight`, `ease-in-out` generate **nothing**: no error,
no style. The class silently does nothing, so a "my padding is missing" bug usually means a
Tailwind default slipped in. Tokens are the only vocabulary, and they are what make the
same markup follow every theme, both densities and coarse pointers.

| For                    | Do                                                                                   | Don't                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Spacing in a component | `p-r3`, `gap-r2`, `mt-r4` (1 is the largest)                                         | `p-4`, `gap-2` (numeric spacing still compiles, for layout one-offs only)                                                              |
| Text size              | `text-body-1/2/3`, `text-h1`…`text-h6`                                               | `text-sm`, `text-lg`, `leading-tight`                                                                                                  |
| Text colour            | `text-fg-primary`, `text-fg-secondary`, `text-fg-muted`, `text-fg-error`             | `text-gray-500`, or a fill token as ink (`text-primary`, `text-status-error`): fills are only guaranteed against their own `on-*` text |
| Surfaces and fills     | `bg-canvas`, `bg-surface-0..3`, `bg-primary` + `text-fg-on-primary`, `border` (bare) | `bg-white`, `bg-blue-500`, `border-2`, a surface step as the only edge of a region                                                     |
| Control and icon size  | `h-control`, `size-control`, `h-row`, `size-icon`                                    | `h-10`, `w-5 h-5` (misses the density and touch hit floor)                                                                             |
| Shape and depth        | `rounded-sm/md/lg/xl/full`; `shadow-sm/md/lg` on floating layers only                | `rounded`, `shadow-xl`                                                                                                                 |
| Weight                 | `font-normal`, `font-medium`, `font-semibold`                                        | `font-bold`                                                                                                                            |
| Page widths            | `max-w-page`, `max-w-measure`, `px-gutter`, `w-column-md`                            | `max-w-4xl`                                                                                                                            |
| Stacking               | `z-sticky`, `z-docked`, `z-bypass`                                                   | `z-50` for page chrome                                                                                                                 |
| Responsive             | Viewport media queries move layout only                                              | An `@media (width …)` that redefines a token                                                                                           |
| Merging a `className`  | `cn(base, className)` from `@batthewz/r-ui-tw-merge`                                 | Plain `tailwind-merge`: it keeps `p-r3 p-r5` and drops `text-h1` next to `text-fg-muted`                                               |

In raw CSS, read the custom properties (`padding: var(--R-SIZE-3)`). The full list is in
r-ui-css's [AGENTS.md](../node_modules/@batthewz/r-ui-css/AGENTS.md).

## Themes

| Theme                                 | Where                                                                     | Why                                                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Harbour (`harbour`) — the default** | [`src/web/style/themes/harbour.css`](../src/web/style/themes/harbour.css) | What a first visit opens in: cool neutrals, sea-teal primary, orchid accent, rounder shapes, roomier `comfortable` density, the system rounded face (no web fonts). An app-owned copy of r-ui's `harbour` example, the same theme r-ui's showcase opens in. |
| Light (`default`)                     | r-ui-css's `:root`                                                        | The package's own palette; no file. Listed first because r-ui treats the first theme as "remove `data-theme`".                                                                                                                                              |
| Dark (`dark`)                         | [`src/web/style/themes/dark.css`](../src/web/style/themes/dark.css)       | An app-owned copy, started from r-ui's `nightfall` example.                                                                                                                                                                                                 |

Both app themes are copies rather than imports because r-ui's examples ship outside
semver: importing one could change the app's look on a patch release, while a copy only
changes when we change it.

### Which theme is the default

r-ui reserves the **first** entry of the theme list for its `:root` palette: choosing it
_removes_ `data-theme`. So the default is not set by list order (Harbour first would make
"Harbour" render the plain `:root` palette). Instead `INITIAL_THEME` in
[`src/web/lib/themes.ts`](../src/web/lib/themes.ts) names it, and
[`vite.config.ts`](../vite.config.ts) ships the page as `<html data-theme="harbour">`.
With nothing saved, the pre-paint script leaves that attribute alone; a saved choice
(Light included) replaces it before first paint. This is how r-ui's own showcase sets its
default. To make a different theme the default, change `INITIAL_THEME`; set it to
`"default"` to open in the plain `:root` palette.

The list the app offers is [`src/web/lib/themes.ts`](../src/web/lib/themes.ts)
(`THEMES`, `THEME_NAMES`, `INITIAL_THEME`). The list is read in two places that must agree: the
`PreferencesMenu` (what can be chosen) and the pre-paint script (what a reload may
restore). `src/web/lib/themes.test.ts` also checks the list against the CSS on disk, so a
listed theme without a stylesheet, a stylesheet missing from the list or from `app.css`,
or a file whose selector does not match its name fails the test suite instead of
rendering unthemed in production.

### Adding a theme

1. Copy `node_modules/@batthewz/r-ui-css/src/_theme-template.css` to
   `src/web/style/themes/<name>.css`. The file name must equal the theme name: r-ui's
   checks read it.
2. Scope it to `:root[data-theme="<name>"]` (root only: no subtree themes, no `@media`,
   no `!important`, one `color-scheme`, set `-COMFORTABLE` / `-COMPACT` density values,
   never the selected names). The
   [theme contract](../node_modules/@batthewz/r-ui-css/docs/theme-contract.md) explains
   each lever.
3. Add `@import "./themes/<name>.css";` to `app.css`, after the two package imports.
4. Add `{ value: "<name>", label: "…" }` to `THEMES`.
5. Run `bun run check:themes`, then `bun run test:web` (the themes test).

### `bun run check:themes`

[`scripts/check-themes.ts`](../scripts/check-themes.ts) runs r-ui's three checks over
every file in `src/web/style/themes/`: r-ui-css contrast (every pair the contract
promises), r-ui-css theme rules, and r-ui-react-components domain contrast (trend,
status, rating, code colours). Run it after any theme edit; it exits non-zero on a
failure.

**Why a wrapper instead of the commands in r-ui's README:** it checks every file in
`themes/` without being told about it, and it treats a check that prints nothing as a
failure. r-ui-css 0.1.0's scripts exited 0 without checking anything under Bun's symlinked
`node_modules` (fixed in 0.1.1); the guard keeps a silent pass from ever looking green.

## Preferences and the pre-paint script

`PreferencesMenu` (in both layouts) lets the viewer pick theme, density
(`comfortable` / `compact`) and input (`fine` / `coarse` hit sizes). r-ui sets
`data-theme`, `data-density` and `data-input` on `<html>` and saves the choice in
`localStorage` under `r-ui:preferences`.

This is a client-only SPA, so without help a reload would paint the default theme first and
flip once React mounts. [`vite.config.ts`](../vite.config.ts) therefore injects r-ui's
`themeScript({ themes: THEME_NAMES })` as the first element of `<head>` in the built
`index.html`; it restores the saved attributes before first paint. Do not hand-write a copy
into `index.html`.

The Worker's CSP has no `'unsafe-inline'`, so it allows this script by its SHA-256 hash,
computed from the served HTML at request time. See
[Security Headers](./api/middleware.md#3-security-headers-srcapimiddlewaresecurity-headersts)
for why the hash cannot be hard-coded.

## App root

[`src/web/App.tsx`](../src/web/App.tsx) mounts, outermost first:

| Layer                                       | Why                                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BrowserRouter` (react-router 7)            | URL state.                                                                                                                                                                                                                                                                            |
| `AppRouterProvider` (r-ui `RouterProvider`) | Hands r-ui the router once, so every `Link`, `AppShell.NavItem` and `AppShell.Brand` navigates client-side and marks the current page (a section's sub-pages keep its item current). The `AppLink` adapter lives at module scope; one created during render would remount every link. |
| `DocumentTitleProvider base={APP_NAME}`     | Pages call `useDocumentTitle("Settings")` and get "Settings \| AI Site Starter". Rename the product in [`src/web/lib/app.ts`](../src/web/lib/app.ts).                                                                                                                                 |
| `ToastProvider`                             | `useToast()` anywhere below.                                                                                                                                                                                                                                                          |
| `UnauthorizedHandler`                       | On a 401 from our API: a "Your session has ended" toast, then a session refetch. `AuthGuard` then redirects to `/login` and remembers the page. A hard reload would have discarded the toast before anyone could read it. Skipped on guest pages.                                     |
| `ErrorBoundary resetKeys={[pathname]}`      | A page that throws shows r-ui's fallback; navigating anywhere else recovers without a reload.                                                                                                                                                                                         |
| `Suspense`                                  | Every page is `lazy()`-loaded; a labelled spinner shows while a chunk loads.                                                                                                                                                                                                          |

## Routing and guards

Routes, guards and redirects are described in [Routing](./architecture/routing.md). In
short: guest pages sit in `GuestGuard`, signed-in pages in `AuthGuard`, `/` redirects to
`/dashboard`, anything else is `NotFound`. The redirect rules live in
[`src/web/lib/auth/redirect.ts`](../src/web/lib/auth/redirect.ts) (`AUTHENTICATED_HOME`,
`GUEST_PATHS`, `postSignInPath`) so the guards, the auth pages and the 401 handler cannot
disagree.

## Layouts

| Layout                                                                                 | Use for          | What it does                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AuthLayout` ([source](../src/web/components/layout/AuthLayout.tsx))                   | Signed-out pages | Brand + `PreferencesMenu` header, one centred `Card` whose heading is the page `h1`. Owns `<main>` and the document title. Props: `title`, `description`, `footer`, `className`. Preferences are here too because a visitor who needs dark mode or larger hit targets needs them on the sign-in form.                    |
| `AuthenticatedLayout` ([source](../src/web/components/layout/AuthenticatedLayout.tsx)) | Signed-in pages  | r-ui `AppShell`: sidebar on wide screens, icon rail on medium, bottom nav on phones, skip link. The header holds the page `h1`, `PreferencesMenu` and the account `DropdownMenu` (Settings, Sign out; a failed sign-out is a toast, never swallowed). Props: `title`, `width` (`"page"` default, `"measure"` for forms). |

Navigation items are one list, [`src/web/lib/navigation.ts`](../src/web/lib/navigation.ts)
(`NAV_ITEMS`), feeding both the sidebar and the bottom nav. Keep it to five or fewer: the
bottom nav has room for five. The product mark is
[`src/web/components/brand/BrandMark.tsx`](../src/web/components/brand/BrandMark.tsx);
swap its glyph for your logo.

## Forms

Every form uses r-ui's `useForm` + `Form` + `Field` + `FormActions` with the **shared Zod
schemas** in `src/shared/schemas/` (`auth.ts`, `user.ts`). `useForm` accepts any Standard
Schema, so the same schema validates in the browser and documents what Better Auth or the
API will enforce. Errors show on blur and clear as they are fixed; a failed submit focuses
the first invalid field.

From [`Login.tsx`](../src/web/pages/Login/Login.tsx):

```tsx
const form = useForm({
  schema: loginSchema,
  defaultValues: { email: "", password: "" },
  onSubmit: async (values, { setErrors }) => {
    try {
      const { error } = await signIn.email(values);
      if (error) {
        setErrors({ "": authErrorMessage(error, "Invalid email or password.") });
        return;
      }
      void navigate(postSignInPath(location.state), { replace: true });
    } catch {
      setErrors({ "": NETWORK_ERROR_MESSAGE });
    }
  },
});

<Form form={form}>
  <Stack gap="r3">
    <FormAlert form={form} />
    <Field name="email" required>
      <Field.Label>Email</Field.Label>
      <Input type="email" autoComplete="email" />
      <Field.Error />
    </Field>
    {/* … */}
    <FormActions>
      <FormActions.Submit className="w-full">Sign in</FormActions.Submit>
    </FormActions>
  </Stack>
</Form>;
```

Rules the pages follow:

- **Server errors about the whole form** go to `setErrors({ "": message })` and are shown
  by [`FormAlert`](../src/web/components/forms/FormAlert.tsx), which renders only errors no
  field owns (r-ui's `ErrorSummary` would repeat field messages on a two-field form) and
  takes focus after a failed submit so screen readers announce it.
- **Server errors about one field** go to that field: `setErrors({ currentPassword: "…" })`.
- **Handle both failure shapes of Better Auth**: HTTP failures resolve as `{ error }`,
  network failures reject. Use `authErrorMessage(error, fallback)` and
  `NETWORK_ERROR_MESSAGE` from [`src/web/lib/auth/errors.ts`](../src/web/lib/auth/errors.ts).
- **Password-only forms** (change password, delete account) include
  [`UsernameHint`](../src/web/components/forms/UsernameHint.tsx), a hidden `username`
  input, so password managers save the new password against the right account.
- `loginSchema` only requires a password to be typed; the length rule belongs to sign-up
  and reset, so a short mistyped password gets "invalid email or password" and older
  accounts are not locked out by a policy change.

## Pages

| Page             | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Login`          | Returns the user to the page `AuthGuard` recorded (`postSignInPath`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `Register`       | `PasswordInput strength` meter is a nudge; the enforced rule is `registerSchema`'s minimum length. Better Auth signs the user in on success.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `ForgotPassword` | Same confirmation whether or not the address has an account, so it cannot enumerate users.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ResetPassword`  | Handles `?token=…`, `?error=INVALID_TOKEN` (expired or used link) and neither, each with a way forward.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Dashboard`      | Reads `GET /api/me` through `useApi` (not the in-memory session), so a fresh deploy proves cookie → Worker → auth middleware → D1 at a glance. Shown in a `DescriptionList`; failures show `ErrorFallback` with retry.                                                                                                                                                                                                                                                                                                                                            |
| `Settings`       | One card per concern, each with its own form and errors. `ProfileSection`: `AvatarUpload` (crop, upload with progress / cancel / retry via `apiUpload`, remove via `DELETE /api/users/me/avatar`) and display name. `PasswordSection`: "sign out of other devices" on by default (the usual reason to change a password is suspecting someone has it). `SessionsSection`: every device, labelled by `describeUserAgent` and `relativeTime`, revocable one by one or all others. `DangerZoneSection`: deletion behind an `alertdialog` that asks for the password. |
| `NotFound`       | Outside both guards; its own `h1` page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Data and uploads

[`src/web/lib/api/client.ts`](../src/web/lib/api/client.ts) is the one way to call our API
(see [API Client](./api/client.md)). Both helpers throw `ApiError` and fire the 401 handler.

- **`useApi<T>(path)`** ([source](../src/web/hooks/use-api.ts)): GET with
  `{ data, error, loading, refetch }`; aborts on unmount or when `path` changes.
- **`apiUpload<T>(path, formData, { method, signal, onProgress })`**: the same contract over
  `XMLHttpRequest`, because `fetch` cannot report upload progress and r-ui's
  `AvatarUpload` / `FileUpload` draw their progress from it. Aborting rejects with an
  `AbortError` `DOMException`.

Small helpers: [`user-agent.ts`](../src/web/lib/user-agent.ts) (short device labels; the
test order matters because UAs impersonate each other) and
[`relative-time.ts`](../src/web/lib/relative-time.ts) ("3 days ago" in the viewer's locale).

## Toasts and errors

- `const { toast } = useToast(); toast({ title, description, tone: "success" | "error" | "warning" })`
  for outcomes that are not tied to a form field (profile saved, sign-out failed, photo
  removal failed). Give a toast an `id` when repeats should collapse (the 401 handler uses
  `"session-expired"`).
- Form errors stay in the form (`FormAlert`, `Field.Error`), not in toasts.
- Load failures render in place with `ErrorFallback onRetry={refetch}`, never a blank card.
- Uncaught render errors are caught by the route-keyed `ErrorBoundary` in `App.tsx`.

## Testing

Web tests (`bun run test:web`, jsdom) render the **real r-ui components** and mock only the
network boundary: the Better Auth client (`vi.mock("@/web/lib/auth/auth-client", …)`) and
`fetch`. Mocking the UI library would let a library change that breaks our pages pass
unnoticed.

[`src/web/test-utils.tsx`](../src/web/test-utils.tsx) provides:

- `renderWithRouter(ui, { route, state, path })`: mounts the same providers as `App.tsx`
  (r-ui `RouterProvider` over a `MemoryRouter`, `ToastProvider`).
- `LocationProbe`: renders the current path (and `location.state`) in
  `data-testid="location"`, so redirects are asserted by what the router did, not by a
  mocked `navigate`.

Query by role and label (`getByRole("button", { name: "Sign in" })`), as a user would. See
[Testing](./guides/tests.md) for the general rules and screenshots.

## Where things live

```
src/web/
├── App.tsx                 # providers + route table
├── main.tsx                # React bootstrap, imports style/app.css
├── index.html              # pre-paint script is injected here at build
├── vite-env.d.ts           # Vite client types (TS 6 type-checks CSS side-effect imports)
├── style/
│   ├── app.css             # the one CSS entry (r-ui-css, components styles, themes)
│   └── themes/             # app-owned themes, one file per data-theme (harbour.css, dark.css)
├── lib/
│   ├── app.ts              # APP_NAME
│   ├── themes.ts           # THEMES / THEME_NAMES / INITIAL_THEME (+ themes.test.ts)
│   ├── navigation.ts       # NAV_ITEMS
│   ├── api/client.ts       # api, apiUpload, ApiError, setOnUnauthorized
│   ├── auth/               # auth-client, redirect, session, errors
│   ├── user-agent.ts
│   └── relative-time.ts
├── hooks/use-api.ts
├── components/
│   ├── brand/BrandMark.tsx
│   ├── forms/              # FormAlert, UsernameHint
│   ├── guards/             # AuthGuard, GuestGuard
│   └── layout/             # AuthLayout, AuthenticatedLayout
├── pages/                  # one folder per route
└── test-utils.tsx          # renderWithRouter, LocationProbe
```

See [Folder Structure](./architecture/folder-structure.md) for the conventions.
