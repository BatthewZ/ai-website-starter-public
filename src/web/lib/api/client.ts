export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
    };
    if (res.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    throw new ApiError(res.status, body.error ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

function serializeBody(body: unknown): BodyInit {
  return body instanceof FormData ? body : JSON.stringify(body);
}

api.get = <T>(path: string, options?: RequestInit) => api<T>(path, options);
api.post = <T>(path: string, body: unknown, options?: RequestInit) =>
  api<T>(path, { method: "POST", body: serializeBody(body), ...options });
api.put = <T>(path: string, body: unknown, options?: RequestInit) =>
  api<T>(path, { method: "PUT", body: serializeBody(body), ...options });
api.delete = <T>(path: string, options?: RequestInit) =>
  api<T>(path, { method: "DELETE", ...options });

export interface UploadOptions {
  method?: "POST" | "PUT";
  /** Aborts the request; the promise rejects with a `DOMException` named `AbortError`. */
  signal?: AbortSignal;
  /** Upload progress as a fraction, 0 to 1. */
  onProgress?: (fraction: number) => void;
}

/** The body as JSON, or `null` when it is empty or not JSON (a proxy's HTML error page). */
function parseJson(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

/**
 * Sends `FormData` and resolves with the JSON response, like `api`, but over
 * XMLHttpRequest, because `fetch` cannot report upload progress and r-ui's
 * `AvatarUpload` / `FileUpload` draw a progress ring from it. Errors follow
 * `api`'s contract (an `ApiError` carrying the server's `error` message, and
 * the 401 handler fires), so callers handle both the same way.
 */
export function apiUpload<T>(
  path: string,
  body: FormData,
  options: UploadOptions = {}
): Promise<T> {
  const { method = "PUT", signal, onProgress } = options;

  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Upload aborted", "AbortError"));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, path);
    xhr.withCredentials = true;
    xhr.responseType = "text";

    const abort = () => xhr.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const cleanup = () => signal?.removeEventListener("abort", abort);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) onProgress?.(event.loaded / event.total);
    };

    xhr.onload = () => {
      cleanup();
      const parsed = parseJson(xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(parsed as T);
        return;
      }
      if (xhr.status === 401 && onUnauthorized) onUnauthorized();
      const message =
        (parsed as { error?: string } | null)?.error ??
        (xhr.statusText || `Upload failed (${xhr.status})`);
      reject(new ApiError(xhr.status, message));
    };
    xhr.onerror = () => {
      cleanup();
      reject(new ApiError(0, "Network error. Check your connection and try again."));
    };
    xhr.onabort = () => {
      cleanup();
      reject(new DOMException("Upload aborted", "AbortError"));
    };

    xhr.send(body);
  });
}
