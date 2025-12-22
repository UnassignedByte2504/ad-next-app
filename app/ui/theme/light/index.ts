/**
 * Ayla Designs Light Theme Palette
 *
 * Light mode is the DEFAULT theme for Ayla Designs.
 * Uses warm Stone neutrals (#FAFAF9) instead of pure white
 * for a softer, more bohemian feel.
 *
 * Primary: Amber (warmth, creativity)
 * Secondary: Lavender (magic, spirituality)
 * Accent: Rose (softness, femininity)
 *
 * @see docs/branding/CORPORATE_IDENTITY.md
 */

import type { PaletteOptions } from "@mui/material/styles";
import {
  primary,
  secondary,
  accent,
  neutral,
  semantic,
  gradients,
} from "../tokens/colors";

/**
 * Light theme palette configuration
 * Optimized for warmth, readability, and bohemian elegance
 */
export const lightPalette: PaletteOptions = {
  mode: "light",

  // Brand colors - Amber primary with Lavender secondary
  primary: {
    main: primary.main, // #F59E0B - Amber
    light: primary.light, // #FBBF24
    dark: primary.dark, // #D97706
    contrastText: primary.contrastText, // #78350F (dark amber)
  },

  secondary: {
    main: secondary.main, // #A855F7 - Lavender
    light: secondary.light, // #C084FC
    dark: secondary.dark, // #7C3AED
    contrastText: secondary.contrastText, // #FFFFFF
  },

  // Semantic colors
  error: {
    main: semantic.error.main, // #EF4444
    light: semantic.error.light, // #F87171
    dark: semantic.error.dark, // #DC2626
    contrastText: semantic.error.contrastText,
  },

  warning: {
    main: semantic.warning.main, // Uses Amber - #F59E0B
    light: semantic.warning.light,
    dark: semantic.warning.dark,
    contrastText: semantic.warning.contrastText,
  },

  info: {
    main: semantic.info.main, // #3B82F6
    light: semantic.info.light,
    dark: semantic.info.dark,
    contrastText: semantic.info.contrastText,
  },

  success: {
    main: semantic.success.main, // #10B981
    light: semantic.success.light,
    dark: semantic.success.dark,
    contrastText: semantic.success.contrastText,
  },

  // Backgrounds - warm Stone neutrals
  background: {
    default: neutral[50], // #FAFAF9 - Warm off-white
    paper: neutral[0], // #FFFFFF - Pure white for cards
  },

  // Text colors - Stone scale
  text: {
    primary: neutral[900], // #1C1917 - Almost black (warm)
    secondary: neutral[600], // #57534E - Secondary text
    disabled: neutral[400], // #A8A29E - Disabled text
  },

  // Dividers and borders - warm tint
  divider: neutral[200], // #E7E5E4

  // Action states
  action: {
    active: neutral[900],
    hover: `rgba(120, 53, 15, 0.04)`, // Amber-tinted hover
    selected: `rgba(120, 53, 15, 0.08)`, // Amber-tinted selection
    disabled: neutral[400],
    disabledBackground: `rgba(120, 53, 15, 0.12)`,
    focus: `rgba(245, 158, 11, 0.12)`, // Primary amber focus
  },
};

/**
 * Extended palette colors for light theme
 * Use with theme.palette.accent, theme.palette.neutral, etc.
 */
export const lightExtendedPalette = {
  // Accent color - Rose
  accent: {
    main: accent.main, // #F43F5E
    light: accent.light, // #FB7185
    dark: accent.dark, // #E11D48
    contrastText: accent.contrastText,
  },

  // Stone neutral scale
  neutral: {
    0: neutral[0],
    50: neutral[50],
    100: neutral[100],
    200: neutral[200],
    300: neutral[300],
    400: neutral[400],
    500: neutral[500],
    600: neutral[600],
    700: neutral[700],
    800: neutral[800],
    850: neutral[850],
    900: neutral[900],
    950: neutral[950],
    1000: neutral[1000],
  },

  // Surface elevation levels (light uses shadows, not color)
  surface: {
    level0: neutral[50], // #FAFAF9 - Base background
    level1: neutral[0], // #FFFFFF - Cards
    level2: neutral[0], // #FFFFFF - Elevated cards
    level3: neutral[0], // #FFFFFF - Modals
    level4: neutral[0], // #FFFFFF - Highest elevation
  },

  // Brand gradients
  gradient: {
    primary: gradients.brand, // Amber → Lavender
    cta: gradients.cta, // Amber gradient
    hero: gradients.hero, // Amber → Rose
    blob: gradients.blob, // For GlowCTA background
  },

  // Glow effects for light mode
  glow: {
    amber: gradients.glowAmber,
    purple: gradients.glowPurple,
  },
};

export default lightPalette;
