"use client";

import { forwardRef, useState, useEffect, type ReactNode } from "react";
import Box from "@mui/material/Box";
import { motion, useReducedMotion } from "framer-motion";

import { primary, secondary, gradients, springs } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface MagicTextProps {
  /** Text content to display */
  children: ReactNode;
  /** Color variant - determines gradient and star color */
  color?: "amber" | "purple";
  /** Additional CSS class */
  className?: string;
  /** Disable animations */
  disableAnimation?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const colorVariants = {
  amber: {
    gradient: gradients.magicAmber,
    starFill: primary.main,
  },
  purple: {
    gradient: gradients.magicPurple,
    starFill: secondary.main,
  },
};

// Star SVG path
const STAR_PATH =
  "M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z";

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * MagicText displays text with an animated gradient effect and floating stars on hover.
 *
 * ## Features
 * - **Gradient Animation**: Text fills with animated gradient on hover
 * - **Floating Stars**: Decorative stars animate around the text
 * - **Color Variants**: Amber (gold) and Purple (lavender)
 * - **Reduced Motion Support**: Respects user's motion preferences
 *
 * ## Usage
 * ```tsx
 * <MagicText color="amber">magical text</MagicText>
 * <MagicText color="purple">mystical text</MagicText>
 * ```
 */
export const MagicText = forwardRef<HTMLSpanElement, MagicTextProps>(
  ({ children, color = "amber", className, disableAnimation = false }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !prefersReducedMotion && !disableAnimation;

    const [isHovered, setIsHovered] = useState(false);
    const [stars, setStars] = useState([
      { id: 1, left: "10%", top: "20%" },
      { id: 2, left: "50%", top: "-10%" },
      { id: 3, left: "90%", top: "30%" },
    ]);

    const variant = colorVariants[color] || colorVariants.amber;

    // Animate star positions when hovered
    useEffect(() => {
      if (!isHovered || !shouldAnimate) return;

      const animateStars = () => {
        setStars((prev) =>
          prev.map((star) => ({
            ...star,
            left: `${Math.floor(Math.random() * 110) - 10}%`,
            top: `${Math.floor(Math.random() * 120) - 40}%`,
          }))
        );
      };

      animateStars();
      const interval = setInterval(animateStars, 1000);
      return () => clearInterval(interval);
    }, [isHovered, shouldAnimate]);

    return (
      <Box
        component="span"
        ref={ref}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          display: "inline-block",
          cursor: "pointer",
        }}
      >
        {/* Floating stars */}
        {shouldAnimate &&
          stars.map((star) => (
            <motion.span
              key={star.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: isHovered ? 0.8 : 0,
                scale: isHovered ? 1 : 0,
                left: star.left,
                top: star.top,
              }}
              transition={springs.smooth}
              style={{
                position: "absolute",
                width: "clamp(16px, 1.5vw, 24px)",
                height: "clamp(16px, 1.5vw, 24px)",
                pointerEvents: "none",
              }}
            >
              <motion.svg
                viewBox="0 0 512 512"
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{
                  duration: 1,
                  repeat: isHovered ? Infinity : 0,
                  ease: "linear",
                }}
                style={{ display: "block", width: "100%", height: "100%" }}
              >
                <path fill={variant.starFill} d={STAR_PATH} />
              </motion.svg>
            </motion.span>
          ))}

        {/* Text with gradient effect */}
        <Box
          component="span"
          sx={{
            background: isHovered && shouldAnimate ? variant.gradient : "none",
            backgroundSize: "200%",
            WebkitBackgroundClip: isHovered && shouldAnimate ? "text" : "unset",
            WebkitTextFillColor:
              isHovered && shouldAnimate ? "transparent" : "inherit",
            animation:
              isHovered && shouldAnimate
                ? "background-pan 3s linear infinite"
                : "none",
            transition: "all 300ms ease",
            "@keyframes background-pan": {
              "0%": { backgroundPosition: "0% center" },
              "100%": { backgroundPosition: "-200% center" },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }
);

MagicText.displayName = "MagicText";
export default MagicText;
