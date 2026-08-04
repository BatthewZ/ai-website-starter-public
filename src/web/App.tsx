import {
  Center,
  ErrorBoundary,
  RouterAdapterProvider,
  type RouterLinkComponent,
  type RouterLinkProps,
  Spinner,
  ToastProvider,
  useToast,
} from "@batthewz/response-ui-react-components";
import { forwardRef, lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Link as RouterLink, Navigate, Route, Routes, useLocation } from "react-router-dom";

import { AuthGuard } from "./components/guards/AuthGuard";
import { GuestGuard } from "./components/guards/GuestGuard";
import { setOnUnauthorized } from "./lib/api/client";

const AdapterLink: RouterLinkComponent = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function AdapterLink({ to, replace, children, ...rest }, ref) {
    return (
      <RouterLink ref={ref} to={to} replace={replace} {...rest}>
        {children}
      </RouterLink>
    );
  }
);

const routerAdapter = { Link: AdapterLink, usePathname: () => useLocation().pathname };

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Demo = lazy(() => import("./pages/Demo/Demo"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Register = lazy(() => import("./pages/Register/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const Showcase = lazy(() => import("./pages/Showcase/Showcase"));
const ThemeEditor = lazy(() => import("./pages/ThemeEditor/ThemeEditor"));

const GUEST_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

function UnauthorizedRedirect() {
  const { toast } = useToast();

  useEffect(() => {
    setOnUnauthorized(() => {
      if (GUEST_PATHS.includes(window.location.pathname)) return;
      toast("Your session has expired. Please sign in again.", { variant: "warning" });
      window.location.href = "/login";
    });
    return () => setOnUnauthorized(null);
  }, [toast]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <RouterAdapterProvider value={routerAdapter}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-surface-0 focus:px-4 focus:py-2 focus:rounded-md focus:shadow-md focus:text-fg-primary"
        >
          Skip to content
        </a>
        <ToastProvider>
        <UnauthorizedRedirect />
        <ErrorBoundary>
          <Suspense
              fallback={
                <Center className="min-h-screen">
                  {/*
                    Children make this the status region — a bare <Spinner /> is
                    aria-hidden decoration as of 0.15.0. This is the route-level
                    Suspense fallback, so it is the only thing on screen while a
                    lazy page chunk loads and it should say so.
                  */}
                  <Spinner size="lg">Loading page…</Spinner>
                </Center>
              }
            >
              <main id="main-content">
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
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/showcase" element={<Showcase />} />
                  <Route path="/theme-editor" element={<ThemeEditor />} />
                  <Route path="/" element={<Navigate to="/showcase" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
          </Suspense>
        </ErrorBoundary>
      </ToastProvider>
      </RouterAdapterProvider>
    </BrowserRouter>
  );
}
