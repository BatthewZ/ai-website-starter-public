# Redeploying

After making code changes:

```bash
bun run db:migrate:remote  # Apply any new migrations FIRST
bun run deploy             # Builds the frontend (vite build) and deploys
```

Apply migrations **before** deploying code that expects them. Better Auth checks the
Drizzle schema against the database when the Worker starts, so new code on an old schema
does not degrade gracefully: every request fails with a 500. Running an additive migration
(a new table or nullable column, like every migration so far) first is safe: the old code
ignores it. A destructive change (drop or rename) needs a two-step rollout instead.

If no file in `migrations/` is new since the last deploy, the migration step is a no-op and
can be skipped. Frontend-only changes still need a deploy, since the Worker serves the built
assets (`bun run deploy` rebuilds them).

## Action required: Better Auth 1.7 (`account.idToken`)

The upgrade to Better Auth 1.7 requires an `idToken` column on the `account` table
(migration `migrations/0002_smart_omega_sentinel.sql`:
`ALTER TABLE account ADD idToken text`). Existing deployments **must** run

```bash
bun run db:migrate:remote
```

before deploying this version. Without it, every request returns 500 and the Worker logs
`Drizzle schema mismatch`. The column holds the OIDC ID token for social / OIDC providers
and stays `null` for email + password accounts. Local databases need
`bun run db:migrate:local` the same way.
