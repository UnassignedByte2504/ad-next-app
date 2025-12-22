/**
 * useLogger Hook
 *
 * Hook para crear un logger con contexto de componente.
 * Facilita el logging consistente en componentes React.
 *
 * @example
 * ```tsx
 * function MusicianCard({ musician }: Props) {
 *   const log = useLogger("MusicianCard");
 *
 *   useEffect(() => {
 *     log.debug("Renderizando card", { musicianId: musician.id });
 *   }, [musician.id]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */

import { useMemo } from "react";
import { logger, type ContextLogger } from "@lib/logger";

/**
 * Crea un logger con contexto de componente
 * @param component - Nombre del componente para identificar en logs
 * @returns Logger con contexto pre-configurado
 */
export function useLogger(component: string): ContextLogger {
  return useMemo(() => logger.withContext({ component }), [component]);
}
