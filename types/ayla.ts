/**
 * Ayla Designs Domain Types
 *
 * Types for the Ayla e-commerce landing page components.
 * Used across products, cart, reviews, and avatar components.
 */

// =============================================================================
// PRODUCT TYPES
// =============================================================================

/**
 * Product item in the Ayla catalog
 */
export interface AylaProduct {
  /** Unique product identifier */
  id: number;
  /** Product display name */
  name: string;
  /** Product description */
  description: string;
  /** Price in USD */
  price: number;
  /** Product category (Planners, Tarjetas, Social Media, etc.) */
  category: string;
  /** Image type key for ProductImage component */
  imageType: string;
  /** List of product features/benefits */
  features: string[];
}

/**
 * Cart item extends product with quantity
 */
export interface AylaCartItem extends AylaProduct {
  /** Quantity in cart */
  quantity: number;
}

// =============================================================================
// REVIEW TYPES
// =============================================================================

/**
 * Avatar color variants for testimonials
 */
export type AylaAvatarColor = "gold" | "lavender" | "rose";

/**
 * Customer review/testimonial
 */
export interface AylaReview {
  /** Reviewer's name */
  name: string;
  /** Reviewer's role/profession */
  role: string;
  /** Review text */
  text: string;
  /** Rating (1-5) */
  rating: number;
  /** Avatar gradient color */
  color: AylaAvatarColor;
}

// =============================================================================
// PRODUCT IMAGE TYPES
// =============================================================================

/**
 * Product image type keys
 */
export type AylaProductImageType =
  | "planner"
  | "cards"
  | "social"
  | "wedding"
  | "brand"
  | "thanks";

/**
 * Image configuration for product types
 */
export interface AylaImageConfig {
  /** Path to the product image */
  imagePath: string;
  /** Fallback gradient colors */
  fallbackGradient: {
    from: string;
    to: string;
  };
  /** Icon component name */
  iconName: "Moon" | "PenTool" | "Image" | "Heart" | "Palette" | "Gift";
}

// =============================================================================
// TOAST TYPES
// =============================================================================

/**
 * Toast notification state
 */
export interface AylaToast {
  /** Whether toast is visible */
  visible: boolean;
  /** Toast message */
  message: string;
  /** Toast variant */
  variant?: "success" | "info" | "warning" | "error";
}

// =============================================================================
// STORE TYPES
// =============================================================================

/**
 * Ayla page store state
 */
export interface AylaStoreState {
  /** Items in cart */
  cartItems: AylaCartItem[];
  /** Whether cart drawer is open */
  isCartOpen: boolean;
  /** Currently selected product for modal */
  selectedProduct: AylaProduct | null;
  /** Toast notification state */
  toast: AylaToast;
  /** Computed: Total cart value */
  cartTotal?: number;
  /** Computed: Total item count */
  cartItemCount?: number;
}

/**
 * Ayla page store actions
 */
export interface AylaStoreActions {
  /** Add product to cart */
  addToCart: (product: AylaProduct) => void;
  /** Remove product from cart */
  removeFromCart: (id: number) => void;
  /** Update item quantity */
  updateQuantity: (id: number, quantity: number) => void;
  /** Clear all items from cart */
  clearCart: () => void;
  /** Open cart drawer */
  openCart: () => void;
  /** Close cart drawer */
  closeCart: () => void;
  /** Open product modal */
  openProductModal: (product: AylaProduct) => void;
  /** Close product modal */
  closeProductModal: () => void;
  /** Show toast notification */
  showToast: (message: string, variant?: AylaToast["variant"]) => void;
  /** Hide toast notification */
  hideToast: () => void;
}
