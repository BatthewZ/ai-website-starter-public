# Build & Deploy Scripts

From `package.json` (the source of truth):

| Script                      | Command                                                                               | Purpose                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `bun run dev`               | `concurrently "vite" "wrangler dev"`                                                  | Start local dev (Vite on :5173 + Wrangler on :8787)                                        |
| `bun run build`             | `vite build`                                                                          | Build frontend to `dist/` (inlines the pre-paint theme script)                             |
| `bun run deploy`            | `vite build && wrangler deploy`                                                       | Build, then deploy Worker + assets to Cloudflare                                           |
| `bun run db:generate`       | `drizzle-kit generate`                                                                | Generate migration SQL from schema changes                                                 |
| `bun run db:migrate:local`  | `wrangler d1 migrations apply ai_site_starter_db --local`                             | Apply migrations locally                                                                   |
| `bun run db:migrate:remote` | `wrangler d1 migrations apply ai_site_starter_db --remote`                            | Apply migrations to production (run before `deploy`)                                       |
| `bun run typecheck`         | `concurrently` of `typecheck:backend`, `typecheck:web`, `typecheck:tests`, `lint:fix` | Typecheck all three tsconfigs and lint                                                     |
| `bun run lint`              | `eslint src/`                                                                         | Lint without fixing                                                                        |
| `bun run check:themes`      | `bun scripts/check-themes.ts`                                                         | Run r-ui's contrast, theme-rule and domain-contrast checks on `src/web/style/themes/*.css` |
| `bun run test`              | `vitest run`                                                                          | Run all tests (`test:web`, `test:api`, `test:unit` run one project)                        |
