import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthGuard } from "./components/guards/AuthGuard";
import { GuestGuard } from "./components/guards/GuestGuard";
import { Center } from "./components/layout";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { Spinner } from "./components/ui/Spinner";
import { ToastProvider, useToast } from "./components/ui/ToastContext";
import { setOnUnauthorized } from "./lib/api/client";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Demo = lazy(() => import("./pages/Demo/Demo"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/ForgotPassword"));
const Login = lazy(() => import("./pages/Login/Login"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const Register = lazy(() => import("./pages/Register/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const Showcase = lazy(() => import("./pages/Showcase/Showcase"));

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
                  <Spinner size="lg" />
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
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
          </Suspense>
        </ErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
}
