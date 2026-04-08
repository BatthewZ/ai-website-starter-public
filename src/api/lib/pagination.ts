import type { Column } from "drizzle-orm";
import { and, eq, gt, lt, or, type SQL } from "drizzle-orm";
import type { Context } from "hono";

// --- Simple cursor (single sort column) ---

export function parseCursorParams(
  c: Context,
  opts: { defaultLimit: number; maxLimit: number },
): { limit: number; cursor: string | undefined } {
  const limitParam = c.req.query("limit");
  const limit = limitParam
    ? Math.min(Math.max(parseInt(limitParam, 10) || opts.defaultLimit, 1), opts.maxLimit)
    : opts.defaultLimit;
  const cursor = c.req.query("cursor");
  return { limit, cursor: cursor || undefined };
}

export function parseCursorDate(cursor: string | undefined): Date | null {
  if (!cursor) return null;
  const date = new Date(cursor);
  return isNaN(date.getTime()) ? null : date;
}

export function computeNextCursor<T>(
  items: T[],
  limit: number,
  getDate: (item: T) => Date | string,
): string | null {
  if (items.length < limit) return null;
  const raw = getDate(items[items.length - 1]);
  return raw instanceof Date ? raw.toISOString() : raw;
}

// --- Compound cursor (date + ID tiebreaker) ---

export function parseCompoundCursor(cursor: string | undefined): { date: Date; id: string } | null {
  if (!cursor) return null;
  const sep = cursor.indexOf("|");
  if (sep === -1) {
    const date = new Date(cursor);
    return isNaN(date.getTime()) ? null : { date, id: "" };
  }
  const datePart = cursor.slice(0, sep);
  const idPart = cursor.slice(sep + 1);
  const date = new Date(datePart);
  if (isNaN(date.getTime()) || !idPart) return null;
  return { date, id: idPart };
}

export function compoundCursorCondition(
  compound: { date: Date; id: string },
  dateColumn: Column,
  idColumn: Column,
  direction: "asc" | "desc",
): SQL {
  const cmp = direction === "asc" ? gt : lt;
  const dateCond = cmp(dateColumn, compound.date);
  if (compound.id) {
    return or(dateCond, and(eq(dateColumn, compound.date), cmp(idColumn, compound.id)))!;
  }
  return dateCond;
}

export function computeCompoundNextCursor<T>(
  items: T[],
  limit: number,
  getDate: (item: T) => Date | string,
  getId: (item: T) => string,
): string | null {
  if (items.length < limit) return null;
  const last = items[items.length - 1];
  const raw = getDate(last);
  const dateStr = raw instanceof Date ? raw.toISOString() : raw;
  return `${dateStr}|${getId(last)}`;
}
