/**
 * Logger Service para Ayla Designs
 *
 * Sistema de logging centralizado con:
 * - Niveles: debug, info, warn, error
 * - Formateo consistente con timestamps
 * - Contexto adicional (metadata)
 * - Deshabilitado en producción (excepto errores)
 * - Preparado para integración con servicios externos (Sentry, LogRocket, etc.)
 */

// Re-export types from ./types to break circular dependencies
export type { LogLevel, LogContext, LogEntry, LogHandler } from "./types";
import type { LogLevel, LogContext, LogEntry, LogHandler } from "./types";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "#9CA3AF", // gray
  info: "#6366F1", // indigo (primary)
  warn: "#F59E0B", // amber
  error: "#EF4444", // red
};

const LOG_ICONS: Record<LogLevel, string> = {
  debug: "🔍",
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
};

class Logger {
  private minLevel: LogLevel = "debug";
  private handlers: LogHandler[] = [];
  private defaultContext: LogContext = {};
  private isDev = process.env.NODE_ENV === "development";

  constructor() {
    // En producción, solo mostrar warnings y errores
    if (!this.isDev) {
      this.minLevel = "warn";
    }
  }

  /**
   * Configura el nivel mínimo de logging
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Añade contexto por defecto a todos los logs
   */
  setDefaultContext(context: LogContext): void {
    this.defaultContext = { ...this.defaultContext, ...context };
  }

  /**
   * Registra un handler para procesar logs (ej: enviar a servicio externo)
   */
  addHandler(handler: LogHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Elimina un handler
   */
  removeHandler(handler: LogHandler): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  /**
   * Crea una instancia del logger con contexto específico
   */
  withContext(context: LogContext): ContextLogger {
    return new ContextLogger(this, context);
  }

  /**
   * Log interno - procesa todos los logs
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: LogContext,
    error?: Error
  ): void {
    // Verificar nivel mínimo
    if (LOG_LEVELS[level] < LOG_LEVELS[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.defaultContext, ...context },
      data,
      error,
    };

    // Mostrar en consola (desarrollo)
    this.logToConsole(entry);

    // Ejecutar handlers externos
    this.handlers.forEach((handler) => {
      try {
        handler(entry);
      } catch (e) {
        console.error("Logger handler error:", e);
      }
    });
  }

  /**
   * Formatea y muestra en consola con estilo
   */
  private logToConsole(entry: LogEntry): void {
    const { level, message, timestamp, context, data, error } = entry;
    const icon = LOG_ICONS[level];
    const color = LOG_COLORS[level];

    // Formatear timestamp
    const time = new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });

    // Construir prefijo
    const componentStr = context?.component ? `[${context.component}]` : "";
    const prefix = `${icon} ${time} ${componentStr}`.trim();

    // Estilo para el prefijo
    const prefixStyle = `color: ${color}; font-weight: bold;`;
    const messageStyle = "color: inherit;";

    // Elegir método de consola
    const consoleMethod = level === "error" ? console.error :
      level === "warn" ? console.warn :
        level === "debug" ? console.debug :
          console.log;

    // Construir argumentos
    const args: unknown[] = [`%c${prefix}%c ${message}`, prefixStyle, messageStyle];

    // Añadir data si existe
    if (data !== undefined) {
      args.push("\n📦 Data:", data);
    }

    // Añadir contexto si tiene más que el component
    const contextKeys = Object.keys(context || {}).filter((k) => k !== "component");
    if (contextKeys.length > 0) {
      const contextData = contextKeys.reduce(
        (acc, key) => ({ ...acc, [key]: context![key] }),
        {}
      );
      args.push("\n🏷️ Context:", contextData);
    }

    // Añadir error si existe
    if (error) {
      args.push("\n🔥 Error:", error);
    }

    consoleMethod(...args);
  }

  // Métodos públicos de logging

  debug(message: string, data?: unknown, context?: LogContext): void {
    this.log("debug", message, data, context);
  }

  info(message: string, data?: unknown, context?: LogContext): void {
    this.log("info", message, data, context);
  }

  warn(message: string, data?: unknown, context?: LogContext): void {
    this.log("warn", message, data, context);
  }

  error(
    message: string,
    error?: Error | unknown,
    data?: unknown,
    context?: LogContext
  ): void {
    const err = error instanceof Error ? error : undefined;
    const errorData = error instanceof Error ? data : error;
    this.log("error", message, errorData, context, err);
  }

  /**
   * Log de rendimiento
   */
  time(label: string): () => void {
    const start = performance.now();
    this.debug(`⏱️ Timer started: ${label}`);

    return () => {
      const duration = performance.now() - start;
      this.debug(`⏱️ Timer ended: ${label}`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  /**
   * Log de grupo (para debugging complejo)
   */
  group(label: string, fn: () => void): void {
    if (this.isDev) {
      console.group(`📁 ${label}`);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  }

  /**
   * Log de tabla (para arrays/objetos)
   */
  table(data: unknown[], columns?: string[]): void {
    if (this.isDev) {
      console.table(data, columns);
    }
  }
}

/**
 * Logger con contexto específico
 */
class ContextLogger {
  constructor(
    private logger: Logger,
    private context: LogContext
  ) { }

  debug(message: string, data?: unknown): void {
    this.logger.debug(message, data, this.context);
  }

  info(message: string, data?: unknown): void {
    this.logger.info(message, data, this.context);
  }

  warn(message: string, data?: unknown): void {
    this.logger.warn(message, data, this.context);
  }

  error(message: string, error?: Error | unknown, data?: unknown): void {
    this.logger.error(message, error, data, this.context);
  }

  time(label: string): () => void {
    return this.logger.time(`[${this.context.component}] ${label}`);
  }
}

// Singleton instance
export const logger = new Logger();

// Re-exportar clases para testing/extensión
export { Logger, ContextLogger };

// NOTA: Los siguientes módulos NO se re-exportan aquí para evitar circular dependencies.
// Importar directamente desde sus archivos:
// - Sentry: import { sentryLogHandler, captureError, setUser, setTags } from "@lib/logger/sentry"
// - Init: import { initLogger, initLoggerWithSentry, setLoggerUser } from "@lib/logger/init"
// - Remote: import { createRemoteLogHandler, getRemoteLogger } from "@lib/logger/remote-logger"
// - File (server): import { createFileLogHandler } from "@lib/logger/file-logger"
