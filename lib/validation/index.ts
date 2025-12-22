/**
 * Validation schemas para formularios de Bemyre
 *
 * Schemas basados en Zod con mensajes de error en español.
 * Todos los schemas siguen las mejores prácticas de seguridad.
 */

export {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "./auth";
