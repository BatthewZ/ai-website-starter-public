# Deployment Checklist

1. [ ] D1 database created (`wrangler d1 create ai_site_starter_db`)
2. [ ] `database_id` in `wrangler.toml` set to the real UUID
3. [ ] `BETTER_AUTH_SECRET` secret set (`wrangler secret put BETTER_AUTH_SECRET`)
4. [ ] `BETTER_AUTH_URL` secret set (`wrangler secret put BETTER_AUTH_URL`)
5. [ ] Frontend built (`bun run build`)
6. [ ] Migrations applied to production (`bun run db:migrate:remote`) — before deploying; Better Auth 1.7 needs `0002` (`account.idToken`) or every request 500s
7. [ ] Deployed (`bun run deploy`)
8. [ ] (Optional) Custom domain configured and `BETTER_AUTH_URL` updated
