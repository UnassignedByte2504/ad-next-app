import { z } from "zod";

/**
 * Mensajes de error personalizados en español para validación de autenticación
 */
const ERROR_MESSAGES = {
  email: {
    required: "El correo electrónico es requerido",
    invalid: "El correo electrónico no es válido",
  },
  password: {
    required: "La contraseña es requerida",
    min: "La contraseña debe tener al menos 8 caracteres",
    max: "La contraseña no puede tener más de 100 caracteres",
    weak: "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
  },
  name: {
    required: "El nombre es requerido",
    min: "El nombre debe tener al menos 2 caracteres",
    max: "El nombre no puede tener más de 100 caracteres",
  },
  confirmPassword: {
    required: "Debes confirmar tu contraseña",
    match: "Las contraseñas no coinciden",
  },
} as const;

/**
 * Regex para validar contraseñas fuertes:
 * - Al menos 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Schema de validación para el formulario de login
 *
 * @example
 * ```ts
 * const result = loginSchema.safeParse({ email: "user@example.com", password: "Password123" });
 * if (!result.success) {
 *   console.log(result.error.format());
 * }
 * ```
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.email.required)
    .email(ERROR_MESSAGES.email.invalid)
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, ERROR_MESSAGES.password.required)
    .min(8, ERROR_MESSAGES.password.min)
    .max(100, ERROR_MESSAGES.password.max),
});

/**
 * Schema de validación para el formulario de registro
 *
 * Valida que las contraseñas coincidan y que cumplan con los requisitos de seguridad.
 *
 * @example
 * ```ts
 * const result = registerSchema.safeParse({
 *   email: "user@example.com",
 *   password: "Password123",
 *   confirmPassword: "Password123",
 *   name: "Juan Pérez"
 * });
 * ```
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, ERROR_MESSAGES.email.required)
      .email(ERROR_MESSAGES.email.invalid)
      .toLowerCase()
      .trim(),
    name: z
      .string()
      .min(1, ERROR_MESSAGES.name.required)
      .min(2, ERROR_MESSAGES.name.min)
      .max(100, ERROR_MESSAGES.name.max)
      .trim(),
    password: z
      .string()
      .min(1, ERROR_MESSAGES.password.required)
      .min(8, ERROR_MESSAGES.password.min)
      .max(100, ERROR_MESSAGES.password.max)
      .regex(PASSWORD_REGEX, ERROR_MESSAGES.password.weak),
    confirmPassword: z
      .string()
      .min(1, ERROR_MESSAGES.confirmPassword.required),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.confirmPassword.match,
    path: ["confirmPassword"],
  });

/**
 * Tipos inferidos de los schemas para usar en componentes
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
