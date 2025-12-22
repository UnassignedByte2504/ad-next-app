"use client";

import { useState, useCallback } from "react";
import { z } from "zod";

/**
 * Errores de validación por campo
 * Mapea el nombre del campo a su mensaje de error
 */
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Estado de validación del formulario
 */
export interface ValidationState {
  /** Si el formulario es válido */
  isValid: boolean;
  /** Si el formulario ha sido validado al menos una vez */
  isDirty: boolean;
  /** Si la validación está en proceso (útil para validaciones async) */
  isValidating: boolean;
}

/**
 * Opciones para el hook useFormValidation
 */
export interface UseFormValidationOptions {
  /**
   * Modo de validación
   * - "onChange": Valida en cada cambio (después de la primera validación)
   * - "onBlur": Valida cuando el campo pierde foco
   * - "onSubmit": Solo valida al enviar el formulario
   * @default "onChange"
   */
  mode?: "onChange" | "onBlur" | "onSubmit";
}

/**
 * Valor de retorno del hook useFormValidation
 */
export interface UseFormValidationReturn<T> {
  /** Errores de validación por campo */
  errors: ValidationErrors<T>;
  /** Estado de validación */
  state: ValidationState;
  /**
   * Valida los datos del formulario
   * @param data - Datos a validar
   * @returns true si es válido, false si hay errores
   */
  validate: (data: Partial<T>) => boolean;
  /**
   * Valida un campo específico
   * @param field - Nombre del campo
   * @param value - Valor del campo
   * @returns true si es válido, false si hay errores
   */
  validateField: <K extends keyof T>(field: K, value: T[K]) => boolean;
  /**
   * Limpia todos los errores de validación
   */
  clearErrors: () => void;
  /**
   * Limpia el error de un campo específico
   * @param field - Nombre del campo
   */
  clearFieldError: <K extends keyof T>(field: K) => void;
  /**
   * Establece un error manualmente en un campo
   * @param field - Nombre del campo
   * @param message - Mensaje de error
   */
  setFieldError: <K extends keyof T>(field: K, message: string) => void;
  /**
   * Resetea el estado de validación
   */
  reset: () => void;
}

/**
 * Hook para validación de formularios con Zod
 *
 * Proporciona validación en tiempo real compatible con formularios controlados
 * de React y componentes de MUI.
 *
 * @param schema - Schema de Zod para validar
 * @param options - Opciones de configuración
 * @returns Objeto con métodos y estado de validación
 *
 * @example
 * ```tsx
 * import { useFormValidation } from "@hooks";
 * import { loginSchema, type LoginFormData } from "@lib/validation";
 *
 * function LoginForm() {
 *   const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
 *   const { errors, validate, validateField, state } = useFormValidation(loginSchema);
 *
 *   const handleChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const value = e.target.value;
 *     setFormData(prev => ({ ...prev, [field]: value }));
 *     if (state.isDirty) {
 *       validateField(field, value);
 *     }
 *   };
 *
 *   const handleSubmit = (e: React.FormEvent) => {
 *     e.preventDefault();
 *     if (validate(formData)) {
 *       // Enviar datos
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <TextField
 *         label="Email"
 *         value={formData.email}
 *         onChange={handleChange("email")}
 *         error={!!errors.email}
 *         helperText={errors.email}
 *       />
 *       <TextField
 *         label="Password"
 *         type="password"
 *         value={formData.password}
 *         onChange={handleChange("password")}
 *         error={!!errors.password}
 *         helperText={errors.password}
 *       />
 *       <Button type="submit" disabled={!state.isValid && state.isDirty}>
 *         Iniciar sesión
 *       </Button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useFormValidation<T extends z.ZodType>(
  schema: T,
  options: UseFormValidationOptions = {}
): UseFormValidationReturn<z.infer<T>> {
  type FormData = z.infer<T>;

  const { mode = "onChange" } = options;

  const [errors, setErrors] = useState<ValidationErrors<FormData>>({});
  const [state, setState] = useState<ValidationState>({
    isValid: false,
    isDirty: false,
    isValidating: false,
  });

  /**
   * Valida los datos completos del formulario
   */
  const validate = useCallback(
    (data: Partial<FormData>): boolean => {
      setState((prev) => ({ ...prev, isValidating: true }));

      const result = schema.safeParse(data);

      if (result.success) {
        setErrors({});
        setState({
          isValid: true,
          isDirty: true,
          isValidating: false,
        });
        return true;
      }

      // Convertir errores de Zod a formato de errores por campo
      const fieldErrors: ValidationErrors<FormData> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof FormData;
        if (field) {
          fieldErrors[field] = error.message;
        }
      });

      setErrors(fieldErrors);
      setState({
        isValid: false,
        isDirty: true,
        isValidating: false,
      });
      return false;
    },
    [schema]
  );

  /**
   * Valida un campo específico
   */
  const validateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]): boolean => {
      // Solo validar si el modo lo permite
      if (mode === "onSubmit" && !state.isDirty) {
        return true;
      }

      setState((prev) => ({ ...prev, isValidating: true }));

      // Intentar validar solo el campo usando pick
      try {
        if (schema instanceof z.ZodObject) {
          const fieldSchema = schema.shape[field as string];
          if (fieldSchema) {
            const result = fieldSchema.safeParse(value);

            setState((prev) => ({ ...prev, isValidating: false }));

            if (result.success) {
              // Limpiar error del campo
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
              });
              return true;
            }

            // Establecer error del campo
            setErrors((prev) => ({
              ...prev,
              [field]: result.error.errors[0]?.message || "Campo inválido",
            }));
            return false;
          }
        }
      } catch {
        // Si falla la validación individual, no hacer nada
        setState((prev) => ({ ...prev, isValidating: false }));
      }

      setState((prev) => ({ ...prev, isValidating: false }));
      return true;
    },
    [schema, mode, state.isDirty]
  );

  /**
   * Limpia todos los errores
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Limpia el error de un campo específico
   */
  const clearFieldError = useCallback(<K extends keyof FormData>(field: K) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Establece un error manualmente
   */
  const setFieldError = useCallback(
    <K extends keyof FormData>(field: K, message: string) => {
      setErrors((prev) => ({
        ...prev,
        [field]: message,
      }));
      setState((prev) => ({
        ...prev,
        isValid: false,
      }));
    },
    []
  );

  /**
   * Resetea el estado de validación
   */
  const reset = useCallback(() => {
    setErrors({});
    setState({
      isValid: false,
      isDirty: false,
      isValidating: false,
    });
  }, []);

  return {
    errors,
    state,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
    reset,
  };
}
