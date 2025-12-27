"use client";

import { forwardRef, memo, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { ProductImage } from "@atoms";
import { primary, springs, shadows, zIndex } from "@/app/ui/theme";
import type { AylaCartItem } from "@types";

// =============================================================================
// TYPES
// =============================================================================

export interface CartProps {
  /** Items in the cart */
  items: AylaCartItem[];
  /** Whether the cart drawer is open */
  isOpen: boolean;
  /** Callback to close the cart */
  onClose: () => void;
  /** Callback to update item quantity */
  onUpdateQuantity: (id: number, quantity: number) => void;
  /** Callback to remove an item */
  onRemove: (id: number) => void;
  /** Callback when checkout is clicked */
  onCheckout?: () => void;
  /** Custom className for the drawer */
  className?: string;
  /** Test ID for testing purposes */
  "data-testid"?: string;
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

interface CartItemProps {
  item: AylaCartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  translations: {
    decreaseQuantity: string;
    increaseQuantity: string;
    removeItem: (name: string) => string;
  };
}

const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  translations,
}: CartItemProps) {
  return (
    <Box
      className="flex gap-4 p-4 rounded-xl"
      sx={{
        bgcolor: "background.paper",
        border: `1px solid`,
        borderColor: "divider",
        boxShadow: shadows.sm,
      }}
    >
      {/* Product image */}
      <Box className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
        <ProductImage type={item.imageType} className="w-full h-full" />
      </Box>

      {/* Item details */}
      <Box className="flex-1 min-w-0">
        <Typography
          component="h4"
          sx={{
            fontWeight: 500,
            fontSize: "0.875rem",
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          €{item.price.toFixed(2)}
        </Typography>

        {/* Quantity controls */}
        <Box className="flex items-center gap-2 mt-2">
          <Box
            component="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded transition-colors"
            sx={{
              bgcolor: `${primary.light}33`,
              "&:hover": {
                bgcolor: `${primary.light}66`,
              },
            }}
            aria-label={translations.decreaseQuantity}
          >
            <Minus size={14} style={{ color: "inherit" }} />
          </Box>

          <Typography
            component="span"
            sx={{
              width: 24,
              textAlign: "center",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "text.secondary",
            }}
          >
            {item.quantity}
          </Typography>

          <Box
            component="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded transition-colors"
            sx={{
              bgcolor: `${primary.light}33`,
              "&:hover": {
                bgcolor: `${primary.light}66`,
              },
            }}
            aria-label={translations.increaseQuantity}
          >
            <Plus size={14} style={{ color: "inherit" }} />
          </Box>

          {/* Remove button */}
          <Box
            component="button"
            onClick={() => onRemove(item.id)}
            className="ml-auto p-1 rounded transition-colors"
            sx={{
              bgcolor: "transparent",
              "&:hover": {
                bgcolor: "error.light",
              },
            }}
            aria-label={translations.removeItem(item.name)}
          >
            <X size={14} className="text-red-500" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Cart - Sliding drawer cart component
 *
 * A responsive sidebar cart featuring:
 * - Animated slide-in from right
 * - Cart items with quantity controls
 * - Empty state with decorative icon
 * - Subtotal calculation
 * - Checkout button
 *
 * @features
 * - Framer Motion slide animation
 * - Keyboard accessible (Escape to close)
 * - Body scroll lock when open
 * - Click outside to close
 * - Respects reduced motion preferences
 * - Full i18n support
 * - Semantic theme colors
 *
 * @example
 * ```tsx
 * <Cart
 *   items={cartItems}
 *   isOpen={isCartOpen}
 *   onClose={() => setIsCartOpen(false)}
 *   onUpdateQuantity={updateQuantity}
 *   onRemove={removeItem}
 * />
 * ```
 */
export const Cart = memo(
  forwardRef<HTMLDivElement, CartProps>(function Cart(
    {
      items,
      isOpen,
      onClose,
      onUpdateQuantity,
      onRemove,
      onCheckout,
      className = "",
      "data-testid": testId,
    },
    ref
  ) {
    const t = useTranslations("Components.cart");
    const prefersReducedMotion = useReducedMotion();

    // Translation helpers for CartItem
    const cartItemTranslations = useMemo(
      () => ({
        decreaseQuantity: t("aria.decreaseQuantity"),
        increaseQuantity: t("aria.increaseQuantity"),
        removeItem: (name: string) => t("aria.removeItem", { name }),
      }),
      [t]
    );

    // Calculate total
    const total = useMemo(() => {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items]);

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

    // Lock body scroll when cart is open
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

    // Handle checkout click
    const handleCheckout = useCallback(() => {
      if (onCheckout) {
        onCheckout();
      }
    }, [onCheckout]);

    // Animation variants
    const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };

    const drawerVariants = {
      hidden: {
        x: "100%",
      },
      visible: {
        x: 0,
        transition: prefersReducedMotion
          ? { duration: 0.1 }
          : { ...springs.smooth, duration: 0.5 },
      },
      exit: {
        x: "100%",
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
      },
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
                zIndex: zIndex.drawer - 1,
              }}
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Cart drawer */}
            <Box
              component={motion.div}
              ref={ref}
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed top-0 right-0 h-full w-full max-w-md ${className}`}
              sx={{
                bgcolor: "background.default",
                boxShadow: shadows.xl,
                zIndex: zIndex.drawer,
              }}
              data-testid={testId}
              role="dialog"
              aria-modal="true"
              aria-label={t("aria.shoppingCart")}
            >
              <Box className="h-full flex flex-col">
                {/* Header */}
                <Box
                  className="p-6 flex items-center justify-between"
                  sx={{
                    bgcolor: "background.paper",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box className="flex items-center gap-3">
                    <ShoppingCart size={24} style={{ color: primary.dark }} />
                    <Typography
                      component="h2"
                      sx={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {t("title")}
                    </Typography>
                  </Box>
                  <Box
                    component="button"
                    onClick={onClose}
                    className="p-2 rounded-full transition-colors"
                    sx={{
                      bgcolor: "transparent",
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: `${primary.light}33`,
                      },
                    }}
                    aria-label={t("aria.closeCart")}
                  >
                    <X size={24} />
                  </Box>
                </Box>

                {/* Items */}
                <Box className="flex-1 overflow-y-auto p-6">
                  {items.length === 0 ? (
                    /* Empty state */
                    <Box className="h-full flex flex-col items-center justify-center text-center">
                      <Moon
                        size={48}
                        style={{ color: `${primary.light}66` }}
                        className="mb-4"
                      />
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                        }}
                      >
                        {t("emptyTitle")}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          mt: 0.5,
                          color: "text.disabled",
                        }}
                      >
                        {t("emptySubtitle")}
                      </Typography>
                    </Box>
                  ) : (
                    /* Cart items */
                    <Box className="space-y-4">
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={onUpdateQuantity}
                          onRemove={onRemove}
                          translations={cartItemTranslations}
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Footer with subtotal and checkout */}
                {items.length > 0 && (
                  <Box
                    className="p-6"
                    sx={{
                      bgcolor: "background.paper",
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box className="flex justify-between items-center mb-4">
                      <Typography sx={{ color: "text.secondary" }}>
                        {t("subtotal")}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1.5rem",
                          fontWeight: 600,
                          color: "text.primary",
                        }}
                      >
                        €{total.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box
                      component="button"
                      onClick={handleCheckout}
                      className="w-full py-4 font-semibold rounded-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      sx={{
                        background: `linear-gradient(to right, ${primary.main}, ${primary.light})`,
                        color: "text.primary",
                        boxShadow: shadows.lg,
                        "&:hover": {
                          boxShadow: shadows.xl,
                        },
                      }}
                    >
                      {t("checkout")}
                    </Box>

                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: "0.75rem",
                        mt: 1.5,
                        color: "text.disabled",
                      }}
                    >
                      {t("checkoutNote")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </AnimatePresence>
    );
  })
);

Cart.displayName = "Cart";

export default Cart;
