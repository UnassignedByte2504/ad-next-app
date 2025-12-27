import type { Meta, StoryObj } from "@storybook/react";
import Box from "@mui/material/Box";
import { FAQAccordion, type FAQItem, type FAQCategory } from "./FAQAccordion";

const meta: Meta<typeof FAQAccordion> = {
  title: "Organisms/FAQAccordion",
  component: FAQAccordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Frequently Asked Questions accordion with search and category support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    grouped: {
      control: "boolean",
      description: "Whether items are grouped by category",
    },
    searchable: {
      control: "boolean",
      description: "Show search input",
    },
    allowMultiple: {
      control: "boolean",
      description: "Allow multiple items expanded",
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: 600, p: 3, bgcolor: "background.paper", borderRadius: 3 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FAQAccordion>;

// Sample FAQ items
const sampleItems: FAQItem[] = [
  {
    id: "1",
    question: "¿Qué es Ayla Designs?",
    answer:
      "Ayla Designs es una tienda online de productos digitales de diseño con estética bohemia. Ofrecemos planners digitales, tarjetas de visita, kits de branding, invitaciones de boda y mucho más para emprendedores y creativos.",
  },
  {
    id: "2",
    question: "¿Cómo puedo comprar un producto?",
    answer:
      "Navega por nuestro catálogo, añade los productos al carrito y completa el checkout con Stripe o PayPal. Recibirás un email con los enlaces de descarga inmediatamente después de la compra.",
  },
  {
    id: "3",
    question: "¿Cómo descargo mis productos?",
    answer:
      "Después de tu compra, recibirás un email con enlaces de descarga. También puedes acceder a todos tus productos desde tu cuenta en la sección 'Mis Descargas'. Los enlaces son válidos durante 30 días.",
  },
  {
    id: "4",
    question: "¿Puedo personalizar los productos?",
    answer:
      "¡Sí! Todos nuestros productos digitales son editables. Incluimos instrucciones detalladas para personalizar colores, textos y elementos en Canva, Adobe o la app correspondiente.",
  },
  {
    id: "5",
    question: "¿Cuál es la política de devoluciones?",
    answer:
      "Debido a la naturaleza digital de nuestros productos, no ofrecemos devoluciones. Sin embargo, si tienes problemas con tu descarga, contacta a soporte y te ayudaremos a resolverlo.",
  },
];

// Sample FAQ categories
const sampleCategories: FAQCategory[] = [
  {
    id: "getting-started",
    title: "Primeros Pasos",
    items: [
      {
        id: "gs-1",
        question: "¿Qué es Ayla Designs?",
        answer:
          "Ayla Designs es una tienda de productos digitales con estética bohemia para emprendedores y creativos.",
      },
      {
        id: "gs-2",
        question: "¿Cómo creo mi cuenta?",
        answer:
          "Puedes registrarte gratis con tu email o a través de Google. Tu cuenta te permite gestionar tus compras y descargas.",
      },
    ],
  },
  {
    id: "products",
    title: "Productos",
    items: [
      {
        id: "p-1",
        question: "¿Qué formatos incluyen los productos?",
        answer:
          "Cada producto incluye formatos para las principales plataformas: Canva, Adobe, GoodNotes, Notability, etc.",
      },
      {
        id: "p-2",
        question: "¿Puedo usar los productos comercialmente?",
        answer:
          "Sí, todos los productos incluyen licencia comercial para uso en tu negocio o proyectos de clientes.",
      },
    ],
  },
  {
    id: "support",
    title: "Soporte y Ayuda",
    items: [
      {
        id: "s-1",
        question: "¿Cómo contacto con soporte?",
        answer:
          "Puedes enviarnos un email a soporte@ayladesigns.me o usar el chat de la web. Respondemos en 24h.",
      },
      {
        id: "s-2",
        question: "¿Qué hago si no puedo descargar?",
        answer:
          "Verifica tu conexión e intenta de nuevo. Si persiste, contacta soporte con tu número de pedido.",
      },
    ],
  },
];

/**
 * Default FAQ accordion.
 */
export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

/**
 * With search functionality.
 */
export const Searchable: Story = {
  args: {
    items: sampleItems,
    searchable: true,
  },
};

/**
 * Allow multiple expanded.
 */
export const MultipleExpanded: Story = {
  args: {
    items: sampleItems,
    allowMultiple: true,
  },
};

/**
 * With default expanded item.
 */
export const DefaultExpanded: Story = {
  args: {
    items: sampleItems,
    defaultExpanded: "1",
  },
};

/**
 * Grouped by category.
 */
export const Grouped: Story = {
  args: {
    items: sampleCategories,
    grouped: true,
  },
};

/**
 * Grouped with search.
 */
export const GroupedSearchable: Story = {
  args: {
    items: sampleCategories,
    grouped: true,
    searchable: true,
  },
};

/**
 * Few items.
 */
export const FewItems: Story = {
  args: {
    items: sampleItems.slice(0, 2),
  },
};

/**
 * Long content.
 */
export const LongContent: Story = {
  args: {
    items: [
      {
        id: "long",
        question: "¿Qué incluye cada producto de Ayla Designs?",
        answer: `Cada producto de Ayla Designs incluye múltiples formatos y recursos:

1. **Archivos Editables**: Templates en Canva, Adobe Illustrator y/o Photoshop para máxima flexibilidad.

2. **Versiones para Apps**: Formatos optimizados para GoodNotes, Notability, y otras apps de notas.

3. **Guía de Uso**: Instrucciones paso a paso para personalizar colores, textos y elementos.

4. **Tipografías**: Lista de fuentes utilizadas con enlaces de descarga gratuita.

5. **Paleta de Colores**: Códigos HEX de todos los colores del diseño para mantener coherencia.

6. **Soporte**: Acceso a nuestro equipo para resolver cualquier duda con tu producto.

7. **Actualizaciones**: Mejoras y nuevas versiones sin coste adicional.

8. **Licencia Comercial**: Uso ilimitado en proyectos personales y comerciales.`,
      },
    ],
    defaultExpanded: "long",
  },
};
