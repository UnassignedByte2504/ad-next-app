/**
 * Date Helper Utilities
 *
 * Pure functions for date manipulation without external dependencies.
 * All functions are immutable - they return new Date objects.
 */

import type {
  DateInput,
  Duration,
  DurationUnit,
  DateRange,
  RangePreset,
  CompareGranularity,
  ParseResult,
} from "./types";

// ============================================================================
// Parsing & Conversion
// ============================================================================

/**
 * Convert any DateInput to a Date object
 * Returns null for invalid inputs
 *
 * @example
 * ```ts
 * toDate(new Date()) // Date
 * toDate("2025-12-04") // Date
 * toDate(1733299200000) // Date
 * toDate("invalid") // null
 * ```
 */
export function toDate(input: DateInput): Date | null {
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === "number") {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof input === "string") {
    // Handle ISO strings and common formats
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Parse a date with validation result
 *
 * @example
 * ```ts
 * parseDate("2025-12-04") // { date: Date, valid: true }
 * parseDate("invalid") // { date: null, valid: false, error: "Invalid date" }
 * ```
 */
export function parseDate(input: DateInput): ParseResult {
  const date = toDate(input);

  if (date === null) {
    return {
      date: null,
      valid: false,
      error: "Invalid date format",
    };
  }

  return {
    date,
    valid: true,
  };
}

/**
 * Check if a value is a valid date
 */
export function isValidDate(input: DateInput): boolean {
  return toDate(input) !== null;
}

// ============================================================================
// Date Math
// ============================================================================

/**
 * Add a duration to a date
 *
 * @example
 * ```ts
 * add(new Date(), { days: 7 }) // 1 week from now
 * add(new Date(), { hours: -2 }) // 2 hours ago
 * add(new Date(), { months: 1, days: 15 }) // 1 month and 15 days from now
 * ```
 */
export function add(input: DateInput, duration: Duration): Date | null {
  const date = toDate(input);
  if (!date) return null;

  const result = new Date(date);

  if (duration.years) {
    result.setFullYear(result.getFullYear() + duration.years);
  }
  if (duration.months) {
    result.setMonth(result.getMonth() + duration.months);
  }
  if (duration.weeks) {
    result.setDate(result.getDate() + duration.weeks * 7);
  }
  if (duration.days) {
    result.setDate(result.getDate() + duration.days);
  }
  if (duration.hours) {
    result.setHours(result.getHours() + duration.hours);
  }
  if (duration.minutes) {
    result.setMinutes(result.getMinutes() + duration.minutes);
  }
  if (duration.seconds) {
    result.setSeconds(result.getSeconds() + duration.seconds);
  }
  if (duration.milliseconds) {
    result.setMilliseconds(result.getMilliseconds() + duration.milliseconds);
  }

  return result;
}

/**
 * Subtract a duration from a date
 *
 * @example
 * ```ts
 * subtract(new Date(), { days: 7 }) // 1 week ago
 * ```
 */
export function subtract(input: DateInput, duration: Duration): Date | null {
  const negativeDuration: Duration = {};

  for (const [key, value] of Object.entries(duration)) {
    if (value !== undefined) {
      negativeDuration[key as DurationUnit] = -value;
    }
  }

  return add(input, negativeDuration);
}

/**
 * Get the difference between two dates in a specific unit
 *
 * @example
 * ```ts
 * diff(date1, date2, "days") // 7
 * diff(date1, date2, "hours") // 168
 * ```
 */
export function diff(
  from: DateInput,
  to: DateInput,
  unit: DurationUnit = "milliseconds"
): number | null {
  const fromDate = toDate(from);
  const toDate_ = toDate(to);

  if (!fromDate || !toDate_) return null;

  const diffMs = toDate_.getTime() - fromDate.getTime();

  const divisors: Record<DurationUnit, number> = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30.44 * 24 * 60 * 60 * 1000, // Average month
    years: 365.25 * 24 * 60 * 60 * 1000, // Average year
  };

  return diffMs / divisors[unit];
}

// ============================================================================
// Start/End of Period
// ============================================================================

