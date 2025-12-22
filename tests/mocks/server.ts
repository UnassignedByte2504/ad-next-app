/**
 * MSW Server - Configuración del servidor de mocking para tests
 *
 * Este servidor intercepta las peticiones HTTP durante los tests
 * y las responde con los handlers definidos.
 */

import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Crear servidor MSW con los handlers base
export const server = setupServer(...handlers);

// Re-export para conveniencia
export { handlers };
