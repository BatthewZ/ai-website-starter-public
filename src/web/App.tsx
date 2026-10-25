import {
  DocumentTitleProvider,
  ErrorBoundary,
  RouterProvider,
  Spinner,
  ToastProvider,
  useToast,
} from "@batthewz/r-ui-react-components";
import {
  type ComponentPropsWithRef,
  lazy,
  type ReactNode,
  Suspense,
  useCallback,
  useEffect,
} from "react";
import {
  BrowserRouter,
  Link as RouterLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router";

import { AuthGuard } from "./components/guards/AuthGuard";
import { GuestGuard } from "./components/guards/GuestGuard";
import { setOnUnauthorized } from "./lib/api/client";
import { APP_NAME } from "./lib/app";
import { useSession } from "./lib/auth/auth-client";
import { AUTHENTICATED_HOME, GUEST_PATHS } from "./lib/auth/redirect";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Register = lazy(() => import("./pages/Register/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Settings = lazy(() => import("./pages/Settings/Settings"));

/**
 * React Router's link, in the shape r-ui's components render (`href`, not
 * `to`). Module scope is required: a component created during render would
 * remount every link on every render.
 */
function AppLink({ href, ...props }: ComponentPropsWithRef<"a"> & { href: string }) {
  return <RouterLink to={href} {...props} />;
}

/**
 * Hands r-ui the router once, so every `Link`, `AppShell.NavItem` and
 * `AppShell.Brand` navigates client-side and marks the current page, with no
 * per-call `as={RouterLink}`. A section's sub-pages (`/settings/…`) keep its
 * nav item current.
 */
function AppRouterProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isCurrent = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );
  return (
    <RouterProvider link={AppLink} isCurrent={isCurrent}>
      {children}
    </RouterProvider>
  );
}

/**
 * Handles a 401 from our own API (`lib/api/client`): the session expired or
 * was revoked on another device while this tab was open.
 *
 * It refetches the session instead of hard-reloading to /login, for two
 * reasons: a reload would throw away the toast before anyone could read it,
 * and the stale session in Better Auth's store would otherwise keep the
 * guards believing the user is signed in. Once the refetch comes back empty,
 * `AuthGuard` redirects to /login and remembers the page for after sign-in.
 */
function UnauthorizedHandler() {
  const { toast } = useToast();
  const { refetch } = useSession();

  useEffect(() => {
    setOnUnauthorized(() => {
      if (GUEST_PATHS.includes(window.location.pathname)) return;
      toast({
        id: "session-expired",
        title: "Your session has ended",
        description: "Please sign in again to continue.",
        tone: "warning",
      });
      void refetch();
    });
    return () => setOnUnauthorized(null);
  }, [toast, refetch]);

  return null;
}

function PageLoading() {
  return (
    <div className="grid min-h-dvh place-items-center">
      {/* Labelled, so it is the status region: it is all there is while a page chunk loads. */}
      <Spinner label="Loading page…" className="size-control" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRouterProvider>
        <DocumentTitleProvider base={APP_NAME}>
          <ToastProvider>
            <UnauthorizedHandler />
            <AppRoutes />
          </ToastProvider>
        </DocumentTitleProvider>
      </AppRouterProvider>
    </BrowserRouter>
  );
}

/**
 * The route table. The error boundary is keyed to the path, so after a page
 * throws, navigating anywhere else renders normally again instead of leaving
 * the fallback up until a reload.
 */
function AppRoutes() {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary resetKeys={[pathname]} className="min-h-dvh content-center">
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />
          <Route
            path="/register"
            element={
              <GuestGuard>
                <Register />
              </GuestGuard>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestGuard>
                <ForgotPassword />
              </GuestGuard>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestGuard>
                <ResetPassword />
              </GuestGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route path="/" element={<Navigate to={AUTHENTICATED_HOME} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
