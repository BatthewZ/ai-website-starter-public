# Dependencies

How versions are chosen, what is deliberately held back, and the security
exceptions that are accepted on purpose. Read this before bumping anything.

## Policy

- **Third-party packages are pinned exactly** (`"hono": "4.13.13"`, no `^`), so an
  install is the same everywhere and an upgrade is always a visible diff.
- **First-party design-system packages use caret ranges** (`@batthewz/r-ui-*`:
  `^0.1.x`). They are ours, published by us, and exempt from the release-age gate
  below, so their patch fixes should flow in with `bun update`. The lockfile still
  records the exact version installed.
- **Nothing younger than 7 days is installed.** `~/.bunfig.toml` sets
  `minimumReleaseAge = 604800`, which also applies to transitive dependencies.
  Most npm compromises (2025's debug/chalk, 2026's keyv/CHAINDROP) were found and
  pulled within days, so waiting a week avoids them. The `@batthewz/r-ui-*` packages
  are listed in `minimumReleaseAgeExcludes`. (npm reads the same policy from
  `~/.npmrc` `min-release-age` / `min-release-age-exclude[]`, but only npm 12+
  implements it.)
- **Vet before bumping.** For a security-relevant package (wrangler, hono,
  better-auth, vite, react, react-router, zod, the eslint and TypeScript
  toolchains), check the advisories in the range and the publisher and provenance
  of the new version (`npm view <pkg>@<ver> _npmUser.name dist.attestations`)
  before installing. A change of publisher or a lost provenance attestation is a
  red flag.

## Auditing

```sh
bun run audit   # bun audit, minus the accepted advisory below
```

`bun audit --production` (runtime dependencies only) should always be clean.

### Accepted: GHSA-67mh-4wv8-2f99 (esbuild, moderate)

esbuild ≤ 0.24.2's **development server** (`esbuild.serve`) answers cross-origin
requests. drizzle-kit pulls esbuild 0.18 in through `@esbuild-kit/core-utils`,
which uses esbuild only to compile the drizzle config, never `serve`. So the
vulnerable code never runs here. `bun run audit` ignores it by ID. Remove the
`--ignore` once drizzle-kit stops depending on `@esbuild-kit/core-utils`.

### Override: undici inside miniflare

`package.json` has:

```json
"overrides": { "miniflare": { "undici": "7.30.1" } }
```

wrangler's miniflare (the local `wrangler dev` runtime) pins `undici` exactly at
7.29.1, which has three advisories fixed in 7.30.1, including a high-severity
denial of service. The override is scoped to miniflare on purpose: jsdom needs
undici 8, and a top-level override would break it. Remove the override when a
wrangler release ships miniflare with undici ≥ 7.30.1 (check with
`bun pm ls --all | grep undici` after bumping wrangler).

## Deferred upgrades

| Upgrade                     | Waiting on                                                                          | Notes                                                                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| better-auth 1.7.10 → 1.7.12 | Release age: 1.7.12 was published 2026-10-20, so it is installable from 2026-10-27  | Hardening (JWT plugin key algorithm, OAuth proxy checks, ID-token audience); none of it applies to this starter's email + password setup, so there is no urgency. |
| TypeScript 6 → 7            | typescript-eslint: every 8.x release (8.72.0 included) requires `typescript <6.1.0` | TS 7 is the native port and ships without the compiler API that typescript-eslint uses. Expected with typescript-eslint support for 7.1.                          |

Avoid these versions if they come up: vitest 5.0.0–5.0.4 (GHSA-p458-7748-mcp3),
wrangler 4.82.0, 4.89.0, 4.89.1 and 4.108.0 (deprecated for breakage), and every
`@cloudflare/vitest-pool-workers` release (deprecated; renamed
`@cloudflare/vitest-plugin`).
