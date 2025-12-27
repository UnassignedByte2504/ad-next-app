"use client";

import { forwardRef, memo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { motion, useReducedMotion } from "framer-motion";
import { Moon } from "lucide-react";

import { primary, secondary } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface HeroDecorationsProps {
  /** Additional CSS class */
  className?: string;
  /** data-testid for testing */
  "data-testid"?: string;
}

// =============================================================================
// KEYFRAMES
// =============================================================================

const floatKeyframes = {
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
    "50%": { transform: "translateY(-20px) rotate(5deg)" },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * HeroDecorations - Decorative elements for the Hero section.
 *
 * Includes:
 * - Parallax circle (top-right, moves with scroll)
 * - Floating moon icon (left side)
 * - Rotated square (bottom-left)
 *
 * All animations respect reduced motion preferences.
 */
export const HeroDecorations = memo(
  forwardRef<HTMLDivElement, HeroDecorationsProps>(
    ({ className, "data-testid": testId = "hero-decorations" }, ref) => {
      const prefersReducedMotion = useReducedMotion();
      const [scrollY, setScrollY] = useState(0);

      // Track scroll for parallax effect
      useEffect(() => {
        if (prefersReducedMotion) return;

        const handleScroll = () => {
          setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
      }, [prefersReducedMotion]);

      return (
        <Box
          ref={ref}
          className={className}
          data-testid={testId}
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            ...floatKeyframes,
          }}
        >
          {/* Parallax Circle - Top Right */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            sx={{
              position: "absolute",
              top: { xs: "5%", md: "10%" },
              right: { xs: "-10%", md: "5%" },
              width: { xs: 200, sm: 280, md: 350 },
              height: { xs: 200, sm: 280, md: 350 },
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${primary.light}40 0%, ${primary.main}20 100%)`,
              filter: "blur(1px)",
              transform: prefersReducedMotion
                ? "none"
                : `translateY(${scrollY * 0.2}px)`,
              transition: prefersReducedMotion ? "none" : "transform 0.1s linear",
            }}
          />

          {/* Floating Moon - Left Side */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: "15%", md: "25%" },
              left: { xs: "5%", md: "15%" },
              color: `${primary.light}80`,
              animation: prefersReducedMotion ? "none" : "float 6s ease-in-out infinite",
              animationDelay: "2s",
            }}
          >
            <Moon size={32} strokeWidth={1.5} />
          </Box>

          {/* Rotated Square - Bottom Left */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, rotate: 35 }}
            animate={{ opacity: 1, rotate: 45 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{
              position: "absolute",
              bottom: { xs: "8%", md: "12%" },
              left: { xs: "-2%", md: "3%" },
              width: { xs: 40, sm: 50, md: 60 },
              height: { xs: 40, sm: 50, md: 60 },
              background: `linear-gradient(135deg, ${secondary.light}60 0%, ${secondary.main}30 100%)`,
              animation: prefersReducedMotion ? "none" : "float 6s ease-in-out infinite",
              borderRadius: 2,
            }}
          />

          {/* Small accent dot - Top Left */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            sx={{
              position: "absolute",
              top: { xs: "20%", md: "30%" },
              left: { xs: "20%", md: "30%" },
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: `${primary.main}50`,
            }}
          />

          {/* Small accent dot - Right side */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            sx={{
              position: "absolute",
              top: { xs: "40%", md: "45%" },
              right: { xs: "15%", md: "20%" },
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: `${secondary.main}40`,
            }}
          />
        </Box>
      );
    }
  )
);

HeroDecorations.displayName = "HeroDecorations";
export default HeroDecorations;
