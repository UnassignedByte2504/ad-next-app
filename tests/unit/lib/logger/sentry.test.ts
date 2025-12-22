import { describe, it, expect } from "vitest";
import { sentryLogHandler } from "@lib/logger/sentry";

describe("sentryLogHandler", () => {
  it("handles debug entry", () => {
    expect(() => sentryLogHandler({ level: "debug", message: "x", timestamp: new Date().toISOString(), context: { component: "C" } })).not.toThrow();
  });
});
