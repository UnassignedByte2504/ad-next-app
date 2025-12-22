"use client";

import { forwardRef, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { motion, useReducedMotion } from "framer-motion";

import { FeatureCard, type FeatureCardProps } from "@atoms/FeatureCard";
import { springs, shapes } from "@/app/ui/theme";

// =============================================================================
// TYPES
// =============================================================================

export interface FeatureItem {
  /** Unique key */
  key: string;
  /** Icon to display */
  icon: ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Icon color */
  iconColor?: FeatureCardProps["iconColor"];
}

export interface FeaturesSectionProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Array of features to display */
  features: FeatureItem[];
  /** Number of columns (1-4) */
  columns?: 1 | 2 | 3 | 4;
  /** Card variant style */
  cardVariant?: FeatureCardProps["variant"];
  /** Background color variant */
  background?: "default" | "paper" | "subtle";
  /** Content alignment */
  align?: "left" | "center";
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const backgroundStyles = {
  default: "background.default",
  paper: "background.paper",
  subtle: "action.hover",
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * FeaturesSection - Displays a grid of feature cards.
 *
 * Features:
 * - M3 Expressive staggered animations
 * - Responsive grid layout (1-4 columns)
 * - Optional title and subtitle with animations
 * - Multiple background and card variants
 * - Accessible with reduced motion support
 *
 * @example
 * ```tsx
 * <FeaturesSection
 *   title="Why Choose Ayla Designs"
 *   subtitle="Beautiful designs, instant delivery"
 *   features={[
 *     { key: 'personalized', icon: <BrushIcon />, title: 'Personalized', description: '...' },
 *     { key: 'instant', icon: <DownloadIcon />, title: 'Instant Download', description: '...' },
 *     { key: 'quality', icon: <AutoAwesomeIcon />, title: 'Handcrafted', description: '...' },
 *   ]}
 *   columns={3}
 * />
 * ```
 */
export const FeaturesSection = forwardRef<HTMLElement, FeaturesSectionProps>(
  (
    {
      title,
      subtitle,
      features,
      columns = 3,
      cardVariant = "elevated",
      background = "default",
      align = "center",
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();

    // Calculate grid columns based on prop
    const gridColumns = {
      xs: 1,
      sm: Math.min(columns, 2),
      md: columns,
    };

    // Animation variants for header
    const headerVariants = {
      hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
      visible: { opacity: 1, y: 0 },
    };

    // Container variants for staggered children
    const containerVariants = {
      hidden: { opacity: prefersReducedMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : 0.1,
          delayChildren: prefersReducedMotion ? 0 : 0.2,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <Box
        ref={ref}
        component="section"
        className={className}
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: backgroundStyles[background],
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          {(title || subtitle) && (
            <Box
              sx={{
                textAlign: align,
                mb: { xs: 5, md: 8 },
                maxWidth: align === "center" ? 700 : "none",
                mx: align === "center" ? "auto" : 0,
              }}
            >
              {title && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={headerVariants}
                  transition={springs.gentle}
                >
                  <Typography
                    variant="h2"
                    fontWeight={700}
                    sx={{
                      mb: subtitle ? 2 : 0,
                      fontSize: { xs: "2rem", md: "2.75rem" },
                    }}
                  >
                    {title}
                  </Typography>
                </motion.div>
              )}
              {subtitle && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={headerVariants}
                  transition={{ ...springs.gentle, delay: 0.1 }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    fontWeight={400}
                    sx={{
                      lineHeight: 1.6,
                      fontSize: { xs: "1rem", md: "1.125rem" },
                    }}
                  >
                    {subtitle}
                  </Typography>
                </motion.div>
              )}
            </Box>
          )}

          {/* Features Grid */}
          <Grid
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            container
            spacing={{ xs: 3, md: 4 }}
          >
            {features.map((feature) => (
              <Grid
                key={feature.key}
                component={motion.div}
                variants={itemVariants}
                transition={springs.gentle}
                size={{
                  xs: 12 / gridColumns.xs,
                  sm: 12 / gridColumns.sm,
                  md: 12 / gridColumns.md,
                }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  iconColor={feature.iconColor}
                  variant={cardVariant}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }
);

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
