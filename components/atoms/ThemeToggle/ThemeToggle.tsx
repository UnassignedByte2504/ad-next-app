"use client";

import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { motion, AnimatePresence } from "framer-motion";
import { forwardRef, useMemo } from "react";
import { useUI, useUIActions } from "@store";
import { cn } from "@utils";
import type { ThemeMode } from "@/store/types";
import { springs } from "@/app/ui/theme";

export interface ThemeToggleProps {
  /** Tamaño del botón */
  size?: "sm" | "md" | "lg";
  /** Mostrar etiqueta de texto junto al icono */
  showLabel?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** Modo de ciclo: 'full' incluye system, 'simple' solo alterna light/dark */
  cycleMode?: "full" | "simple";
  /** Deshabilitado */
  disabled?: boolean;
}

/**
 * Configuración de tamaños siguiendo Material Design 3.
 */
const SIZE_CONFIG = {
  sm: { button: 36, icon: 20, fontSize: 12 },
  md: { button: 44, icon: 24, fontSize: 14 },
  lg: { button: 52, icon: 28, fontSize: 16 },
} as const;

/**
 * Spring configurations from theme tokens.
 * - expressive: bouncy spring for highlighted moments
 * - standard: smooth spring for functional transitions
 */
const SPRING_CONFIG = {
  expressive: springs.bouncy,
  standard: springs.smooth,
};

/**
 * Animated Sun Icon - SVG con rayos animados
 */
const SunIcon = ({ size }: { size: number }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Centro del sol */}
    <motion.circle
      cx="12"
      cy="12"
      r="4"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={SPRING_CONFIG.expressive}
    />
    {/* Rayos del sol - animados */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 12 + Math.cos(rad) * 6;
      const y1 = 12 + Math.sin(rad) * 6;
      const x2 = 12 + Math.cos(rad) * 9;
      const y2 = 12 + Math.sin(rad) * 9;
      return (
        <motion.line
          key={angle}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            ...SPRING_CONFIG.expressive,
            delay: i * 0.03,
          }}
        />
      );
    })}
  </motion.svg>
);

/**
 * Animated Moon Icon - SVG con estrellas
 */
const MoonIcon = ({ size }: { size: number }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Luna creciente */}
    <motion.path
      d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"
      initial={{ rotate: -30, scale: 0.8 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={SPRING_CONFIG.expressive}
    />
    {/* Estrellas decorativas */}
    {[
      { cx: 19, cy: 5, delay: 0.1 },
      { cx: 21, cy: 9, delay: 0.15 },
      { cx: 17, cy: 3, delay: 0.2 },
    ].map((star, i) => (
      <motion.circle
        key={i}
        cx={star.cx}
        cy={star.cy}
        r="0.5"
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ...SPRING_CONFIG.expressive,
          delay: star.delay,
        }}
      />
    ))}
  </motion.svg>
);

/**
 * Animated System Icon - Monitor con sol/luna
 */
const SystemIcon = ({ size }: { size: number }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Monitor */}
    <motion.rect
      x="2"
      y="3"
      width="20"
      height="14"
      rx="2"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={SPRING_CONFIG.standard}
    />
    {/* Base del monitor */}
    <motion.line
      x1="8"
      y1="21"
      x2="16"
      y2="21"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ ...SPRING_CONFIG.standard, delay: 0.1 }}
    />
    <motion.line
      x1="12"
      y1="17"
      x2="12"
      y2="21"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ ...SPRING_CONFIG.standard, delay: 0.05 }}
    />
    {/* Sol/Luna pequeño dentro */}
    <motion.circle
      cx="9"
      cy="10"
      r="2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
    />
    <motion.path
      d="M14 8a2 2 0 0 0 3 3 3 3 0 1 1-3-3z"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      style={{ transform: "scale(0.7)", transformOrigin: "15px 10px" }}
    />
  </motion.svg>
);

/**
 * ThemeToggle - Botón animado para cambiar el tema.
 *
 * Características:
 * - Animaciones Spring siguiendo M3 Motion Physics System
 * - Iconos SVG animados (sun rays, moon stars)
 * - Transiciones suaves entre estados
 * - Soporte para modo simple (light/dark) o completo (+ system)
 *
 * @example
 * ```tsx
 * // Toggle simple
 * <ThemeToggle />
 *
 * // Con etiqueta
 * <ThemeToggle showLabel />
 *
 * // Solo light/dark
 * <ThemeToggle cycleMode="simple" />
 * ```
 */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (
    {
      size = "md",
      showLabel = false,
      className,
      cycleMode = "full",
      disabled = false,
    },
    ref
  ) => {
    const themeFromStore = useUI((state) => state.theme);
    const { setTheme } = useUIActions();

    // Fallbacks para asegurar que siempre hay valores válidos
    const theme = themeFromStore ?? "light";
    const validSize = size in SIZE_CONFIG ? size : "md";
    const config = SIZE_CONFIG[validSize];

    // Determinar el siguiente tema en el ciclo
    const getNextTheme = (): ThemeMode => {
      if (cycleMode === "simple") {
        return theme === "light" ? "dark" : "light";
      }

      switch (theme) {
        case "light":
          return "dark";
        case "dark":
          return "system";
        case "system":
          return "light";
        default:
          return "light";
      }
    };

    const handleToggle = () => {
      if (!disabled) {
        setTheme(getNextTheme());
      }
    };

    // Icono y etiqueta según tema actual
    const { icon, label, tooltipText } = useMemo(() => {
      switch (theme) {
        case "light":
          return {
            icon: <SunIcon size={config.icon} />,
            label: "Claro",
            tooltipText: "Cambiar a tema oscuro",
          };
        case "dark":
          return {
            icon: <MoonIcon size={config.icon} />,
            label: "Oscuro",
            tooltipText: cycleMode === "full" ? "Cambiar a tema del sistema" : "Cambiar a tema claro",
          };
        case "system":
          return {
            icon: <SystemIcon size={config.icon} />,
            label: "Sistema",
            tooltipText: "Cambiar a tema claro",
          };
        default:
          return {
            icon: <SunIcon size={config.icon} />,
            label: "Claro",
            tooltipText: "Cambiar a tema oscuro",
          };
      }
    }, [theme, config.icon, cycleMode]);

    const button = (
      <motion.button
        ref={ref}
        onClick={handleToggle}
        disabled={disabled}
        aria-label={`Cambiar tema. Tema actual: ${label}`}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full",
          "bg-transparent border-0 cursor-pointer",
          "transition-colors duration-200",
          "hover:bg-black/5 dark:hover:bg-white/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        style={{
          width: config.button,
          height: config.button,
        }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={SPRING_CONFIG.expressive}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={SPRING_CONFIG.expressive}
            className="flex items-center justify-center"
            style={{ color: "currentColor" }}
          >
            {icon}
          </motion.div>
        </AnimatePresence>

        {showLabel && (
          <Box
            component={motion.span}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              ml: 1,
              fontSize: config.fontSize,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Box>
        )}
      </motion.button>
    );

    // Si no tiene label, mostrar tooltip
    if (!showLabel) {
      return (
        <Tooltip title={tooltipText} arrow>
          <span style={{ display: "inline-flex" }}>{button}</span>
        </Tooltip>
      );
    }

    return button;
  }
);

ThemeToggle.displayName = "ThemeToggle";
