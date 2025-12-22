import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApiError } from "@hooks/useApiError";
import { ApiError } from "@/errors";

describe("useApiError", () => {
  it("handles ApiError lifecycle", () => {
    const apiErr = new ApiError({
      code: "USER_NOT_FOUND",
      message: "User missing",
      status_code: 404,
      correlation_id: "cid-x",
      timestamp: new Date().toISOString(),
      path: "/users/me",
    });
    const { result } = renderHook(() => useApiError({ componentName: "Profile" }));
    act(() => result.current.setError(apiErr));
    expect(result.current.hasError).toBe(true);
    expect(result.current.apiCode).toBe("USER_NOT_FOUND");
    act(() => result.current.clearError());
    expect(result.current.hasError).toBe(false);
  });
});
