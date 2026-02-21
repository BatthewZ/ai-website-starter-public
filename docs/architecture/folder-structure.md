# Folder Structure

## Domain-Driven Folder Structure

The project organizes code by **domain** (what it relates to), not by **technical role** (all components together, all hooks together). This keeps related files co-located and makes the codebase navigable as it scales.

### Core Principles

1. **Co-locate by domain, not by type.** A page's components, hooks, and types live inside that page's folder.
2. **Promote to shared only when reused.** A component starts in `pages/Dashboard/components/`. Once a second page needs it, move it to `components/ui/` or `components/layout/`.
3. **Flat until it hurts.** Do not create sub-folders pre-emptively.
4. **Mirror structure between frontend and backend.** Both `api/routes/` and `shared/schemas/` group by domain (e.g., `auth`, `users`, `posts`).

### Directory Map

```
src/
├── api/                          # Backend (Hono Worker)
│   ├── index.ts                  # Worker entry point, global middleware
│   ├── env.ts                    # Bindings & env type definitions
│   ├── middleware/               # Shared middleware
│   ├── lib/                      # Shared API utilities
│   └── routes/                   # Domain-grouped route modules
│       ├── index.ts              # Route aggregator
│       ├── auth/                 # Auth domain
│       │   └── auth.routes.ts
│       └── users/                # Users domain
│           ├── users.routes.ts
│           └── users.handlers.ts
│
├── db/                           # Database layer
│   ├── index.ts                  # createDb(d1) factory
│   └── schema/                   # Drizzle schemas grouped by domain
│       ├── auth.ts               # user, session, account, verification
│       └── index.ts              # Re-exports all schemas
│
├── shared/                       # Shared (frontend + backend)
│   ├── schemas/                  # Zod schemas grouped by domain
│   └── types/                    # Shared TypeScript types
│
└── web/                          # Frontend (React SPA)
    ├── App.tsx                   # Root router
    ├── main.tsx                  # React bootstrap
    ├── lib/                      # Utilities & clients
    ├── hooks/                    # Shared hooks
    ├── components/               # Shared components
    │   ├── ui/                   # Generic UI primitives
    │   ├── layout/               # App shell components
    │   └── guards/               # Route guards
    └── pages/                    # Route-level page components
        ├── Dashboard/
        ├── Login/
        ├── Register/
        └── Settings/
```

### Web Conventions

| Folder | Purpose | Rule |
|---|---|---|
| `pages/{PageName}/` | Route-level entry point | One folder per route. Folder and file share PascalCase name. |
| `pages/{PageName}/components/` | Page-specific components | Only used by this page. Promote to `components/` if reused. |
| `pages/{PageName}/hooks/` | Page-specific hooks | Custom hooks scoped to this page's logic. |
| `components/ui/` | Generic UI primitives | Button, Input, Modal -- no business logic. |
| `components/layout/` | App shell / layout | Header, Sidebar, Footer, AppLayout. |
| `components/guards/` | Route guards | AuthGuard, GuestGuard, RoleGuard. |
| `hooks/` | Shared hooks | Hooks used by 2+ pages. |
| `lib/` | Utilities & clients | Auth client, API client, helper functions. |

### API Conventions

| Folder | Purpose | Rule |
|---|---|---|
| `routes/{domain}/` | Domain route module | Contains `{domain}.routes.ts` and `{domain}.handlers.ts`. |
| `routes/index.ts` | Route aggregator | Imports and mounts all domain routes. |
| `middleware/` | Shared middleware | Cross-cutting concerns: auth, CORS, logging, rate limiting. |
| `lib/` | Shared utilities | Auth factory, error helpers, response formatters. |
| `env.ts` | Environment types | Bindings, variables, and Hono env type. |
