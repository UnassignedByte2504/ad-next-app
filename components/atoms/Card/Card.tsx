"use client";

import { forwardRef, type ReactNode } from "react";
import MuiCard, { type CardProps as MuiCardProps } from "@mui/material/Card";
import { motion } from "framer-motion";
import { springs, shapes, durations, easings, shadows } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardSize = "sm" | "md" | "lg";

export interface CardProps extends Omit<MuiCardProps, "variant"> {
  /** Visual variant */
  variant?: CardVariant;
  /** Size preset affecting padding */
  size?: CardSize;
  /** Enable hover animations (M3 Expressive) */
  interactive?: boolean;
  /** Disable all animations */
  disableAnimation?: boolean;
  /** Custom border radius override */
  borderRadius?: keyof typeof shapes | number;
  /** Card content */
  children: ReactNode;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const variantStyles: Record<
  CardVariant,
  {
    elevation: number;
    border: string;
    background: string;
  }
> = {
  elevated: {
    elevation: 2,
    border: "none",
    background: "var(--mui-palette-background-paper)",
  },
  outlined: {
    elevation: 0,
    border: "1px solid var(--mui-palette-divider)",
    background: "transparent",
  },
  filled: {
    elevation: 0,
    border: "none",
    background: "var(--mui-palette-action-hover)",
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Card - Ayla Designs' elegant card component with M3 Expressive features.
 *
 * Wraps MUI Card with:
 * - Spring animations on hover/tap
 * - Shape morphing support
 * - Multiple visual variants
 * - Amber-tinted shadows (Ayla branding)
 *
 * @example
 * ```tsx
 * // Interactive product card
 * <Card variant="elevated" interactive>
 *   <CardContent>Bohemian Planner Kit</CardContent>
 * </Card>
 *
 * // Static outlined card
 * <Card variant="outlined" size="lg">
 *   <CardContent>Order Summary</CardContent>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "elevated",
      interactive = false,
      disableAnimation = false,
      borderRadius = "lg",
      children,
      className,
      sx,
      onClick,
      ...props
    },
    ref
  ) => {
    // Resolve border radius
    const resolvedRadius =
      typeof borderRadius === "number" ? borderRadius : shapes[borderRadius];

    // Get variant styles
    const variantStyle = variantStyles[variant];

    // For interactive cards, wrap in motion div
    if (interactive && !disableAnimation) {
      return (
        <motion.div
          ref={ref}
          className={className}
          onClick={onClick}
          whileHover={{
            scale: 1.01,
            y: -2,
          }}
          whileTap={{ scale: 0.99 }}
          transition={springs.smooth}
          style={{
            borderRadius: `${resolvedRadius}px`,
            border: variantStyle.border,
            background: variant === "elevated" ? "#FFFFFF" : variantStyle.background,
            overflow: "hidden",
            cursor: "pointer",
            // Amber-tinted shadow for Ayla branding
            boxShadow:
              variant === "elevated"
                ? shadows.md
                : "none",
          }}
        >
          {children}
        </motion.div>
      );
    }

    // Non-interactive card uses MUI Card directly
    return (
      <MuiCard
        ref={ref}
        elevation={variantStyle.elevation}
        className={className}
        onClick={onClick}
        sx={{
          borderRadius: `${resolvedRadius}px`,
          border: variantStyle.border,
          background: variantStyle.background,
          overflow: "hidden",
          cursor: onClick ? "pointer" : "default",
          transition: `box-shadow ${durations.fast}ms ${easings.default}`,
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiCard>
    );
  }
);

Card.displayName = "Card";

export default Card;
