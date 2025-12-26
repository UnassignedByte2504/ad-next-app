"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { cn } from "@utils";

export interface LogoProps {
  /** Tamano del logo */
  size?: "sm" | "md" | "lg";
  /** Variante del logo: 'short' = "Ayla.", 'full' = "Ayla.Designs" */
  variant?: "short" | "full";
  /** URL a la que enlaza el logo (opcional) */
  linkTo?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Color del texto principal (hereda del tema por defecto) */
  textColor?: string;
  /** data-testid para testing */
  "data-testid"?: string;
}

/**
 * Logo de Ayla Designs.
 *
 * Componente tipografico que muestra el logo de la marca.
 * - Variante "short": "Ayla." (para navbar)
 * - Variante "full": "Ayla.Designs" (para footer)
 *
 * El punto siempre se muestra en el color primario (amber).
 * Usa Cormorant Garamond como tipografia.
 */
export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      size = "md",
      variant = "short",
      linkTo,
      className,
      textColor,
      "data-testid": testId = "logo",
    },
    ref
  ) => {
    const theme = useTheme();

    // Tamanos de fuente segun el size
    const fontSizes = {
      sm: "1.25rem", // 20px
      md: "1.5rem", // 24px
      lg: "2rem", // 32px
    };

    const fontSize = fontSizes[size];

    // Color del punto (siempre primary/amber)
    const dotColor = theme.palette.primary.main;

    // Color del texto (usa el color del tema o el proporcionado)
    const mainTextColor = textColor || theme.palette.text.primary;

    // Componente del logo
    const logoContent = (
      <div
        ref={ref}
        className={cn("inline-flex items-center", className)}
        data-testid={testId}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: mainTextColor }}>Ayla</span>
        <span style={{ color: dotColor }}>.</span>
        {variant === "full" && (
          <span style={{ color: mainTextColor }}>Designs</span>
        )}
      </div>
    );

    // Si hay un enlace, envolver en Link
    if (linkTo) {
      return (
        <Link
          href={linkTo}
          className="inline-flex no-underline hover:opacity-80 transition-opacity"
        >
          {logoContent}
        </Link>
      );
    }

    return logoContent;
  }
);

Logo.displayName = "Logo";
