import { describe, it, expect } from "vitest";
import { logger } from "@lib/logger";

describe("logger", () => {
  it("logs with context", () => {
    const ctx = logger.withContext({ component: "Test" });
    ctx.info("hello", { ok: true });
    expect(typeof ctx.debug).toBe("function");
  });
});
