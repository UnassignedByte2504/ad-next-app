/**
 * Ayla Designs Theme
 *
 * Re-exports from the modular theme architecture at app/ui/theme/
 *
 * @deprecated Import directly from '@/app/ui/theme' for access to all theme utilities
 *
 * @example
 * ```tsx
 * // Preferred: Import from modular theme
 * import { theme, genreColors, fontFamilies } from '@/app/ui/theme';
 *
 * // Legacy: Default import still works
 * import theme from '@/app/theme';
 * ```
 */

// Re-export everything from the modular theme
export * from "./ui/theme";

// Default export for backwards compatibility
export { default } from "./ui/theme";
