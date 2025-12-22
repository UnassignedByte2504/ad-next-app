"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { motion } from "framer-motion";

import { Button } from "@atoms/Button";
import { springs, durations, easings, primary, secondary, neutral, gradients } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface CallToActionProps {
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** Primary button text */
  primaryText?: string;
  /** Primary button href */
  primaryHref?: string;
  /** Secondary button text */
  secondaryText?: string;
  /** Secondary button href */
  secondaryHref?: string;
  /** Visual variant */
  variant?: "primary" | "secondary" | "gradient" | "outline" | "subtle";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Content alignment */
  align?: "left" | "center" | "right";
  /** Full width (uses Container) */
  fullWidth?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Primary button click handler */
  onPrimaryClick?: () => void;
  /** Secondary button click handler */
  onSecondaryClick?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const variantStyles = {
  primary: {
    bgcolor: primary.main,
    color: "common.white",
    buttonVariant: "contained" as const,
    useCustomButtonStyle: true,
  },
  secondary: {
    bgcolor: secondary.main,
    color: neutral[950],
    buttonVariant: "contained" as const,
    useCustomButtonStyle: true,
  },
  gradient: {
    background: gradients.brand,
    color: "common.white",
    buttonVariant: "contained" as const,
    useCustomButtonStyle: true,
  },
  outline: {
    bgcolor: "transparent",
    border: `2px solid ${primary.main}`,
    color: "text.primary",
    buttonVariant: "contained" as const,
    useCustomButtonStyle: false,
  },
  subtle: {
    bgcolor: `${primary.main}0D`, // 5% opacity
    color: "text.primary",
    buttonVariant: "contained" as const,
    useCustomButtonStyle: false,
  },
};

const sizeStyles = {
  sm: {
    py: { xs: 3, md: 4 },
    titleSize: { xs: "1.125rem", md: "1.25rem" },
    descSize: { xs: "0.875rem", md: "0.875rem" },
    gap: 2,
  },
  md: {
    py: { xs: 4, md: 6 },
    titleSize: { xs: "1.25rem", md: "1.5rem" },
    descSize: { xs: "0.875rem", md: "1rem" },
    gap: 2.5,
  },
  lg: {
    py: { xs: 6, md: 8 },
    titleSize: { xs: "1.5rem", md: "2rem" },
    descSize: { xs: "1rem", md: "1.125rem" },
    gap: 3,
  },
};

const alignMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CallToAction - Promotional banner with title, description, and action buttons.
 *
 * Features:
 * - Multiple visual variants (primary, secondary, gradient, outline, subtle)
 * - Size variants for different contexts
 * - Animated entrance
 * - Flexible alignment options
 *
 * @example
 * ```tsx
 * // Primary CTA banner
 * <CallToAction
 *   title="¿Eres músico?"
 *   description="Crea tu perfil y conecta con bandas"
 *   primaryText="Crear perfil"
 *   primaryHref="/signup"
 *   variant="gradient"
 * />
 *
 * // Subtle CTA in a section
 * <CallToAction
 *   title="Únete a la comunidad"
 *   primaryText="Registrarse"
 *   variant="subtle"
 *   size="sm"
 * />
 * ```
 */
export const CallToAction = forwardRef<HTMLDivElement, CallToActionProps>(
  (
    {
      title,
      description,
      primaryText,
      primaryHref,
      secondaryText,
      secondaryHref,
      variant = "primary",
      size = "md",
      align = "center",
      fullWidth = true,
      className,
      onPrimaryClick,
      onSecondaryClick,
    },
    ref
  ) => {
    const styles = variantStyles[variant];
    const sizes = sizeStyles[size];
    const hasPrimary = primaryText && (primaryHref || onPrimaryClick);
    const hasSecondary = secondaryText && (secondaryHref || onSecondaryClick);

    const content = (
      <MotionBox
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={springs.smooth}
        className={className}
        sx={{
          ...styles,
          py: sizes.py,
          px: { xs: 3, md: 4 },
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: alignMap[align],
          textAlign: align,
          gap: sizes.gap,
          transition: `all ${durations.normal}ms ${easings.default}`,
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: sizes.titleSize,
            color: "inherit",
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            variant="body1"
            sx={{
              fontSize: sizes.descSize,
              color: "inherit",
              opacity: 0.9,
              maxWidth: "600px",
            }}
          >
            {description}
          </Typography>
        )}

        {/* Buttons */}
        {(hasPrimary || hasSecondary) && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mt: 1,
            }}
          >
            {hasPrimary && (
              <Button
                variant={styles.buttonVariant}
                color={styles.useCustomButtonStyle ? undefined : "primary"}
                href={primaryHref}
                onClick={onPrimaryClick}
                sx={{
                  ...(styles.useCustomButtonStyle && {
                    bgcolor: "common.white",
                    color: variant === "secondary" ? secondary.dark : primary.main,
                    "&:hover": {
                      bgcolor: neutral[100],
                    },
                  }),
                }}
              >
                {primaryText}
              </Button>
            )}
            {hasSecondary && (
              <Button
                variant="outlined"
                href={secondaryHref}
                onClick={onSecondaryClick}
                sx={{
                  ...(styles.useCustomButtonStyle && {
                    borderColor: "common.white",
                    color: "common.white",
                    "&:hover": {
                      borderColor: "common.white",
                      bgcolor: `${neutral[50]}1A`,
                    },
                  }),
                }}
              >
                {secondaryText}
              </Button>
            )}
          </Box>
        )}
      </MotionBox>
    );

    if (fullWidth) {
      return <Container maxWidth="lg">{content}</Container>;
    }

    return content;
  }
);

CallToAction.displayName = "CallToAction";

export default CallToAction;
