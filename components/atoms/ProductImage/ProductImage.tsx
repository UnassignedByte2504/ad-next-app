"use client";

import { forwardRef, useState } from "react";
import Box from "@mui/material/Box";
import {
  Moon,
  PenTool,
  Image as ImageIcon,
  Heart,
  Palette,
  Gift,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { categoryGradients } from "@/app/ui/theme";
import type { AylaProductImageType } from "@/types/ayla";

// =============================================================================
// TYPES
// =============================================================================

export interface ProductImageProps {
  /** Product image type key */
  type: AylaProductImageType | string;
  /** Additional CSS class */
  className?: string;
  /** Alt text for the image */
  alt?: string;
  /** Whether to show decorative icons */
  showDecorations?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Image configuration mapping product types to assets
 */
const imageConfig: Record<
  string,
  {
    imagePath: string;
    fallbackGradient: { from: string; to: string };
    icon: LucideIcon;
  }
> = {
  planner: {
    imagePath: "/images/products/planner.webp",
    fallbackGradient: categoryGradients.Planners,
    icon: Moon,
  },
  cards: {
    imagePath: "/images/products/business-card.webp",
    fallbackGradient: categoryGradients.Tarjetas,
    icon: PenTool,
  },
  social: {
    imagePath: "/images/products/media-kit.webp",
    fallbackGradient: categoryGradients["Social Media"] || { from: "#C9B8D4", to: "#E8D5B0" },
    icon: ImageIcon,
  },
  wedding: {
    imagePath: "/images/products/wedding-kit.webp",
    fallbackGradient: categoryGradients.Bodas,
    icon: Heart,
  },
  brand: {
    imagePath: "/images/products/brand-kit.webp",
    fallbackGradient: categoryGradients.Branding,
    icon: Palette,
  },
  thanks: {
    imagePath: "/images/products/thank-you.webp",
    fallbackGradient: categoryGradients["Thank You"],
    icon: Gift,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProductImage displays a product image with fallback gradient and decorative icons.
 *
 * ## Features
 * - **Fallback Gradients**: Beautiful category-specific gradients when images fail to load
 * - **Decorative Icons**: Sparkles and category icons for visual interest
 * - **Lazy Loading**: Images load efficiently with native lazy loading
 * - **Theme Integration**: Uses category gradients from theme tokens
 *
 * ## Usage
 * ```tsx
 * <ProductImage type="planner" />
 * <ProductImage type="wedding" showDecorations={false} />
 * ```
 */
export const ProductImage = forwardRef<HTMLDivElement, ProductImageProps>(
  ({ type, className, alt, showDecorations = true }, ref) => {
    const [imageError, setImageError] = useState(false);

    const config = imageConfig[type] || imageConfig.planner;
    const Icon = config.icon;
    const imageUrl = config.imagePath;

    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${config.fallbackGradient.from} 0%, ${config.fallbackGradient.to} 100%)`,
        }}
      >
        {/* Product Image */}
        {!imageError && (
          <Box
            component="img"
            src={imageUrl}
            alt={alt || `${type} design`}
            loading="lazy"
            onError={() => setImageError(true)}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.5s ease",
            }}
          />
        )}

        {/* Overlay gradient */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Decorative elements */}
        {showDecorations && (
          <>
            {/* Top-right sparkle */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                opacity: 0.4,
              }}
            >
              <Sparkles size={24} color="#ffffff" />
            </Box>

            {/* Bottom-left category icon */}
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                opacity: 0.4,
              }}
            >
              <Icon size={20} color="#ffffff" />
            </Box>
          </>
        )}
      </Box>
    );
  }
);

ProductImage.displayName = "ProductImage";
export default ProductImage;
