import { RouterProvider, ToastProvider } from "@batthewz/r-ui-react-components";
import { render, type RenderResult } from "@testing-library/react";
import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { Link as RouterLink, MemoryRouter, Route, Routes, useLocation } from "react-router";

/**
 * Test harness for web components: the same providers App.tsx mounts (a router
 * r-ui links navigate through, and the toast stack), around REAL r-ui
 * components. Only the network boundary (Better Auth's client, `fetch`) is
 * mocked in tests, never the UI library, so a test fails when the library's
 * behaviour changes in a way our pages depend on.
 */

function TestLink({ href, ...props }: ComponentPropsWithRef<"a"> & { href: string }) {
  return <RouterLink to={href} {...props} />;
}

function Providers({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <RouterProvider link={TestLink} isCurrent={(href) => href === pathname}>
      <ToastProvider>{children}</ToastProvider>
    </RouterProvider>
  );
}

/**
 * Renders where the router decides what `location.state` and `pathname` are.
 * Shows the current location as text in a `data-testid="location"` element,
 * so a redirect is asserted by what the router did, not by a mocked navigate.
 * A plain div on purpose: `<output>` has an implicit `status` role and would
 * collide with the spinners the guards are tested for.
 */
export function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location" data-state={JSON.stringify(location.state ?? null)}>
      {location.pathname}
      {location.search}
    </div>
  );
}

interface RenderOptions {
  /** The URL the test starts at. Default "/". */
  route?: string;
  /** `location.state` for that first entry. */
  state?: unknown;
  /** Where `ui` is mounted. Default "*" (every path). */
  path?: string;
}

/**
 * Mounts `ui` at `path` and a `LocationProbe` on every other path, so a test
 * can follow a redirect away from the component under test.
 */
export function renderWithRouter(
  ui: ReactElement,
  { route = "/", state, path = "*" }: RenderOptions = {}
): RenderResult {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: route.split("?")[0],
          search: route.includes("?") ? `?${route.split("?")[1]}` : "",
          state,
        },
      ]}
    >
      <Providers>
        <Routes>
          <Route
            path={path}
            element={
              <>
                {ui}
                <LocationProbe />
              </>
            }
          />
          {path !== "*" && <Route path="*" element={<LocationProbe />} />}
        </Routes>
      </Providers>
    </MemoryRouter>
  );
}
