# Frontend API Client

The frontend uses a typed fetch wrapper defined in `src/web/lib/api/client.ts`:

```ts
export async function api<T>(path: string, options?: RequestInit): Promise<T>
api.get    = <T>(path: string, options?: RequestInit) => api<T>(path, options);
api.post   = <T>(path: string, body: unknown, options?: RequestInit) => ...;
api.put    = <T>(path: string, body: unknown, options?: RequestInit) => ...;
api.delete = <T>(path: string, options?: RequestInit) => ...;
```

## Features

- Automatically sets `Content-Type: application/json` and `credentials: "include"`.
- Throws `ApiError` (with `status` and `message`) on non-2xx responses.
- On 401 responses, calls the `onUnauthorized` callback (which shows a toast and redirects to `/login`).

## Usage

```ts
import { api } from "@/web/lib/api/client";

// GET
const { user } = await api.get<{ user: User }>("/api/me");

// POST
const { post } = await api.post<{ post: Post }>("/api/posts", { title: "Hello" });
```
