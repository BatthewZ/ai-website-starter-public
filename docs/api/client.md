# Frontend API Client

The frontend calls our API through `src/web/lib/api/client.ts`:

```ts
export async function api<T>(path: string, options?: RequestInit): Promise<T>
api.get    = <T>(path: string, options?: RequestInit) => api<T>(path, options);
api.post   = <T>(path: string, body: unknown, options?: RequestInit) => ...;
api.put    = <T>(path: string, body: unknown, options?: RequestInit) => ...;
api.delete = <T>(path: string, options?: RequestInit) => ...;

export function apiUpload<T>(
  path: string,
  body: FormData,
  options?: { method?: "POST" | "PUT"; signal?: AbortSignal; onProgress?: (fraction: number) => void }
): Promise<T>
```

## Features

- Automatically sets `Content-Type: application/json` and `credentials: "include"`.
- Supports `FormData` bodies -- when the body is a `FormData` instance, the `Content-Type` header is omitted so the browser sets the correct `multipart/form-data` boundary.
- Throws `ApiError` (with `status` and the server's `error` message) on non-2xx responses.
- On 401 responses, calls the handler registered with `setOnUnauthorized`. `App.tsx` registers one that shows a "session ended" toast and refetches the session, after which `AuthGuard` redirects to `/login` (see [Routing](../architecture/routing.md#session-expiry-401)).

## `apiUpload`

Use it for uploads that show progress. It runs over `XMLHttpRequest` because `fetch` cannot
report upload progress, and r-ui's `AvatarUpload` / `FileUpload` draw their progress from
`onProgress` (a fraction from 0 to 1). It keeps `api`'s error contract (an `ApiError`, and
the 401 handler fires), so callers handle both the same way. Aborting `signal` rejects with
a `DOMException` named `AbortError`; a network failure rejects with `ApiError(0, …)`. The
default method is `PUT`, matching `PUT /api/users/me/avatar`.

## Usage

```ts
import { api, apiUpload } from "@/web/lib/api/client";

// GET
const { user } = await api.get<{ user: User }>("/api/me");

// POST
const { post } = await api.post<{ post: Post }>("/api/posts", { title: "Hello" });

// DELETE
await api.delete("/api/users/me/avatar");

// Upload with progress and cancel (as r-ui's AvatarUpload calls it in ProfileSection)
const body = new FormData();
body.append("file", file, "avatar.webp");
const { upload } = await apiUpload<{ upload: Upload }>("/api/users/me/avatar", body, {
  signal,
  onProgress,
});
```

For GETs inside components, prefer the `useApi(path)` hook (see [Frontend](../app-frontend.md#data-and-uploads)).
