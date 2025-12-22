"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { motion, useReducedMotion } from "framer-motion";

import { Chip } from "@atoms/Chip";
import {
  springs,
  shapes,
  chipShapeMorph,
  durations,
  easings,
} from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface CategoryItem {
  /** Unique key for the category */
  key: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: React.ReactElement;
}

export interface CategoryChipsProps {
  /** Array of category items */
  categories: CategoryItem[];
  /** Currently selected category key(s) */
  selected?: string | string[];
  /** Callback when a category is clicked */
  onSelect?: (key: string) => void;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Chip size */
  size?: "small" | "medium";
  /** Layout direction */
  direction?: "row" | "column";
  /** Content alignment */
  align?: "start" | "center" | "end";
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const getContainerVariants = (reducedMotion: boolean | null) => ({
  hidden: { opacity: reducedMotion ? 1 : 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: reducedMotion ? 0 : 0.04,
      delayChildren: reducedMotion ? 0 : 0.1,
    },
  },
});

const getChipVariants = (reducedMotion: boolean | null) => ({
  hidden: {
    opacity: reducedMotion ? 1 : 0,
    scale: reducedMotion ? 1 : 0.85,
    y: reducedMotion ? 0 : 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
});

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CategoryChips - A group of selectable category chips with animation.
 *
 * Features:
 * - M3 Expressive staggered entrance animation
 * - Shape morphing on selection (pill → rounded)
 * - Single or multi-select support
 * - Spring physics for natural motion
 * - Accessible focus states
 * - Reduced motion support
 *
 * @example
 * ```tsx
 * // Single selection
 * <CategoryChips
 *   categories={[
 *     { key: 'invitations', label: 'Invitations' },
 *     { key: 'art', label: 'Digital Art' },
 *   ]}
 *   selected={selectedCategory}
 *   onSelect={setSelectedCategory}
 * />
 *
 * // Multiple selection
 * <CategoryChips
 *   categories={categories}
 *   selected={['invitations', 'art']}
 *   multiple
 *   onSelect={handleToggle}
 * />
 * ```
 */
export const CategoryChips = forwardRef<HTMLDivElement, CategoryChipsProps>(
  (
    {
      categories,
      selected,
      onSelect,
      multiple = false,
      size = "medium",
      direction = "row",
      align = "center",
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    // Helper to check if a category is selected
    const isSelected = (key: string): boolean => {
      if (!selected) return false;
      if (Array.isArray(selected)) return selected.includes(key);
      return selected === key;
    };

    // Get alignment value
    const alignMap = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
    };

    return (
      <Box ref={ref} className={className}>
        <Stack
          component={motion.div}
          variants={getContainerVariants(prefersReducedMotion)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          direction={direction}
          spacing={1.5}
          flexWrap="wrap"
          justifyContent={alignMap[align]}
          alignItems={direction === "column" ? alignMap[align] : "center"}
          useFlexGap
          sx={{ gap: 1.5 }}
        >
          {categories.map((category) => {
            const categorySelected = isSelected(category.key);

            return (
              <motion.div
                key={category.key}
                variants={getChipVariants(prefersReducedMotion)}
                transition={springs.gentle}
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.05,
                        transition: springs.snappy,
                      }
                }
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              >
                <Chip
                  label={category.label}
                  icon={category.icon}
                  variant={categorySelected ? "filled" : "outlined"}
                  color={categorySelected ? "primary" : "default"}
                  size={size}
                  clickable
                  onClick={() => onSelect?.(category.key)}
                  sx={{
                    cursor: "pointer",
                    // Shape morphing: pill when unselected, rounded when selected
                    borderRadius: categorySelected
                      ? `${shapes.lg}px`
                      : `${shapes.full}px`,
                    transition: `all ${durations.fast}ms ${easings.default}`,
                    // Hover states
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: categorySelected
                        ? "primary.dark"
                        : "action.hover",
                    },
                    // Focus ring
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 2,
                    },
                    // Selected state styling
                    ...(categorySelected && {
                      fontWeight: 600,
                      boxShadow: `0 2px 8px color-mix(in srgb, var(--mui-palette-primary-main) 25%, transparent)`,
                    }),
                  }}
                />
              </motion.div>
            );
          })}
        </Stack>
      </Box>
    );
  }
);

CategoryChips.displayName = "CategoryChips";

export default CategoryChips;
