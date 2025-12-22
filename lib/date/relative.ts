/**
 * Relative Time Utilities
 *
 * Wrappers around Intl.RelativeTimeFormat for human-readable
 * relative time strings like "hace 2 horas" or "in 3 days".
 */

import type {
  DateInput,
  RelativeTimeUnit,
  RelativeTimeStyle,
  RelativeTimeOptions,
  SupportedLocale,
} from "./types";
import { DEFAULT_LOCALE } from "./types";
import { toDate } from "./helpers";

// ============================================================================
// Formatter Cache
// ============================================================================

const relativeFormatterCache = new Map<string, Intl.RelativeTimeFormat>();

function getRelativeFormatter(
  locale: SupportedLocale,
  style: RelativeTimeStyle = "long",
  numeric: "always" | "auto" = "auto"
): Intl.RelativeTimeFormat {
  const key = `${locale}-${style}-${numeric}`;

  let formatter = relativeFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(locale, { style, numeric });
    relativeFormatterCache.set(key, formatter);
  }

  return formatter;
}

// ============================================================================
// Time Unit Thresholds
// ============================================================================

/**
 * Thresholds for automatic unit selection (in milliseconds)
 */
const THRESHOLDS: { unit: RelativeTimeUnit; ms: number }[] = [
  { unit: "year", ms: 365.25 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30.44 * 24 * 60 * 60 * 1000 },
  { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
  { unit: "second", ms: 1000 },
];

/**
 * Select the best unit for a given duration
 */
function selectUnit(ms: number): { unit: RelativeTimeUnit; value: number } {
  const absMs = Math.abs(ms);

  for (const { unit, ms: threshold } of THRESHOLDS) {
    if (absMs >= threshold) {
      return {
        unit,
        value: Math.round(ms / threshold),
      };
    }
  }

  return { unit: "second", value: Math.round(ms / 1000) };
}

// ============================================================================
// Relative Time Functions
// ============================================================================

/**
 * Format a date as relative time from now
 *
 * @example
 * ```ts
 * timeAgo(twoHoursAgo) // "hace 2 horas"
 * timeAgo(nextWeek) // "dentro de 7 días"
 * timeAgo(yesterday, { style: "short" }) // "hace 1 d"
 * ```
 */
export function timeAgo(
  input: DateInput,
  options: RelativeTimeOptions = {}
): string {
  const date = toDate(input);
  if (!date) return "";

  const { locale = DEFAULT_LOCALE, style = "long", numeric = "auto" } = options;

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const { unit, value } = selectUnit(diffMs);

  const formatter = getRelativeFormatter(locale, style, numeric);
  return formatter.format(value, unit);
}

/**
 * Format relative time between two dates
 *
 * @example
 * ```ts
 * timeFrom(eventStart, eventEnd) // "2 horas después"
 * ```
 */
export function timeFrom(
  from: DateInput,
  to: DateInput,
  options: RelativeTimeOptions = {}
): string {
  const fromDate = toDate(from);
  const toDate_ = toDate(to);
  if (!fromDate || !toDate_) return "";

  const { locale = DEFAULT_LOCALE, style = "long", numeric = "always" } = options;

  const diffMs = toDate_.getTime() - fromDate.getTime();
  const { unit, value } = selectUnit(diffMs);

  const formatter = getRelativeFormatter(locale, style, numeric);
  return formatter.format(value, unit);
}

/**
 * Format time remaining until a date
 *
 * @example
 * ```ts
 * timeUntil(deadline) // "3 días"
 * timeUntil(deadline, { style: "narrow" }) // "3d"
 * ```
 */
export function timeUntil(
  input: DateInput,
  options: Omit<RelativeTimeOptions, "numeric"> = {}
): string {
  const date = toDate(input);
  if (!date) return "";

  const { locale = DEFAULT_LOCALE, style = "long" } = options;

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  // If in the past, return empty or a fallback
  if (diffMs < 0) {
    return locale === "es" ? "Finalizado" : "Ended";
  }

  const { unit, value } = selectUnit(diffMs);
  const formatter = getRelativeFormatter(locale, style, "always");

  // Remove the "in" prefix - we just want the duration
  // This is a bit hacky but Intl doesn't have a duration-only format
  const result = formatter.format(value, unit);

  // For Spanish: "dentro de X días" -> "X días"
  // For English: "in X days" -> "X days"
  if (locale === "es") {
    return result.replace(/^dentro de /, "");
  }
  return result.replace(/^in /, "");
}

/**
 * Format time elapsed since a date
 *
 * @example
 * ```ts
 * timeSince(createdAt) // "2 meses"
 * ```
 */
export function timeSince(
  input: DateInput,
  options: Omit<RelativeTimeOptions, "numeric"> = {}
): string {
  const date = toDate(input);
  if (!date) return "";

  const { locale = DEFAULT_LOCALE, style = "long" } = options;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // If in the future, return empty or a fallback
  if (diffMs < 0) {
    return locale === "es" ? "Próximamente" : "Coming soon";
  }

  const { unit, value } = selectUnit(-diffMs); // Negative to get "ago" format
  const formatter = getRelativeFormatter(locale, style, "always");

  const result = formatter.format(value, unit);

  // Remove the "ago" suffix - we just want the duration
  // For Spanish: "hace X días" -> "X días"
  // For English: "X days ago" -> "X days"
  if (locale === "es") {
    return result.replace(/^hace /, "");
  }
  return result.replace(/ ago$/, "");
}

// ============================================================================
// Smart Relative Formatting
// ============================================================================

/**
 * Smart relative time that switches to absolute date for older dates
 *
 * - < 1 day: "hace 2 horas"
 * - < 7 days: "hace 3 días"
 * - < 1 year: "4 dic"
 * - >= 1 year: "4 dic 2024"
 *
 * @example
 * ```ts
 * smartTimeAgo(recentPost) // "hace 2 horas"
 * smartTimeAgo(oldPost) // "15 mar 2024"
 * ```
 */
export function smartTimeAgo(
  input: DateInput,
  options: RelativeTimeOptions = {}
): string {
  const date = toDate(input);
  if (!date) return "";

  const { locale = DEFAULT_LOCALE } = options;

  const now = new Date();
  const diffMs = Math.abs(now.getTime() - date.getTime());

  // Less than 7 days: use relative time
  if (diffMs < 7 * 24 * 60 * 60 * 1000) {
    return timeAgo(date, options);
  }

  // Import formatDate dynamically to avoid circular dependency
  // For older dates, use absolute format
  const sameYear = date.getFullYear() === now.getFullYear();

  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });

  return formatter.format(date);
}

// ============================================================================
// Duration Formatting
// ============================================================================

/**
 * Format a duration in milliseconds as human-readable string
 *
 * @example
 * ```ts
 * formatDuration(3600000) // "1 hora"
 * formatDuration(90000) // "1 minuto"
 * formatDuration(5400000, { style: "short" }) // "1 h 30 min"
 * ```
 */
export function formatDuration(
  ms: number,
  options: { locale?: SupportedLocale; style?: RelativeTimeStyle } = {}
): string {
  const { locale = DEFAULT_LOCALE, style = "long" } = options;

  if (ms < 1000) {
    return locale === "es" ? "menos de un segundo" : "less than a second";
  }

  const { unit, value } = selectUnit(ms);
  const absValue = Math.abs(value);

  // Use Intl.RelativeTimeFormat just for the unit names
  const formatter = getRelativeFormatter(locale, style, "always");
  const formatted = formatter.format(absValue, unit);

  // Extract just the number + unit part
  // "in 2 hours" -> "2 hours"
  // "dentro de 2 horas" -> "2 horas"
  if (locale === "es") {
    return formatted.replace(/^dentro de /, "").replace(/^hace /, "");
  }
  return formatted.replace(/^in /, "").replace(/ ago$/, "");
}
