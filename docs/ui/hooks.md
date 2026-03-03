# Shared Hooks

Hooks that live in `src/web/hooks/` because they are shared across multiple UI components.

## useFloating

Wrapper around [`@floating-ui/react`](https://floating-ui.com/) that applies project defaults (offset, flip, shift, auto-update). Returns the full `@floating-ui/react` floating context for use with its interaction hooks.

**Source:** `src/web/hooks/use-floating.ts`

### Config

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `Placement` | `"bottom"` | Where to position the floating element relative to the reference. |
| `offsetPx` | `number` | `8` | Distance in pixels between reference and floating element. |
| `arrowRef` | `RefObject<Element>` | -- | Ref to an arrow element for `arrow` middleware. |
| `open` | `boolean` | -- | Controlled open state, passed through to `@floating-ui/react`. |
| `onOpenChange` | `(open: boolean) => void` | -- | Callback when the open state should change. |

### Return Value

Returns the object from `@floating-ui/react`'s `useFloating` — includes `refs`, `floatingStyles`, `context`, `placement`, and more. See the [@floating-ui/react docs](https://floating-ui.com/docs/useFloating) for the full shape.

### Middleware

Applied in order: `offset` → `flip` → `shift` (8px padding) → `arrow` (when `arrowRef` provided).

### Re-exports

The module also re-exports these from `@floating-ui/react` for convenience:

- `FloatingPortal`, `FloatingFocusManager`
- `useDismiss`, `useClick`, `useHover`, `useFocus`
- `useInteractions`, `useRole`, `useTransitionStyles`
- `useListNavigation`, `useTypeahead`
- `Placement` (type)

### Usage

```tsx
import { useFloating, useClick, useDismiss, useInteractions } from "@/web/hooks/use-floating";
import { useState } from "react";

function Popover() {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    offsetPx: 12,
    open,
    onOpenChange: setOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        Toggle
      </button>
      {open && (
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          Popover content
        </div>
      )}
    </>
  );
}
```

---

## useClickOutside

Detects mouse and touch events outside a referenced element and calls a handler. Useful for dismissing overlays when the user clicks away.

**Source:** `src/web/hooks/use-click-outside.ts`

### Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ref` | `RefObject<Element \| null>` | -- | Ref to the element that defines the "inside" boundary. |
| `handler` | `() => void` | -- | Callback fired on outside click/touch. |
| `enabled` | `boolean` | `true` | Pass `false` to temporarily disable the listener. |

### Behavior

- Listens on `mousedown` and `touchstart` (captures the interaction before it propagates).
- The `handler` is stored in a ref so the effect does not re-attach when the callback identity changes.
- Listeners are cleaned up on unmount or when `enabled` becomes `false`.

### Usage

```tsx
import { useRef, useState } from "react";
import { useClickOutside } from "@/web/hooks/use-click-outside";

function Dropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref}>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <div className="absolute">Dropdown content</div>}
    </div>
  );
}
```

---

## useFocusTrap

Traps keyboard focus (Tab / Shift+Tab) within a container element. On activation, focuses the first focusable element; on deactivation, restores focus to the previously focused element.

**Source:** `src/web/hooks/use-focus-trap.ts`

### Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ref` | `RefObject<HTMLElement \| null>` | -- | Ref to the container that should trap focus. |
| `enabled` | `boolean` | -- | Activates/deactivates the trap. |

### Focusable Selector

Matches: `a[href]`, `button:not(:disabled)`, `input:not(:disabled)`, `select:not(:disabled)`, `textarea:not(:disabled)`, `[tabindex]:not([tabindex="-1"])`.

### Behavior

- On enable: saves `document.activeElement`, then focuses the first focusable child (or the container itself if none found).
- **Tab** on the last focusable element wraps to the first; **Shift+Tab** on the first wraps to the last.
- **Mouse clicks** outside the container are caught via a `focusin` listener that redirects focus back into the trap.
- On disable/unmount: restores focus to the previously active element.

### Usage

```tsx
import { useRef } from "react";
import { useFocusTrap } from "@/web/hooks/use-focus-trap";

function Modal({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open);

  return (
    <div ref={ref} tabIndex={-1}>
      <button>First</button>
      <button>Last</button>
    </div>
  );
}
```

---

## useRovingFocus

Implements the [roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex) keyboard navigation pattern. Only the currently focused item has `tabIndex={0}`; all others have `tabIndex={-1}`. Arrow keys, Home, and End move focus between items.

**Source:** `src/web/hooks/use-roving-focus.ts`

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | -- | Determines which arrow keys navigate (Left/Right vs Up/Down). |
| `loop` | `boolean` | `true` | Whether navigation wraps from last to first and vice versa. |

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `getRovingProps` | `(index: number) => RovingProps` | Spread onto each item. Provides `tabIndex`, `onKeyDown`, and `ref`. |
| `focusedIndex` | `number` | The currently focused item index. |
| `setFocusedIndex` | `(index: number) => void` | Programmatically change the focused index. |

### Keyboard Mapping

| Key | Horizontal | Vertical |
| --- | --- | --- |
| Next | `ArrowRight` | `ArrowDown` |
| Previous | `ArrowLeft` | `ArrowUp` |
| First | `Home` | `Home` |
| Last | `End` | `End` |

### Usage

```tsx
import { useRovingFocus } from "@/web/hooks/use-roving-focus";

function Toolbar() {
  const { getRovingProps } = useRovingFocus({ orientation: "horizontal" });
  const items = ["Bold", "Italic", "Underline"];

  return (
    <div role="toolbar" aria-label="Text formatting">
      {items.map((label, i) => (
        <button key={label} {...getRovingProps(i)}>
          {label}
        </button>
      ))}
    </div>
  );
}
```

---

## useFileUpload

Manages file upload state, client-side validation, and API submission. Used by [`AvatarUpload`](avatar-upload.md) and available for custom upload UIs.

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
  const { state, upload, validate, error } = useFileUpload<{ upload: { url: string } }>();

  const handleFile = async (file: File) => {
    const err = validate(file, { accept: ["image/png"], maxSize: 2 * 1024 * 1024 });
    if (err) return alert(err.message);
    await upload(file, { endpoint: "/api/users/me/avatar", method: "put" });
  };

  return <div>{state === "uploading" ? "Uploading..." : "Ready"}</div>;
}
```

---

## useDocumentTitle

Sets the document title while the component is mounted, appending the app name suffix. Restores the previous title on unmount.

**Source:** `src/web/hooks/use-document-title.ts`

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `title` | `string` | The page title. Rendered as `"<title> \| AI Site Starter"`. Pass an empty string for the base title only. |

### Usage

```tsx
import { useDocumentTitle } from "@/web/hooks/use-document-title";

