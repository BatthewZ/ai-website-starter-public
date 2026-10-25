# Frontend Routing

Routing uses **`react-router` v7** (the `react-router-dom` package is no longer used; v7
ships everything from `react-router`). The route table is `AppRoutes` in
[`src/web/App.tsx`](../../src/web/App.tsx).

### Current Routes

| Path               | Guard      | Page                                                 |
| ------------------ | ---------- | ---------------------------------------------------- |
| `/login`           | GuestGuard | Login                                                |
| `/register`        | GuestGuard | Register                                             |
| `/forgot-password` | GuestGuard | ForgotPassword                                       |
| `/reset-password`  | GuestGuard | ResetPassword (`?token=…` or `?error=INVALID_TOKEN`) |
| `/dashboard`       | AuthGuard  | Dashboard                                            |
| `/settings`        | AuthGuard  | Settings                                             |
| `/`                | None       | Redirects to `/dashboard` (`AUTHENTICATED_HOME`)     |
| `*`                | None       | NotFound (404); works signed in or out               |

The former `/demo`, `/showcase` and `/theme-editor` routes were removed. The component
reference is now the hosted [r-ui showcase](https://batthewz.github.io/r-ui/showcase/).

### Router adapter for r-ui

`App.tsx` wraps the app in r-ui's `RouterProvider` with a module-scope `AppLink` (react-router's
`Link`, taking `href`) and an `isCurrent(href)` that also matches sub-paths. Every r-ui
`Link`, `AppShell.NavItem` and `AppShell.Brand` therefore navigates client-side and marks
the current page without a per-call `as={RouterLink}` or `current` prop.

### Lazy Loading

Every page is loaded with `lazy()`, so each is its own chunk, downloaded on first visit.
While a chunk loads, `Suspense` shows a full-height spinner labelled "Loading page…".
The `Suspense` sits inside an `ErrorBoundary` keyed to the pathname: a page that throws
shows the error fallback, and navigating elsewhere recovers without a reload.

### Route Guards

Guards live in [`src/web/components/guards/`](../../src/web/components/guards/). Both read
Better Auth's `useSession()` through `sessionStatus()`
([`lib/auth/session.ts`](../../src/web/lib/auth/session.ts)), which reports `"loading"`
while the first session fetch is in flight. Treating that moment as "signed out" would
bounce a signed-in user to `/login` on every hard reload.

- **`AuthGuard`** wraps r-ui's `RequireAuth`, which never renders the page while the
  session is loading (no flash of protected content). Signed out, it replaces the history
  entry with `/login` and records the requested page in location state
  (`{ from: "/settings?…" }`).
- **`GuestGuard`** shows a spinner while loading and, for a signed-in user, redirects to
  `postSignInPath(location.state)`. This is also what moves the user on after sign-in or
  sign-up: Better Auth updates the session store and the guard re-renders.

The redirect rules are in [`lib/auth/redirect.ts`](../../src/web/lib/auth/redirect.ts):

| Export                          | Purpose                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTHENTICATED_HOME`            | `/dashboard`: where sign-in lands when nothing was requested.                                                                                                                                                                                                                                                                                   |
| `GUEST_PATHS`                   | The four signed-out pages.                                                                                                                                                                                                                                                                                                                      |
| `signInRedirectState(location)` | The `{ from }` state `AuthGuard` records.                                                                                                                                                                                                                                                                                                       |
| `postSignInPath(state)`         | The page to open after sign-in. Location state can be written by any script on the page, so `from` is validated: it must be a same-origin path (no `https://…`, `//…` or `/\…`, which would make sign-in an open redirect) and not a guest path (which would bounce straight back to a form). Anything else falls back to `AUTHENTICATED_HOME`. |

### Session Expiry (401)

`UnauthorizedHandler` in `App.tsx` registers a callback with the API client
(`setOnUnauthorized`). When our API answers 401 (the session expired or was revoked on
another device), it shows a "Your session has ended" toast and refetches the session; it
does nothing on guest paths. Once the refetch comes back empty, `AuthGuard` redirects to
`/login` and remembers the page. It deliberately does not hard-reload to `/login`: a reload
would discard the toast before it could be read.