/**
 * Get the start of a time period
 *
 * @example
 * ```ts
 * startOf(new Date(), "day") // Today at 00:00:00
 * startOf(new Date(), "month") // First day of month at 00:00:00
 * startOf(new Date(), "week") // Monday at 00:00:00 (or Sunday depending on locale)
 * ```
 */
export function startOf(
  input: DateInput,
  unit: CompareGranularity,
  weekStartsOn: 0 | 1 = 1 // 0 = Sunday, 1 = Monday
): Date | null {
  const date = toDate(input);
  if (!date) return null;

  const result = new Date(date);

  switch (unit) {
    case "year":
      result.setMonth(0, 1);
      result.setHours(0, 0, 0, 0);
      break;
    case "month":
      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      break;
    case "week": {
      const day = result.getDay();
      const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
      result.setDate(result.getDate() - diff);
      result.setHours(0, 0, 0, 0);
      break;
    }
    case "day":
      result.setHours(0, 0, 0, 0);
      break;
    case "hour":
      result.setMinutes(0, 0, 0);
      break;
    case "minute":
      result.setSeconds(0, 0);
      break;
    case "second":
      result.setMilliseconds(0);
      break;
    case "millisecond":
      // No change needed
      break;
  }

  return result;
}

/**
 * Get the end of a time period
 *
 * @example
 * ```ts
 * endOf(new Date(), "day") // Today at 23:59:59.999
 * endOf(new Date(), "month") // Last day of month at 23:59:59.999
 * ```
 */
export function endOf(
  input: DateInput,
  unit: CompareGranularity,
  weekStartsOn: 0 | 1 = 1
): Date | null {
  const date = toDate(input);
  if (!date) return null;

  const result = new Date(date);

  switch (unit) {
    case "year":
      result.setMonth(11, 31);
      result.setHours(23, 59, 59, 999);
      break;
    case "month":
      result.setMonth(result.getMonth() + 1, 0); // Last day of current month
      result.setHours(23, 59, 59, 999);
      break;
    case "week": {
      const start = startOf(result, "week", weekStartsOn);
      if (!start) return null;
      result.setTime(start.getTime());
      result.setDate(result.getDate() + 6);
      result.setHours(23, 59, 59, 999);
      break;
    }
    case "day":
      result.setHours(23, 59, 59, 999);
      break;
    case "hour":
      result.setMinutes(59, 59, 999);
      break;
    case "minute":
      result.setSeconds(59, 999);
      break;
    case "second":
      result.setMilliseconds(999);
      break;
    case "millisecond":
      // No change needed
      break;
  }

  return result;
}

// ============================================================================
// Comparisons
// ============================================================================

/**
 * Check if two dates are the same at a given granularity
 *
 * @example
 * ```ts
 * isSame(date1, date2, "day") // true if same calendar day
 * isSame(date1, date2, "month") // true if same month and year
 * ```
 */
export function isSame(
  date1: DateInput,
  date2: DateInput,
  granularity: CompareGranularity = "millisecond"
): boolean {
  const d1 = startOf(date1, granularity);
  const d2 = startOf(date2, granularity);

  if (!d1 || !d2) return false;

  return d1.getTime() === d2.getTime();
}

/**
 * Check if date1 is before date2
 */
export function isBefore(
  date1: DateInput,
  date2: DateInput,
  granularity: CompareGranularity = "millisecond"
): boolean {
  const d1 = startOf(date1, granularity);
  const d2 = startOf(date2, granularity);

  if (!d1 || !d2) return false;

  return d1.getTime() < d2.getTime();
}

/**
 * Check if date1 is after date2
 */
export function isAfter(
  date1: DateInput,
  date2: DateInput,
  granularity: CompareGranularity = "millisecond"
): boolean {
  const d1 = startOf(date1, granularity);
  const d2 = startOf(date2, granularity);

  if (!d1 || !d2) return false;

  return d1.getTime() > d2.getTime();
}

/**
 * Check if a date is between two other dates
 */
