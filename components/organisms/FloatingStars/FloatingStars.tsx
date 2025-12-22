"use client";

import { forwardRef, memo, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { primary } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Configuration for a single decorative star
 */
interface StarConfig {
  /** Horizontal position as percentage */
  left: number;
  /** Vertical position as percentage */
  top: number;
  /** Animation duration in seconds */
  duration: number;
  /** Animation delay in seconds */
  delay: number;
  /** Star size in pixels */
  size: number;
  /** Star opacity (0-1) */
  opacity: number;
}

export interface FloatingStarsProps {
  /** Custom className for the container */
  className?: string;
  /** Override the default star color */
  starColor?: string;
  /** Number of stars to render (default: 15) */
  count?: number;
  /** Custom star configurations (overrides count) */
  stars?: StarConfig[];
  /** Test ID for testing purposes */
  "data-testid"?: string;
}

// =============================================================================
// DEFAULT STAR CONFIGURATIONS
// =============================================================================

/**
 * Pre-defined star positions to avoid hydration mismatch
 * These are carefully placed for visual balance across the viewport
 */
const DEFAULT_STARS: StarConfig[] = [
  { left: 15, top: 20, duration: 2.5, delay: 0.2, size: 10, opacity: 0.35 },
  { left: 85, top: 15, duration: 3.2, delay: 1.1, size: 12, opacity: 0.4 },
  { left: 45, top: 35, duration: 2.8, delay: 0.5, size: 9, opacity: 0.45 },
  { left: 70, top: 60, duration: 3.5, delay: 2.0, size: 14, opacity: 0.3 },
  { left: 25, top: 75, duration: 2.2, delay: 0.8, size: 11, opacity: 0.5 },
  { left: 55, top: 85, duration: 3.0, delay: 1.5, size: 8, opacity: 0.35 },
  { left: 90, top: 45, duration: 2.6, delay: 2.5, size: 13, opacity: 0.4 },
  { left: 10, top: 50, duration: 3.3, delay: 0.3, size: 10, opacity: 0.45 },
  { left: 35, top: 25, duration: 2.9, delay: 1.8, size: 15, opacity: 0.35 },
  { left: 65, top: 70, duration: 2.4, delay: 2.2, size: 9, opacity: 0.5 },
  { left: 80, top: 30, duration: 3.1, delay: 0.7, size: 11, opacity: 0.4 },
  { left: 20, top: 90, duration: 2.7, delay: 1.3, size: 12, opacity: 0.35 },
  { left: 50, top: 55, duration: 3.4, delay: 2.8, size: 10, opacity: 0.45 },
  { left: 40, top: 10, duration: 2.3, delay: 0.1, size: 14, opacity: 0.3 },
  { left: 75, top: 80, duration: 3.6, delay: 1.9, size: 8, opacity: 0.5 },
];

// =============================================================================
// CSS KEYFRAMES
// =============================================================================

const PULSE_KEYFRAMES = `
  @keyframes floating-stars-pulse {
    0%, 100% {
      opacity: var(--star-opacity);
      transform: scale(1);
    }
    50% {
      opacity: calc(var(--star-opacity) * 1.5);
      transform: scale(1.15);
    }
  }
`;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * FloatingStars - Decorative floating star particles
 *
 * A self-contained decoration component that renders pulsing sparkle
 * icons across its container. Used for ambient magical effects in
 * hero sections and other decorative areas.
 *
 * @features
 * - Pre-defined positions to avoid hydration mismatch
 * - Respects reduced motion preferences
 * - Uses theme primary color by default
 * - Fully customizable star configurations
 *
 * @example
 * ```tsx
 * <div className="relative h-screen">
 *   <FloatingStars />
 *   <HeroContent />
 * </div>
 * ```
 */
export const FloatingStars = memo(
  forwardRef<HTMLDivElement, FloatingStarsProps>(function FloatingStars(
    {
      className = "",
      starColor = primary.main,
      count,
      stars: customStars,
      "data-testid": testId,
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Use custom stars, or slice default stars to match count
    const stars = useMemo(() => {
      if (customStars) return customStars;
      if (count && count < DEFAULT_STARS.length) {
        return DEFAULT_STARS.slice(0, count);
      }
      return DEFAULT_STARS;
    }, [customStars, count]);

    return (
      <div
        ref={ref}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        data-testid={testId}
        aria-hidden="true"
      >
        {/* Inject keyframes */}
        <style>{PULSE_KEYFRAMES}</style>

        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              // CSS custom property for animation
              "--star-opacity": star.opacity,
              animation: prefersReducedMotion
                ? "none"
                : `floating-stars-pulse ${star.duration}s ease-in-out infinite`,
              animationDelay: prefersReducedMotion ? "0s" : `${star.delay}s`,
              // Static opacity for reduced motion
              opacity: prefersReducedMotion ? star.opacity : undefined,
            } as React.CSSProperties}
          >
            <Sparkles
              size={star.size}
              color={starColor}
              style={{ opacity: prefersReducedMotion ? 1 : undefined }}
            />
          </div>
        ))}
      </div>
    );
  })
);

FloatingStars.displayName = "FloatingStars";

export default FloatingStars;
