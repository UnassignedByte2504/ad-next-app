"use client";

import { forwardRef, type ReactNode } from "react";
import MuiCardActions, {
  type CardActionsProps as MuiCardActionsProps,
} from "@mui/material/CardActions";

// =============================================================================
// TYPES
// =============================================================================

export interface CardActionsProps extends Omit<MuiCardActionsProps, "children"> {
  /** Layout direction */
  direction?: "row" | "column";
  /** Alignment */
  align?: "left" | "center" | "right" | "stretch" | "space-between";
  /** Spacing between buttons */
  spacing?: "sm" | "md" | "lg";
  /** Padding size */
  padding?: "none" | "sm" | "md";
  /** Content */
  children: ReactNode;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const spacingMap = {
  sm: 1,
  md: 1.5,
  lg: 2,
};

const paddingMap = {
  none: 0,
  sm: 1.5,
  md: 2,
};

const alignMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  stretch: "stretch",
  "space-between": "space-between",
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CardActions - Action buttons area for cards
 *
 * Provides consistent layout for card action buttons.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardContent>...</CardContent>
 *   <CardActions align="stretch" spacing="md">
 *     <Button variant="outlined">Cancel</Button>
 *     <Button variant="contained">Submit</Button>
 *   </CardActions>
 * </Card>
 * ```
 */
export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  (
    {
      direction = "row",
      align = "left",
      spacing = "md",
      padding = "md",
      children,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <MuiCardActions
        ref={ref}
        sx={{
          display: "flex",
          flexDirection: direction,
          justifyContent: direction === "row" ? alignMap[align] : "flex-start",
          alignItems: direction === "column" ? alignMap[align] : "center",
          gap: spacingMap[spacing],
          p: paddingMap[padding],
          pt: 0,
          // Make children stretch if align is stretch
          "& > *": align === "stretch" ? { flex: 1 } : undefined,
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiCardActions>
    );
  }
);

CardActions.displayName = "CardActions";

export default CardActions;
