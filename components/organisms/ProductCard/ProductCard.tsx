"use client";

import { forwardRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, Plus, Check } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms/Button";
import { Chip } from "@/components/atoms/Chip";
import { ProductImage } from "@/components/atoms/ProductImage";
import {
  springs,
  primary,
  neutral,
  shadows,
  semantic,
  categoryColors,
  fontFamilies,
} from "@/app/ui/theme";
import type { AylaProduct } from "@/types/ayla";

// =============================================================================
// TYPES
// =============================================================================

export interface ProductCardProps {
  /** Product data */
  product: AylaProduct;
  /** Callback when "Add to Cart" is clicked */
  onAddToCart?: (product: AylaProduct) => void;
  /** Callback when "View Product" is clicked or card is clicked */
  onViewProduct?: (product: AylaProduct) => void;
  /** Index for staggered animation */
  index?: number;
  /** Additional CSS class */
  className?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get category color from theme, with fallback
 */
const getCategoryColor = (category: string): string => {
  const colors = categoryColors as Record<string, string>;
  return colors[category] || "#C9B8D4"; // Default to Planners color
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProductCard displays a product with image, category, title, description, and price.
 *
 * ## Features
 * - **Hover Overlay**: Action buttons appear on hover
 * - **Add to Cart Feedback**: Visual confirmation when item is added
 * - **M3 Expressive Animation**: Scale and shadow on hover
 * - **Reduced Motion Support**: Respects user's motion preferences
 * - **Atomic Composition**: Uses Button, Chip, and ProductImage atoms
 * - **Theme Integration**: Uses categoryColors, fontFamilies from theme
 *
 * ## Usage
 * ```tsx
 * <ProductCard
 *   product={product}
 *   onAddToCart={(p) => addToCart(p)}
 *   onViewProduct={(p) => openModal(p)}
 * />
 * ```
 */
export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onAddToCart, onViewProduct, index = 0, className = "" }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart?.(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleViewProduct = (e: React.MouseEvent) => {
      e.stopPropagation();
      onViewProduct?.(product);
    };

    // Get category color from theme
    const chipColor = getCategoryColor(product.category);

    // Animation variants
    const cardVariants = {
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 30,
      },
      visible: {
        opacity: 1,
        y: 0,
      },
    };

    return (
      <motion.div
        ref={ref}
        className={`group relative w-full cursor-pointer ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={cardVariants}
        transition={{
          ...springs.gentle,
          delay: index * 0.1,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewProduct?.(product)}
      >
        {/* Image container with 4:5 aspect ratio */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 5",
            borderRadius: "16px",
            overflow: "hidden",
            transition: "all 0.5s ease",
            transform: isHovered ? "scale(1.02)" : "scale(1)",
            boxShadow: isHovered ? shadows.cardHover : shadows.card,
          }}
        >
          <ProductImage type={product.imageType} className="w-full h-full" />

          {/* Category badge using Chip atom with categoryColors */}
          <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
            <Chip
              label={product.category}
              size="small"
              sx={{
                bgcolor: `${chipColor}E6`, // 90% opacity
                color: neutral[800],
                fontFamily: fontFamilies.body,
                fontWeight: 500,
                fontSize: "0.75rem",
                borderRadius: "9999px", // Pill shape per branding
                backdropFilter: "blur(4px)",
                "& .MuiChip-label": {
                  px: 1.5,
                  py: 0.5,
                },
              }}
            />
          </Box>

          {/* Hover overlay with actions */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 2.5,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              background: `linear-gradient(to top, ${neutral[900]}E6 0%, ${neutral[900]}80 50%, transparent 100%)`,
            }}
          >
            <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
              {/* View More button */}
              <Button
                variant="outlined"
                onClick={handleViewProduct}
                startIcon={<Eye size={16} />}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  py: 1,
                  borderRadius: "9999px", // Pill per branding
                  fontFamily: fontFamilies.body,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(4px)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  textTransform: "none",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                  },
                }}
              >
                Ver más
              </Button>

              {/* Add to Cart button with gradient per branding */}
              <Button
                variant="contained"
                onClick={handleAddToCart}
                startIcon={addedToCart ? <Check size={16} /> : <Plus size={16} />}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  py: 1,
                  borderRadius: "9999px", // Pill per branding
                  fontFamily: fontFamilies.body,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  background: addedToCart
                    ? semantic.success.main
                    : `linear-gradient(to right, ${primary.main}, ${primary.light})`,
                  color: addedToCart ? "white" : neutral[900],
                  textTransform: "none",
                  boxShadow: addedToCart
                    ? "none"
                    : `0 4px 14px rgba(245, 158, 11, 0.25)`,
                  "&:hover": {
                    background: addedToCart
                      ? semantic.success.main
                      : `linear-gradient(to right, ${primary.dark}, ${primary.main})`,
                    boxShadow: addedToCart
                      ? "none"
                      : `0 6px 20px rgba(245, 158, 11, 0.35)`,
                  },
                }}
              >
                {addedToCart ? "¡Añadido!" : "Añadir"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Product info */}
        <Box sx={{ mt: 2, px: 0.5 }}>
          {/* Product title - Cormorant Garamond per branding */}
          <Typography
            component="h3"
            sx={{
              fontFamily: fontFamilies.heading,
              fontSize: "1.125rem",
              fontWeight: 600,
              lineHeight: 1.3,
              color: isHovered ? primary.dark : neutral[800],
              transition: "color 0.2s ease",
            }}
          >
            {product.name}
          </Typography>

          {/* Description - Nunito Sans per branding */}
          <Typography
            sx={{
              mt: 0.5,
              fontFamily: fontFamilies.body,
              fontSize: "0.875rem",
              lineHeight: 1.5,
              color: neutral[500],
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>

          {/* Price - Cormorant Garamond per branding */}
          <Typography
            sx={{
              mt: 1,
              fontFamily: fontFamilies.heading,
              fontSize: "1.25rem",
              fontWeight: 600,
              color: neutral[800],
            }}
          >
            €{product.price.toFixed(2)}
          </Typography>
        </Box>
      </motion.div>
    );
  }
);

ProductCard.displayName = "ProductCard";
export default ProductCard;
