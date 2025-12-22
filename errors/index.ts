/* Custom Errors for Bemyre App */

// Import base types for use in this file
import {
  ErrorSeverity,
  ErrorCode,
  AppError,
  NetworkError,
} from "./base";
import type { ErrorContext } from "./base";

// Re-export base types to break circular dependency with api.ts
export {
  ErrorSeverity,
  ErrorCode,
  type ErrorContext,
  AppError,
  NetworkError,
} from "./base";

export class ConnectionTimeoutError extends NetworkError {
  constructor(
    message: string = 'Connection timed out',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.CONNECTION_TIMEOUT,
      'The request is taking longer than expected. Please try again.',
      context
    );
  }
}

export class ServerUnavailableError extends NetworkError {
  constructor(
    message: string = 'Server is unavailable',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.SERVER_UNAVAILABLE,
      'The server is temporarily unavailable. Please try again in a few minutes.',
      context
    );
  }
}

export class RateLimitError extends NetworkError {
  constructor(
    message: string = 'Rate limit exceeded',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.RATE_LIMITED,
      'Too many requests. Please wait a moment before trying again.',
      context
    );
  }
}

/**
 * Authentication-related errors
 */
export class AuthError extends AppError {
  constructor(
    message: string = 'Authentication failed',
    code: ErrorCode = ErrorCode.AUTH_FAILED,
    userMessage: string = 'Authentication failed. Please log in again.',
    context?: ErrorContext
  ) {
    super(message, code, ErrorSeverity.HIGH, userMessage, false, context);
  }
}

export class TokenExpiredError extends AuthError {
  constructor(
    message: string = 'Authentication token expired',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.TOKEN_EXPIRED,
      'Your session has expired. Please log in again.',
      context
    );
  }
}

export class InsufficientPermissionsError extends AuthError {
  constructor(
    message: string = 'Insufficient permissions',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'You do not have permission to perform this action.',
      context
    );
  }
}

export class WebRtcAuthError extends AuthError {
  constructor(
    message: string = 'WebRTC authentication failed',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.WEBRTC_AUTH_FAILED,
      'Identity verification failed. Please ensure your camera and microphone are working.',
      context
    );
  }
}

/**
 * Validation-related errors
 */
export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly validationRules?: string[];

  constructor(
    message: string = 'Validation failed',
    field?: string,
    validationRules?: string[],
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.MEDIUM,
      'Please check your input and try again.',
      false,
      context
    );
    if (field !== undefined) {
      this.field = field;
    }
    if (validationRules !== undefined) {
      this.validationRules = validationRules;
    }
  }
}

export class InvalidInputError extends ValidationError {
  constructor(
    message: string = 'Invalid input provided',
    field?: string,
    context?: ErrorContext
  ) {
    super(
      message,
      field,
      ['Invalid format or value'],
      context
    );
  }
}

/**
 * Service-related errors
 */
export class ServiceError extends AppError {
  public readonly serviceName: string;

  constructor(
    message: string = 'Service error occurred',
    serviceName: string = 'Unknown Service',
    code: ErrorCode = ErrorCode.SERVICE_UNAVAILABLE,
    userMessage: string = 'A service is temporarily unavailable. Please try again later.',
    context?: ErrorContext
  ) {
    super(message, code, ErrorSeverity.HIGH, userMessage, true, context);
    this.serviceName = serviceName;
  }
}


/**
 * Component/UI-related errors
 */
export class ComponentError extends AppError {
  public readonly componentName: string;

  constructor(
    message: string = 'Component error occurred',
    componentName: string = 'Unknown Component',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.COMPONENT_RENDER_ERROR,
      ErrorSeverity.MEDIUM,
      'A display issue occurred. Please refresh the page.',
      false,
      context
    );
    this.componentName = componentName;
  }
}

/**
 * Data-related errors
 */
export class DataError extends AppError {
  constructor(
    message: string = 'Data processing error',
    code: ErrorCode = ErrorCode.DATA_CORRUPTION,
    userMessage: string = 'There was an issue processing the data. Please try again.',
    context?: ErrorContext
  ) {
    super(message, code, ErrorSeverity.MEDIUM, userMessage, true, context);
  }
}

export class ParseError extends DataError {
  constructor(
    message: string = 'Failed to parse data',
    context?: ErrorContext
  ) {
    super(
      message,
      ErrorCode.PARSE_ERROR,
      'The data format is invalid. Please check and try again.',
      context
    );
  }
}

/**
 * Utility functions for error handling
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorSeverityLevel(severity: ErrorSeverity): number {
  const levels = {
    [ErrorSeverity.LOW]: 1,
    [ErrorSeverity.MEDIUM]: 2,
    [ErrorSeverity.HIGH]: 3,
    [ErrorSeverity.CRITICAL]: 4
  };
  return levels[severity] || 0;
}

export function createErrorFromHttpStatus(
  status: number,
  message?: string,
  context?: ErrorContext
): AppError {
  switch (true) {
    case status === 401:
      return new AuthError(message || 'Unauthorized', ErrorCode.AUTH_FAILED, 'Please log in to continue.', context);
    case status === 403:
      return new InsufficientPermissionsError(message || 'Forbidden', context);
    case status === 404:
      return new NetworkError(message || 'Not found', ErrorCode.REQUEST_FAILED, 'The requested resource was not found.', context);
    case status === 429:
      return new RateLimitError(message || 'Too many requests', context);
    case status >= 500:
      return new ServerUnavailableError(message || 'Server error', context);
    case status >= 400:
      return new ValidationError(message || 'Bad request', undefined, undefined, context);
    default:
      return new NetworkError(message || 'Request failed', ErrorCode.REQUEST_FAILED, 'An unexpected error occurred.', context);
  }
}

/**
 * Error factory for common scenarios
 */
export const ErrorFactory = {
  network: (message?: string, context?: ErrorContext) => new NetworkError(message, ErrorCode.NETWORK_ERROR, undefined, context),
  auth: (message?: string, context?: ErrorContext) => new AuthError(message, ErrorCode.AUTH_FAILED, undefined, context),
  validation: (message?: string, field?: string, context?: ErrorContext) => new ValidationError(message, field, undefined, context),
  service: (serviceName: string, message?: string, context?: ErrorContext) => new ServiceError(message, serviceName, ErrorCode.SERVICE_UNAVAILABLE, undefined, context),
  component: (componentName: string, message?: string, context?: ErrorContext) => new ComponentError(message, componentName, context),
  data: (message?: string, context?: ErrorContext) => new DataError(message, ErrorCode.DATA_CORRUPTION, undefined, context)
};

// Re-export API error types and utilities (aligned with backend)
export * from "./codes";
export * from "./api";