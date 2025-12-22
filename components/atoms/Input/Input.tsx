"use client";

import {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { motion, AnimatePresence } from "framer-motion";
import { alpha } from "@mui/material/styles";

import {
  primary,
  neutral,
  semantic,
  shapes,
  springs,
  interactiveStates,
  fontFamilies,
  shadows,
} from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "filled" | "outlined";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input size variant */
  size?: InputSize;
  /** Visual style variant (MD3 spec) */
  variant?: InputVariant;
  /** Floating label text */
  label?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Error message (shows error state when provided) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Leading icon or element */
  startAdornment?: ReactNode;
  /** Trailing icon or element */
  endAdornment?: ReactNode;
  /** Show clear button when input has value */
  clearable?: boolean;
  /** Show character count (requires maxLength) */
  showCount?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Callback when clear button is clicked */
  onClear?: () => void;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);

const sizeConfig: Record<
  InputSize,
  {
    height: number;
    heightWithLabel: number;
    padding: string;
    fontSize: string;
    labelSize: string;
    helperSize: string;
    iconSize: number;
    borderRadius: number;
  }
> = {
  sm: {
    height: 40,
    heightWithLabel: 48,
    padding: "8px 12px",
    fontSize: "0.875rem",
    labelSize: "0.6875rem",
    helperSize: "0.6875rem",
    iconSize: 18,
    borderRadius: shapes.sm,
  },
  md: {
    height: 48,
    heightWithLabel: 56,
    padding: "12px 16px",
    fontSize: "1rem",
    labelSize: "0.75rem",
    helperSize: "0.75rem",
    iconSize: 20,
    borderRadius: shapes.md,
  },
  lg: {
    height: 56,
    heightWithLabel: 64,
    padding: "16px 20px",
    fontSize: "1.125rem",
    labelSize: "0.75rem",
    helperSize: "0.75rem",
    iconSize: 24,
    borderRadius: shapes.lg,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Input - Ayla Designs' elegant text input atom.
 *
 * A modern, accessible input component following Material Design 3 Expressive
 * guidelines with Ayla's bohemian warmth and professional elegance.
 *
 * Features:
 * - **Floating Label**: Animated label that floats on focus/value
 * - **Spring Animations**: M3 Expressive spring physics for natural feel
 * - **Two Variants**: Filled (subtle bg) and Outlined (border-focused)
 * - **Three Sizes**: sm, md, lg for different contexts
 * - **Rich States**: Focus, error, success, disabled with visual feedback
 * - **Adornments**: Leading/trailing icons or custom elements
 * - **Clearable**: Optional clear button
 * - **Character Count**: Optional maxLength counter
 * - **Accessibility**: Proper ARIA attributes and keyboard support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input label="Email" placeholder="you@example.com" />
 *
 * // With validation
 * <Input
 *   label="Username"
 *   error="Username is already taken"
 *   startAdornment={<PersonIcon />}
 * />
 *
 * // Outlined variant with clear
 * <Input
 *   label="Search"
 *   variant="outlined"
 *   clearable
 *   endAdornment={<SearchIcon />}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      variant = "filled",
      label,
      helperText,
      error,
      success,
      startAdornment,
      endAdornment,
      clearable = false,
      showCount = false,
      fullWidth = false,
      onClear,
      className,
      disabled,
      value,
      defaultValue,
      maxLength,
      onFocus,
      onBlur,
      onChange,
      id: propId,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = propId || generatedId;
    const helperId = `${inputId}-helper`;

    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(
      defaultValue?.toString() || ""
    );

    const config = sizeConfig[size];
    const currentValue = value !== undefined ? value.toString() : internalValue;
    const hasValue = currentValue.length > 0;
    const hasError = Boolean(error);
    const hasSuccess = success && !hasError;
    const isLabelFloating = isFocused || hasValue;

    // Determine colors based on state
    const getStateColor = () => {
      if (hasError) return semantic.error.main;
      if (hasSuccess) return semantic.success.main;
      if (isFocused) return primary.main;
      return neutral[500];
    };

    const getBorderColor = () => {
      if (disabled) return neutral[200];
      if (hasError) return semantic.error.main;
      if (hasSuccess) return semantic.success.main;
      if (isFocused) return primary.main;
      return variant === "outlined" ? neutral[300] : "transparent";
    };

    const getBackgroundColor = () => {
      if (variant === "outlined") return "transparent";
      if (disabled) return neutral[100];
      if (isFocused) return "#FFFFFF";
      return neutral[100];
    };

    // Handlers
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("");
      }
      onClear?.();
    };

    // Character count
    const charCount = currentValue.length;
    const showCharCount = showCount && maxLength !== undefined;

    return (
      <Box
        className={className}
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          width: fullWidth ? "100%" : "auto",
          minWidth: fullWidth ? "100%" : 200,
        }}
      >
        {/* Input Container */}
        <MotionBox
          initial={false}
          animate={hasError ? interactiveStates.shake : {}}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 1,
            height: label ? config.heightWithLabel : config.height,
            padding: config.padding,
            paddingTop: label ? "20px" : config.padding.split(" ")[0],
            paddingBottom: label ? "8px" : config.padding.split(" ")[0],
            paddingLeft: startAdornment ? "12px" : config.padding.split(" ")[1],
            paddingRight:
              endAdornment || clearable
                ? "12px"
                : config.padding.split(" ")[1],
            borderRadius: `${config.borderRadius}px`,
            backgroundColor: getBackgroundColor(),
            border: `2px solid ${getBorderColor()}`,
            transition: `background-color 200ms ease, border-color 200ms ease`,
            cursor: disabled ? "not-allowed" : "text",
            // Subtle glow on focus (M3 Expressive) - amber tinted for Ayla
            boxShadow: isFocused
              ? `0 0 0 3px ${alpha(primary.main, 0.15)}`
              : shadows.sm,
            "&:hover": disabled
              ? {}
              : {
                  backgroundColor:
                    variant === "outlined"
                      ? alpha(neutral[100], 0.5)
                      : "#FFFFFF",
                  borderColor: hasError
                    ? semantic.error.main
                    : hasSuccess
                      ? semantic.success.main
                      : isFocused
                        ? primary.main
                        : neutral[400],
                },
          }}
        >
          {/* Floating Label - positioned relative to main container */}
          {label && (
            <motion.label
              htmlFor={inputId}
              initial={false}
              animate={{
                top: isLabelFloating ? 8 : "50%",
                y: isLabelFloating ? 0 : "-50%",
              }}
              transition={springs.snappy}
              style={{
                position: "absolute",
                left: startAdornment ? 44 : 16,
                transformOrigin: "left top",
                fontSize: isLabelFloating ? config.labelSize : config.fontSize,
                fontWeight: 500,
                fontFamily: fontFamilies.body,
                color: isLabelFloating ? getStateColor() : neutral[500],
                pointerEvents: "none",
                backgroundColor: isLabelFloating
                  ? variant === "outlined"
                    ? neutral[50]
                    : "transparent"
                  : "transparent",
                padding: isLabelFloating && variant === "outlined" ? "0 4px" : 0,
                zIndex: 2,
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {label}
            </motion.label>
          )}

          {/* Start Adornment */}
          {startAdornment && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: getStateColor(),
                fontSize: config.iconSize,
                opacity: disabled ? 0.5 : 1,
                "& svg": { fontSize: config.iconSize },
              }}
            >
              {startAdornment}
            </Box>
          )}

          {/* Input Field */}
          <Box sx={{ flex: 1, position: "relative", height: "100%" }}>
            {/* Native Input */}
            <Box
              component="input"
              ref={ref}
              id={inputId}
              disabled={disabled}
              value={currentValue}
              maxLength={maxLength}
              aria-invalid={hasError}
              aria-describedby={helperText || error ? helperId : undefined}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...rest}
              sx={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: config.fontSize,
                fontWeight: 400,
                fontFamily: fontFamilies.body,
                color: disabled ? neutral[400] : neutral[800],
                caretColor: primary.main,
                padding: 0,
                // Align input text to bottom when label is present
                display: "flex",
                alignItems: label ? "flex-end" : "center",
                "&::placeholder": {
                  color: neutral[400],
                  opacity: label && !isLabelFloating ? 0 : 1,
                  transition: "opacity 200ms ease",
                },
                "&:disabled": {
                  cursor: "not-allowed",
                },
                // Remove autofill background - light mode for Ayla
                "&:-webkit-autofill": {
                  WebkitBoxShadow: `0 0 0 100px #FFFFFF inset`,
                  WebkitTextFillColor: neutral[800],
                },
              }}
            />
          </Box>

          {/* Clear Button */}
          <AnimatePresence>
            {clearable && hasValue && !disabled && (
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={springs.snappy}
              >
                <IconButton
                  size="small"
                  onClick={handleClear}
                  sx={{
                    p: 0.5,
                    color: neutral[500],
                    "&:hover": {
                      color: neutral[700],
                      backgroundColor: alpha(neutral[300], 0.3),
                    },
                  }}
                  aria-label="Clear input"
                >
                  <ClearIcon sx={{ fontSize: config.iconSize - 2 }} />
                </IconButton>
              </MotionBox>
            )}
          </AnimatePresence>

          {/* End Adornment */}
          {endAdornment && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: getStateColor(),
                fontSize: config.iconSize,
                opacity: disabled ? 0.5 : 1,
                "& svg": { fontSize: config.iconSize },
              }}
            >
              {endAdornment}
            </Box>
          )}
        </MotionBox>

        {/* Helper Text / Error / Character Count */}
        <AnimatePresence mode="wait">
          {(helperText || error || showCharCount) && (
            <MotionBox
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={springs.snappy}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
                mt: 0.75,
                px: 0.5,
              }}
            >
              <Typography
                id={helperId}
                variant="caption"
                sx={{
                  fontSize: config.helperSize,
                  fontFamily: fontFamilies.body,
                  color: hasError
                    ? semantic.error.main
                    : hasSuccess
                      ? semantic.success.main
                      : neutral[500],
                  lineHeight: 1.4,
                }}
              >
                {error || helperText}
              </Typography>

              {showCharCount && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: config.helperSize,
                    fontFamily: fontFamilies.body,
                    color:
                      charCount >= (maxLength || 0)
                        ? semantic.error.main
                        : neutral[500],
                    flexShrink: 0,
                  }}
                >
                  {charCount}/{maxLength}
                </Typography>
              )}
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    );
  }
);

Input.displayName = "Input";

export default Input;
