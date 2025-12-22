// Custom hooks de Bemyre
export { useLogger } from "./useLogger";
export { useApiError, type UseApiErrorReturn, type UseApiErrorOptions } from "./useApiError";
export {
  useFormValidation,
  type ValidationErrors,
  type ValidationState,
  type UseFormValidationOptions,
  type UseFormValidationReturn,
} from "./useFormValidation";
export { useThemeSync } from "./useThemeSync";
export {
  useInView,
  type UseInViewOptions,
  type UseInViewReturn,
} from "./useInView";

// TODO: Crear estos hooks
// export * from "./useAuth";
// export * from "./useUser";
// export * from "./useMusician";
// export * from "./useDebounce";
// export * from "./useMediaQuery";
