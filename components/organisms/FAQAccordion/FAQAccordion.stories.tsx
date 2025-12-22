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
    question: "¿Qué es Bemyre?",
    answer:
      "Bemyre es una red social para músicos que permite conectar con otros artistas, formar bandas, encontrar locales de ensayo y organizar conciertos. Nuestra misión es facilitar la colaboración musical y ayudar a los músicos a crecer juntos.",
  },
  {
    id: "2",
    question: "¿Cómo puedo crear una cuenta?",
    answer:
      "Puedes crear una cuenta en Bemyre de forma gratuita usando tu correo electrónico o a través de Google. Solo necesitas completar tu perfil con tus instrumentos, géneros musicales favoritos y ubicación para empezar a conectar con otros músicos.",
  },
  {
    id: "3",
    question: "¿Cómo creo una banda?",
    answer:
      "Para crear una banda, ve a tu perfil y selecciona 'Crear banda'. Podrás invitar a otros usuarios, definir el estilo musical, subir fotos y describir lo que buscáis. Las bandas tienen su propio perfil donde pueden compartir contenido y buscar nuevos miembros.",
  },
  {
    id: "4",
    question: "¿Puedo unirme a bandas existentes?",
    answer:
      "¡Sí! Puedes explorar las bandas que buscan nuevos miembros y enviar solicitudes de unión. También puedes configurar tu perfil para que las bandas te encuentren fácilmente según tus instrumentos y géneros.",
  },
  {
    id: "5",
    question: "¿Es Bemyre gratuito?",
    answer:
      "Sí, Bemyre es completamente gratuito para todos los usuarios. Puedes crear tu perfil, unirte a bandas, contactar con otros músicos y usar todas las funciones principales sin coste alguno.",
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
        question: "¿Qué es Bemyre?",
        answer:
          "Bemyre es una red social para músicos que permite conectar con otros artistas, formar bandas y encontrar locales de ensayo.",
      },
      {
        id: "gs-2",
        question: "¿Cómo creo mi cuenta?",
        answer:
          "Puedes registrarte gratis con tu email o a través de Google. Completa tu perfil con tus instrumentos y géneros favoritos.",
      },
    ],
  },
  {
    id: "bands",
    title: "Bandas",
    items: [
      {
        id: "b-1",
        question: "¿Cómo creo una banda?",
        answer:
          "Ve a tu perfil, selecciona 'Crear banda', invita miembros y define el estilo musical de tu grupo.",
      },
      {
        id: "b-2",
        question: "¿Puedo estar en varias bandas?",
        answer:
          "Sí, puedes ser miembro de múltiples bandas simultáneamente sin ninguna restricción.",
      },
    ],
  },
  {
    id: "venues",
    title: "Locales y Ensayos",
    items: [
      {
        id: "v-1",
        question: "¿Cómo encuentro una sala de ensayo?",
        answer:
          "Usa el buscador para filtrar por ubicación y tipo de local. Puedes ver disponibilidad y precios directamente.",
      },
      {
        id: "v-2",
        question: "¿Puedo registrar mi local?",
        answer:
          "Sí, los propietarios de locales pueden registrarse como 'Venue' y gestionar reservas a través de la plataforma.",
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
        question: "¿Cuáles son todas las funcionalidades de Bemyre?",
        answer: `Bemyre ofrece una amplia variedad de funcionalidades para músicos:

1. **Perfil Personal**: Crea un perfil detallado con tus instrumentos, géneros, experiencia y muestras de audio.

2. **Búsqueda de Músicos**: Encuentra otros artistas por ubicación, instrumento, género musical o nivel de experiencia.

3. **Gestión de Bandas**: Crea y administra tus propias bandas, invita miembros y coordina ensayos.

4. **Salas de Ensayo**: Busca y reserva salas de ensayo en tu zona con disponibilidad en tiempo real.

5. **Conciertos y Eventos**: Descubre conciertos cerca de ti y promociona tus propios eventos.

6. **Mensajería**: Comunícate directamente con otros músicos a través de nuestro sistema de mensajería integrado.

7. **Feed de Actividad**: Mantente al día con las novedades de los músicos y bandas que sigues.

8. **Integración con Spotify**: Conecta tu perfil de Spotify para compartir tu música favorita.`,
      },
    ],
    defaultExpanded: "long",
  },
};
