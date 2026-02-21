# Frontend Routing

### Lazy Loading

All page components are loaded lazily using React's `lazy()` and `Suspense`:

```tsx
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Login = lazy(() => import("./pages/Login/Login"));
// ... etc
```

This means each page is a separate JavaScript chunk that is only downloaded when the user navigates to that route. During loading, a full-screen spinner is shown:

```tsx
<Suspense
  fallback={
    <Center className="min-h-screen">
      <Spinner size="lg" />
    </Center>
  }
>
  <Routes>...</Routes>
</Suspense>
```

### Route Guards

Routes are protected using guard components that wrap page components:

- **`AuthGuard`** -- requires an active session. If no session exists, redirects to `/login`. Used for protected pages like `/dashboard` and `/settings`.
- **`GuestGuard`** -- requires no active session. If a session exists, redirects to `/dashboard`. Used for auth pages like `/login`, `/register`, `/forgot-password`, and `/reset-password`.

Both guards show a loading spinner while the session is being checked (`isPending` state).

### Current Routes

| Path | Guard | Page |
|---|---|---|
| `/` | None | Redirects to `/dashboard` |
| `/login` | GuestGuard | Login |
| `/register` | GuestGuard | Register |
| `/forgot-password` | GuestGuard | ForgotPassword |
| `/reset-password` | GuestGuard | ResetPassword |
| `/dashboard` | AuthGuard | Dashboard |
| `/settings` | AuthGuard | Settings |
| `/demo` | None | Demo |
| `/showcase` | None | Showcase |
| `*` | None | NotFound (404) |

### Unauthorized Redirect

The `App.tsx` includes an `UnauthorizedRedirect` component that listens for 401 responses from the API client. When a 401 is received (e.g., expired session), the user sees a toast message and is redirected to `/login`. This redirect is suppressed on guest paths (`/login`, `/register`, `/forgot-password`, `/reset-password`) to avoid redirect loops.
