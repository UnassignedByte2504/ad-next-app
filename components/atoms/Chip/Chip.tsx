"use client";

import MuiChip, { ChipProps as MuiChipProps } from "@mui/material/Chip";
import { forwardRef } from "react";
import { fontFamilies, neutral, primary, springs } from "@/app/ui/theme";

export interface ChipProps extends Omit<MuiChipProps, "color"> {
  /** Texto del chip */
  label: string;
  /** Variante del chip */
  variant?: "filled" | "outlined";
  /** Color del chip */
  color?: "default" | "primary" | "secondary" | "error" | "warning" | "info" | "success";
  /** Tamaño del chip */
  size?: "small" | "medium";
  /** Icono al inicio */
  icon?: React.ReactElement;
  /** Avatar al inicio */
  avatar?: React.ReactElement;
  /** Si es clickeable */
  clickable?: boolean;
  /** Si es seleccionable (toggle) */
  selected?: boolean;
  /** Callback al eliminar */
  onDelete?: () => void;
}

/**
 * Chip - Ayla Designs' elegant tag/label component.
 *
 * Used for categories, tags, filters, and status indicators.
 * Features pill shape (9999px border radius) per Ayla branding.
 *
 * @example
 * ```tsx
 * // Basic category chip
 * <Chip label="Planners" />
 *
 * // With category color
 * <Chip
 *   label="Bodas"
 *   sx={{ bgcolor: `${categoryColors.Bodas}4D` }}
 * />
 * ```
 */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      label,
      variant = "filled",
      color = "default",
      size = "medium",
      icon,
      avatar,
      clickable = false,
      selected = false,
      onDelete,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiChip
        ref={ref}
        label={label}
        variant={selected ? "filled" : variant}
        color={selected ? "primary" : color}
        size={size}
        icon={icon}
        avatar={avatar}
        clickable={clickable}
        onDelete={onDelete}
        className={className}
        sx={{
          // Ayla pill shape
          borderRadius: "9999px",
          // Nunito Sans font
          fontFamily: fontFamilies.body,
          fontWeight: 500,
          // Transitions
          transition: `all ${springs.snappy.duration}s ${springs.snappy.ease || "ease-out"}`,
          // Default styling for unfilled
          ...(color === "default" && variant === "filled" && {
            bgcolor: neutral[200],
            color: neutral[700],
            "&:hover": {
              bgcolor: neutral[300],
            },
          }),
          // Outlined default uses stone border
          ...(color === "default" && variant === "outlined" && {
            borderColor: neutral[300],
            color: neutral[700],
            "&:hover": {
              bgcolor: neutral[100],
              borderColor: neutral[400],
            },
          }),
          // Hover scale for clickable
          ...(clickable && {
            "&:hover": {
              transform: "scale(1.03)",
            },
          }),
          // Selected state uses amber
          ...(selected && {
            bgcolor: primary.main,
            color: primary.dark,
            "&:hover": {
              bgcolor: primary.light,
            },
          }),
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";
