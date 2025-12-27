"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import { Chip } from "@atoms";
import { springs, categoryColors } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export type ChipColorType = "category" | "primary" | "secondary";

export interface ChipItem {
  /** Display label */
  label: string;
  /** Optional custom color (hex) */
  color?: string;
}

export interface CardChipGroupProps {
  /** Optional label above chips */
  label?: string;
  /** Array of chip items or strings */
  chips: (string | ChipItem)[];
  /** Color type - determines automatic coloring */
  colorType?: ChipColorType;
  /** Chip variant */
  variant?: "filled" | "outlined" | "soft";
  /** Chip size */
  size?: "small" | "medium";
  /** Max chips to show (rest collapsed as "+N") */
  maxVisible?: number;
  /** Enable spring animations on chips */
  animated?: boolean;
  /** Gap between chips */
  spacing?: number;
  /** Click handler for chips */
  onChipClick?: (chip: string) => void;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get color for a chip based on its type and label
 * Uses categoryColors for product categories (Planners, Bodas, etc.)
 */
const getChipColor = (
  label: string,
  colorType: ChipColorType,
  customColor?: string
): string | undefined => {
  if (customColor) return customColor;

  switch (colorType) {
    case "category":
      return categoryColors[label as keyof typeof categoryColors];
    case "primary":
      return undefined; // Use MUI primary
    case "secondary":
      return undefined; // Use MUI secondary
    default:
      return undefined;
  }
};

/**
 * Get MUI color prop for non-custom colors
 */
const getMuiColor = (
  colorType: ChipColorType
): "primary" | "secondary" | "default" => {
  switch (colorType) {
    case "primary":
      return "primary";
    case "secondary":
      return "secondary";
    default:
      return "default";
  }
};

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.bouncy,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

const MotionStack = motion.create(Stack);
const MotionBox = motion.create(Box);

/**
 * CardChipGroup - Group of chips for cards
 *
 * Features:
 * - Automatic coloring for product categories
 * - M3 Expressive spring animations
 * - Collapsible with "+N more"
 * - Soft variant recommended for dark mode
 *
 * @example
 * ```tsx
 * // Category chips with automatic colors
 * <CardChipGroup
 *   label="Categorías"
 *   chips={["Planners", "Bodas", "Branding"]}
 *   colorType="category"
 *   variant="soft"
 * />
 *
 * // Primary color chips
 * <CardChipGroup
 *   label="Tags"
 *   chips={["New", "Featured", "Sale"]}
 *   colorType="primary"
 *   animated
 * />
 * ```
 */
export const CardChipGroup = forwardRef<HTMLDivElement, CardChipGroupProps>(
  (
    {
      label,
      chips,
      colorType = "category",
      variant = "soft",
      size = "small",
      maxVisible = 3,
      animated = false,
      spacing = 0.5,
      onChipClick,
    },
    ref
  ) => {
    // Normalize chips to ChipItem format
    const normalizedChips: ChipItem[] = chips.map((chip) =>
      typeof chip === "string" ? { label: chip } : chip
    );

    // Split into visible and hidden
    const visibleChips = normalizedChips.slice(0, maxVisible);
    const hiddenCount = normalizedChips.length - maxVisible;

    // Wrapper component for animation
    const ChipWrapper = animated ? MotionBox : Box;
    const StackWrapper = animated ? MotionStack : Stack;

    return (
      <Box ref={ref}>
        {/* Label */}
        {label && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: "block" }}
          >
            {label}
          </Typography>
        )}

        {/* Chips */}
        <StackWrapper
          direction="row"
          spacing={spacing}
          sx={{ flexWrap: "wrap" }}
          useFlexGap
          {...(animated && {
            variants: containerVariants,
            initial: "hidden",
            animate: "visible",
          })}
        >
          {visibleChips.map((chip) => {
            const customColor = getChipColor(chip.label, colorType, chip.color);
            const muiColor = getMuiColor(colorType);

            return (
              <ChipWrapper
                key={chip.label}
                {...(animated && { variants: chipVariants })}
              >
                <Chip
                  label={chip.label}
                  size={size}
                  variant={variant === "soft" ? "outlined" : variant}
                  color={customColor ? undefined : muiColor}
                  onClick={onChipClick ? () => onChipClick(chip.label) : undefined}
                  sx={
                    customColor && variant === "soft"
                      ? {
                          bgcolor: `${customColor}26`, // 15% opacity
                          color: customColor,
                          borderColor: "transparent",
                          "&:hover": {
                            bgcolor: `${customColor}40`, // 25% opacity
                          },
                        }
                      : customColor
                        ? {
                            bgcolor: customColor,
                            color: "white",
                            "&:hover": {
                              bgcolor: customColor,
                              filter: "brightness(1.1)",
                            },
                          }
                        : undefined
                  }
                />
              </ChipWrapper>
            );
          })}

          {/* +N more chip */}
          {hiddenCount > 0 && (
            <ChipWrapper {...(animated && { variants: chipVariants })}>
              <Chip
                label={`+${hiddenCount}`}
                size={size}
                variant="outlined"
                sx={{
                  opacity: 0.7,
                }}
              />
            </ChipWrapper>
          )}
        </StackWrapper>
      </Box>
    );
  }
);

CardChipGroup.displayName = "CardChipGroup";

export default CardChipGroup;
