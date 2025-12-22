/**
 * Ayla Designs Product Catalog
 *
 * Static product data for the e-commerce landing page.
 * Products represent digital design products: planners, templates, kits.
 */

import type { AylaProduct } from "@/types/ayla";

/**
 * Product catalog - 6 digital design products
 */
export const products: AylaProduct[] = [
  {
    id: 1,
    name: "Celestial Planner 2025",
    description:
      "Planificador digital completo con fases lunares, seguimiento de hábitos, calendario anual y elementos celestiales.",
    price: 24.99,
    category: "Planners",
    imageType: "planner",
    features: [
      "12 meses completos",
      "Fases lunares",
      "Seguimiento de hábitos",
      "Compatible con GoodNotes",
    ],
  },
  {
    id: 2,
    name: "Bohemian Business Cards",
    description:
      "Pack de 5 plantillas de tarjetas de visita editables con diseños únicos que combinan elegancia bohemia.",
    price: 12.99,
    category: "Tarjetas",
    imageType: "cards",
    features: [
      "5 diseños únicos",
      "Editables en Canva",
      "Alta resolución",
      "Listos para imprimir",
    ],
  },
  {
    id: 3,
    name: "Crystal Social Media Kit",
    description:
      "Kit completo para Instagram con 30 plantillas de posts, stories y highlights para un feed cohesivo.",
    price: 29.99,
    category: "Social Media",
    imageType: "social",
    features: [
      "30 plantillas",
      "Posts + Stories",
      "Paleta incluida",
      "Guía de uso",
    ],
  },
  {
    id: 4,
    name: "Moonlight Wedding Suite",
    description:
      "Suite completa de papelería para bodas: invitaciones, RSVP, menús y programa celestial.",
    price: 39.99,
    category: "Bodas",
    imageType: "wedding",
    features: [
      "Invitación + RSVP",
      "Menú + Programa",
      "Números de mesa",
      "Save the date",
    ],
  },
  {
    id: 5,
    name: "Mystic Brand Kit",
    description:
      "Kit de branding completo con logo, paleta de colores, tipografías y elementos gráficos.",
    price: 49.99,
    category: "Branding",
    imageType: "brand",
    features: [
      "Logo editable",
      "Paleta de colores",
      "Guía tipográfica",
      "20+ elementos",
    ],
  },
  {
    id: 6,
    name: "Boho Thank You Cards",
    description:
      "Pack de 10 diseños de tarjetas de agradecimiento con ilustraciones botánicas y celestiales.",
    price: 9.99,
    category: "Tarjetas",
    imageType: "thanks",
    features: [
      "10 diseños",
      "Imprimibles A6",
      "Editables",
      "Versión digital",
    ],
  },
];

export default products;
