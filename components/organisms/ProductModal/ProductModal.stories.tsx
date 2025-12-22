import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { ProductModal } from "./ProductModal";
import type { AylaProduct } from "@types";

// =============================================================================
// MOCK DATA
// =============================================================================

const mockProduct: AylaProduct = {
  id: 1,
  name: "Celestial Planner 2025",
  description:
    "Planificador digital completo con fases lunares, seguimiento de hábitos, calendario anual y elementos celestiales. Perfecto para organizar tu vida con un toque de magia.",
  price: 24.99,
  category: "Planners",
  imageType: "planner",
  features: [
    "12 meses completos",
    "Fases lunares",
    "Seguimiento de hábitos",
    "Compatible con GoodNotes",
  ],
};

const weddingProduct: AylaProduct = {
  id: 4,
  name: "Moonlight Wedding Suite",
  description:
    "Suite completa de papelería para bodas: invitaciones, RSVP, menús y programa celestial. Todo lo que necesitas para tu día especial.",
  price: 39.99,
  category: "Bodas",
  imageType: "wedding",
  features: [
    "Invitación + RSVP",
    "Menú + Programa",
    "Números de mesa",
    "Save the date",
  ],
};

const brandProduct: AylaProduct = {
  id: 5,
  name: "Mystic Brand Kit",
  description:
    "Kit de branding completo con logo, paleta de colores, tipografías y elementos gráficos. Ideal para emprendedoras que quieren una identidad visual cohesiva.",
  price: 49.99,
  category: "Branding",
  imageType: "brand",
  features: [
    "Logo editable",
    "Paleta de colores",
    "Guía tipográfica",
    "20+ elementos",
  ],
};

// =============================================================================
// META
// =============================================================================

const meta: Meta<typeof ProductModal> = {
  title: "Organisms/ProductModal",
  component: ProductModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Full-screen modal for displaying product details.

## Features
- Two-column layout with product image
- Star rating and review count
- Features list with checkmarks
- Add to cart button
- Keyboard accessible (Escape to close)
- Click outside to close
- Respects reduced motion preferences

## Usage
\`\`\`tsx
<ProductModal
  product={selectedProduct}
  isOpen={!!selectedProduct}
  onClose={() => setSelectedProduct(null)}
  onAddToCart={handleAddToCart}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    product: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductModal>;

// =============================================================================
// INTERACTIVE WRAPPER
// =============================================================================

const InteractiveWrapper = ({
  product,
  reviewCount,
}: {
  product: AylaProduct;
  reviewCount?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-amber-500 text-white rounded-lg"
      >
        Open Modal
      </button>
      <ProductModal
        product={product}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddToCart={fn()}
        reviewCount={reviewCount}
      />
    </div>
  );
};

// =============================================================================
// STORIES
// =============================================================================

/**
 * Default modal with planner product
 */
export const Default: Story = {
  render: () => <InteractiveWrapper product={mockProduct} />,
};

/**
 * Wedding product variant
 */
export const WeddingProduct: Story = {
  render: () => <InteractiveWrapper product={weddingProduct} />,
};

/**
 * Branding kit variant
 */
export const BrandingProduct: Story = {
  render: () => <InteractiveWrapper product={brandProduct} />,
};

/**
 * With custom review count
 */
export const WithCustomReviews: Story = {
  render: () => <InteractiveWrapper product={mockProduct} reviewCount={128} />,
};

/**
 * Closed state (for documentation)
 */
export const Closed: Story = {
  args: {
    product: mockProduct,
    isOpen: false,
    onClose: fn(),
    onAddToCart: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "When isOpen is false, the modal is not rendered.",
      },
    },
  },
};

/**
 * Product with longer description
 */
export const LongDescription: Story = {
  render: () => (
    <InteractiveWrapper
      product={{
        ...mockProduct,
        description:
          "Planificador digital completo diseñado con amor para emprendedoras y soñadoras. Incluye fases lunares detalladas para cada mes, seguimiento de hábitos personalizable, calendario anual con fechas importantes, y elementos celestiales únicos que harán de tu planificación una experiencia mágica. Compatible con las principales aplicaciones de notas digitales como GoodNotes, Notability y Noteshelf. Cada página está cuidadosamente diseñada para inspirarte y ayudarte a alcanzar tus metas.",
      }}
    />
  ),
};

/**
 * Product with many features
 */
export const ManyFeatures: Story = {
  render: () => (
    <InteractiveWrapper
      product={{
        ...brandProduct,
        features: [
          "Logo principal editable",
          "Variaciones de logo secundarias",
          "Paleta de colores completa",
          "Guía tipográfica detallada",
          "20+ elementos gráficos",
          "Patrones de marca",
          "Iconos personalizados",
          "Mockups incluidos",
        ],
      }}
    />
  ),
};
