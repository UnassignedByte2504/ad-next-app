import { describe, it, expect } from "vitest";
import { createRemoteLogHandler } from "@lib/logger/remote-logger";

describe("remote-logger", () => {
  it("creates handler", () => {
    const handler = createRemoteLogHandler({ batchSize: 1, flushInterval: 10 });
    handler({ level: "info", message: "m", timestamp: new Date().toISOString(), context: { component: "X" } });
    expect(typeof handler).toBe("function");
  });
});
