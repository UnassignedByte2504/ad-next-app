"use client";

import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { forwardRef } from "react";
import { shadows } from "@/app/ui/theme";

export interface ButtonProps extends Omit<MuiButtonProps, "color"> {
  /** Variante del botón */
  variant?: "contained" | "outlined" | "text";
  /** Color del botón */
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  /** Tamaño del botón */
  size?: "small" | "medium" | "large";
  /** Estado de carga */
  loading?: boolean;
  /** Icono al inicio */
  startIcon?: React.ReactNode;
  /** Icono al final */
  endIcon?: React.ReactNode;
  /** Ancho completo */
  fullWidth?: boolean;
}

/**
 * Botón base de Ayla Designs.
 * Extiende el botón de MUI con:
 * - Pill shape (border-radius full)
 * - Amber-tinted shadows para variante contained
 * - Estado de carga con spinner
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "contained",
      color = "primary",
      size = "medium",
      loading = false,
      disabled,
      startIcon,
      endIcon,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const isContained = variant === "contained";
    const isPrimary = color === "primary";

    return (
      <MuiButton
        ref={ref}
        variant={variant}
        color={color}
        size={size}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
        endIcon={endIcon}
        className={className}
        sx={{
          // Pill shape - Ayla Design System
          borderRadius: "9999px",
          // Amber-tinted shadow for primary contained buttons
          ...(isContained &&
            isPrimary && {
              boxShadow: shadows.ctaGlow,
              "&:hover": {
                boxShadow: shadows.ctaGlowHover,
              },
            }),
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = "Button";
