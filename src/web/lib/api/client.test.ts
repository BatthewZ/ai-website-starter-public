import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api, ApiError, apiUpload, setOnUnauthorized } from "./client";

describe("api client", () => {
  beforeEach(() => {
    setOnUnauthorized(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setOnUnauthorized(null);
  });

  function mockFetch(status: number, body: unknown = {}) {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        statusText: "Status " + status,
        json: () => Promise.resolve(body),
      })
    );
  }

  it("calls onUnauthorized callback when response is 401", async () => {
    const handler = vi.fn();
    setOnUnauthorized(handler);
    mockFetch(401, { error: "Unauthorized" });

    await expect(api("/api/me")).rejects.toThrow();
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does NOT call onUnauthorized for non-401 errors", async () => {
    const handler = vi.fn();
    setOnUnauthorized(handler);

    mockFetch(403, { error: "Forbidden" });
    await expect(api("/api/admin")).rejects.toThrow();

    mockFetch(500, { error: "Internal" });
    await expect(api("/api/fail")).rejects.toThrow();

    expect(handler).not.toHaveBeenCalled();
  });

  it("still throws ApiError after calling the callback", async () => {
    const handler = vi.fn();
    setOnUnauthorized(handler);
    mockFetch(401, { error: "Unauthorized" });

    await expect(api("/api/me")).rejects.toThrowError(ApiError);
    await expect(api("/api/me")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });
  });

  it("disables the callback when set to null", async () => {
    const handler = vi.fn();
    setOnUnauthorized(handler);
    setOnUnauthorized(null);
    mockFetch(401, { error: "Unauthorized" });

    await expect(api("/api/me")).rejects.toThrow();
    expect(handler).not.toHaveBeenCalled();
  });

  it("throws normally on 401 when no callback is set", async () => {
    mockFetch(401, { error: "Unauthorized" });

    await expect(api("/api/me")).rejects.toThrowError(ApiError);
    await expect(api("/api/me")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });
  });
});

/**
 * A minimal XMLHttpRequest double: the upload helper exists only because
 * fetch cannot report upload progress, so these drive the XHR events
 * directly. Each test triggers exactly the events a browser would.
 */
class FakeXHR {
  static last: FakeXHR | null = null;
  method = "";
  url = "";
  withCredentials = false;
  responseType = "";
  status = 0;
  statusText = "";
  responseText = "";
  sent: unknown = null;
  aborted = false;
  upload: {
    onprogress: ((e: { lengthComputable: boolean; loaded: number; total: number }) => void) | null;
  } = {
    onprogress: null,
  };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  constructor() {
    FakeXHR.last = this;
  }
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
  send(body: unknown) {
    this.sent = body;
  }
  abort() {
    this.aborted = true;
    this.onabort?.();
  }
  respond(status: number, body: unknown) {
    this.status = status;
    this.responseText = JSON.stringify(body);
    this.onload?.();
  }
}

describe("apiUpload", () => {
  beforeEach(() => {
    vi.stubGlobal("XMLHttpRequest", FakeXHR);
    FakeXHR.last = null;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the form with credentials, reports progress and resolves with the JSON", async () => {
    const onProgress = vi.fn();
    const body = new FormData();
    const promise = apiUpload<{ ok: boolean }>("/api/users/me/avatar", body, { onProgress });
    const xhr = FakeXHR.last!;

    expect(xhr.method).toBe("PUT");
    expect(xhr.url).toBe("/api/users/me/avatar");
    expect(xhr.withCredentials).toBe(true);
    expect(xhr.sent).toBe(body);

    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 50, total: 200 });
    expect(onProgress).toHaveBeenLastCalledWith(0.25);

    xhr.respond(200, { ok: true });
    await expect(promise).resolves.toEqual({ ok: true });
  });

  it("rejects with the server's error message as an ApiError", async () => {
    const promise = apiUpload("/api/x", new FormData());
    FakeXHR.last!.respond(400, { error: "File too large. Maximum size is 2MB" });
    await expect(promise).rejects.toEqual(new ApiError(400, "File too large. Maximum size is 2MB"));
  });

  it("fires the 401 handler, like api()", async () => {
    const handler = vi.fn();
    setOnUnauthorized(handler);
    const promise = apiUpload("/api/x", new FormData());
    FakeXHR.last!.respond(401, { error: "Unauthorized" });
    await expect(promise).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("aborts the request when the signal fires", async () => {
    const controller = new AbortController();
    const promise = apiUpload("/api/x", new FormData(), { signal: controller.signal });
    controller.abort();
    await expect(promise).rejects.toMatchObject({ name: "AbortError" });
    expect(FakeXHR.last!.aborted).toBe(true);
  });

  it("does not send at all when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      apiUpload("/api/x", new FormData(), { signal: controller.signal })
    ).rejects.toMatchObject({
      name: "AbortError",
    });
    expect(FakeXHR.last).toBeNull();
  });

  it("rejects with status 0 on a network error", async () => {
    const promise = apiUpload("/api/x", new FormData());
    FakeXHR.last!.onerror?.();
    await expect(promise).rejects.toMatchObject({ status: 0 });
  });
});
