"use client";

import { forwardRef, type ReactNode } from "react";
import MuiCardContent, {
  type CardContentProps as MuiCardContentProps,
} from "@mui/material/CardContent";

// =============================================================================
// TYPES
// =============================================================================

export interface CardContentProps extends Omit<MuiCardContentProps, "children"> {
  /** Content padding size */
  size?: "none" | "sm" | "md" | "lg";
  /** Content */
  children: ReactNode;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const paddingMap = {
  none: 0,
  sm: 1.5,
  md: 2,
  lg: 3,
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CardContent - Content area for cards
 *
 * Wraps MUI CardContent with size presets.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardContent size="md">
 *     <Typography>Hello World</Typography>
 *   </CardContent>
 * </Card>
 * ```
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ size = "md", children, sx, ...props }, ref) => {
    return (
      <MuiCardContent
        ref={ref}
        sx={{
          p: paddingMap[size],
          "&:last-child": {
            pb: paddingMap[size],
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiCardContent>
    );
  }
);

CardContent.displayName = "CardContent";

export default CardContent;
