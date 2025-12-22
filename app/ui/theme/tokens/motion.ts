/**
 * Motion Tokens - Material Design 3 Expressive
 *
 * Spring physics configurations for animations.
 * Based on M3 Expressive motion system (Google I/O 2025).
 *
 * @see https://m3.material.io/styles/motion/overview/how-it-works
 * @see /docs/theming/DESIGN_SYSTEM_PRINCIPLES.md
 */

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

/**
 * Spring configs for framer-motion
 * Use these instead of duration/easing for more natural animations
 */
export const springs = {
  /**
   * Snappy - Quick interactions (hover, tap, toggle)
   * High stiffness, moderate damping = fast, crisp response
   */
  snappy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17,
  },

  /**
   * Smooth - Standard transitions (expand, collapse, modal)
   * Balanced stiffness/damping = natural, comfortable motion
   */
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },

  /**
   * Bouncy - Expressive animations (like, success, celebration)
   * High stiffness, low damping = playful overshoot
   */
  bouncy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 15,
  },

  /**
   * Gentle - Subtle entries (fade in, slide up)
   * Low stiffness, high damping = soft, elegant motion
   */
  gentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  },

  /**
   * Stiff - Immediate response (drag, resize)
   * Very high stiffness = minimal delay, direct control
   */
  stiff: {
    type: "spring" as const,
    stiffness: 600,
    damping: 30,
  },
} as const;

// =============================================================================
// DURATION FALLBACKS
// =============================================================================

/**
 * Duration tokens for non-spring animations
 * Use when springs aren't appropriate (CSS transitions, etc.)
 */
export const durations = {
  /** 100ms - Instant feedback (background color changes) */
  instant: 100,
  /** 200ms - Quick transitions (tooltips, dropdowns) */
  fast: 200,
  /** 300ms - Standard transitions (modals, cards) */
  normal: 300,
  /** 500ms - Slow transitions (page changes, complex animations) */
  slow: 500,
  /** 800ms - Very slow (hero animations, onboarding) */
  slower: 800,
} as const;

// =============================================================================
// EASING CURVES (Legacy support)
// =============================================================================

/**
 * CSS easing curves for transitions
 * Prefer springs when possible, use these for CSS-only animations
 */
export const easings = {
  /** Standard ease - general purpose */
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Ease out - elements entering */
  out: "cubic-bezier(0, 0, 0.2, 1)",
  /** Ease in - elements exiting */
  in: "cubic-bezier(0.4, 0, 1, 1)",
  /** Ease in-out - elements moving */
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Sharp - quick changes */
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const;

// =============================================================================
// FRAMER-MOTION VARIANTS
// =============================================================================

/**
 * Common animation variants for framer-motion
 */
export const variants = {
  /**
   * Fade in/out
   */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  /**
   * Scale up from center
   */
  scaleUp: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  /**
   * Slide up from bottom
   */
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },

  /**
   * Slide down from top
   */
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  /**
   * Slide in from left
   */
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  /**
   * Slide in from right
   */
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
} as const;

// =============================================================================
// INTERACTIVE STATES
// =============================================================================

/**
 * Hover/Tap states for interactive elements
 */
export const interactiveStates = {
  /**
   * Standard button/card hover
   */
  hover: {
    scale: 1.02,
    transition: springs.snappy,
  },

  /**
   * Tap/press state
   */
  tap: {
    scale: 0.98,
  },

  /**
   * Chip hover (smaller scale)
   */
  chipHover: {
    scale: 1.05,
    transition: springs.snappy,
  },

  /**
   * Card hover with shadow
   */
  cardHover: {
    scale: 1.01,
    y: -2,
    transition: springs.smooth,
  },

  /**
   * Like/Favorite animation
   */
  like: {
    scale: [1, 1.3, 1] as number[],
    transition: {
      duration: 0.3,
      times: [0, 0.5, 1] as number[],
      ease: "easeOut" as const,
    },
  },

  /**
   * Error shake
   */
  shake: {
    x: [0, -10, 10, -10, 10, 0] as number[],
    transition: {
      duration: 0.4,
    },
  },
} as const;

// =============================================================================
// SHAPE MORPHING
// =============================================================================

/**
 * Border radius scale (M3 Expressive)
 */
export const shapes = {
  /** 4px - Badges, small elements */
  xs: 4,
  /** 8px - Chips, small inputs */
  sm: 8,
  /** 12px - Buttons, inputs */
  md: 12,
  /** 16px - Cards, modals */
  lg: 16,
  /** 24px - FABs, highlighted elements */
  xl: 24,
  /** 9999px - Pills, avatars */
  full: 9999,
} as const;

/**
 * Shape morphing variants for buttons
 */
export const buttonShapeMorph = {
  idle: {
    borderRadius: shapes.md,
  },
  hover: {
    borderRadius: shapes.lg,
    transition: springs.snappy,
  },
  pressed: {
    borderRadius: shapes.sm,
    scale: 0.98,
  },
} as const;

/**
 * Shape morphing variants for chips
 */
export const chipShapeMorph = {
  idle: {
    borderRadius: shapes.full,
  },
  selected: {
    borderRadius: shapes.lg,
    scale: 1.05,
    transition: springs.bouncy,
  },
} as const;

// =============================================================================
// REDUCED MOTION
// =============================================================================

/**
 * Config for users who prefer reduced motion
 * Use with useReducedMotion() hook
 */
export const reducedMotion = {
  type: "tween" as const,
  duration: 0,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SpringConfig = (typeof springs)[keyof typeof springs];
export type Duration = (typeof durations)[keyof typeof durations];
export type Easing = (typeof easings)[keyof typeof easings];
export type Shape = (typeof shapes)[keyof typeof shapes];
