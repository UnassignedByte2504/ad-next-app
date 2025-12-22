"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  AylaProduct,
  AylaCartItem,
  AylaToast,
  AylaStoreState,
  AylaStoreActions,
} from "@types";

// =============================================================================
// TYPES
// =============================================================================

interface AylaContextValue extends AylaStoreState, AylaStoreActions {}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: AylaStoreState = {
  cartItems: [],
  isCartOpen: false,
  selectedProduct: null,
  toast: {
    visible: false,
    message: "",
    variant: "success",
  },
};

// =============================================================================
// REDUCER
// =============================================================================

type Action =
  | { type: "ADD_TO_CART"; payload: AylaProduct }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "SET_SELECTED_PRODUCT"; payload: AylaProduct | null }
  | { type: "SHOW_TOAST"; payload: AylaToast }
  | { type: "HIDE_TOAST" };

function aylaReducer(state: AylaStoreState, action: Action): AylaStoreState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };

    case "SET_CART_OPEN":
      return {
        ...state,
        isCartOpen: action.payload,
      };

    case "SET_SELECTED_PRODUCT":
      return {
        ...state,
        selectedProduct: action.payload,
      };

    case "SHOW_TOAST":
      return {
        ...state,
        toast: action.payload,
      };

    case "HIDE_TOAST":
      return {
        ...state,
        toast: { ...state.toast, visible: false },
      };

    default:
      return state;
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

const AylaContext = createContext<AylaContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export interface AylaProviderProps {
  children: ReactNode;
  /** Initial cart items (for SSR or testing) */
  initialCartItems?: AylaCartItem[];
}

/**
 * AylaProvider - Context provider for Ayla Designs store
 *
 * Manages:
 * - Cart items (add, remove, update quantity)
 * - Cart drawer open state
 * - Selected product for modal
 * - Toast notifications
 *
 * @example
 * ```tsx
 * <AylaProvider>
 *   <AylaPageContent />
 * </AylaProvider>
 * ```
 */
export function AylaProvider({ children, initialCartItems }: AylaProviderProps) {
  const [state, dispatch] = useReducer(aylaReducer, {
    ...initialState,
    cartItems: initialCartItems || [],
  });

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const addToCart = useCallback((product: AylaProduct) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: "SET_CART_OPEN", payload: true });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: "SET_CART_OPEN", payload: false });
  }, []);

  const openProductModal = useCallback((product: AylaProduct) => {
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: product });
  }, []);

  const closeProductModal = useCallback(() => {
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: null });
  }, []);

  const showToast = useCallback(
    (message: string, variant: AylaToast["variant"] = "success") => {
      dispatch({
        type: "SHOW_TOAST",
        payload: { visible: true, message, variant },
      });

      // Auto-hide after 2.5 seconds
      setTimeout(() => {
        dispatch({ type: "HIDE_TOAST" });
      }, 2500);
    },
    []
  );

  const hideToast = useCallback(() => {
    dispatch({ type: "HIDE_TOAST" });
  }, []);

  // ==========================================================================
  // DERIVED VALUES
  // ==========================================================================

  const cartTotal = useMemo(() => {
    return state.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [state.cartItems]);

  const cartItemCount = useMemo(() => {
    return state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.cartItems]);

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const value = useMemo<AylaContextValue>(
    () => ({
      // State
      cartItems: state.cartItems,
      isCartOpen: state.isCartOpen,
      selectedProduct: state.selectedProduct,
      toast: state.toast,

      // Derived
      cartTotal,
      cartItemCount,

      // Actions
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      openProductModal,
      closeProductModal,
      showToast,
      hideToast,
    }),
    [
      state.cartItems,
      state.isCartOpen,
      state.selectedProduct,
      state.toast,
      cartTotal,
      cartItemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      openProductModal,
      closeProductModal,
      showToast,
      hideToast,
    ]
  );

  return <AylaContext.Provider value={value}>{children}</AylaContext.Provider>;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * useAyla - Access the Ayla store context
 *
 * @throws Error if used outside of AylaProvider
 *
 * @example
 * ```tsx
 * const { cartItems, addToCart, showToast } = useAyla();
 *
 * const handleAdd = () => {
 *   addToCart(product);
 *   showToast(`${product.name} añadido al carrito`);
 * };
 * ```
 */
export function useAyla(): AylaContextValue {
  const context = useContext(AylaContext);

  if (!context) {
    throw new Error("useAyla must be used within an AylaProvider");
  }

  return context;
}

export default AylaProvider;
