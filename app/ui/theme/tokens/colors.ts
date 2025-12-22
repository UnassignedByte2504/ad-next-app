/**
 * Ayla Designs Color Tokens
 *
 * Based on the "Magia Profesional" concept - bohemian elegance
 * meets professional design for meaningful moments.
 *
 * Palette: Amber (warmth) + Lavender (magic) + Rose (softness)
 * Neutrals: Stone (warm grays)
 *
 * @see docs/branding/CORPORATE_IDENTITY.md
 */

// =============================================================================
// BRAND COLORS
// =============================================================================

/**
 * Primary Brand Color - Amber (Golden Warmth)
 * Represents warmth, creativity, and the golden light of inspiration
 * Used for: CTAs, primary actions, highlights
 */
export const primary = {
  main: "#F59E0B",
  light: "#FBBF24",
  dark: "#D97706",
  50: "#FFFBEB",
  100: "#FEF3C7",
  200: "#FDE68A",
  300: "#FCD34D",
  400: "#FBBF24",
  500: "#F59E0B",
  600: "#D97706",
  700: "#B45309",
  800: "#92400E",
  900: "#78350F",
  contrastText: "#78350F", // Dark amber for readability
} as const;

/**
 * Secondary Brand Color - Lavender (Mystic Purple)
 * Represents magic, spirituality, and bohemian soul
 * Used for: Accents, secondary actions, decorative elements
 */
export const secondary = {
  main: "#A855F7",
  light: "#C084FC",
  dark: "#7C3AED",
  50: "#FAF5FF",
  100: "#F3E8FF",
  200: "#E9D5FF",
  300: "#D8B4FE",
  400: "#C084FC",
  500: "#A855F7",
  600: "#9333EA",
  700: "#7C3AED",
  800: "#6B21A8",
  900: "#581C87",
  contrastText: "#FFFFFF",
} as const;

/**
 * Accent Color - Rose (Soft Blush)
 * Provides warmth and femininity, complements the bohemian aesthetic
 * Used for: Highlights, notifications, special elements
 */
export const accent = {
  main: "#F43F5E",
  light: "#FB7185",
  dark: "#E11D48",
  50: "#FFF1F2",
  100: "#FFE4E6",
  200: "#FECDD3",
  300: "#FDA4AF",
  400: "#FB7185",
  500: "#F43F5E",
  600: "#E11D48",
  700: "#BE123C",
  800: "#9F1239",
  900: "#881337",
  contrastText: "#FFFFFF",
} as const;

// =============================================================================
// NEUTRAL COLORS - Stone (Warm Grays)
// =============================================================================

/**
 * Stone neutrals - warmer than pure grays
 * Creates a softer, more inviting feel
 */
export const neutral = {
  0: "#FFFFFF",
  50: "#FAFAF9",
  100: "#F5F5F4",
  200: "#E7E5E4",
  300: "#D6D3D1",
  400: "#A8A29E",
  500: "#78716C",
  600: "#57534E",
  700: "#44403C",
  800: "#292524",
  850: "#1C1917",
  900: "#1C1917",
  950: "#0C0A09",
  1000: "#000000",
} as const;

// =============================================================================
// SEMANTIC COLORS
// =============================================================================

export const semantic = {
  error: {
    main: "#EF4444",
    light: "#F87171",
    dark: "#DC2626",
    bg: "rgba(239, 68, 68, 0.15)",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#F59E0B",
    light: "#FBBF24",
    dark: "#D97706",
    bg: "rgba(245, 158, 11, 0.15)",
    contrastText: "#78350F",
  },
  info: {
    main: "#3B82F6",
    light: "#60A5FA",
    dark: "#2563EB",
    bg: "rgba(59, 130, 246, 0.15)",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#10B981",
    light: "#34D399",
    dark: "#059669",
    bg: "rgba(16, 185, 129, 0.15)",
    contrastText: "#FFFFFF",
  },
} as const;

// =============================================================================
// CATEGORY COLORS - Product Categories
// Soft, bohemian colors for product categorization
// =============================================================================

export const categoryColors = {
  // Main product categories
  Planners: "#C9B8D4", // Soft Lavender
  Tarjetas: "#D4B896", // Warm Sand
  "Social Media": "#A855F7", // Vibrant Purple
  Bodas: "#F2DCDC", // Blush Pink
  Branding: "#E8D5B0", // Golden Cream
  "Thank You": "#E1D8EA", // Light Sage

  // Additional categories
  "Digital Art": "#C9B8D4", // Lavender
  Stickers: "#FDE68A", // Light Amber
  "Wall Art": "#FDA4AF", // Rose
  Journals: "#D8B4FE", // Light Purple
} as const;

