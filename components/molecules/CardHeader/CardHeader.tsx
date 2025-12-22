"use client";

import { forwardRef, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// =============================================================================
// TYPES
// =============================================================================

export interface CardHeaderProps {
  /** Avatar element (e.g., <Avatar />) */
  avatar?: ReactNode;
  /** Main title */
  title: ReactNode;
  /** Optional subtitle */
  subtitle?: ReactNode;
  /** Action element (e.g., IconButton, menu) */
  action?: ReactNode;
  /** Badge/chip to show next to title */
  badge?: ReactNode;
  /** Alignment of content */
  align?: "left" | "center";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const sizeConfig = {
  sm: {
    gap: 2,
    titleVariant: "subtitle2" as const,
    subtitleVariant: "caption" as const,
  },
  md: {
    gap: 3,
    titleVariant: "subtitle1" as const,
    subtitleVariant: "body2" as const,
  },
  lg: {
    gap: 4,
    titleVariant: "h6" as const,
    subtitleVariant: "body2" as const,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CardHeader - Header section for cards
 *
 * Combines avatar, title, subtitle, and action into a consistent header layout.
 *
 * @example
 * ```tsx
 * <CardHeader
 *   avatar={<Avatar src="/user.jpg" />}
 *   title="Pablo Toribio"
 *   subtitle="Madrid, España"
 *   action={<FavoriteButton />}
 * />
 * ```
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      avatar,
      title,
      subtitle,
      action,
      badge,
      align = "left",
      size = "md",
      className,
    },
    ref
  ) => {
    const config = sizeConfig[size];

    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: config.gap,
          justifyContent: align === "center" ? "center" : "flex-start",
          textAlign: align,
        }}
      >
        {/* Avatar */}
        {avatar && <Box sx={{ flexShrink: 0 }}>{avatar}</Box>}

        {/* Title & Subtitle */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0, // Enable text truncation
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant={config.titleVariant}
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>
            {badge}
          </Box>
          {subtitle && (
            <Typography
              variant={config.subtitleVariant}
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action */}
        {action && <Box sx={{ flexShrink: 0, ml: "auto" }}>{action}</Box>}
      </Box>
    );
  }
);

CardHeader.displayName = "CardHeader";

export default CardHeader;
