import { useCallback, useEffect, useReducer, useState } from "react";

import { api, ApiError } from "@/web/lib/api/client";

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => void;
}

type Action<T> =
  | { type: "fetch" }
  | { type: "success"; data: T }
  | { type: "error"; error: string };

function reducer<T>(_state: UseApiState<T>, action: Action<T>): UseApiState<T> {
  switch (action.type) {
    case "fetch":
      return { data: null, error: null, loading: true };
    case "success":
      return { data: action.data, error: null, loading: false };
    case "error":
      return { data: null, error: action.error, loading: false };
  }
}

export function useApi<T>(path: string): UseApiResult<T> {
  const [refetchCount, setRefetchCount] = useState(0);
  const [state, dispatch] = useReducer(reducer<T>, {
    data: null,
    error: null,
    loading: true,
  });

  const refetch = useCallback(() => setRefetchCount((c) => c + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "fetch" });

    api
      .get<T>(path, { signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) dispatch({ type: "success", data: result });
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted)
          dispatch({
            type: "error",
            error: err instanceof ApiError ? err.message : "An error occurred",
          });
      });

    return () => controller.abort();
  }, [path, refetchCount]);

  return { ...state, refetch };
}
