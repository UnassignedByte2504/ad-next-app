"use client";

import { forwardRef, memo, useRef, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sparkles } from "lucide-react";
import { useInView } from "@hooks";
import {
  primary,
  secondary,
  neutral,
  gradients,
  springs,
} from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface GlowCTAProps {
  /** Main heading text */
  title?: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Callback when CTA is clicked (alternative to href) */
  onCtaClick?: () => void;
  /** Custom icon to show above title */
  icon?: ReactNode;
  /** Custom className for the section */
  className?: string;
  /** Test ID for testing purposes */
  "data-testid"?: string;
}

// =============================================================================
// CSS KEYFRAMES
// =============================================================================

const BLOB_KEYFRAMES = `
  @keyframes glow-cta-blob-rotate {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    50% {
      transform: translate(-50%, -50%) rotate(180deg) scale(1, 1.3);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * GlowCTA - Call-to-action section with mouse-following glow effect
 *
 * A dramatic CTA section featuring:
 * - Dark background with mouse-following gradient blob
 * - Blur overlay for dreamlike effect
 * - Animated content entrance
 * - Accessible button with optional link or callback
 *
 * @features
 * - Web Animations API for smooth blob tracking
 * - CSS backdrop-filter for blur effect
 * - Respects reduced motion preferences
 * - Theme token integration
 *
 * @example
 * ```tsx
 * <GlowCTA
 *   title="Ready to transform your brand?"
 *   subtitle="Join hundreds of entrepreneurs who trust Ayla Designs"
 *   ctaText="Get Started"
 *   ctaHref="#products"
 * />
 * ```
 */
export const GlowCTA = memo(
  forwardRef<HTMLElement, GlowCTAProps>(function GlowCTA(
    {
      title = "Ready to transform your brand?",
      subtitle = "Join hundreds of entrepreneurs who trust Ayla Designs to bring their vision to life.",
      ctaText = "Get Started",
      ctaHref = "#products",
      onCtaClick,
      icon,
      className = "",
      "data-testid": testId,
    },
    ref
  ) {
    const sectionRef = useRef<HTMLElement>(null);
    const blobRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const [contentRef, isInView] = useInView<HTMLDivElement>({
      threshold: 0.15,
      triggerOnce: true,
    });

    // Use forwarded ref or internal ref
    const resolvedRef = (ref as React.RefObject<HTMLElement>) || sectionRef;

    // Mouse-following blob effect
    useEffect(() => {
      const section = resolvedRef.current || sectionRef.current;
      const blob = blobRef.current;

      // Skip animation if reduced motion or refs unavailable
      if (!section || !blob || prefersReducedMotion) return;

      const handlePointerMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        blob.animate(
          {
            left: `${x}px`,
            top: `${y}px`,
          },
          { duration: 3000, fill: "forwards" }
        );
      };

      section.addEventListener("pointermove", handlePointerMove);
      return () => section.removeEventListener("pointermove", handlePointerMove);
    }, [resolvedRef, prefersReducedMotion]);

    // Handle CTA click
    const handleCtaClick = (e: React.MouseEvent) => {
      if (onCtaClick) {
        e.preventDefault();
        onCtaClick();
      }
    };

    // Animation variants
    const contentVariants = {
      hidden: { opacity: 0, y: 60 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          ...springs.gentle,
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: springs.gentle,
      },
    };

    return (
      <section
        ref={resolvedRef}
        className={`py-24 relative overflow-hidden ${className}`}
        style={{ background: neutral[850] }}
        data-testid={testId}
      >
        {/* Inject keyframes */}
        <style>{BLOB_KEYFRAMES}</style>

        {/* Animated blob that follows cursor */}
        <div
          ref={blobRef}
          className="absolute pointer-events-none"
          style={{
            width: "40vmax",
            height: "40vmax",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            borderRadius: "50%",
            background: gradients.blob,
            animation: prefersReducedMotion
              ? "none"
              : "glow-cta-blob-rotate 20s infinite",
            opacity: 0.6,
          }}
          aria-hidden="true"
        />

        {/* Blur overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ backdropFilter: "blur(12vmax)" }}
          aria-hidden="true"
        />

        {/* Content */}
        <motion.div
          ref={contentRef}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Icon */}
          <motion.div variants={itemVariants}>
            {icon || (
              <Moon
                className="mx-auto mb-6"
                size={48}
                style={{ color: `${primary.light}66` }} // 40% opacity
              />
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="font-serif text-4xl md:text-5xl text-white mb-4"
          >
            {title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg mb-8"
            style={{ color: neutral[300] }}
          >
            {subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <a
              href={ctaHref}
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${primary.main}, ${primary.light})`,
                color: neutral[900],
                boxShadow: `0 4px 14px ${primary.main}40`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 25px ${primary.main}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 14px ${primary.main}40`;
              }}
            >
              {ctaText}
              <Sparkles size={18} />
            </a>
          </motion.div>
        </motion.div>
      </section>
    );
  })
);

GlowCTA.displayName = "GlowCTA";

export default GlowCTA;
