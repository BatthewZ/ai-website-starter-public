# Deployment Guide

### 1. Build the frontend

```bash
bun run build
```

This runs `vite build` and outputs the React SPA to the `dist/` directory. The Worker serves these static files for all non-API routes.

### 2. Create a D1 database

If you have not yet created a D1 database for this project:

```bash
wrangler d1 create ai_site_starter_db
```

This outputs a `database_id`. Copy it.

### 3. Configure `wrangler.toml`

**File:** `wrangler.toml`

```toml
name = "ai-site-starter"
main = "src/api/index.ts"
compatibility_date = "2025-01-13"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "single-page-application"
run_worker_first = true

[[d1_databases]]
binding = "DB"
database_name = "ai_site_starter_db"
database_id = "placeholder"
```

Replace `"placeholder"` in `database_id` with the actual UUID from step 2.

#### Configuration breakdown

| Field                            | Purpose                                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `name`                           | Worker name (appears in Cloudflare dashboard)                                                              |
| `main`                           | Worker entry point (the Hono API server)                                                                   |
| `compatibility_date`             | Cloudflare Workers runtime compatibility target                                                            |
| `compatibility_flags`            | `nodejs_compat` enables Node.js APIs in Workers                                                            |
| `[assets].directory`             | Path to the built frontend files                                                                           |
| `[assets].binding`               | Binding name for the asset fetcher (`env.ASSETS`)                                                          |
| `[assets].not_found_handling`    | `single-page-application` returns `index.html` for unmatched routes (SPA client-side routing)              |
| `[assets].run_worker_first`      | `true` means the Worker handles all requests first; unmatched non-API routes fall through to static assets |
| `[[d1_databases]].binding`       | The binding name for the D1 database (`env.DB`)                                                            |
| `[[d1_databases]].database_name` | Human-readable name of the D1 database                                                                     |
| `[[d1_databases]].database_id`   | UUID of the D1 database in your Cloudflare account                                                         |

### 4. Set production secrets

Production secrets are stored securely in Cloudflare and are **not** committed to source control.

```bash
wrangler secret put BETTER_AUTH_SECRET
```

When prompted, enter a strong random secret string (at least 32 characters). This is used to sign auth tokens.

```bash
wrangler secret put BETTER_AUTH_URL
```

Enter your production URL (e.g. `https://your-app.your-domain.com` or `https://ai-site-starter.your-subdomain.workers.dev`).

Optionally, if you have additional trusted origins (e.g. for CORS):

```bash
wrangler secret put TRUSTED_ORIGINS
```

Enter a comma-separated list of origins (e.g. `https://other-domain.com,https://staging.example.com`).

### 5. Apply database migrations to production

```bash
bun run db:migrate:remote
```

This runs `wrangler d1 migrations apply ai_site_starter_db --remote` and applies all pending migration files from the `migrations/` directory to the production D1 database.

Always apply migrations before step 6. Better Auth validates the Drizzle schema when the Worker starts, so code deployed ahead of its migration fails every request with a 500 (`Drizzle schema mismatch`). See [Redeploying](./redeploying.md).

### 6. Deploy

```bash
bun run deploy
```

This runs `vite build && wrangler deploy`, which:

1. Builds the frontend into `dist/` (including the inlined pre-paint theme script)
2. Bundles the Worker entry point (`src/api/index.ts`) and its dependencies
3. Uploads the built static assets from `dist/`
4. Deploys to Cloudflare's edge network

After deployment, your app is live at `https://ai-site-starter.<your-subdomain>.workers.dev`.
