"use client";

import { forwardRef, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion, useReducedMotion } from "framer-motion";

import {
  springs,
  shapes,
  neutral,
  primary,
  durations,
  easings,
} from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface FeatureCardProps {
  /** Icon to display */
  icon: ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Icon color (MUI palette color) */
  iconColor?: "primary" | "secondary" | "info" | "success" | "warning" | "error";
  /** Visual variant */
  variant?: "elevated" | "outlined" | "filled";
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const variantStyles = {
  elevated: {
    bgcolor: "background.paper",
    border: "none",
    borderColor: "transparent",
    boxShadow: `0 4px 20px ${primary[500]}0D`,
    hoverShadow: `0 12px 32px ${primary[500]}1A`,
  },
  outlined: {
    bgcolor: "transparent",
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "none",
    hoverShadow: `0 8px 24px ${primary[500]}0D`,
  },
  filled: {
    bgcolor: "action.hover",
    border: "none",
    borderColor: "transparent",
    boxShadow: "none",
    hoverShadow: `0 4px 16px ${primary[500]}0D`,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * FeatureCard - Displays a feature with icon, title and description.
 *
 * Features:
 * - M3 Expressive spring animations
 * - Subtle hover lift effect
 * - Accessible focus states
 * - Reduced motion support
 *
 * Used for value propositions, feature highlights, and service descriptions.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={<DownloadIcon />}
 *   title="Instant Download"
 *   description="Get your files immediately after purchase."
 *   iconColor="primary"
 * />
 * ```
 */
export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      icon,
      title,
      description,
      iconColor = "primary",
      variant = "elevated",
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const styles = variantStyles[variant];

    // Animation variants
    const cardVariants = {
      hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
      visible: { opacity: 1, y: 0 },
      hover: { y: prefersReducedMotion ? 0 : -6, scale: 1.01 },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, margin: "-50px" }}
        variants={cardVariants}
        transition={springs.gentle}
        style={{ height: "100%" }}
      >
        <Box
          tabIndex={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: `${shapes.lg}px`,
            bgcolor: styles.bgcolor,
            border: styles.border,
            borderColor: styles.borderColor,
            textAlign: "center",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: styles.boxShadow,
            transition: `box-shadow ${durations.normal}ms ${easings.default}`,
            cursor: "default",
            "&:hover": {
              boxShadow: styles.hoverShadow,
            },
            // Accessible focus ring
            "&:focus-visible": {
              outline: `2px solid`,
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          {/* Icon container with subtle animation */}
          <Box
            component={motion.div}
            whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 3 }}
            transition={springs.smooth}
            sx={{
              color: `${iconColor}.main`,
              fontSize: "3rem",
              mb: 2.5,
              p: 1.5,
              borderRadius: `${shapes.xl}px`,
              bgcolor: `${iconColor}.main`,
              // Use CSS custom property for alpha
              background: `color-mix(in srgb, var(--mui-palette-${iconColor}-main) 12%, transparent)`,
              "& svg": {
                fontSize: "inherit",
                display: "block",
              },
            }}
          >
            {icon}
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              mb: 1.5,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
              maxWidth: "32ch",
            }}
          >
            {description}
          </Typography>
        </Box>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export default FeatureCard;
