"use client";

import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { forwardRef } from "react";

import { avatarColors, semantic, neutral, shadows, durations } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

/** Gradient color options for Ayla avatars */
export type AvatarGradientColor = "gold" | "lavender" | "rose" | "sage" | "sand";

export interface AvatarProps extends Omit<MuiAvatarProps, "variant"> {
  /** URL de la imagen */
  src?: string;
  /** Texto alternativo */
  alt?: string;
  /** Tamaño del avatar */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Variante de forma */
  variant?: "circular" | "rounded" | "square";
  /** Mostrar indicador de online */
  online?: boolean;
  /** Color de fondo para iniciales (solid color) */
  bgColor?: string;
  /** Gradient color for Ayla-style avatars */
  gradientColor?: AvatarGradientColor;
  /** Iniciales a mostrar si no hay imagen */
  initials?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Avatar de usuario.
 * Muestra imagen de perfil, iniciales o indicador de online.
 *
 * ## Features
 * - **Multiple sizes**: xs, sm, md, lg, xl
 * - **Gradient backgrounds**: Ayla-style gradients (gold, lavender, rose)
 * - **Online indicator**: Badge with ripple animation
 * - **Shape variants**: circular, rounded, square
 *
 * ## Usage
 * ```tsx
 * // With image
 * <Avatar src="/user.jpg" alt="User" size="lg" />
 *
 * // With gradient initials (Ayla style)
 * <Avatar initials="MG" gradientColor="gold" size="md" />
 *
 * // With online indicator
 * <Avatar src="/user.jpg" online size="md" />
 * ```
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      size = "md",
      variant = "circular",
      online,
      bgColor,
      gradientColor,
      initials,
      sx,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const dimension = sizeMap[size];

    // Determine background style
    const getBackgroundStyle = () => {
      if (gradientColor && avatarColors[gradientColor]) {
        const gradient = avatarColors[gradientColor];
        return {
          background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})`,
        };
      }
      if (bgColor) {
        return { bgcolor: bgColor };
      }
      return {};
    };

    const avatar = (
      <MuiAvatar
        ref={ref}
        src={src}
        alt={alt}
        variant={variant}
        sx={{
          width: dimension,
          height: dimension,
          fontSize: dimension * 0.4,
          fontWeight: 600,
          color: neutral[0], // Use theme token instead of hardcoded #FFFFFF
          boxShadow: gradientColor ? shadows.md : undefined, // Use amber-tinted shadow from theme
          ...getBackgroundStyle(),
          ...sx,
        }}
        className={className}
        {...props}
      >
        {!src && (initials || children)}
      </MuiAvatar>
    );

    if (online !== undefined) {
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: online ? semantic.success.main : neutral[400], // Use theme tokens
              color: online ? semantic.success.main : neutral[400],
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
              "&::after": {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: online ? `ripple ${durations.slower + 200}ms infinite ease-in-out` : "none",
                border: "1px solid currentColor",
                content: '""',
              },
            },
            "@keyframes ripple": {
              "0%": {
                transform: "scale(.8)",
                opacity: 1,
              },
              "100%": {
                transform: "scale(2.4)",
                opacity: 0,
              },
            },
          }}
        >
          {avatar}
        </Badge>
      );
    }

    return avatar;
  }
);

Avatar.displayName = "Avatar";
export default Avatar;
