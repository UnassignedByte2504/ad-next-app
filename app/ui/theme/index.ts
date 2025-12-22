/**
 * Ayla Designs Theme System
 *
 * Modular theme architecture for MUI 7 with support for:
 * - Light and dark color schemes (light is default)
 * - CSS variables for runtime theme switching
 * - Custom design tokens (colors, typography, spacing)
 * - Branded component overrides
 * - Bohemian aesthetic with amber warmth and lavender magic
 *
 * @example
 * ```tsx
 * import { theme } from '@/app/ui/theme';
 * import { ThemeProvider } from '@mui/material/styles';
 *
 * <ThemeProvider theme={theme}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @see docs/branding/CORPORATE_IDENTITY.md
 */

"use client";

import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { darkPalette, darkExtendedPalette } from "./dark";
import { lightPalette, lightExtendedPalette } from "./light";
import { componentOverrides } from "./components";
import { typographyVariants, fontFamilies } from "./tokens/typography";
import { primary } from "./tokens/colors";

// =============================================================================
// THEME OPTIONS
// =============================================================================

const themeOptions: ThemeOptions = {
  // CSS Variables for runtime theme switching
  cssVariables: {
    colorSchemeSelector: "class",
  },

  // Color schemes
  colorSchemes: {
    light: {
      palette: lightPalette,
    },
    dark: {
      palette: darkPalette,
    },
  },

  // Default to light mode (Ayla's warm bohemian aesthetic)
  defaultColorScheme: "light",

  // Typography
  typography: {
    fontFamily: fontFamilies.body,
    ...typographyVariants,
  },

  // Shape - slightly larger radius for softer bohemian feel
  shape: {
    borderRadius: 12,
  },

  // Spacing (default: 8px base)
  spacing: 8,

  // Breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  // Z-index scale
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  // Component overrides
  components: componentOverrides,
};

// =============================================================================
// THEME INSTANCE
// =============================================================================

/**
 * Main theme instance for Ayla Designs
 *
 * Includes:
 * - Light (default) and dark color schemes
 * - Custom typography (Cormorant Garamond + Nunito Sans)
 * - Branded component overrides
 * - CSS variables support
 * - Amber primary, Lavender secondary, Rose accent
 */
export const theme = createTheme(themeOptions);

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Get extended palette for current mode
 * Includes accent colors, neutral scale, surface levels, gradients, and glows
 */
export const getExtendedPalette = (mode: "light" | "dark") => {
  return mode === "dark" ? darkExtendedPalette : lightExtendedPalette;
};

/**
 * Create a themed shadow with amber brand color tint
 * Used for CTA buttons, cards, and elevated elements
 */
export const createBrandShadow = (
  elevation: 1 | 2 | 3 | 4 = 1,
  mode: "light" | "dark" = "light"
) => {
  // Amber color: #F59E0B → rgb(245, 158, 11)
  const opacity = mode === "dark" ? 0.4 : 0.15;
  const baseOpacity = elevation * 0.05;

  return `0 ${elevation * 2}px ${elevation * 8}px rgba(245, 158, 11, ${baseOpacity + opacity * 0.2})`;
};

/**
 * Create a CTA glow effect (stronger amber shadow)
 */
export const createCtaGlow = (mode: "light" | "dark" = "light") => {
  const opacity = mode === "dark" ? 0.35 : 0.25;
  return `0 4px 14px rgba(245, 158, 11, ${opacity})`;
};

/**
 * Create a hover glow effect (even stronger)
 */
export const createCtaGlowHover = (mode: "light" | "dark" = "light") => {
  const opacity = mode === "dark" ? 0.45 : 0.35;
  return `0 8px 20px rgba(245, 158, 11, ${opacity})`;
};

// =============================================================================
// RE-EXPORTS
// =============================================================================

// Color Tokens
export {
  primary,
  secondary,
  accent,
  neutral,
  semantic,
  categoryColors,
  categoryGradients,
  avatarColors,
  gradients,
  shadows,
} from "./tokens/colors";

// Legacy exports (deprecated)
export { genreColors, instrumentColors } from "./tokens/colors";

// Typography Tokens
export {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
} from "./tokens/typography";

// Motion (M3 Expressive)
export {
  springs,
  durations,
  easings,
  variants,
  interactiveStates,
  shapes,
  buttonShapeMorph,
  chipShapeMorph,
  reducedMotion,
} from "./tokens/motion";

// Palettes
export { darkPalette, darkExtendedPalette } from "./dark";
export { lightPalette, lightExtendedPalette } from "./light";

// Component overrides
export { componentOverrides } from "./components";

// Default export
export default theme;
