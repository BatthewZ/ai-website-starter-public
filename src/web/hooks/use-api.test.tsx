import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/web/lib/api/client";

import { useApi } from "./use-api";

// Mock the api client module
vi.mock("@/web/lib/api/client", async () => {
  const actual = await vi.importActual<typeof import("@/web/lib/api/client")>(
    "@/web/lib/api/client",
  );
  return {
    ...actual,
    api: Object.assign(vi.fn(), {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }),
  };
});

// Get a reference to the mocked api
import { api } from "@/web/lib/api/client";
const mockGet = api.get as ReturnType<typeof vi.fn>;

describe("useApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in a loading state", () => {
    mockGet.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useApi("/api/test"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns data on successful fetch", async () => {
    const payload = { id: 1, name: "Test" };
    mockGet.mockResolvedValue(payload);

    const { result } = renderHook(() => useApi<typeof payload>("/api/items"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(payload);
    expect(result.current.error).toBeNull();
  });

  it("returns an error message when the fetch fails with an ApiError", async () => {
    mockGet.mockRejectedValue(new ApiError(404, "Not found"));

    const { result } = renderHook(() => useApi("/api/missing"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Not found");
    expect(result.current.data).toBeNull();
  });

  it("returns a generic error for non-ApiError exceptions", async () => {
    mockGet.mockRejectedValue(new Error("Network failure"));

    const { result } = renderHook(() => useApi("/api/broken"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("An error occurred");
    expect(result.current.data).toBeNull();
  });

  it("refetch triggers a new request", async () => {
    const firstPayload = { value: 1 };
    const secondPayload = { value: 2 };
    mockGet.mockResolvedValueOnce(firstPayload).mockResolvedValueOnce(secondPayload);

    const { result } = renderHook(() => useApi<{ value: number }>("/api/data"));

    await waitFor(() => {
      expect(result.current.data).toEqual(firstPayload);
    });

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(secondPayload);
    });

    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it("passes the path and an abort signal to api.get", async () => {
    mockGet.mockResolvedValue({});

    renderHook(() => useApi("/api/test-path"));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    expect(mockGet).toHaveBeenCalledWith("/api/test-path", {
      signal: expect.any(AbortSignal),
    });
  });

  it("aborts the request on unmount", () => {
    mockGet.mockReturnValue(new Promise(() => {})); // never resolves

    const { unmount } = renderHook(() => useApi("/api/slow"));

    unmount();

    // The AbortController.abort() was called -- verify by checking the signal
    const callArgs = mockGet.mock.calls[0];
    const signal = callArgs[1]?.signal as AbortSignal;
    expect(signal.aborted).toBe(true);
  });

  it("refetches when path changes", async () => {
    const payload1 = { path: "a" };
    const payload2 = { path: "b" };
    mockGet.mockResolvedValueOnce(payload1).mockResolvedValueOnce(payload2);

    const { result, rerender } = renderHook(({ path }) => useApi<{ path: string }>(path), {
      initialProps: { path: "/api/a" },
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(payload1);
    });

    rerender({ path: "/api/b" });

    await waitFor(() => {
      expect(result.current.data).toEqual(payload2);
    });

    expect(mockGet).toHaveBeenCalledTimes(2);
  });
});
