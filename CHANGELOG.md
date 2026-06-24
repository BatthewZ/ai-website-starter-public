# Changelog

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
