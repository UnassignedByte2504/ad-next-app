/**
 * Ayla Designs Design Tokens
 *
 * Centralized export of all design tokens for consistent styling
 * across the application.
 *
 * @see docs/branding/CORPORATE_IDENTITY.md
 */

// =============================================================================
// COLORS
// =============================================================================

export {
  // Brand colors
  primary,
  secondary,
  accent,
  neutral,
  semantic,
  // Category & product colors
  categoryColors,
  categoryGradients,
  avatarColors,
  // Gradients & shadows
  gradients,
  shadows,
  // Legacy aliases (deprecated - use categoryColors)
  genreColors,
  instrumentColors,
} from "./colors";

export type {
  PrimaryColor,
  SecondaryColor,
  AccentColor,
  NeutralColor,
  SemanticColors,
  CategoryColors,
  AvatarColors,
} from "./colors";

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  typographyVariants,
} from "./typography";

export type {
  FontFamily,
  FontWeight,
  FontSize,
  LineHeight,
  LetterSpacing,
} from "./typography";

// =============================================================================
// MOTION (M3 Expressive)
// =============================================================================

export {
  // Animation physics
  springs,
  durations,
  easings,
  // Framer Motion variants
  variants,
  interactiveStates,
  // Shape morphing
  shapes,
  buttonShapeMorph,
  chipShapeMorph,
  // Accessibility
  reducedMotion,
} from "./motion";

export type { SpringConfig, Duration, Easing, Shape } from "./motion";

// =============================================================================
// Z-INDEX
// =============================================================================

export { zIndex } from "./z-index";

export type { ZIndex } from "./z-index";
