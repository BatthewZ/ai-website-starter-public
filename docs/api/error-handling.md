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
  return c.json({ error: "Internal Server Error", requestId }, 500);
});
```

## Behavior

1. **`HTTPException`**: If the error is a Hono `HTTPException` (e.g., thrown by middleware or handlers), the response uses the exception's status code and message. The `requestId` is always included.

2. **Unexpected errors**: Any other error is logged as a structured JSON object (with the full stack trace) and returns a generic `500 Internal Server Error` response. The error details are never leaked to the client.

3. **Request ID**: Every error response includes the `requestId`, making it possible to correlate client-side errors with server-side logs.