/**
 * Category gradient pairs for product images
 * Each category has a from/to gradient
 */
export const categoryGradients = {
  Planners: { from: "#E8D5B0", to: "#C9B8D4" }, // Gold → Lavender
  Tarjetas: { from: "#D4B896", to: "#F2DCDC" }, // Sand → Blush
  "Social Media": { from: "#C9B8D4", to: "#E8D5B0" }, // Lavender → Gold
  Bodas: { from: "#F2DCDC", to: "#E1D8EA" }, // Blush → Sage
  Branding: { from: "#E1D8EA", to: "#D4B896" }, // Sage → Sand
  "Thank You": { from: "#F0EBF4", to: "#E8D5B0" }, // Light Lavender → Gold
  "Digital Art": { from: "#E9D5FF", to: "#FEF3C7" }, // Purple → Amber
  Stickers: { from: "#FEF3C7", to: "#FFE4E6" }, // Amber → Rose
} as const;

// =============================================================================
// AVATAR COLORS - For user avatars and testimonials
// =============================================================================

export const avatarColors = {
  gold: { from: "#FCD34D", to: "#F59E0B" }, // Amber gradient
  lavender: { from: "#D8B4FE", to: "#A855F7" }, // Purple gradient
  rose: { from: "#FDA4AF", to: "#F43F5E" }, // Rose gradient
  sage: { from: "#E1D8EA", to: "#C9B8D4" }, // Soft lavender
  sand: { from: "#E8D5B0", to: "#D4B896" }, // Warm sand
} as const;

// =============================================================================
// GRADIENT PRESETS
// =============================================================================

export const gradients = {
  /** Primary brand gradient - amber to lavender */
  brand: "linear-gradient(135deg, #F59E0B 0%, #A855F7 100%)",

  /** CTA gradient - warm amber */
  cta: "linear-gradient(to right, #F59E0B, #FBBF24)",

  /** Hero gradient - amber to rose */
  hero: "linear-gradient(135deg, #F59E0B 0%, #F43F5E 100%)",

  /** Magic text gradient - animated */
  magicAmber: "linear-gradient(to right, #F59E0B, #D97706, #FBBF24, #F59E0B)",
  magicPurple: "linear-gradient(to right, #A855F7, #7C3AED, #C084FC, #A855F7)",

  /** Background gradients */
  heroBackground: "linear-gradient(to bottom, #FFFBEB, #FAFAF9, #FAF5FF30)",
  sectionSubtle: "linear-gradient(to bottom, #FFFFFF80, #FAFAF9, #FAF5FF20)",

  /** Glow effects */
  glowAmber: "linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)",
  glowPurple: "linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, transparent 100%)",

  /** Dark mode glow */
  glowAmberDark: "linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, transparent 100%)",
  glowPurpleDark: "linear-gradient(180deg, rgba(168, 85, 247, 0.15) 0%, transparent 100%)",

  /** Blob gradient for GlowCTA */
  blob: "linear-gradient(to right, #F59E0B, #A855F7)",

  /** Legacy aliases */
  glowDark: "linear-gradient(180deg, rgba(245, 158, 11, 0.15) 0%, transparent 100%)",
  glowLight: "linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, transparent 100%)",
} as const;

// =============================================================================
// SHADOW PRESETS - With brand tint
// =============================================================================

export const shadows = {
  /** Amber-tinted shadows for light mode */
  sm: `0 1px 2px rgba(120, 53, 15, 0.05)`,
  md: `0 4px 6px rgba(120, 53, 15, 0.07)`,
  lg: `0 10px 15px rgba(120, 53, 15, 0.10)`,
  xl: `0 20px 25px rgba(120, 53, 15, 0.15)`,

  /** Glowing shadows for CTAs */
  ctaGlow: `0 4px 14px rgba(245, 158, 11, 0.25)`,
  ctaGlowHover: `0 8px 20px rgba(245, 158, 11, 0.35)`,

  /** Card shadows */
  card: `0 4px 20px rgba(120, 53, 15, 0.08)`,
  cardHover: `0 20px 25px rgba(120, 53, 15, 0.15)`,
} as const;

// =============================================================================
// LEGACY EXPORTS (for backwards compatibility during migration)
// =============================================================================

/** @deprecated Use categoryColors instead */
export const genreColors = categoryColors;

/** @deprecated Use categoryColors instead */
export const instrumentColors = categoryColors;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type PrimaryColor = typeof primary;
export type SecondaryColor = typeof secondary;
export type AccentColor = typeof accent;
export type NeutralColor = typeof neutral;
export type SemanticColors = typeof semantic;
export type CategoryColors = typeof categoryColors;
export type AvatarColors = typeof avatarColors;
