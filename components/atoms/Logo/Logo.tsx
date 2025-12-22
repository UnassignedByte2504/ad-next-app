"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@utils";

export interface LogoProps {
  /** Tamaño del logo */
  size?: "sm" | "md" | "lg";
  /** Variante del logo */
  variant?: "full" | "icon";
  /** URL a la que enlaza el logo (opcional) */
  linkTo?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Prioridad de carga de la imagen */
  priority?: boolean;
}

/**
 * Logo de Bemyre.
 * Componente que muestra el logo de la aplicación con diferentes tamaños y variantes.
 * Opcionalmente puede envolver el logo en un enlace.
 */
export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      size = "sm",
      variant = "full", // Reserved for future icon-only variant
      linkTo,
      className,
      priority = false,
    },
    ref
  ) => {
    // Dimensiones según el tamaño
    const dimensions = {
      sm: { width: 50, height: 32 },
      md: { width: 120, height: 48 },
      lg: { width: 160, height: 64 },
    };

    const { width, height } = dimensions[size];

    // Note: variant prop is reserved for future icon-only implementation
    // Currently only 'full' variant is supported
    void variant;

    // Componente de imagen
    const logoImage = (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <Image
          src="/images/Bemyre_logo.png"
          alt="Bemyre"
          width={width}
          height={height}
          priority={priority}
          className="object-contain"
        />
      </div>
    );

    // Si hay un enlace, envolver en Link
    if (linkTo) {
      return (
        <Link
          href={linkTo}
          className="inline-flex no-underline hover:opacity-80 transition-opacity"
        >
          {logoImage}
        </Link>
      );
    }

    return logoImage;
  }
);

Logo.displayName = "Logo";
