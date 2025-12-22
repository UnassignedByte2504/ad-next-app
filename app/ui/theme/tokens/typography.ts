/**
 * Ayla Designs Typography Tokens
 *
 * Font pairing: Cormorant Garamond (headings) + Nunito Sans (body) + JetBrains Mono (code)
 *
 * Cormorant Garamond: Elegant serif with modern touch - for titles, prices, featured elements
 * Nunito Sans: Rounded, friendly, high readability - for body text, forms, UI
 * JetBrains Mono: Monospace - for prices, discount codes, technical data
 *
 * @see docs/branding/CORPORATE_IDENTITY.md
 */

// =============================================================================
// FONT FAMILIES
// =============================================================================

export const fontFamilies = {
  /** Elegant serif - for headings, product titles, featured elements */
  heading: "'Cormorant Garamond', Georgia, serif",

  /** Rounded, friendly - for body text and forms */
  body: "'Nunito Sans', system-ui, sans-serif",

  /** Monospace - for prices, discount codes, technical data */
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

// =============================================================================
// FONT WEIGHTS
// =============================================================================

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// =============================================================================
// FONT SIZES (rem based on 16px root)
// =============================================================================

export const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "4rem", // 64px
} as const;

// =============================================================================
// LINE HEIGHTS
// =============================================================================

export const lineHeights = {
  tight: 1.2,
  snug: 1.3,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
} as const;

// =============================================================================
// LETTER SPACING
// =============================================================================

export const letterSpacing = {
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

// =============================================================================
// MUI TYPOGRAPHY VARIANTS
// =============================================================================

export const typographyVariants = {
  h1: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes["5xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes["4xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  },
  h4: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  },
  h5: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
  },
  h6: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
  },
  subtitle1: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
  },
  subtitle2: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
  },
  body1: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.loose,
  },
  body2: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
  },
  button: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    textTransform: "none" as const,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
  overline: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    textTransform: "uppercase" as const,
    letterSpacing: letterSpacing.widest,
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
