/**
 * Unit Tests - Utility Functions
 *
 * Tests para las funciones de utilidad en @utils/helpers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  formatDate,
  formatRelativeDate,
  formatCurrency,
  formatNumber,
  truncate,
  capitalize,
  slugify,
  generateId,
  debounce,
  throttle,
  sleep,
} from "@utils/helpers";

describe("cn (className merger)", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  it("resolves Tailwind conflicts", () => {
    // El segundo px- debería sobrescribir al primero
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles arrays", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("handles objects", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn(null, undefined)).toBe("");
  });
});

describe("formatDate", () => {
  const testDate = new Date("2024-06-15T14:30:00Z");

  it("formats date in long format by default", () => {
    const result = formatDate(testDate);
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("formats date in short format", () => {
    const result = formatDate(testDate, "short");
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("formats time only", () => {
    const result = formatDate(testDate, "time");
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it("accepts string dates", () => {
    const result = formatDate("2024-06-15T14:30:00Z");
    expect(result).toContain("2024");
  });

  it("accepts timestamps", () => {
    const result = formatDate(testDate.getTime());
    expect(result).toContain("2024");
  });
});

describe("formatRelativeDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'hace unos segundos' for very recent", () => {
    const date = new Date("2024-06-15T11:59:30Z");
    expect(formatRelativeDate(date)).toBe("hace unos segundos");
  });

  it("returns minutes for recent times", () => {
    const date = new Date("2024-06-15T11:55:00Z");
    expect(formatRelativeDate(date)).toBe("hace 5 minutos");
  });

  it("returns singular minute", () => {
    const date = new Date("2024-06-15T11:59:00Z");
    expect(formatRelativeDate(date)).toBe("hace 1 minuto");
  });

  it("returns hours", () => {
    const date = new Date("2024-06-15T09:00:00Z");
    expect(formatRelativeDate(date)).toBe("hace 3 horas");
  });

  it("returns days", () => {
    const date = new Date("2024-06-13T12:00:00Z");
    expect(formatRelativeDate(date)).toBe("hace 2 días");
  });

  it("returns formatted date for older than a week", () => {
    const date = new Date("2024-06-01T12:00:00Z");
    const result = formatRelativeDate(date);
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe("formatCurrency", () => {
  it("formats EUR by default", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("€");
    // El formato exacto puede variar según el entorno, verificamos componentes clave
    expect(result).toMatch(/1\.?234[,.]56/);
  });

  it("formats USD", () => {
    const result = formatCurrency(1234.56, "USD");
    expect(result).toContain("$");
  });

  it("handles zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("handles negative amounts", () => {
    const result = formatCurrency(-100);
    expect(result).toContain("-");
    expect(result).toContain("100");
  });
});

describe("formatNumber", () => {
  it("formats with thousand separators", () => {
    expect(formatNumber(1234567)).toBe("1.234.567");
  });

  it("handles small numbers", () => {
    expect(formatNumber(123)).toBe("123");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
  });

  it("does not truncate short strings", () => {
    expect(truncate("Hi", 10)).toBe("Hi");
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("trims whitespace before ellipsis", () => {
    expect(truncate("Hello World", 6)).toBe("Hello...");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("handles already capitalized", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("handles single character", () => {
    expect(capitalize("h")).toBe("H");
  });

  it("handles empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("does not change rest of string", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("HELLO")).toBe("hello");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(slugify("Músico en Madrid")).toBe("musico-en-madrid");
  });

  it("removes leading/trailing hyphens", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });
});

describe("generateId", () => {
  it("generates string of default length", () => {
    const id = generateId();
    expect(id).toHaveLength(8);
  });

  it("generates string of custom length", () => {
    // Math.random().toString(36) genera máximo ~11 caracteres
    // Testeamos con un valor dentro del límite
    const id = generateId(6);
    expect(id).toHaveLength(6);
  });

  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("only contains alphanumeric characters", () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("delays function execution", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("resets timer on subsequent calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to the function", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("arg1", "arg2");
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("arg1", "arg2");
  });
});

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("executes immediately on first call", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("ignores calls within limit", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("allows calls after limit expires", () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();

    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after specified time", async () => {
    const callback = vi.fn();

    sleep(1000).then(callback);

    expect(callback).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(callback).toHaveBeenCalled();
  });

  it("returns a Promise", () => {
    expect(sleep(100)).toBeInstanceOf(Promise);
  });
});
