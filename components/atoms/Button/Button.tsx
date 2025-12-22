"use client";

import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { forwardRef } from "react";

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
 * Botón base de Bemyre.
 * Extiende el botón de MUI con estado de carga y estilos personalizados.
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
      ...props
    },
    ref
  ) => {
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
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

Button.displayName = "Button";
