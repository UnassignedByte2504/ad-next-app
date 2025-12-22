/**
 * Ayla Designs Customer Reviews
 *
 * Testimonials for the e-commerce landing page.
 * Reviews showcase different customer personas and use cases.
 */

import type { AylaReview } from "@/types/ayla";

/**
 * Customer testimonials - 3 reviews from different personas
 */
export const reviews: AylaReview[] = [
  {
    name: "María González",
    role: "Wedding Planner",
    text: "Los diseños de Ayla son exactamente lo que buscaba: profesionales pero con ese toque bohemio que mis clientes adoran.",
    rating: 5,
    color: "gold",
  },
  {
    name: "Carlos Ruiz",
    role: "Coach de Bienestar",
    text: "Mi marca necesitaba ese equilibrio entre lo espiritual y lo profesional. Ayla Designs lo clavó perfectamente.",
    rating: 5,
    color: "lavender",
  },
  {
    name: "Laura Fernández",
    role: "Emprendedora Digital",
    text: "Las plantillas de social media han transformado mi feed de Instagram. Recibo cumplidos constantemente.",
    rating: 5,
    color: "rose",
  },
];

export default reviews;
