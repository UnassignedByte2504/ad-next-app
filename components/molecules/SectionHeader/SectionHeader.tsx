"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@atoms/Button";
import { springs, durations, easings, primary } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface SectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Optional action button text */
  actionText?: string;
  /** Optional action button href */
  actionHref?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Content alignment */
  align?: "left" | "center" | "right";
  /** Show divider line */
  showDivider?: boolean;
  /** Animate on scroll into view */
  animate?: boolean;
  /** Custom action element */
  action?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Click handler for action */
  onActionClick?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const sizeStyles = {
  sm: {
    titleVariant: "h6" as const,
    titleSize: { xs: "1rem", md: "1.125rem" },
    subtitleSize: { xs: "0.75rem", md: "0.875rem" },
    gap: 0.5,
    mb: 2,
  },
  md: {
    titleVariant: "h5" as const,
    titleSize: { xs: "1.25rem", md: "1.5rem" },
    subtitleSize: { xs: "0.875rem", md: "1rem" },
    gap: 1,
    mb: 3,
  },
  lg: {
    titleVariant: "h4" as const,
    titleSize: { xs: "1.5rem", md: "2rem" },
    subtitleSize: { xs: "1rem", md: "1.125rem" },
    gap: 1.5,
    mb: 4,
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
 * SectionHeader - Title and optional subtitle for content sections.
 *
 * Features:
 * - Multiple size variants
 * - Optional "View all" action link
 * - Animated entrance
 * - Flexible alignment
 *
 * @example
 * ```tsx
 * // Basic usage
 * <SectionHeader title="Conciertos en tu zona" />
 *
 * // With subtitle and action
 * <SectionHeader
 *   title="Contacta con músicos"
 *   subtitle="Encuentra colaboradores cerca de ti"
 *   actionText="Ver todos"
 *   actionHref="/musicians"
 * />
 *
 * // Large centered header
 * <SectionHeader
 *   title="Descubre tu próxima banda"
 *   size="lg"
 *   align="center"
 * />
 * ```
 */
export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      title,
      subtitle,
      actionText,
      actionHref,
      size = "md",
      align = "left",
      showDivider = false,
      animate = true,
      action,
      className,
      onActionClick,
    },
    ref
  ) => {
    const styles = sizeStyles[size];
    const hasAction = action || (actionText && (actionHref || onActionClick));

    const content = (
      <Box
        ref={ref}
        className={className}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: hasAction ? "row" : "column" },
          justifyContent: "space-between",
          alignItems: { xs: alignMap[align], sm: hasAction ? "center" : alignMap[align] },
          gap: { xs: 2, sm: hasAction ? 3 : styles.gap },
          mb: styles.mb,
          textAlign: { xs: align, sm: hasAction ? "left" : align },
        }}
      >
        {/* Title & Subtitle */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: styles.gap,
            alignItems: { xs: alignMap[align], sm: hasAction ? "flex-start" : alignMap[align] },
          }}
        >
          <Typography
            variant={styles.titleVariant}
            sx={{
              fontWeight: 700,
              fontSize: styles.titleSize,
              color: "text.primary",
              position: "relative",
              ...(showDivider && {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: align === "center" ? "50%" : 0,
                  transform: align === "center" ? "translateX(-50%)" : "none",
                  width: 40,
                  height: 3,
                  bgcolor: primary.main,
                  borderRadius: 1.5,
                },
              }),
            }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                fontSize: styles.subtitleSize,
                color: "text.secondary",
                maxWidth: "600px",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action */}
        {hasAction && (
          <Box sx={{ flexShrink: 0 }}>
            {action || (
              <Button
                variant="text"
                size="small"
                href={actionHref}
                onClick={onActionClick}
                sx={{
                  color: primary.main,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: `${primary.main}0D`,
                  },
                  transition: `all ${durations.fast}ms ${easings.default}`,
                }}
              >
                {actionText}
              </Button>
            )}
          </Box>
        )}
      </Box>
    );

    if (animate) {
      return (
        <MotionBox
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={springs.smooth}
        >
          {content}
        </MotionBox>
      );
    }

    return content;
  }
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
