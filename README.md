# Purpose

I didn't want to keep wasting time and tokens having agents constantly rebuild components or auth for new projects. I wanted to make something modular and easy to theme for reuse in future, set up with all of the AI tooling that I'm currently using, and with docs and AGENTS.md ready to go.

# Demo

Check it out, try the theme switches. These are the building blocks to work with, to re-theme or to build upon.

[Advanced Components Showcase](https://ai-website-starter.benmatthews-it.workers.dev/showcase)

[UI Primitives Demo](https://ai-website-starter.benmatthews-it.workers.dev/demo)

# AI Site Starter

A full-stack website starter built on Cloudflare Workers. Hono API + React SPA served from a single Worker, with Better Auth (email/password), Drizzle ORM on D1 SQLite, a token-driven design system, and an AI agentic workflow powered by [swarm-cli](https://github.com/mj1618/swarm-cli).

## Tech Stack

| Layer       | Technology                                                                  |
| ----------- | --------------------------------------------------------------------------- |
| Runtime     | [Cloudflare Workers](https://workers.cloudflare.com/)                       |
| API         | [Hono](https://hono.dev/)                                                   |
| Frontend    | [React 19](https://react.dev/) + [React Router](https://reactrouter.com/)   |
| Styling     | [Tailwind CSS v4](https://tailwindcss.com/) with CSS custom property tokens |
| Database    | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)             |
| ORM         | [Drizzle ORM](https://orm.drizzle.team/)                                    |
| Auth        | [Better Auth](https://www.better-auth.com/) (email/password)                |
| Validation  | [Zod](https://zod.dev/) (shared between frontend and backend)               |
| Icons       | [Lucide React](https://lucide.dev/icons/)                                   |
| Testing     | [Vitest](https://vitest.dev/) + Testing Library                             |
| AI Agents   | [swarm-cli](https://github.com/mj1618/swarm-cli)                            |
| Package Mgr | [Bun](https://bun.sh/)                                                      |

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

AFter cloning, don't forget to delete your .git file and do a new `git init`.

The app runs at `http://localhost:8787` or `http://localhost:5173` for hot module reloading.

## Want to get building?

Talk with your agent about the app you want to build. Tell it to come up with a plan that's organised into phases. Optionally talk about the theme/feel you want (in which case tell it to read `tech.css`, `grimdark.css` and `events.css` for examples).

Tell it to write the plan out to `swarm/PLAN.md`

Once you're done, and you've installed all the pre-reqs, run `swarm up` and grab yourself a cuppa.

## Documentation

| Topic                                                | Description                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| [Architecture](docs/architecture/architecture.md)    | Worker architecture, request flow, folder structure, routing     |
| [API](docs/api/api.md)                               | Endpoints, middleware, error handling, rate limiting, validation |
| [Auth](docs/auth/auth.md)                            | Better Auth setup, auth flows, middleware, route guards, schemas |
| [Database](docs/database/database.md)                | D1 + Drizzle ORM setup, schema, migrations, query examples       |
| [Design System](docs/design-system/design-system.md) | Tokens, colors, typography, spacing, theming, motion             |
| [UI Components](docs/ui/ui.md)                       | Layout, UI primitives, display components, forms, animations     |
| [Deployment](docs/deployment/deployment.md)          | Prerequisites, step-by-step guide, environment, custom domains   |
| [Swarm CLI](docs/swarm/swarm.md)                     | AI agent pipeline, commands, task files, configuration           |
