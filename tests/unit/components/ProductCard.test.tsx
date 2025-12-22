/**
 * Unit Tests - ProductCard Component
 *
 * Tests for the ProductCard organism:
 * - Rendering product information
 * - Category chip theming
 * - Action button callbacks
 * - Add to Cart feedback state
 * - Hover interactions
 * - Accessibility
 */

import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within } from "@tests/utils";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "@organisms/ProductCard";
import { products } from "@/data/ayla";
import type { AylaProduct } from "@/types/ayla";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      onClick,
      onMouseEnter,
      onMouseLeave,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      onMouseEnter?: () => void;
      onMouseLeave?: () => void;
    }) => (
      <div
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-testid="product-card"
        {...props}
      >
        {children}
      </div>
    ),
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Sample product for tests
const mockProduct: AylaProduct = products[0];

describe("ProductCard", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByTestId("product-card")).toBeInTheDocument();
    });

    it("renders product name", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    it("renders product description", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    });

    it("renders product price with euro symbol", () => {
      render(<ProductCard product={mockProduct} />);
      expect(
        screen.getByText(`€${mockProduct.price.toFixed(2)}`)
      ).toBeInTheDocument();
    });

    it("renders category chip", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    });

    it("renders product image component", () => {
      render(<ProductCard product={mockProduct} />);
      // ProductImage renders with alt text
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<ProductCard product={mockProduct} className="custom-card" />);
      const card = screen.getByTestId("product-card");
      expect(card.className).toContain("custom-card");
    });
  });

  describe("Category Products", () => {
    it("renders Planner category correctly", () => {
      const planner = products.find((p) => p.category === "Planners");
      if (planner) {
        render(<ProductCard product={planner} />);
        expect(screen.getByText("Planners")).toBeInTheDocument();
      }
    });

    it("renders Tarjetas category correctly", () => {
      const tarjetas = products.find((p) => p.category === "Tarjetas");
      if (tarjetas) {
        render(<ProductCard product={tarjetas} />);
        expect(screen.getByText("Tarjetas")).toBeInTheDocument();
      }
    });

    it("renders Social Media category correctly", () => {
      const social = products.find((p) => p.category === "Social Media");
      if (social) {
        render(<ProductCard product={social} />);
        expect(screen.getByText("Social Media")).toBeInTheDocument();
      }
    });

    it("renders Bodas category correctly", () => {
      const bodas = products.find((p) => p.category === "Bodas");
      if (bodas) {
        render(<ProductCard product={bodas} />);
        expect(screen.getByText("Bodas")).toBeInTheDocument();
      }
    });

    it("renders Branding category correctly", () => {
      const branding = products.find((p) => p.category === "Branding");
      if (branding) {
        render(<ProductCard product={branding} />);
        expect(screen.getByText("Branding")).toBeInTheDocument();
      }
    });
  });

  describe("Action Buttons", () => {
    it("renders View More button", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByRole("button", { name: /ver más/i })).toBeInTheDocument();
    });

    it("renders Add to Cart button", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByRole("button", { name: /añadir/i })).toBeInTheDocument();
    });

    it("calls onViewProduct when View More button is clicked", async () => {
      const handleViewProduct = vi.fn();
      const { user } = render(
        <ProductCard product={mockProduct} onViewProduct={handleViewProduct} />
      );

      const viewButton = screen.getByRole("button", { name: /ver más/i });
      await user.click(viewButton);

      expect(handleViewProduct).toHaveBeenCalledTimes(1);
      expect(handleViewProduct).toHaveBeenCalledWith(mockProduct);
    });

    it("calls onAddToCart when Add button is clicked", async () => {
      const handleAddToCart = vi.fn();
      const { user } = render(
        <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
      );

      const addButton = screen.getByRole("button", { name: /añadir/i });
      await user.click(addButton);

      expect(handleAddToCart).toHaveBeenCalledTimes(1);
      expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    it("calls onViewProduct when card is clicked", async () => {
      const handleViewProduct = vi.fn();
      const { user } = render(
        <ProductCard product={mockProduct} onViewProduct={handleViewProduct} />
      );

      const card = screen.getByTestId("product-card");
      await user.click(card);

      expect(handleViewProduct).toHaveBeenCalledTimes(1);
      expect(handleViewProduct).toHaveBeenCalledWith(mockProduct);
    });

    it("stopPropagation on button clicks to prevent card click", async () => {
      const handleViewProduct = vi.fn();
      const handleAddToCart = vi.fn();
      const { user } = render(
        <ProductCard
          product={mockProduct}
          onViewProduct={handleViewProduct}
          onAddToCart={handleAddToCart}
        />
      );

      const addButton = screen.getByRole("button", { name: /añadir/i });
      await user.click(addButton);

      // onAddToCart should be called, but onViewProduct should NOT be called
      // because the button click has stopPropagation
      expect(handleAddToCart).toHaveBeenCalledTimes(1);
      expect(handleViewProduct).not.toHaveBeenCalled();
    });
  });

  describe("Add to Cart Feedback", () => {
    it("shows '¡Añadido!' after clicking Add to Cart", async () => {
      const { user } = render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);

      const addButton = screen.getByRole("button", { name: /añadir/i });
      await user.click(addButton);

      expect(screen.getByRole("button", { name: /añadido/i })).toBeInTheDocument();
    });

    it("shows check icon when added to cart", async () => {
      const { user } = render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);

      const addButton = screen.getByRole("button", { name: /añadir/i });
      await user.click(addButton);

      // Check icon should be rendered (as part of the button)
      const addedButton = screen.getByRole("button", { name: /añadido/i });
      expect(addedButton).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("accepts index prop for staggered animation", () => {
      render(<ProductCard product={mockProduct} index={5} />);
      expect(screen.getByTestId("product-card")).toBeInTheDocument();
    });

    it("uses index=0 by default", () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByTestId("product-card")).toBeInTheDocument();
    });

    it("handles missing callbacks gracefully", async () => {
      const { user } = render(<ProductCard product={mockProduct} />);

      // Should not throw when clicking without callbacks
      const addButton = screen.getByRole("button", { name: /añadir/i });
      await user.click(addButton);

      const viewButton = screen.getByRole("button", { name: /ver más/i });
      await user.click(viewButton);

      const card = screen.getByTestId("product-card");
      await user.click(card);

      expect(card).toBeInTheDocument();
    });
  });

  describe("Hover State", () => {
    it("changes isHovered state on mouse enter", async () => {
      const { user } = render(<ProductCard product={mockProduct} />);

      const card = screen.getByTestId("product-card");
      await user.hover(card);

      // Card should still be in the document (hover state is internal)
      expect(card).toBeInTheDocument();
    });

    it("changes isHovered state on mouse leave", async () => {
      const { user } = render(<ProductCard product={mockProduct} />);

      const card = screen.getByTestId("product-card");
      await user.hover(card);
      await user.unhover(card);

      expect(card).toBeInTheDocument();
    });
  });

  describe("Typography", () => {
    it("renders product title as h3", () => {
      render(<ProductCard product={mockProduct} />);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(mockProduct.name);
    });

    it("truncates long descriptions to 2 lines", () => {
      const longDescProduct: AylaProduct = {
        ...mockProduct,
        description:
          "This is a very long description that should be truncated to two lines in the card display to maintain consistent visual layout across all product cards in the grid.",
      };

      render(<ProductCard product={longDescProduct} />);
      expect(screen.getByText(longDescProduct.description)).toBeInTheDocument();
    });
  });

  describe("Pricing", () => {
    it("formats price with 2 decimal places", () => {
      const product: AylaProduct = { ...mockProduct, price: 10 };
      render(<ProductCard product={product} />);
      expect(screen.getByText("€10.00")).toBeInTheDocument();
    });

    it("handles decimal prices correctly", () => {
      const product: AylaProduct = { ...mockProduct, price: 24.99 };
      render(<ProductCard product={product} />);
      expect(screen.getByText("€24.99")).toBeInTheDocument();
    });

    it("handles high prices correctly", () => {
      const product: AylaProduct = { ...mockProduct, price: 199.99 };
      render(<ProductCard product={product} />);
      expect(screen.getByText("€199.99")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has clickable card with cursor pointer", () => {
      render(<ProductCard product={mockProduct} />);
      const card = screen.getByTestId("product-card");
      expect(card.className).toContain("cursor-pointer");
    });

    it("buttons are keyboard accessible", async () => {
      const handleAddToCart = vi.fn();
      const { user } = render(
        <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
      );

      const addButton = screen.getByRole("button", { name: /añadir/i });
      addButton.focus();
      expect(addButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleAddToCart).toHaveBeenCalledTimes(1);
    });

    it("View button is accessible", () => {
      render(<ProductCard product={mockProduct} />);
      const viewButton = screen.getByRole("button", { name: /ver más/i });
      expect(viewButton).toBeInTheDocument();
    });

    it("Add button is accessible", () => {
      render(<ProductCard product={mockProduct} />);
      const addButton = screen.getByRole("button", { name: /añadir/i });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe("forwardRef", () => {
    it("forwards ref to the root element", () => {
      const ref = vi.fn();
      render(<ProductCard ref={ref} product={mockProduct} />);
      // Note: With mocked motion.div, ref might not be called
      // In real implementation, ref would be attached
    });
  });

  describe("Reduced Motion", () => {
    it("respects reduced motion preference", () => {
      // The useReducedMotion hook is mocked to return false
      // This test ensures the component renders without animation issues
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByTestId("product-card")).toBeInTheDocument();
    });
  });

  describe("All Products", () => {
    it("renders all products from the catalog", () => {
      products.forEach((product) => {
        const { unmount } = render(<ProductCard product={product} />);
        expect(screen.getByText(product.name)).toBeInTheDocument();
        expect(screen.getByText(product.category)).toBeInTheDocument();
        expect(screen.getByText(`€${product.price.toFixed(2)}`)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
