import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Cart } from "./Cart";
import type { AylaCartItem } from "@types";

// =============================================================================
// MOCK DATA
// =============================================================================

const mockItems: AylaCartItem[] = [
  {
    id: 1,
    name: "Celestial Planner 2025",
    description: "Planificador digital completo",
    price: 24.99,
    category: "Planners",
    imageType: "planner",
    features: ["12 meses completos"],
    quantity: 1,
  },
  {
    id: 3,
    name: "Crystal Social Media Kit",
    description: "Kit completo para Instagram",
    price: 29.99,
    category: "Social Media",
    imageType: "social",
    features: ["30 plantillas"],
    quantity: 2,
  },
];

const singleItem: AylaCartItem[] = [
  {
    id: 5,
    name: "Mystic Brand Kit",
    description: "Kit de branding completo",
    price: 49.99,
    category: "Branding",
    imageType: "brand",
    features: ["Logo editable"],
    quantity: 1,
  },
];

const manyItems: AylaCartItem[] = [
  {
    id: 1,
    name: "Celestial Planner 2025",
    description: "Planificador digital completo",
    price: 24.99,
    category: "Planners",
    imageType: "planner",
    features: [],
    quantity: 1,
  },
  {
    id: 2,
    name: "Bohemian Business Cards",
    description: "Pack de 5 plantillas",
    price: 12.99,
    category: "Tarjetas",
    imageType: "cards",
    features: [],
    quantity: 3,
  },
  {
    id: 3,
    name: "Crystal Social Media Kit",
    description: "Kit completo para Instagram",
    price: 29.99,
    category: "Social Media",
    imageType: "social",
    features: [],
    quantity: 1,
  },
  {
    id: 4,
    name: "Moonlight Wedding Suite",
    description: "Suite completa de papelería",
    price: 39.99,
    category: "Bodas",
    imageType: "wedding",
    features: [],
    quantity: 1,
  },
  {
    id: 5,
    name: "Mystic Brand Kit",
    description: "Kit de branding completo",
    price: 49.99,
    category: "Branding",
    imageType: "brand",
    features: [],
    quantity: 2,
  },
];

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof Cart> = {
  title: "Organisms/Cart",
  component: Cart,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Sliding drawer cart component with item management.

## Features
- Animated slide-in from right
- Cart items with quantity controls
- Empty state with decorative icon
- Subtotal calculation
- Checkout button
- Keyboard accessible (Escape to close)
- Click outside to close

## Usage
\`\`\`tsx
<Cart
  items={cartItems}
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  onUpdateQuantity={updateQuantity}
  onRemove={removeItem}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Cart>;

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

const InteractiveWrapper = ({
  initialItems,
}: {
  initialItems: AylaCartItem[];
}) => {
  const [items, setItems] = useState(initialItems);
  const [isOpen, setIsOpen] = useState(true);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-amber-500 text-white rounded-lg"
      >
        Open Cart ({items.length} items)
      </button>
      <Cart
        items={items}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onCheckout={fn()}
      />
    </div>
  );
};

// =============================================================================
// STORIES
// =============================================================================

/**
 * Cart with multiple items
 */
export const Default: Story = {
  render: () => <InteractiveWrapper initialItems={mockItems} />,
};

/**
 * Empty cart state
 */
export const Empty: Story = {
  render: () => <InteractiveWrapper initialItems={[]} />,
};

/**
 * Cart with single item
 */
export const SingleItem: Story = {
  render: () => <InteractiveWrapper initialItems={singleItem} />,
};

/**
 * Cart with many items (scrollable)
 */
export const ManyItems: Story = {
  render: () => <InteractiveWrapper initialItems={manyItems} />,
};

/**
 * Closed state (for documentation)
 */
export const Closed: Story = {
  args: {
    items: mockItems,
    isOpen: false,
    onClose: fn(),
    onUpdateQuantity: fn(),
    onRemove: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "When isOpen is false, the cart drawer is hidden.",
      },
    },
  },
};

/**
 * High total value
 */
export const HighValue: Story = {
  render: () => (
    <InteractiveWrapper
      initialItems={[
        {
          id: 1,
          name: "Premium Bundle",
          description: "Everything included",
          price: 199.99,
          category: "Bundles",
          imageType: "brand",
          features: [],
          quantity: 5,
        },
      ]}
    />
  ),
};
