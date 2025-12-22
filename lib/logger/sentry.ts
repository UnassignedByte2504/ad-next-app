/**
 * Sentry Integration para Bemyre
 *
 * Wrapper para Sentry que se integra con el sistema de logging.
 * Proporciona funciones helper y el handler para el logger.
 */

import * as Sentry from "@sentry/nextjs";
import type { LogEntry, LogHandler } from "./types";

/**
 * Handler de Sentry para el Logger
 *
 * Envía logs de nivel warn y error a Sentry como breadcrumbs,
 * y los errores como excepciones.
 */
export const sentryLogHandler: LogHandler = (entry: LogEntry) => {
  const { level, message, context, error, data } = entry;

  // Añadir breadcrumb para todos los niveles (útil para debugging)
  Sentry.addBreadcrumb({
    category: context?.component || "app",
    message,
    level: mapLogLevelToSentry(level),
    data: {
      ...context,
      ...(typeof data === "object" ? data : { data }),
    },
  });

  // Si es un error con excepción, capturarlo
  if (level === "error" && error) {
    Sentry.captureException(error, {
      tags: {
        component: context?.component,
      },
      extra: {
        message,
        context,
        data,
      },
    });
  }

  // Warnings sin excepción se envían como mensaje
  if (level === "warn" && !error) {
    Sentry.captureMessage(message, {
      level: "warning",
      tags: {
        component: context?.component,
      },
      extra: {
        context,
        data,
      },
    });
  }
};

/**
 * Mapea niveles de log a niveles de Sentry
 */
function mapLogLevelToSentry(
  level: LogEntry["level"]
): Sentry.Breadcrumb["level"] {
  const mapping: Record<LogEntry["level"], Sentry.Breadcrumb["level"]> = {
    debug: "debug",
    info: "info",
    warn: "warning",
    error: "error",
  };
  return mapping[level];
}

/**
 * Captura un error en Sentry con contexto adicional
 */
export function captureError(
  error: Error,
  context?: {
    component?: string;
    userId?: string;
    extra?: Record<string, unknown>;
  }
): string {
  return Sentry.captureException(error, {
    tags: {
      component: context?.component,
    },
    user: context?.userId ? { id: context.userId } : undefined,
    extra: context?.extra,
  });
}

/**
 * Establece el usuario actual en Sentry
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
} | null): void {
  if (user) {
    Sentry.setUser(user);
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Añade tags globales para filtrar en Sentry
 */
export function setTags(tags: Record<string, string>): void {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
}

/**
 * Crea una transacción para medir rendimiento
 */
export function startTransaction(
  name: string,
  op: string
): Sentry.Span | undefined {
  return Sentry.startInactiveSpan({ name, op });
}

/**
 * Re-exportar Sentry para uso directo cuando sea necesario
 */
export { Sentry };
