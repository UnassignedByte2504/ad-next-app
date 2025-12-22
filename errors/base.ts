/**
 * Base Error Classes for Bemyre App
 *
 * Este archivo contiene las clases base de errores.
 * Separado para evitar dependencias circulares con api.ts
 */

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ErrorCode {
  // Network Errors (1000-1999)
  NETWORK_ERROR = 1000,
  CONNECTION_TIMEOUT = 1001,
  SERVER_UNAVAILABLE = 1002,
  REQUEST_FAILED = 1003,
  RATE_LIMITED = 1004,
  UNKNOWN_NETWORK_ERROR = 1099,

  // Authentication Errors (2000-2999)
  AUTH_FAILED = 2000,
  TOKEN_EXPIRED = 2001,
  INSUFFICIENT_PERMISSIONS = 2002,
  WEBRTC_AUTH_FAILED = 2003,
  TWO_FACTOR_REQUIRED = 2004,

  // Validation Errors (3000-3999)
  VALIDATION_ERROR = 3000,
  INVALID_INPUT = 3001,
  MISSING_REQUIRED_FIELD = 3002,
  INVALID_FORMAT = 3003,

  // Service Errors (4000-4999)
  SERVICE_UNAVAILABLE = 4000,

  // UI/Component Errors (5000-5999)
  COMPONENT_RENDER_ERROR = 5000,
  INVALID_PROPS = 5001,
  STATE_CORRUPTION = 5002,

  // Data Errors (6000-6999)
  DATA_CORRUPTION = 6000,
  PARSE_ERROR = 6001,
  SERIALIZATION_ERROR = 6002,

  // Unknown/Generic Errors (9000-9999)
  UNKNOWN_ERROR = 9000,
  SYSTEM_ERROR = 9001,
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  /** ID de correlación para trazabilidad (alineado con backend) */
  correlationId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: Date;
  additionalData?: Record<string, unknown>;
}

/**
 * Base custom error class with enhanced functionality
 */
export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly userMessage: string;
  public readonly context?: ErrorContext;
  public readonly isRetryable: boolean;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: ErrorCode,
    severity: ErrorSeverity,
    userMessage: string,
    isRetryable: boolean = false,
    context?: ErrorContext
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.userMessage = userMessage;
    this.isRetryable = isRetryable;
    if (context !== undefined) {
      this.context = context;
    }
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (Node.js only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging/reporting
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      userMessage: this.userMessage,
      isRetryable: this.isRetryable,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  constructor(
    message: string = "Network request failed",
    code: ErrorCode = ErrorCode.NETWORK_ERROR,
    userMessage: string = "Unable to connect to the server. Please check your internet connection.",
    context?: ErrorContext
  ) {
    super(message, code, ErrorSeverity.HIGH, userMessage, true, context);
  }
}
