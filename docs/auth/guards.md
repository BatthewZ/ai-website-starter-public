# Route Guards

Route guards are React components that wrap page components to control access based on
auth state. They live in `src/web/components/guards/` and are re-exported from its
`index.ts`. Both map Better Auth's `useSession()` to `"loading" | "authenticated" |
"unauthenticated"` with `sessionStatus()` (`src/web/lib/auth/session.ts`), where
`isPending` wins over `data`: during the first fetch `data` is `null`, and reading that as
"signed out" would send a signed-in user to `/login` on every hard reload.

### AuthGuard

**File**: `src/web/components/guards/AuthGuard.tsx`

Renders the page only for a signed-in user, on top of r-ui's `RequireAuth` (which never
renders `children` while loading, so protected content cannot flash). Signed out, it
replaces the history entry with `/login` and records where the user was going, so sign-in
returns them there:

```tsx
<RequireAuth
  status={sessionStatus(session)}
  signInHref="/login"
  onUnauthenticated={() =>
    void navigate("/login", { replace: true, state: signInRedirectState(location) })
  }
  className="min-h-dvh content-center"
>
  {children}
</RequireAuth>
```

### GuestGuard

**File**: `src/web/components/guards/GuestGuard.tsx`

Renders the page only for a signed-out visitor (`/login`, `/register`, `/forgot-password`,
`/reset-password`). While loading it shows a labelled spinner; a signed-in user is
redirected to `postSignInPath(location.state)`: the page `AuthGuard` recorded, or
`/dashboard`. This is also what moves a user on after a successful sign-in or sign-up,
since Better Auth updates the session store and the guard re-renders.

`postSignInPath` (`src/web/lib/auth/redirect.ts`) validates the recorded path before using
it: only same-origin, non-guest paths are accepted, so a crafted `history.state` cannot turn
sign-in into an open redirect.

**Usage**:

```tsx
<Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
<Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
```

See [Routing](../architecture/routing.md) for the full route table and the 401 handling.
