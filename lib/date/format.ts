/**
 * Date Formatting Utilities
 *
 * Wrappers around Intl.DateTimeFormat with predefined presets
 * for consistent date/time display across Ayla Designs.
 */

import type {
  DateInput,
  DateFormatPreset,
  TimeFormatPreset,
  DateTimeFormatPreset,
  SupportedLocale,
  FormatOptions,
} from "./types";
import { DEFAULT_LOCALE } from "./types";
import { toDate } from "./helpers";

// ============================================================================
// Format Preset Configurations
// ============================================================================

/**
 * Intl options for date format presets
 */
const DATE_PRESETS: Record<Exclude<DateFormatPreset, "iso">, Intl.DateTimeFormatOptions> = {
  short: {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
  medium: {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
  long: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
  full: {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};

/**
 * Intl options for time format presets
 */
const TIME_PRESETS: Record<TimeFormatPreset, Intl.DateTimeFormatOptions> = {
  short: {
    hour: "2-digit",
    minute: "2-digit",
  },
  medium: {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  },
  long: {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  },
};

/**
 * Intl options for datetime format presets
 */
const DATETIME_PRESETS: Record<Exclude<DateTimeFormatPreset, "iso">, Intl.DateTimeFormatOptions> = {
  short: {
    ...DATE_PRESETS.short,
    ...TIME_PRESETS.short,
  },
  medium: {
    ...DATE_PRESETS.medium,
    ...TIME_PRESETS.short,
  },
  long: {
    ...DATE_PRESETS.long,
    ...TIME_PRESETS.medium,
  },
  full: {
    ...DATE_PRESETS.full,
    ...TIME_PRESETS.long,
  },
};

// ============================================================================
// Formatter Cache (Performance)
// ============================================================================

/**
 * Cache for Intl.DateTimeFormat instances
 * Key format: `${locale}-${JSON.stringify(options)}`
 */
const formatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Get or create a cached formatter
 */
function getFormatter(locale: SupportedLocale, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}-${JSON.stringify(options)}`;

  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    formatterCache.set(key, formatter);
  }

  return formatter;
}

// ============================================================================
// Format Functions
// ============================================================================

/**
 * Format a date using a preset or custom options
 *
 * @example
 * ```ts
 * formatDate(new Date(), "medium") // "4 dic 2025"
 * formatDate("2025-12-04", "long", "en") // "December 4, 2025"
 * ```
 */
export function formatDate(
  input: DateInput,
  preset: DateFormatPreset = "medium",
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const date = toDate(input);
  if (!date) return "";

  if (preset === "iso") {
    return date.toISOString().split("T")[0];
  }

  const formatter = getFormatter(locale, DATE_PRESETS[preset]);
  return formatter.format(date);
}

/**
 * Format a time using a preset or custom options
 *
 * @example
 * ```ts
 * formatTime(new Date(), "short") // "14:30"
 * formatTime(new Date(), "long") // "14:30:00 CET"
 * ```
 */
export function formatTime(
  input: DateInput,
  preset: TimeFormatPreset = "short",
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const date = toDate(input);
  if (!date) return "";

  const formatter = getFormatter(locale, TIME_PRESETS[preset]);
  return formatter.format(date);
}

/**
 * Format a datetime using a preset or custom options
 *
 * @example
 * ```ts
 * formatDateTime(new Date(), "medium") // "4 dic 2025, 14:30"
 * formatDateTime(new Date(), "iso") // "2025-12-04T14:30:00.000Z"
 * ```
 */
export function formatDateTime(
  input: DateInput,
  preset: DateTimeFormatPreset = "medium",
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const date = toDate(input);
  if (!date) return "";

  if (preset === "iso") {
    return date.toISOString();
  }

  const formatter = getFormatter(locale, DATETIME_PRESETS[preset]);
  return formatter.format(date);
}

/**
 * Format with custom Intl options
 *
 * @example
 * ```ts
 * formatCustom(new Date(), { weekday: "short", month: "short", day: "numeric" })
 * // "jue, 4 dic"
 * ```
 */
export function formatCustom(
  input: DateInput,
  options: FormatOptions
): string {
  const date = toDate(input);
  if (!date) return "";

  const { locale = DEFAULT_LOCALE, ...intlOptions } = options;
  const formatter = getFormatter(locale, intlOptions);
  return formatter.format(date);
}

// ============================================================================
// Specialized Formatters
// ============================================================================

/**
 * Format for display in lists/cards (compact)
 * Shows relative date for recent, absolute for older
 *
 * @example
 * ```ts
 * formatForDisplay(today) // "Hoy"
 * formatForDisplay(yesterday) // "Ayer"
 * formatForDisplay(lastWeek) // "28 nov"
 * formatForDisplay(lastYear) // "4 dic 2024"
 * ```
 */
export function formatForDisplay(
  input: DateInput,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const date = toDate(input);
  if (!date) return "";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const inputDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor((today.getTime() - inputDay.getTime()) / (1000 * 60 * 60 * 24));

  // Today/Yesterday
  if (diffDays === 0) {
    return locale === "es" ? "Hoy" : "Today";
  }
  if (diffDays === 1) {
    return locale === "es" ? "Ayer" : "Yesterday";
  }

  // Same year - omit year
  if (date.getFullYear() === now.getFullYear()) {
    return formatCustom(date, {
      locale,
      day: "numeric",
      month: "short",
    });
  }

  // Different year - include year
  return formatDate(date, "medium", locale);
}

/**
 * Format for event times (shows both date and time intelligently)
 *
 * @example
 * ```ts
 * formatEventTime(todayEvent) // "Hoy, 14:30"
 * formatEventTime(nextWeekEvent) // "Lun 11 dic, 18:00"
 * ```
 */
export function formatEventTime(
  input: DateInput,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const date = toDate(input);
  if (!date) return "";

  const displayDate = formatForDisplay(date, locale);
  const time = formatTime(date, "short", locale);

  return `${displayDate}, ${time}`;
}

/**
 * Format a date range
 *
 * @example
 * ```ts
 * formatRange(start, end) // "4 - 10 dic 2025"
 * formatRange(start, end) // "4 dic - 3 ene 2026"
 * ```
 */
export function formatRange(
  start: DateInput,
  end: DateInput,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return "";

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    // Same month: "4 - 10 dic 2025"
    const startDay = startDate.getDate();
    const endFormatted = formatDate(endDate, "medium", locale);
    return `${startDay} - ${endFormatted}`;
  }

  if (sameYear) {
    // Same year: "4 dic - 3 ene 2025"
    const startFormatted = formatCustom(startDate, { locale, day: "numeric", month: "short" });
    const endFormatted = formatDate(endDate, "medium", locale);
    return `${startFormatted} - ${endFormatted}`;
  }

  // Different years: "4 dic 2025 - 3 ene 2026"
  const startFormatted = formatDate(startDate, "medium", locale);
  const endFormatted = formatDate(endDate, "medium", locale);
  return `${startFormatted} - ${endFormatted}`;
}
