/**
 * Utility Functions para Ayla Designs
 *
 * Funciones helper reutilizables en toda la aplicación.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind de forma inteligente
 * Resuelve conflictos entre clases (ej: "px-2 px-4" → "px-4")
 *
 * @example
 * ```tsx
 * <div className={cn("px-2 py-1", isActive && "bg-primary", className)}>
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha en español
 *
 * @example
 * ```ts
 * formatDate(new Date()) // "1 de diciembre de 2025"
 * formatDate(new Date(), "short") // "01/12/2025"
 * formatDate(new Date(), "time") // "14:30"
 * ```
 */
export function formatDate(
  date: Date | string | number,
  format: "long" | "short" | "time" | "datetime" = "long"
): string {
  const d = new Date(date);

  const options: Record<string, Intl.DateTimeFormatOptions> = {
    long: { day: "numeric", month: "long", year: "numeric" },
    short: { day: "2-digit", month: "2-digit", year: "numeric" },
    time: { hour: "2-digit", minute: "2-digit" },
    datetime: {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return d.toLocaleDateString("es-ES", options[format]);
}

/**
 * Formatea una fecha relativa (hace X tiempo)
 *
 * @example
 * ```ts
 * formatRelativeDate(new Date(Date.now() - 60000)) // "hace 1 minuto"
 * formatRelativeDate(new Date(Date.now() - 3600000)) // "hace 1 hora"
 * ```
 */
export function formatRelativeDate(date: Date | string | number): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "hace unos segundos";
  if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
  if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  if (diffDays < 7) return `hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;

  return formatDate(d, "short");
}

/**
 * Formatea un número como moneda
 *
 * @example
 * ```ts
 * formatCurrency(1234.56) // "1.234,56 €"
 * formatCurrency(1234.56, "USD") // "$1,234.56"
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: "EUR" | "USD" = "EUR"
): string {
  return new Intl.NumberFormat(currency === "EUR" ? "es-ES" : "en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formatea un número con separadores de miles
 *
 * @example
 * ```ts
 * formatNumber(1234567) // "1.234.567"
 * ```
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

/**
 * Trunca un string con elipsis
 *
 * @example
 * ```ts
 * truncate("Hello World", 5) // "Hello..."
 * ```
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "...";
}

/**
 * Capitaliza la primera letra
 *
 * @example
 * ```ts
 * capitalize("hello world") // "Hello world"
 * ```
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convierte string a slug
 *
 * @example
 * ```ts
 * slugify("Hello World!") // "hello-world"
 * slugify("Músico en Madrid") // "musico-en-madrid"
 * ```
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Genera un ID único
 *
 * @example
 * ```ts
 * generateId() // "k7x9m2p4"
 * generateId(16) // "k7x9m2p4q1w3e5r6"
 * ```
 */
export function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Debounce una función
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query) => search(query), 300);
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle una función
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => handleScroll(), 100);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep/delay async
 *
 * @example
 * ```ts
 * await sleep(1000); // Espera 1 segundo
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Verifica si estamos en el cliente (navegador)
 */
export const isClient = typeof window !== "undefined";

/**
 * Verifica si estamos en el servidor
 */
export const isServer = typeof window === "undefined";

/**
 * Verifica si estamos en desarrollo
 */
export const isDev = process.env.NODE_ENV === "development";

/**
 * Verifica si estamos en producción
 */
export const isProd = process.env.NODE_ENV === "production";
