import { describe, it, expect } from "vitest";
import { initLogger } from "@lib/logger/init";

describe("initLogger", () => {
  it("runs", () => {
    expect(() => initLogger({ sentry: false, remoteLogging: false })).not.toThrow();
  });
});
