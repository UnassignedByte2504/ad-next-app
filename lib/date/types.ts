/**
 * Date/Time Types
 *
 * Type definitions for the date utility module.
 * Uses native Intl types where possible.
 */

// ============================================================================
// Locale Types
// ============================================================================

/**
 * Supported locales for date formatting
 * Aligned with i18n locales in messages/
 */
export type SupportedLocale = "es" | "en";

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: SupportedLocale = "es";

// ============================================================================
// Format Preset Types
// ============================================================================

/**
 * Predefined date format presets for consistent UI
 */
export type DateFormatPreset =
  | "short" // 04/12/2025
  | "medium" // 4 dic 2025
  | "long" // 4 de diciembre de 2025
  | "full" // jueves, 4 de diciembre de 2025
  | "iso"; // 2025-12-04

/**
 * Predefined time format presets
 */
export type TimeFormatPreset =
  | "short" // 14:30
  | "medium" // 14:30:00
  | "long"; // 14:30:00 CET

/**
 * Predefined datetime format presets
 */
export type DateTimeFormatPreset =
  | "short" // 04/12/2025, 14:30
  | "medium" // 4 dic 2025, 14:30
  | "long" // 4 de diciembre de 2025, 14:30:00
  | "full" // jueves, 4 de diciembre de 2025, 14:30:00 CET
  | "iso"; // 2025-12-04T14:30:00.000Z

// ============================================================================
// Relative Time Types
// ============================================================================

/**
 * Units for relative time formatting
 */
export type RelativeTimeUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

/**
 * Style for relative time output
 */
export type RelativeTimeStyle = "long" | "short" | "narrow";

// ============================================================================
// Duration Types
// ============================================================================

/**
 * Duration object representing time spans
 */
export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

/**
 * Units for duration operations
 */
export type DurationUnit = keyof Duration;

// ============================================================================
// Date Input Types
// ============================================================================

/**
 * Accepted date input types
 * Flexible input, strict output
 */
export type DateInput = Date | string | number;

/**
 * Parse result with validation
 */
export interface ParseResult {
  date: Date | null;
  valid: boolean;
  error?: string;
}

// ============================================================================
// Range Types
// ============================================================================

/**
 * Date range representation
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Predefined range presets for common use cases
 */
export type RangePreset =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear";

// ============================================================================
// Comparison Types
// ============================================================================

/**
 * Granularity for date comparisons
 */
export type CompareGranularity =
  | "year"
  | "month"
  | "week"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

// ============================================================================
// Format Options (extending Intl)
// ============================================================================

/**
 * Extended options for date formatting
 */
export interface FormatOptions extends Intl.DateTimeFormatOptions {
  locale?: SupportedLocale;
}

/**
 * Options for relative time formatting
 */
export interface RelativeTimeOptions {
  locale?: SupportedLocale;
  style?: RelativeTimeStyle;
  numeric?: "always" | "auto";
}
