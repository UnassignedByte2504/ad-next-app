"use client";

import { forwardRef, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Star, Check, ShoppingCart } from "lucide-react";
import { ProductImage } from "@atoms";
import { primary, neutral, springs, shadows } from "@/app/ui/theme";
import type { AylaProduct } from "@types";

// =============================================================================
// TYPES
// =============================================================================

export interface ProductModalProps {
  /** Product to display (null when closed) */
  product: AylaProduct | null;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when add to cart is clicked */
  onAddToCart?: (product: AylaProduct) => void;
  /** Custom review count to display */
  reviewCount?: number;
  /** Test ID for testing purposes */
  "data-testid"?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProductModal - Full-screen product detail modal
 *
 * A responsive modal displaying:
 * - Product image with category badge
 * - Star rating and review count
 * - Full description
 * - Features list with checkmarks
 * - Price and add-to-cart button
 *
 * @features
 * - Framer Motion animations with spring physics
 * - Keyboard accessible (Escape to close)
 * - Focus trap considerations
 * - Respects reduced motion preferences
 * - Click outside to close
 *
 * @example
 * ```tsx
 * <ProductModal
 *   product={selectedProduct}
 *   isOpen={!!selectedProduct}
 *   onClose={() => setSelectedProduct(null)}
 *   onAddToCart={handleAddToCart}
 * />
 * ```
 */
export const ProductModal = memo(
  forwardRef<HTMLDivElement, ProductModalProps>(function ProductModal(
    {
      product,
      isOpen,
      onClose,
      onAddToCart,
      reviewCount = 47,
      "data-testid": testId,
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Handle escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Lock body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    // Handle add to cart and close
    const handleAddToCart = useCallback(() => {
      if (product && onAddToCart) {
        onAddToCart(product);
        onClose();
      }
    }, [product, onAddToCart, onClose]);

    // Animation variants
    const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    const modalVariants = {
      hidden: {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.95,
        y: prefersReducedMotion ? 0 : 20,
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springs.smooth,
      },
      exit: {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.95,
        y: prefersReducedMotion ? 0 : 20,
        transition: { duration: 0.2 },
      },
    };

    return (
      <AnimatePresence>
        {isOpen && product && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 z-50"
              style={{
                background: `${neutral[900]}B3`, // 70% opacity
                backdropFilter: "blur(4px)",
              }}
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Modal container */}
            <div
              className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center pointer-events-none"
              data-testid={testId}
            >
              <motion.div
                ref={ref}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="rounded-3xl overflow-hidden flex flex-col md:flex-row pointer-events-auto max-w-4xl w-full max-h-full"
                style={{
                  background: neutral[50],
                  boxShadow: shadows.xl,
                }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
              >
                {/* Image section */}
                <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                  <ProductImage type={product.imageType} />
                  <span
                    className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full"
                    style={{
                      background: `${primary.light}E6`, // 90% opacity
                      color: neutral[800],
                    }}
                  >
                    {product.category}
                  </span>
                </div>

                {/* Content section */}
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto relative">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
                    style={{ background: neutral[200] }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = neutral[300];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = neutral[200];
                    }}
                    aria-label="Close modal"
                  >
                    <X size={20} style={{ color: neutral[600] }} />
                  </button>

                  <div className="flex-1">
                    {/* Title */}
                    <h2
                      id="product-modal-title"
                      className="font-serif text-3xl md:text-4xl pr-10 mb-2"
                      style={{ color: neutral[800] }}
                    >
                      {product.name}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="fill-current"
                          style={{ color: primary.light }}
                        />
                      ))}
                      <span
                        className="text-sm ml-2"
                        style={{ color: neutral[500] }}
                      >
                        ({reviewCount} reseñas)
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="leading-relaxed mb-6"
                      style={{ color: neutral[600] }}
                    >
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4
                        className="text-sm font-semibold mb-3"
                        style={{ color: neutral[700] }}
                      >
                        Incluye:
                      </h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2"
                            style={{ color: neutral[600] }}
                          >
                            <Check
                              size={16}
                              className="flex-shrink-0"
                              style={{ color: primary.main }}
                            />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer with price and CTA */}
                  <div
                    className="pt-4"
                    style={{ borderTop: `1px solid ${primary.light}33` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="font-serif text-3xl"
                        style={{ color: neutral[800] }}
                      >
                        €{product.price.toFixed(2)}
                      </span>
                      <span className="text-sm" style={{ color: neutral[500] }}>
                        Descarga instantánea
                      </span>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full py-4 font-semibold rounded-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(to right, ${primary.main}, ${primary.light})`,
                        color: neutral[900],
                        boxShadow: shadows.lg,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = shadows.xl;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = shadows.lg;
                      }}
                    >
                      <ShoppingCart size={20} />
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  })
);

ProductModal.displayName = "ProductModal";

export default ProductModal;
