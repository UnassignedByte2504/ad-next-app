/**
 * Date Utilities Module
 *
 * Zero-dependency date/time utilities using native Intl APIs.
 * Designed for i18n support with es/en locales.
 *
 * @example
 * ```ts
 * import { formatDate, timeAgo, add, isToday } from "@/lib/date";
 *
 * // Formatting
 * formatDate(new Date(), "medium") // "4 dic 2025"
 * formatDateTime(event.date, "short", "en") // "12/04/2025, 2:30 PM"
 *
 * // Relative time
 * timeAgo(post.createdAt) // "hace 2 horas"
 * smartTimeAgo(oldPost) // "15 mar 2024"
 *
 * // Date math
 * add(new Date(), { days: 7 }) // 1 week from now
 * subtract(deadline, { hours: 1 }) // 1 hour before deadline
 *
 * // Comparisons
 * isToday(event.date) // true/false
 * isBetween(date, range.start, range.end) // true/false
 *
 * // Ranges
 * getRange("thisWeek") // { start, end }
 * ```
 *
 * @module lib/date
 */

// Types
export type {
  SupportedLocale,
  DateFormatPreset,
  TimeFormatPreset,
  DateTimeFormatPreset,
  RelativeTimeUnit,
  RelativeTimeStyle,
  Duration,
  DurationUnit,
  DateInput,
  ParseResult,
  DateRange,
  RangePreset,
  CompareGranularity,
  FormatOptions,
  RelativeTimeOptions,
} from "./types";

export { DEFAULT_LOCALE } from "./types";

// Formatting
export {
  formatDate,
  formatTime,
  formatDateTime,
  formatCustom,
  formatForDisplay,
  formatEventTime,
  formatRange,
} from "./format";

// Relative time
export {
  timeAgo,
  timeFrom,
  timeUntil,
  timeSince,
  smartTimeAgo,
  formatDuration,
} from "./relative";

// Helpers
export {
  // Parsing
  toDate,
  parseDate,
  isValidDate,
  // Math
  add,
  subtract,
  diff,
  // Start/End
  startOf,
  endOf,
  // Comparisons
  isSame,
  isBefore,
  isAfter,
  isBetween,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
  isFuture,
  // Ranges
  getRange,
  isInRange,
  // Getters
  getDayOfWeek,
  getWeekNumber,
  getQuarter,
  isLeapYear,
  getDaysInMonth,
} from "./helpers";
