"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

import { Avatar } from "@/components/atoms/Avatar";
import { springs, primary, neutral, shadows } from "@/app/ui/theme";
import type { AylaReview, AylaAvatarColor } from "@/types/ayla";

// =============================================================================
// TYPES
// =============================================================================

export interface ReviewCardProps {
  /** Review data */
  review: AylaReview;
  /** Index for staggered animation delay */
  index?: number;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ReviewCard displays a customer testimonial with avatar, rating, and quote.
 *
 * ## Features
 * - **Gradient Avatar**: Uses Ayla-style gradient avatars
 * - **Star Rating**: Visual star rating display
 * - **M3 Expressive Animation**: Scroll-triggered entrance with stagger
 * - **Hover Effects**: Subtle lift and shadow on hover
 * - **Reduced Motion Support**: Respects user's motion preferences
 *
 * ## Usage
 * ```tsx
 * <ReviewCard
 *   review={{
 *     name: "María González",
 *     role: "Wedding Planner",
 *     text: "Amazing designs!",
 *     rating: 5,
 *     color: "gold"
 *   }}
 *   index={0}
 * />
 * ```
 */
export const ReviewCard = forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ review, index = 0, className }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    // Animation variants
    const cardVariants = {
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 40,
      },
      visible: {
        opacity: 1,
        y: 0,
      },
      hover: prefersReducedMotion
        ? {}
        : {
            y: -4,
            boxShadow: shadows.cardHover,
          },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, margin: "-50px" }}
        variants={cardVariants}
        transition={{
          ...springs.gentle,
          delay: index * 0.15,
        }}
        style={{ height: "100%" }}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            border: `1px solid ${primary[100]}`,
            boxShadow: shadows.sm,
            transition: "box-shadow 0.3s ease",
          }}
        >
          {/* Star rating */}
          <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
            {[...Array(review.rating)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={primary[400]}
                color={primary[400]}
              />
            ))}
            {/* Empty stars for ratings less than 5 */}
            {[...Array(5 - review.rating)].map((_, i) => (
              <Star
                key={`empty-${i}`}
                size={16}
                fill="transparent"
                color={neutral[300]}
              />
            ))}
          </Box>

          {/* Review text */}
          <Typography
            variant="body1"
            sx={{
              color: neutral[600],
              fontStyle: "italic",
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            &quot;{review.text}&quot;
          </Typography>

          {/* Reviewer info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              pt: 2,
              borderTop: `1px solid ${primary[100]}`,
            }}
          >
            <Avatar
              initials={review.name.charAt(0)}
              gradientColor={review.color as AylaAvatarColor}
              size="md"
            />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: neutral[800],
                }}
              >
                {review.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: neutral[500],
                }}
              >
                {review.role}
              </Typography>
            </Box>
          </Box>
        </Box>
      </motion.div>
    );
  }
);

ReviewCard.displayName = "ReviewCard";
export default ReviewCard;
