# AI Site Starter

A full-stack website starter built on Cloudflare Workers. Hono API + React SPA served from a single Worker, with Better Auth (email/password), Drizzle ORM on D1 SQLite, a token-driven design system, and an AI agentic workflow powered by [swarm-cli](https://github.com/mj1618/swarm-cli).

Component reference: the [r-ui showcase](https://batthewz.github.io/r-ui/showcase/) shows every UI component the app is built from, live, with theme, density and input switchable.

## Tech Stack

| Layer       | Technology                                                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime     | [Cloudflare Workers](https://workers.cloudflare.com/)                                                                                  |
| API         | [Hono](https://hono.dev/)                                                                                                              |
| Frontend    | [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/)                                                            |
| UI          | [r-ui](https://batthewz.github.io/r-ui/showcase/) (`@batthewz/r-ui-css`, `@batthewz/r-ui-react-components`, `@batthewz/r-ui-tw-merge`) |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com/) with r-ui's design tokens                                                                  |
| Database    | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)                                                                        |
| ORM         | [Drizzle ORM](https://orm.drizzle.team/)                                                                                               |
| Auth        | [Better Auth](https://www.better-auth.com/) (email/password)                                                                           |
| Validation  | [Zod](https://zod.dev/) (shared between frontend and backend)                                                                          |
| Icons       | [Lucide React](https://lucide.dev/icons/)                                                                                              |
| Testing     | [Vitest](https://vitest.dev/) + Testing Library                                                                                        |
| AI Agents   | [swarm-cli](https://github.com/mj1618/swarm-cli)                                                                                       |
| Package Mgr | [Bun](https://bun.sh/)                                                                                                                 |

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare Workers tooling)
- A Cloudflare account (for deployment)
- [Swarm CLI](https://github.com/mj1618/swarm-cli) (Agent / Ralph Loop management)
- [Playwright CLI](https://github.com/microsoft/playwright-cli) (Visual testing and cli browser tools for agents)

### Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd ai-site-starter

# Install dependencies
bun install

# Create local environment variables
# Add these to .dev.vars (gitignored):
echo 'BETTER_AUTH_SECRET=your-secret-key-here' > .dev.vars
echo 'BETTER_AUTH_URL=http://localhost:8787' >> .dev.vars
echo 'TRUSTED_ORIGINS'http://localhost:5173 >> .dev.vars

# Generate and apply database migrations
bun run db:generate
bun run db:migrate:local

# Start the dev server
bun run dev
```

The app runs at `http://localhost:8787` or `http://localhost:5173` for hot module reloading.

### Everyday commands

```bash
bun run typecheck      # backend, web and test tsconfigs + eslint --fix
bun run test           # all Vitest projects (test:web, test:api, test:unit for one)
bun run check:themes   # r-ui contrast + theme-rule checks on src/web/style/themes/*.css
bun run audit          # dependency advisories (see docs/guides/dependencies.md)
bun run db:migrate:remote && bun run deploy   # migrate production first, then deploy
```

The full list is in [Build & Deploy Scripts](docs/deployment/scripts.md).

## Documentation

| Topic                                             | Description                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Architecture](docs/architecture/architecture.md) | Worker architecture, request flow, folder structure, routing                                         |
| [API](docs/api/api.md)                            | Endpoints, middleware, error handling, rate limiting, validation                                     |
| [Auth](docs/auth/auth.md)                         | Better Auth setup, auth flows, middleware, route guards, schemas                                     |
| [Database](docs/database/database.md)             | D1 + Drizzle ORM setup, schema, migrations, query examples                                           |
| [Frontend](docs/app-frontend.md)                  | r-ui (`@batthewz/r-ui-*`) components, tokens & themes, preferences, routing, layouts, forms, testing |
| [Deployment](docs/deployment/deployment.md)       | Prerequisites, step-by-step guide, environment, custom domains                                       |
| [Dependencies](docs/guides/dependencies.md)       | Version policy (pinning, 7-day release age), accepted audit exceptions, overrides, deferred upgrades |
