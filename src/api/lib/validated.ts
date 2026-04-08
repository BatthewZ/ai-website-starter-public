import type { Context } from "hono";
import type { z, ZodType } from "zod";

type ReqWithValid = { valid: (target: string) => unknown };

function extractValid(c: Context, target: "json" | "query"): unknown {
  return (c.req as unknown as ReqWithValid).valid(target);
}

export function validJson<T extends ZodType>(c: Context, schema: T): z.output<T> {
  void schema;
   
  return extractValid(c, "json") as z.output<T>;
}

export function validQuery<T extends ZodType>(c: Context, schema: T): z.output<T> {
  void schema;
   
  return extractValid(c, "query") as z.output<T>;
}
