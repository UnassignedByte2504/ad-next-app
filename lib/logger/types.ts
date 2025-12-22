/**
 * Logger Types
 *
 * Tipos compartidos entre módulos del logger.
 * Separados para evitar circular dependencies.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  /** Nombre del componente o módulo */
  component?: string;
  /** ID de usuario si está autenticado */
  userId?: string;
  /** ID de request/correlación */
  requestId?: string;
  /** Metadata adicional */
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  data?: unknown;
}

export type LogHandler = (entry: LogEntry) => void;
