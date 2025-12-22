"use client";

import { forwardRef, memo, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Moon } from "lucide-react";
import { ProductImage } from "@atoms";
import { primary, neutral, springs, shadows } from "@/app/ui/theme";
import type { AylaCartItem } from "@types";
import Box from "@mui/material/Box";
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
}

const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <Box
      className="flex gap-4 p-4 rounded-xl"
      style={{
        background: "white",
        border: `1px solid ${primary.light}33`,
        boxShadow: shadows.sm,
      }}
    >
      {/* Product image */}
      <Box className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
        <ProductImage type={item.imageType} className="w-full h-full" />
      </Box>

      {/* Item details */}
      <Box className="flex-1 min-w-0">
        <h4
          className="font-medium truncate text-sm"
          style={{ color: neutral[800] }}
        >
          {item.name}
        </h4>
        <p className="text-sm font-semibold" style={{ color: primary.main }}>
          €{item.price.toFixed(2)}
        </p>

        {/* Quantity controls */}
        <Box className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded transition-colors"
            style={{ background: `${primary.light}33` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${primary.light}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${primary.light}33`;
            }}
            aria-label="Decrease quantity"
          >
            <Minus size={14} style={{ color: neutral[600] }} />
          </button>

          <span
            className="w-6 text-center font-medium text-sm"
            style={{ color: neutral[700] }}
          >
            {item.quantity}
          </span>

          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded transition-colors"
            style={{ background: `${primary.light}33` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${primary.light}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${primary.light}33`;
            }}
            aria-label="Increase quantity"
          >
            <Plus size={14} style={{ color: neutral[600] }} />
          </button>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto p-1 rounded transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FEE2E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            aria-label={`Remove ${item.name} from cart`}
          >
            <X size={14} className="text-red-500" />
          </button>
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
    const prefersReducedMotion = useReducedMotion();

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
              className="fixed inset-0 z-40"
              style={{
                background: `${neutral[900]}80`, // 50% opacity
                backdropFilter: "blur(4px)",
              }}
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Cart drawer */}
            <motion.div
              ref={ref}
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed top-0 right-0 h-full w-full max-w-md z-50 ${className}`}
              style={{
                background: neutral[50],
                boxShadow: shadows.xl,
              }}
              data-testid={testId}
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
            >
              <Box className="h-full flex flex-col">
                {/* Header */}
                <Box
                  className="p-6 flex items-center justify-between"
                  style={{
                    background: "white",
                    borderBottom: `1px solid ${primary.light}40`,
                  }}
                >
                  <Box className="flex items-center gap-3">
                    <ShoppingCart size={24} style={{ color: primary.dark }} />
                    <h2
                      className="font-serif text-2xl"
                      style={{ color: neutral[800] }}
                    >
                      Tu Carrito
                    </h2>
                  </Box>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full transition-colors"
                    style={{ background: "transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${primary.light}33`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                    aria-label="Close cart"
                  >
                    <X size={24} style={{ color: neutral[600] }} />
                  </button>
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
                      <p
                        className="font-medium"
                        style={{ color: neutral[500] }}
                      >
                        Tu carrito está vacío
                      </p>
                      <p className="text-sm mt-1" style={{ color: neutral[400] }}>
                        Explora nuestros diseños bohemios
                      </p>
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
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Footer with subtotal and checkout */}
                {items.length > 0 && (
                  <Box
                    className="p-6"
                    style={{
                      background: "white",
                      borderTop: `1px solid ${primary.light}40`,
                    }}
                  >
                    <Box className="flex justify-between items-center mb-4">
                      <span style={{ color: neutral[600] }}>Subtotal</span>
                      <span
                        className="font-serif text-2xl"
                        style={{ color: neutral[800] }}
                      >
                        €{total.toFixed(2)}
                      </span>
                    </Box>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 font-semibold rounded-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
                      Finalizar Compra
                    </button>

                    <p
                      className="text-center text-xs mt-3"
                      style={{ color: neutral[400] }}
                    >
                      Pago seguro · Descarga instantánea
                    </p>
                  </Box>
                )}
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  })
);

Cart.displayName = "Cart";

export default Cart;
