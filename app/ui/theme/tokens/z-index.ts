/**
 * Z-Index Tokens - Centralized Layer Management
 *
 * Prevents z-index conflicts by providing a consistent scale.
 * Always use these tokens instead of arbitrary z-index values.
 *
 * @see /docs/theming/DESIGN_SYSTEM_PRINCIPLES.md
 */

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

/**
 * Z-index tokens organized by layer purpose.
 *
 * Layers from back to front:
 * - base (0): Default stacking
 * - decoration (1-10): Decorative elements (FloatingStars, etc.)
 * - content (10-50): Main content layers
 * - sticky (100): Sticky elements (headers, etc.)
 * - navbar (1100): Navigation bar
 * - drawer (1200): Sidebars, drawers
 * - modal (1300): Modals, dialogs
 * - popover (1400): Popovers, tooltips
 * - toast (1500): Toast notifications
 * - max (9999): Maximum (use sparingly)
 */
export const zIndex = {
  /** Base layer - default stacking context */
  base: 0,

  /** Decorative background elements (stars, patterns) */
  decoration: 1,

  /** Hero overlay (gradient, dark overlay) */
  heroOverlay: 1,

  /** Hero content (text, buttons) */
  heroContent: 2,

  /** Floating elements above content */
  floating: 10,

  /** Dropdown menus */
  dropdown: 50,

  /** Sticky elements (sub-headers) */
  sticky: 100,

  /** App bar / Navigation bar */
  appBar: 1100,

  /** Side drawers */
  drawer: 1200,

  /** Modals and dialogs */
  modal: 1300,

  /** Popovers and tooltips */
  popover: 1400,

  /** Toast notifications */
  toast: 1500,

  /** Maximum - use sparingly for critical overlays */
  max: 9999,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ZIndex = (typeof zIndex)[keyof typeof zIndex];
