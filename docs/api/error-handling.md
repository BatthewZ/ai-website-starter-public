# Error Handling

The global error handler is defined in `src/api/index.ts`:

```ts
app.onError((err, c) => {
  const requestId = c.get("requestId") ?? "unknown";

  if (err instanceof HTTPException) {
    return c.json({ error: err.message, requestId }, err.status);
  }

  console.error(
    JSON.stringify({
      level: "error",
      method: c.req.method,
      path: c.req.path,
      error: err.message,
      stack: err.stack,
      requestId,
    })
  );
  return errorResponse(c, "Internal Server Error", 500);
});
```

## Behavior

1. **`HTTPException`**: If the error is a Hono `HTTPException` (e.g., thrown by middleware or handlers), the response uses the exception's status code and message. The `requestId` is always included.

2. **Unexpected errors**: Any other error is logged as a structured JSON object (with the full stack trace) and returns a generic `500 Internal Server Error` response. The error details are never leaked to the client.

3. **Request ID**: Every error response includes the `requestId`, making it possible to correlate client-side errors with server-side logs.

## `errorResponse` Helper

The `errorResponse` function in `src/api/lib/error-response.ts` is the standard way to return error JSON responses. It automatically includes the `requestId` from the Hono context:

```ts
import { errorResponse } from "../lib/error-response";

// Returns: { error: "Not Found", requestId: "..." }
return errorResponse(c, "Not Found", 404);

// With extra fields:
return errorResponse(c, "Validation failed", 400, { details: [...] });
```

This helper is used by the global error handler, the 404 catch-all, and the `requireAuth` middleware.

## `throwWithContext` Helper

The `throwWithContext` function in `src/api/lib/error-response.ts` re-throws an error with a contextual prefix added to the message, making it easier to trace the origin in logs:

```ts
import { throwWithContext } from "../lib/error-response";

try {
  await riskyOperation();
} catch (error) {
  throwWithContext(error, "riskyOperation"); // "[riskyOperation] original message"
}
```