export function isBetween(
  date: DateInput,
  start: DateInput,
  end: DateInput,
  granularity: CompareGranularity = "millisecond",
  inclusive: "[]" | "()" | "[)" | "(]" = "[]"
): boolean {
  const d = startOf(date, granularity);
  const s = startOf(start, granularity);
  const e = startOf(end, granularity);

  if (!d || !s || !e) return false;

  const dTime = d.getTime();
  const sTime = s.getTime();
  const eTime = e.getTime();

  const startCheck =
    inclusive[0] === "[" ? dTime >= sTime : dTime > sTime;
  const endCheck =
    inclusive[1] === "]" ? dTime <= eTime : dTime < eTime;

  return startCheck && endCheck;
}

/**
 * Check if a date is today
 */
export function isToday(input: DateInput): boolean {
  return isSame(input, new Date(), "day");
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(input: DateInput): boolean {
  const yesterday = subtract(new Date(), { days: 1 });
  return yesterday ? isSame(input, yesterday, "day") : false;
}

/**
 * Check if a date is tomorrow
 */
export function isTomorrow(input: DateInput): boolean {
  const tomorrow = add(new Date(), { days: 1 });
  return tomorrow ? isSame(input, tomorrow, "day") : false;
}

/**
 * Check if a date is in the past
 */
export function isPast(input: DateInput): boolean {
  return isBefore(input, new Date());
}

/**
 * Check if a date is in the future
 */
export function isFuture(input: DateInput): boolean {
  return isAfter(input, new Date());
}

// ============================================================================
// Range Helpers
// ============================================================================

/**
 * Get a predefined date range
 *
 * @example
 * ```ts
 * getRange("thisWeek") // { start: Monday 00:00, end: Sunday 23:59 }
 * getRange("lastMonth") // { start: First of last month, end: Last of last month }
 * ```
 */
export function getRange(preset: RangePreset): DateRange | null {
  const now = new Date();

  switch (preset) {
    case "today":
      return {
        start: startOf(now, "day")!,
        end: endOf(now, "day")!,
      };
    case "yesterday": {
      const yesterday = subtract(now, { days: 1 })!;
      return {
        start: startOf(yesterday, "day")!,
        end: endOf(yesterday, "day")!,
      };
    }
    case "thisWeek":
      return {
        start: startOf(now, "week")!,
        end: endOf(now, "week")!,
      };
    case "lastWeek": {
      const lastWeek = subtract(now, { weeks: 1 })!;
      return {
        start: startOf(lastWeek, "week")!,
        end: endOf(lastWeek, "week")!,
      };
    }
    case "thisMonth":
      return {
        start: startOf(now, "month")!,
        end: endOf(now, "month")!,
      };
    case "lastMonth": {
      const lastMonth = subtract(now, { months: 1 })!;
      return {
        start: startOf(lastMonth, "month")!,
        end: endOf(lastMonth, "month")!,
      };
    }
    case "thisYear":
      return {
        start: startOf(now, "year")!,
        end: endOf(now, "year")!,
      };
    case "lastYear": {
      const lastYear = subtract(now, { years: 1 })!;
      return {
        start: startOf(lastYear, "year")!,
        end: endOf(lastYear, "year")!,
      };
    }
    default:
      return null;
  }
}

/**
 * Check if a date falls within a range
 */
export function isInRange(
  date: DateInput,
  range: DateRange,
  granularity: CompareGranularity = "day"
): boolean {
  return isBetween(date, range.start, range.end, granularity, "[]");
}

// ============================================================================
// Getters
// ============================================================================

/**
 * Get the day of the week (0-6, where 0 is Sunday)
 */
export function getDayOfWeek(input: DateInput): number | null {
  const date = toDate(input);
  return date ? date.getDay() : null;
}

/**
 * Get the week number of the year (ISO week)
 */
export function getWeekNumber(input: DateInput): number | null {
  const date = toDate(input);
  if (!date) return null;

  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Get the quarter (1-4)
 */
export function getQuarter(input: DateInput): number | null {
  const date = toDate(input);
  if (!date) return null;
  return Math.floor(date.getMonth() / 3) + 1;
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(input: DateInput): number | null {
  const date = toDate(input);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
