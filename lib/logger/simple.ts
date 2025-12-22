/**
 * Simple Logger - Versión ligera sin dependencias de Sentry
 *
 * Usar en archivos que se cargan durante SSR para evitar
 * circular dependencies con @sentry/nextjs.
 *
 * Para logging completo con Sentry, usar logger de ./index.ts
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const isDev = process.env.NODE_ENV === "development";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const minLevel = isDev ? "debug" : "warn";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatMessage(level: LogLevel, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
}

export const simpleLogger = {
  debug(message: string, data?: unknown): void {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, data));
    }
  },

  info(message: string, data?: unknown): void {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, data));
    }
  },

  warn(message: string, data?: unknown): void {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, data));
    }
  },

  error(message: string, error?: Error | unknown, data?: unknown): void {
    if (shouldLog("error")) {
      const errorData = {
        ...(typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {}),
        error: error instanceof Error ? error.message : error,
      };
      console.error(formatMessage("error", message, errorData));
    }
  },

  withContext(context: Record<string, unknown>) {
    const mergeData = (data?: unknown): Record<string, unknown> => ({
      ...context,
      ...(typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {}),
    });

    return {
      debug: (msg: string, data?: unknown) => simpleLogger.debug(msg, mergeData(data)),
      info: (msg: string, data?: unknown) => simpleLogger.info(msg, mergeData(data)),
      warn: (msg: string, data?: unknown) => simpleLogger.warn(msg, mergeData(data)),
      error: (msg: string, err?: Error | unknown, data?: unknown) => simpleLogger.error(msg, err, mergeData(data)),
    };
  },
};
