/**
 * Ayla Designs Dark Theme Palette
 *
 * Dark mode uses warm Stone neutrals (#0C0A09) instead of true black
 * to reduce eye strain and maintain the bohemian warmth.
 *
 * Colors are slightly lighter/more vibrant than light mode for
 * better visibility on dark backgrounds.
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
 * Dark theme palette configuration
 * Optimized for OLED screens, reduced eye strain, and warm aesthetics
 */
export const darkPalette: PaletteOptions = {
  mode: "dark",

  // Brand colors - slightly lighter for dark mode visibility
  primary: {
    main: primary[400], // #FBBF24 - Lighter amber for visibility
    light: primary[300], // #FCD34D
    dark: primary.main, // #F59E0B
    contrastText: primary[900], // #78350F
  },

  secondary: {
    main: secondary[400], // #C084FC - Lighter lavender
    light: secondary[300], // #D8B4FE
    dark: secondary.main, // #A855F7
    contrastText: neutral[900], // Dark text on light lavender
  },

  // Semantic colors - slightly lighter for dark backgrounds
  error: {
    main: semantic.error.light, // #F87171
    light: "#FCA5A5",
    dark: semantic.error.main,
    contrastText: neutral[900],
  },

  warning: {
    main: semantic.warning.light, // #FBBF24
    light: primary[300],
    dark: semantic.warning.main,
    contrastText: semantic.warning.contrastText,
  },

  info: {
    main: semantic.info.light, // #60A5FA
    light: "#93C5FD",
    dark: semantic.info.main,
    contrastText: neutral[900],
  },

  success: {
    main: semantic.success.light, // #34D399
    light: "#6EE7B7",
    dark: semantic.success.main,
    contrastText: neutral[900],
  },

  // Backgrounds - warm Stone dark colors
  background: {
    default: neutral[950], // #0C0A09 - Main background (warm black)
    paper: neutral[900], // #1C1917 - Cards, surfaces
  },

  // Text colors - Stone light scale
  text: {
    primary: neutral[100], // #F5F5F4 - Main text
    secondary: neutral[400], // #A8A29E - Secondary text
    disabled: neutral[600], // #57534E - Disabled text
  },

  // Dividers and borders - subtle warm tint
  divider: neutral[800], // #292524

  // Action states
  action: {
    active: neutral[100],
    hover: `rgba(245, 158, 11, 0.08)`, // Amber-tinted hover
    selected: `rgba(245, 158, 11, 0.16)`, // Amber-tinted selection
    disabled: neutral[600],
    disabledBackground: `rgba(245, 158, 11, 0.12)`,
    focus: `rgba(245, 158, 11, 0.24)`, // Primary amber focus (stronger in dark)
  },
};

/**
 * Extended palette colors for dark theme
 * Use with theme.palette.accent, theme.palette.neutral, etc.
 */
export const darkExtendedPalette = {
  // Accent color - Rose (lighter for dark mode)
  accent: {
    main: accent[400], // #FB7185 - Lighter rose
    light: accent[300], // #FDA4AF
    dark: accent.main, // #F43F5E
    contrastText: neutral[900],
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

  // Surface elevation levels (M3 style - lighter surfaces at higher elevation)
  surface: {
    level0: neutral[950], // #0C0A09 - Base background
    level1: neutral[900], // #1C1917 - +1dp (cards)
    level2: neutral[850], // #1C1917 - +2dp (elevated cards)
    level3: neutral[800], // #292524 - +3dp (modals)
    level4: neutral[700], // #44403C - +4dp (highest elevation)
  },

  // Brand gradients
  gradient: {
    primary: gradients.brand, // Amber → Lavender
    cta: gradients.cta, // Amber gradient
    hero: gradients.hero, // Amber → Rose
    blob: gradients.blob, // For GlowCTA background
  },

  // Glow effects for dark mode (stronger opacity)
  glow: {
    amber: gradients.glowAmberDark,
    purple: gradients.glowPurpleDark,
  },
};

export default darkPalette;
