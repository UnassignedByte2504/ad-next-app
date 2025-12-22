"use client";

import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslations } from "next-intl";
import { forwardRef, KeyboardEvent, type ChangeEvent } from "react";

export interface SearchInputProps {
  /** Valor actual del campo de búsqueda */
  value?: string;
  /** Callback cuando cambia el valor */
  onChange?: (value: string) => void;
  /** Callback cuando se ejecuta la búsqueda (Enter o botón) */
  onSearch?: (value: string) => void;
  /** Texto placeholder */
  placeholder?: string;
  /** Tamaño del input */
  size?: "sm" | "md" | "lg";
  /** Variante del input */
  variant?: "outlined" | "filled";
  /** Mostrar botón de búsqueda */
  showButton?: boolean;
  /** Estado de carga */
  loading?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Ancho completo */
  fullWidth?: boolean;
  /** Deshabilitado */
  disabled?: boolean;
}

/**
 * Configuración de tamaños siguiendo Material Design 3 guidelines.
 * - sm: Compacto para barras de herramientas
 * - md: Tamaño estándar para la mayoría de casos
 * - lg: Destacado para páginas de búsqueda principal
 */
const SIZE_CONFIG = {
  sm: {
    height: 40,
    fontSize: 14,
    iconSize: 20,
    buttonSize: 32,
    gap: 8,
    px: 16,
  },
  md: {
    height: 48,
    fontSize: 16,
    iconSize: 22,
    buttonSize: 36,
    gap: 10,
    px: 18,
  },
  lg: {
    height: 56,
    fontSize: 18,
    iconSize: 24,
    buttonSize: 42,
    gap: 12,
    px: 20,
  },
} as const;

/**
 * SearchInput - Campo de búsqueda siguiendo Material Design 3.
 *
 * Características:
 * - Container redondeado (pill shape) siguiendo M3 guidelines
 * - Icono de búsqueda a la izquierda (leading, non-functional)
 * - Botón de acción circular a la derecha (trailing, optional)
 * - Soporte para variantes outlined y filled
 * - Estados de carga con spinner
 *
 * @example
 * // Básico
 * <SearchInput placeholder="Buscar..." onChange={setValue} />
 *
 * // Con botón de búsqueda
 * <SearchInput showButton onSearch={handleSearch} />
 *
 * // Variante filled
 * <SearchInput variant="filled" />
 */
export const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  (
    {
      value = "",
      onChange,
      onSearch,
      placeholder,
      size = "md",
      variant = "outlined",
      showButton = false,
      loading = false,
      className,
      fullWidth = false,
      disabled = false,
    },
    ref
  ) => {
    const t = useTranslations("Components.searchInput");
    const config = SIZE_CONFIG[size];
    const borderRadius = config.height / 2;
    const resolvedPlaceholder = placeholder ?? t("placeholder");
    const ariaLabel = t("ariaLabel");
    const searchButtonLabel = t("searchButton");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && onSearch) {
        event.preventDefault();
        onSearch(value);
      }
    };

    const handleSearchClick = () => {
      if (!loading && !disabled) {
        onSearch?.(value);
      }
    };

    const isOutlined = variant === "outlined";

    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: `${config.gap}px`,
          height: config.height,
          width: fullWidth ? "100%" : "auto",
          minWidth: 200,
          borderRadius: `${borderRadius}px`,
          px: `${config.px}px`,
          transition: "all 0.2s ease-in-out",
          cursor: disabled ? "not-allowed" : "text",
          opacity: disabled ? 0.5 : 1,

          // Variante outlined
          ...(isOutlined && {
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "transparent",
            "&:hover": {
              borderColor: disabled ? "divider" : "primary.main",
            },
            "&:focus-within": {
              borderColor: "primary.main",
              borderWidth: 2,
              // Compensar el borde extra
              px: `${config.px - 1}px`,
            },
          }),

          // Variante filled
          ...(!isOutlined && {
            backgroundColor: "action.hover",
            border: "none",
            "&:hover": {
              backgroundColor: disabled ? "action.hover" : "action.selected",
            },
            "&:focus-within": {
              backgroundColor: "action.selected",
            },
          }),
        }}
        onClick={(e) => {
          // Focus en el input al hacer clic en el container
          const input = e.currentTarget.querySelector("input");
          input?.focus();
        }}
      >
        {/* Leading icon (search o loading) */}
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "action.active",
          }}
        >
          {loading ? (
            <CircularProgress
              size={config.iconSize}
              color="inherit"
              sx={{ color: "action.active" }}
            />
          ) : (
            <SearchIcon
              sx={{
                fontSize: config.iconSize,
                color: "inherit",
              }}
            />
          )}
        </Box>

        {/* Input field */}
        <InputBase
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          inputProps={{
            "aria-label": ariaLabel,
          }}
          sx={{
            flex: 1,
            fontSize: config.fontSize,
            "& .MuiInputBase-input": {
              padding: 0,
              height: "100%",
              "&::placeholder": {
                opacity: 0.6,
                color: "text.secondary",
              },
            },
          }}
        />

        {/* Trailing button (optional) */}
        {showButton && (
          <IconButton
            onClick={handleSearchClick}
            disabled={loading || disabled}
            aria-label={searchButtonLabel}
            size="small"
            sx={{
              flexShrink: 0,
              width: config.buttonSize,
              height: config.buttonSize,
              borderRadius: "50%",
              backgroundColor: "action.hover",
              color: "action.active",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },
              "&:disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            <SearchIcon sx={{ fontSize: config.iconSize * 0.85 }} />
          </IconButton>
        )}
      </Box>
    );
  }
);

SearchInput.displayName = "SearchInput";
