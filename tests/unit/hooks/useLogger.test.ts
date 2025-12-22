import { describe, it, expect } from "vitest";
import { renderHook } from "@tests/utils";
import { useLogger } from "@hooks/useLogger";

describe("useLogger", () => {
  it("creates context logger", () => {
    const { result } = renderHook(() => useLogger("Comp"));
    expect(typeof result.current.info).toBe("function");
    result.current.debug("msg", { a: 1 });
  });
});
