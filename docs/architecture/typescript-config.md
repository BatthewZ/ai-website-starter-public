# TypeScript Configuration

## Three TypeScript Configurations

The project uses a [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) setup with a root `tsconfig.json` that references three sub-configs:

```json
// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./tsconfig.backend.json" },
    { "path": "./tsconfig.web.json" },
    { "path": "./tsconfig.test.json" }
  ]
}
```

### Why Three Configs?

The backend, frontend, and tests run in fundamentally different environments with different global types:

| | `tsconfig.backend.json` | `tsconfig.web.json` | `tsconfig.test.json` |
|---|---|---|---|
| **Environment** | Cloudflare Workers | Browser | Vitest |
| **Global types** | `@cloudflare/workers-types` | `DOM`, `DOM.Iterable`, `@types/react`, `@types/react-dom` | Vitest globals |
| **Includes** | `src/api/**/*`, `src/db/**/*`, `src/shared/**/*` | `src/web/**/*`, `src/shared/**/*` | Test files |
| **JSX** | Not configured | `react-jsx` | `react-jsx` |

If these were combined into a single config:

- Backend code would see `window`, `document`, and DOM APIs (which do not exist in Workers).
- Frontend code would see `D1Database`, `KVNamespace`, and other Workers types (which do not exist in browsers).

The `src/shared/` directory is included in **both** the backend and web configs. This is intentional -- shared code (Zod schemas, types, constants) must type-check in both environments.

### Type-checking

The `typecheck` script runs all three configs in parallel using `concurrently`, along with ESLint:

```bash
bun run typecheck
# Expands to:
# concurrently -n backend,web,tests,eslint -c blue,green,yellow,red \
#   "bun run typecheck:backend" \
#   "bun run typecheck:web" \
#   "bun run typecheck:tests" \
#   "bun run lint:fix"
```

Each sub-script runs `tsc --noEmit` with the corresponding config:
- `typecheck:backend` -- `tsc --noEmit -p tsconfig.backend.json`
- `typecheck:web` -- `tsc --noEmit -p tsconfig.web.json`
- `typecheck:tests` -- `tsc --noEmit -p tsconfig.test.json`

---

## The `@/` Path Alias

Both TypeScript configs and Vite define a path alias `@/` that maps to the `src/` directory:

```json
// In both tsconfig.backend.json and tsconfig.web.json
"paths": {
  "@/*": ["./src/*"]
}
```

```ts
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

This allows imports like:

```ts
import { useSession } from "@/web/lib/auth/auth-client";
import { loginSchema } from "@/shared/schemas/auth";
```

The alias is configured in three places because each tool resolves imports independently:

1. **`tsconfig.backend.json`** -- so `tsc` resolves `@/` in backend code.
2. **`tsconfig.web.json`** -- so `tsc` resolves `@/` in frontend code.
3. **`vite.config.ts`** -- so Vite's bundler resolves `@/` at build time.
