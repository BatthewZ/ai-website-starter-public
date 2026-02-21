# Route Guards

Route guards are React components that wrap page components to control access based on auth state. They are defined in `src/web/components/guards/`.

### AuthGuard

**File**: `src/web/components/guards/AuthGuard.tsx`

Requires an active session. If the session is loading, shows a spinner. If no session exists, redirects to `/login`.

```tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Center className="min-h-screen">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

**Usage**:

```tsx
<Route
  path="/dashboard"
  element={
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  }
/>
```

### GuestGuard

**File**: `src/web/components/guards/GuestGuard.tsx`

Requires no active session. If the session is loading, shows a spinner. If a session exists, redirects to `/dashboard`.

```tsx
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Center className="min-h-screen">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
```

**Usage**:

```tsx
<Route
  path="/login"
  element={
    <GuestGuard>
      <Login />
    </GuestGuard>
  }
/>
```
