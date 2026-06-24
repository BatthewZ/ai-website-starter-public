# Frontend

The UI components, layout primitives, form controls, animations, shared hooks, and
the design-system tokens/themes are all provided by the **`@batthewz/response-ui-*`**
packages. This project consumes them — it no longer maintains local copies.

## Where the docs live

| What | Reference |
| --- | --- |
| Components, hooks, props/API, patterns | [`@batthewz/response-ui-react-components`](https://www.npmjs.com/package/@batthewz/response-ui-react-components) — see its `README.md` (usage + full "what ships") and `AGENTS.md` (complete public surface + prop reference, DataTable/AvatarUpload/forms/router patterns) |
| Design tokens, themes, responsive scales | [`@batthewz/response-ui-css`](https://www.npmjs.com/package/@batthewz/response-ui-css) — `README.md`, `docs/theme-contract.md`, `docs/extending.md` |
| Tailwind class-merge config | [`@batthewz/response-ui-tw-merge`](https://www.npmjs.com/package/@batthewz/response-ui-tw-merge) |
| Live examples (every component + theme) | [UI Primitives Demo](https://ai-website-starter.benmatthews-it.workers.dev/demo) · [Showcase](https://ai-website-starter.benmatthews-it.workers.dev/showcase) |

Usage: `import { Button, Card, Stack } from "@batthewz/response-ui-react-components";`

CSS is wired once in [`src/web/style/app.css`](../src/web/style/app.css):

```css
@import "@batthewz/response-ui-css";
@import "@batthewz/response-ui-react-components/styles";
```

The router adapter (`RouterAdapterProvider`) is wired once in
[`src/web/App.tsx`](../src/web/App.tsx) so `AppShell`/`Breadcrumbs` links use react-router.

## App-specific frontend (kept local — no package equivalent)

These exist only in this app and are intentionally **not** provided by the packages:

| Item | Location | Purpose |
| --- | --- | --- |
| `AuthenticatedLayout` | `src/web/components/layout/` | Auth-aware app chrome (composes the package's `AppShell` + Better Auth sign-out + nav). |
| `AuthGuard` / `GuestGuard` | `src/web/components/guards/` | Route guards bound to Better Auth + react-router redirects. |
| `ThemeEditor` page | `src/web/pages/ThemeEditor/` | App feature for editing theme tokens (hex/oklch conversion, export). |
| `useApi` | `src/web/hooks/use-api.ts` | App data-fetching hook (see below). |
| `useFileUpload` | `src/web/hooks/use-file-upload.ts` | App upload transport (see below). |

---

## useApi

A data-fetching hook that performs a GET request to the given API path, tracks
loading/error/data state, and supports refetching.

**Source:** `src/web/hooks/use-api.ts`

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `path` | `string` | The API endpoint path (e.g., `"/api/users/me"`). |

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `data` | `T \| null` | The response data on success. |
| `error` | `string \| null` | Error message on failure. |
| `loading` | `boolean` | `true` while the request is in flight. |
| `refetch` | `() => void` | Triggers a fresh request. |

### Behavior

- Aborts in-flight requests on unmount or when `path` changes.
- Extracts error messages from `ApiError` instances.

### Usage

```tsx
import { Alert, Spinner, Text } from "@batthewz/response-ui-react-components";

import { useApi } from "@/web/hooks/use-api";

function UserProfile() {
  const { data, loading, error } = useApi<{ name: string }>("/api/users/me");

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;
  return <Text>{data?.name}</Text>;
}
```

---

## useFileUpload

Manages file upload state, client-side validation, and API submission. Available for
custom upload UIs — e.g. pairing with the package's selection-only `FileUpload`
component, which surfaces chosen files but does not perform the network upload itself.

**Source:** `src/web/hooks/use-file-upload.ts`

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `state` | `"idle" \| "uploading" \| "success" \| "error"` | Current upload state. |
| `error` | `string \| null` | Error message from the last failed upload. |
| `data` | `T \| null` | Response data from a successful upload. |
| `upload` | `(file: File, options: UploadOptions) => Promise<T \| null>` | Sends the file to the API. |
| `cancel` | `() => void` | Aborts the in-flight upload. |
| `validate` | `(file: File, constraints: FileConstraints) => ValidationError \| null` | Client-side validation before uploading. |
| `reset` | `() => void` | Resets state to idle and aborts any in-flight upload. |

### UploadOptions

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | -- | API endpoint to upload to. |
| `method` | `"post" \| "put"` | `"put"` | HTTP method. |
| `fieldName` | `string` | `"file"` | FormData field name. |

### FileConstraints

| Option | Type | Description |
| --- | --- | --- |
| `accept` | `readonly string[]` | Accepted MIME types. Empty or undefined allows all. |
| `maxSize` | `number` | Maximum file size in bytes. |

### Usage

```tsx
import { useFileUpload } from "@/web/hooks/use-file-upload";

function UploadButton() {
  const { state, upload, validate } = useFileUpload<{ upload: { url: string } }>();

  const handleFile = async (file: File) => {
    const err = validate(file, { accept: ["image/png"], maxSize: 2 * 1024 * 1024 });
    if (err) return alert(err.message);
    await upload(file, { endpoint: "/api/users/me/avatar", method: "put" });
  };

  return <div>{state === "uploading" ? "Uploading..." : "Ready"}</div>;
}
```
