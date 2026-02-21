# API

## Overview

The API is a Hono application running inside a Cloudflare Worker. All API endpoints are mounted under `/api/*`. The entry point is `src/api/index.ts`.

## Documentation

- [Middleware](./middleware.md) -- middleware stack, order, and details for each middleware
- [Endpoints](./endpoints.md) -- available API endpoints and request/response formats
- [Error Handling](./error-handling.md) -- global error handler behavior
- [Rate Limiting](./rate-limiting.md) -- rate limit configuration and behavior
- [Validation](./validation.md) -- request validation middleware
- [Adding Routes](./adding-routes.md) -- step-by-step guide for adding new API routes
- [Frontend API Client](./client.md) -- typed fetch wrapper for the frontend
- [CORS](./cors.md) -- CORS configuration and allowed origins
