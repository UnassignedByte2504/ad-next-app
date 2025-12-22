"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@utils";
import { springs, primary, secondary, neutral } from "@/app/ui/theme";

export interface NavLinkProps {
  /** URL de destino */
  href: string;
  /** Contenido del enlace */
  children: React.ReactNode;
  /** Icono opcional antes del texto */
  icon?: React.ReactNode;
  /** Sobreescribir detección automática de estado activo */
  active?: boolean;
  /** Variante del enlace */
  variant?: "default" | "pill" | "vertical";
  /** Tamaño del enlace */
  size?: "sm" | "md" | "lg";
  /** Clases CSS adicionales */
  className?: string;
  /** Función onClick personalizada */
  onClick?: () => void;
}

/**
 * NavLink - Ayla Designs' elegant navigation link with M3 Expressive design.
 *
 * Características M3 2025:
 * - Pill-shaped active indicator con animación spring
 * - Iconos con transición filled/outlined
 * - Physics-based animations (spring)
 * - Soporte para layout horizontal y vertical
 * - Amber primary color for active states (Ayla branding)
 *
 * @example
 * ```tsx
 * <NavLink href="/shop" icon={<ShoppingBagIcon />}>
 *   Shop
 * </NavLink>
 *
 * <NavLink href="/cart" variant="pill" active>
 *   Cart
 * </NavLink>
 * ```
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      href,
      children,
      icon,
      active: activeProp,
      variant = "default",
      size = "md",
      className,
      onClick,
    },
    ref
  ) => {
    const pathname = usePathname();
    const isActive = activeProp ?? pathname === href;
    const [isHovered, setIsHovered] = useState(false);

    // M3 Expressive spring physics from theme tokens
    const springConfig = springs.smooth;
    const hoverSpring = springs.snappy;

    // Size configurations
    const sizeConfig = {
      sm: {
        padding: "px-3 py-1.5",
        text: "text-xs",
        iconSize: "text-sm",
        gap: "gap-1.5",
      },
      md: {
        padding: "px-4 py-2",
        text: "text-sm",
        iconSize: "text-base",
        gap: "gap-2",
      },
      lg: {
        padding: "px-5 py-2.5",
        text: "text-base",
        iconSize: "text-lg",
        gap: "gap-2.5",
      },
    };

    const currentSize = sizeConfig[size];

    // Base styles shared across variants
    const baseClasses = cn(
      "relative inline-flex items-center font-medium",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "select-none cursor-pointer transition-colors",
      currentSize.gap,
      currentSize.text
    );

    // Get text color based on state (using theme tokens - inline styles for dynamic values)
    const getTextColor = (): string => {
      if (isActive) {
        // Active state: primary brand color (except pill which has white text)
        return variant === "pill" ? neutral[0] : primary.main;
      }
      if (isHovered) {
        // Hover state: warm secondary/amber tint
        return secondary.main;
      }
      // Default state: stone neutral
      return neutral[400];
    };

    // Variant-specific styles (without dynamic Tailwind classes)
    const getVariantClasses = () => {
      switch (variant) {
        case "pill":
          return cn(
            "rounded-full",
            currentSize.padding
          );
        case "vertical":
          return cn(
            "flex-col rounded-2xl w-full",
            "py-3 px-4"
          );
        default:
          return cn(
            "rounded-full",
            currentSize.padding
          );
      }
    };

    // Get hover background for vertical variant
    const getVerticalHoverBg = () => {
      if (variant === "vertical" && !isActive && isHovered) {
        return `${primary.main}0D`; // 5% opacity
      }
      return undefined;
    };

    // Focus ring color using theme token
    const focusRingStyle = {
      "--tw-ring-color": `${primary.main}80`, // 50% opacity
    } as React.CSSProperties;

    // Hover background indicator for non-pill variants
    const HoverIndicator = () => (
      <AnimatePresence>
        {isHovered && !isActive && variant !== "vertical" && (
          <motion.span
            className="absolute inset-0 rounded-full -z-10"
            style={{ backgroundColor: `${primary.main}1A` }} // 10% opacity
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={hoverSpring}
          />
        )}
      </AnimatePresence>
    );

    // Pill indicator component (with hover state for non-active)
    const PillIndicator = () => (
      <>
        {/* Active pill */}
        <AnimatePresence>
          {isActive && (
            <motion.span
              layoutId="navlink-pill-indicator"
              className="absolute inset-0 rounded-full -z-10"
              style={{ backgroundColor: primary.main }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={springConfig}
            />
          )}
        </AnimatePresence>
        {/* Hover pill (subtle amber tint) */}
        <AnimatePresence>
          {!isActive && isHovered && (
            <motion.span
              className="absolute inset-0 rounded-full -z-10"
              style={{ backgroundColor: `${secondary.main}26` }} // 15% opacity
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={hoverSpring}
            />
          )}
        </AnimatePresence>
      </>
    );

    // Underline indicator for default variant (shows on hover and active)
    const UnderlineIndicator = () => (
      <motion.span
        className="absolute bottom-0 left-1/2 h-0.5 rounded-full"
        style={{
          backgroundColor: isActive ? primary.main : secondary.main,
        }}
        initial={false}
        animate={{
          width: isActive ? "60%" : isHovered ? "40%" : "0%",
          x: "-50%",
          opacity: isActive ? 1 : isHovered ? 0.7 : 0,
        }}
        transition={hoverSpring}
      />
    );

    // Vertical pill indicator
    const VerticalIndicator = () => (
      <AnimatePresence>
        {isActive && variant === "vertical" && (
          <motion.span
            className="absolute left-0 top-1/2 w-1 h-8 rounded-r-full -translate-y-1/2"
            style={{ backgroundColor: primary.main }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={springConfig}
          />
        )}
      </AnimatePresence>
    );

    return (
      <Link
        ref={ref}
        href={href}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(baseClasses, getVariantClasses(), className)}
        style={{
          color: getTextColor(),
          backgroundColor: getVerticalHoverBg(),
          ...focusRingStyle,
        }}
        aria-current={isActive ? "page" : undefined}
      >
        {/* Hover background indicator */}
        <HoverIndicator />

        {/* Active state indicator based on variant */}
        {variant === "pill" && <PillIndicator />}
        {variant === "default" && <UnderlineIndicator />}
        {variant === "vertical" && <VerticalIndicator />}

        {/* Icon with animation */}
        {icon && (
          <motion.span
            className={cn(
              "flex items-center justify-center",
              currentSize.iconSize,
              variant === "vertical" && "mb-1"
            )}
            initial={false}
            animate={{
              scale: isActive ? 1.1 : isHovered ? 1.05 : 1,
              y: isActive && variant !== "vertical" ? -1 : 0,
            }}
            transition={hoverSpring}
          >
            {icon}
          </motion.span>
        )}

        {/* Text label */}
        <motion.span
          className={cn(
            variant === "vertical" && "text-xs font-medium"
          )}
          initial={false}
          animate={{
            fontWeight: isActive ? 600 : isHovered ? 550 : 500,
          }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.span>
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";
