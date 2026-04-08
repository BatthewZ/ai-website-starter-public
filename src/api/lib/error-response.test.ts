import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import type { AppEnv } from "../env";
import { requestIdMiddleware } from "../middleware/request-id";
import { errorResponse, throwWithContext } from "./error-response";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("errorResponse", () => {
  it("returns the correct status, error message, and a requestId UUID", async () => {
    const app = new Hono<AppEnv>();
    app.use("*", requestIdMiddleware);
    app.get("/not-found", (c) => errorResponse(c, "Not Found", 404));

    const res = await app.request("/not-found");

    expect(res.status).toBe(404);
    const body: any = await res.json();
    expect(body.error).toBe("Not Found");
    expect(body.requestId).toMatch(UUID_RE);
  });

  it("spreads extra fields into the response body", async () => {
    const app = new Hono<AppEnv>();
    app.use("*", requestIdMiddleware);
    app.get("/conflict", (c) =>
      errorResponse(c, "Conflict", 409, { field: "slug" }),
    );

    const res = await app.request("/conflict");

    expect(res.status).toBe(409);
    const body: any = await res.json();
    expect(body.error).toBe("Conflict");
    expect(body.field).toBe("slug");
    expect(body.requestId).toMatch(UUID_RE);
  });

  it('uses "unknown" when requestId middleware is not applied', async () => {
    const app = new Hono<AppEnv>();
    app.get("/no-id", (c) => errorResponse(c, "Bad Request", 400));

    const res = await app.request("/no-id");

    expect(res.status).toBe(400);
    const body: any = await res.json();
    expect(body.error).toBe("Bad Request");
    expect(body.requestId).toBe("unknown");
  });
});

describe("throwWithContext", () => {
  it("prepends context to an Error message", () => {
    expect(() => throwWithContext(new Error("fail"), "createUser")).toThrowError(
      "[createUser] fail",
    );
  });

  it("re-throws non-Error values unchanged", () => {
    const sentinel = "string-error";
    expect(() => throwWithContext(sentinel, "ctx")).toThrow(sentinel);
  });
});
