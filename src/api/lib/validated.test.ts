import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { validateBody, validateQuery } from "../middleware/validate";
import { validJson, validQuery } from "./validated";

describe("validJson", () => {
  const schema = z.object({ name: z.string() });
  const app = new Hono();

  app.post("/test", validateBody(schema), (c) => {
    const data = validJson(c, schema);
    return c.json(data);
  });

  it("returns validated JSON body for valid input", async () => {
    const res = await app.request("/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "test" }),
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: "test" });
  });

  it("returns 400 for invalid input (middleware rejects)", async () => {
    const res = await app.request("/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
    const body: any = await res.json();
    expect(body).toHaveProperty("error", "Validation failed");
    expect(body.details).toBeInstanceOf(Array);
    expect(body.details.length).toBeGreaterThan(0);
  });
});

describe("validQuery", () => {
  const schema = z.object({ page: z.string().optional() });
  const app = new Hono();

  app.get("/items", validateQuery(schema), (c) => {
    const data = validQuery(c, schema);
    return c.json(data);
  });

  it("returns validated query params", async () => {
    const res = await app.request("/items?page=5");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ page: "5" });
  });

  it("returns validated data when optional param is omitted", async () => {
    const res = await app.request("/items");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({});
  });
});
