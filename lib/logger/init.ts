/**
 * Inicialización del Logger con Sentry y Remote Logging
 *
 * Este archivo configura el logger para enviar logs a:
 * - Sentry (errores y breadcrumbs)
 * - Servidor (archivos con rotación)
 *
 * Debe importarse en el lado del cliente (providers.tsx o layout).
 */

import { logger } from "./index";
import { sentryLogHandler } from "./sentry";
import { createRemoteLogHandler } from "./remote-logger";

export interface LoggerInitOptions {
  /** Habilitar envío a Sentry */
  sentry?: boolean;
  /** Habilitar envío a servidor (archivos) */
  remoteLogging?: boolean;
  /** Opciones del remote logger */
  remoteOptions?: {
    endpoint?: string;
    batchSize?: number;
    flushInterval?: number;
  };
}

const DEFAULT_OPTIONS: LoggerInitOptions = {
  sentry: true,
  remoteLogging: true,
  remoteOptions: {
    endpoint: "/api/logs",
    batchSize: 10,
    flushInterval: 5000,
  },
};

/**
 * Inicializa el logger con todos los handlers configurados
 */
export function initLogger(options: LoggerInitOptions = {}): void {
  // Solo en cliente
  if (typeof window === "undefined") return;

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Handler de Sentry
  if (opts.sentry) {
    logger.addHandler(sentryLogHandler);
  }

  // Handler de remote logging (archivos en servidor)
  if (opts.remoteLogging) {
    const remoteHandler = createRemoteLogHandler(opts.remoteOptions);
    logger.addHandler(remoteHandler);
  }

  logger.info("Logger inicializado", {
    sentry: opts.sentry,
    remoteLogging: opts.remoteLogging,
  }, {
    component: "Logger",
  });
}

/**
 * @deprecated Usar initLogger() en su lugar
 */
export function initLoggerWithSentry(): void {
  initLogger({ sentry: true, remoteLogging: true });
}

/**
 * Configura el contexto del usuario en el logger
 */
export function setLoggerUser(userId: string): void {
  logger.setDefaultContext({ userId });
}

export { logger, sentryLogHandler };