function SettingsPage() {
  useDocumentTitle("Settings");
  // document.title is now "Settings | AI Site Starter"
  return <div>...</div>;
}
```

---

## usePrefersReducedMotion

Returns `true` when the user has `prefers-reduced-motion: reduce` enabled in their OS or browser settings. Used by animation components to skip animations.

**Source:** `src/web/hooks/use-reduced-motion.ts`

### Return Value

`boolean` — `true` if reduced motion is preferred, `false` otherwise.

### Behavior

- Uses `useSyncExternalStore` to subscribe to the `(prefers-reduced-motion: reduce)` media query.
- Returns `false` on the server (SSR-safe).

### Usage

```tsx
import { usePrefersReducedMotion } from "@/web/hooks/use-reduced-motion";

function AnimatedWidget() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div style={{ transition: reducedMotion ? "none" : "transform 0.3s" }}>
      Content
    </div>
  );
}
```

---

## useApi

A data-fetching hook that performs a GET request to the given API path, tracks loading/error/data state, and supports refetching.

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
import { useApi } from "@/web/hooks/use-api";

function UserProfile() {
  const { data, loading, error, refetch } = useApi<{ name: string }>("/api/users/me");

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">{error}</Alert>;
  return <Text>{data?.name}</Text>;
}
```

---

## useTheme

Provides access to the current theme and the ability to switch themes. Reads from the `data-theme` attribute on `<html>` and persists the choice to localStorage.

**Source:** `src/web/hooks/use-theme.ts`

### Return Value

| Property | Type | Description |
| --- | --- | --- |
| `theme` | `Theme` | The current theme name (`"default"`, `"events"`, `"grimdark"`, or `"tech"`). |
| `setTheme` | `(theme: Theme) => void` | Sets the active theme. |
| `themes` | `readonly Theme[]` | Array of all available theme names. |

### Behavior

- Uses `useSyncExternalStore` with a `MutationObserver` to react to `data-theme` attribute changes.
- Setting `"default"` removes the `data-theme` attribute and clears localStorage.
- Other themes set the attribute and persist to localStorage under the key `"theme"`.
- Gracefully handles private browsing mode (localStorage may throw).
- The initial theme is restored before React mounts via a blocking inline `<script>` in `src/web/index.html` (not by this hook). The hook reads the already-applied `data-theme` attribute on first render. See the [FOUC prevention](../design-system/theming.md#fouc-prevention) section in the theming docs.

### Usage

```tsx
import { useTheme } from "@/web/hooks/use-theme";

function ThemePicker() {
  const { theme, setTheme, themes } = useTheme();
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
      {themes.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}
```

---

## useDebounce

Returns a debounced version of a value that only updates after a specified delay of inactivity. Useful for search inputs, API queries, and any scenario where you want to wait for the user to stop typing.

**Source:** `src/web/hooks/use-debounce.ts`

### Parameters

| Parameter | Type     | Default | Description                                       |
| --------- | -------- | ------- | ------------------------------------------------- |
| `value`   | `T`      | --      | The value to debounce.                            |
| `delayMs` | `number` | `300`   | Delay in milliseconds. Pass `0` to bypass debounce. |

### Return Value

`T` — The debounced value.

### Behavior

- Uses `useEffect` + `setTimeout` internally.
- Cleans up timeouts on unmount and when the value changes.
- When `delayMs` is `0`, updates immediately (no debounce).

### Usage

```tsx
import { useEffect, useState } from "react";
import { useDebounce } from "@/web/hooks/use-debounce";

function SearchResults() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Only fires 300ms after user stops typing
    fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```
