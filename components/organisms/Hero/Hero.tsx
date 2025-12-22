"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

import { Button } from "@atoms/Button";
import { springs, durations, easings, neutral } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface HeroProps {
  /** Main headline text */
  headline: string;
  /** Optional subheadline */
  subheadline?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Secondary CTA text */
  secondaryCtaText?: string;
  /** Secondary CTA href */
  secondaryCtaHref?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Background video URL (takes precedence over image) */
  backgroundVideo?: string;
  /** Overlay type */
  overlay?: "none" | "dark" | "light" | "gradient";
  /** Height variant */
  height?: "full" | "large" | "medium" | "small";
  /** Content alignment */
  align?: "left" | "center" | "right";
  /** Content vertical position */
  verticalAlign?: "top" | "center" | "bottom";
  /** Custom content below headline */
  children?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Click handler for CTA */
  onCtaClick?: () => void;
  /** Click handler for secondary CTA */
  onSecondaryCtaClick?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const heightMap = {
  full: "100vh",
  large: "80vh",
  medium: "60vh",
  small: "40vh",
};

const overlayStyles = {
  none: "transparent",
  dark: `${neutral[1000]}B3`, // 70% opacity
  light: `${neutral[50]}80`, // 50% opacity
  gradient: `linear-gradient(180deg, ${neutral[1000]}00 0%, ${neutral[1000]}CC 100%)`,
};

const alignMap = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const verticalAlignMap = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Hero - Full-width hero section with background, headline, and CTAs.
 *
 * Features:
 * - Background image/video support
 * - Multiple overlay options
 * - Responsive typography
 * - Animated entrance
 * - Multiple height variants
 * - Flexible content alignment
 *
 * @example
 * ```tsx
 * <Hero
 *   headline="Conoce la música en vivo de tu localidad"
 *   subheadline="Conecta con músicos cerca de ti"
 *   ctaText="Únete hoy"
 *   ctaHref="/signup"
 *   backgroundImage="/images/concert.jpg"
 *   overlay="gradient"
 * />
 * ```
 */
export const Hero = forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      headline,
      subheadline,
      ctaText,
      ctaHref,
      secondaryCtaText,
      secondaryCtaHref,
      backgroundImage,
      backgroundVideo,
      overlay = "dark",
      height = "large",
      align = "center",
      verticalAlign = "center",
      children,
      className,
      onCtaClick,
      onSecondaryCtaClick,
    },
    ref
  ) => {
    const hasBackground = backgroundImage || backgroundVideo;
    const hasCta = ctaText && (ctaHref || onCtaClick);
    const hasSecondaryCta = secondaryCtaText && (secondaryCtaHref || onSecondaryCtaClick);

    return (
      <Box
        ref={ref}
        component="section"
        className={className}
        sx={{
          position: "relative",
          minHeight: heightMap[height],
          display: "flex",
          alignItems: verticalAlignMap[verticalAlign],
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Background Video */}
        {backgroundVideo && (
          <Box
            component="video"
            autoPlay
            muted
            loop
            playsInline
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </Box>
        )}

        {/* Background Image */}
        {backgroundImage && !backgroundVideo && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        )}

        {/* Overlay */}
        {hasBackground && overlay !== "none" && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: overlayStyles[overlay],
              zIndex: 1,
            }}
          />
        )}

        {/* Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            py: { xs: 8, md: 12 },
            display: "flex",
            flexDirection: "column",
            alignItems: alignMap[align],
            textAlign: align,
          }}
        >
          {/* Headline */}
          <MotionTypography
            variant="h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.smooth}
            sx={{
              color: hasBackground ? "common.white" : "text.primary",
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
              lineHeight: 1.2,
              maxWidth: "900px",
              textShadow: hasBackground ? `0 2px 40px ${neutral[1000]}80` : "none",
            }}
          >
            {headline}
          </MotionTypography>

          {/* Subheadline */}
          {subheadline && (
            <MotionTypography
              variant="h5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.1 }}
              sx={{
                color: hasBackground ? `${neutral[50]}CC` : "text.secondary",
                fontWeight: 400,
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                maxWidth: "700px",
                mt: { xs: 2, md: 3 },
                textShadow: hasBackground ? `0 1px 20px ${neutral[1000]}60` : "none",
              }}
            >
              {subheadline}
            </MotionTypography>
          )}

          {/* Custom Children */}
          {children && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.15 }}
              sx={{ mt: { xs: 3, md: 4 } }}
            >
              {children}
            </MotionBox>
          )}

          {/* CTA Buttons */}
          {(hasCta || hasSecondaryCta) && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.2 }}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: { xs: 4, md: 5 },
              }}
            >
              {hasCta && (
                <Button
                  variant="contained"
                  size="large"
                  href={ctaHref}
                  onClick={onCtaClick}
                  sx={{
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    transition: `all ${durations.fast}ms ${easings.default}`,
                  }}
                >
                  {ctaText}
                </Button>
              )}
              {hasSecondaryCta && (
                <Button
                  variant="outlined"
                  size="large"
                  href={secondaryCtaHref}
                  onClick={onSecondaryCtaClick}
                  sx={{
                    px: { xs: 4, md: 6 },
                    py: { xs: 1.5, md: 2 },
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    borderColor: hasBackground ? "common.white" : undefined,
                    color: hasBackground ? "common.white" : undefined,
                    "&:hover": {
                      borderColor: hasBackground ? "common.white" : undefined,
                      bgcolor: hasBackground ? `${neutral[50]}1A` : undefined,
                    },
                  }}
                >
                  {secondaryCtaText}
                </Button>
              )}
            </MotionBox>
          )}
        </Container>
      </Box>
    );
  }
);

Hero.displayName = "Hero";

export default Hero;
