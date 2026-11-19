import axios from "axios";

/**
 * Describes the category of an API failure.
 *
 * http: Server returned an unsuccessful HTTP response.
 * network: Request could not reach the server.
 * timeout: Request exceeded the configured timeout.
 * canceled: Request was intentionally canceled.
 * unknown: Unexpected error outside the normal API failure categories.
 */
export type ApiErrorType =
  | "http"
  | "network"
  | "timeout"
  | "canceled"
  | "unknown";

/**
 * Configuration used to create a normalized API error.
 */
export interface ApiErrorOptions {
  message: string;
  type: ApiErrorType; // category tells us the failure category: HTTP failure.
  status?: number; //status tells us the exact HTTP status: 404.
  code?: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
  retryable?: boolean;
}

/**
 * Standard application error for all API failures.
 *
 * Components and features should consume this error instead
 * of depending directly on Axios error response structures.
 */
export class ApiError extends Error {
  readonly type: ApiErrorType;
  readonly status: number | undefined;
  readonly code: string | undefined;
  readonly requestId: string | undefined;
  readonly fieldErrors: Record<string, string>;
  readonly retryable: boolean;

  constructor(options: ApiErrorOptions) {
    super(options.message);

    this.name = "ApiError";
    this.type = options.type;
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.fieldErrors = options.fieldErrors ?? {};
    this.retryable = options.retryable ?? false;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Represents a JSON object received from an API.
 */
type ErrorPayload = Record<string, unknown>;

/**
 * Checks whether a value is a non-null JSON object.
 *
 * Prevents unsafe property access on unknown API response data.
 */
function isRecord(value: unknown): value is ErrorPayload {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns a trimmed string or undefined for invalid values.
 */
function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Extracts field-level validation errors from common Java API formats.
 *
 * Supported formats:
 * - Spring validation: errors: [{ field, defaultMessage }]
 * - Custom validation: errors: { field: message }
 * - Field errors: fieldErrors: [{ field, message }]
 * - Bean Validation: violations: [{ propertyPath, message }]
 */
function getFieldErrors(payload: ErrorPayload): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  const addFieldError = (field: unknown, message: unknown) => {
    const fieldName = getString(field);
    const errorMessage = getString(message);

    if (fieldName && errorMessage && !fieldErrors[fieldName]) {
      fieldErrors[fieldName] = errorMessage;
    }
  };

  const errors = payload.errors;

  if (isRecord(errors)) {
    for (const [field, message] of Object.entries(errors)) {
      addFieldError(field, message);
    }
  }

  if (Array.isArray(errors)) {
    for (const item of errors) {
      if (!isRecord(item)) continue;

      addFieldError(
        item.field ?? item.name ?? item.propertyPath,
        item.defaultMessage ?? item.message ?? item.msg,
      );
    }
  }

  const responseFieldErrors = payload.fieldErrors;

  if (Array.isArray(responseFieldErrors)) {
    for (const item of responseFieldErrors) {
      if (!isRecord(item)) continue;

      addFieldError(
        item.field ?? item.fieldName,
        item.defaultMessage ?? item.message,
      );
    }
  }

  const violations = payload.violations;

  if (Array.isArray(violations)) {
    for (const item of violations) {
      if (!isRecord(item)) continue;

      addFieldError(item.field ?? item.propertyPath, item.message);
    }
  }

  return fieldErrors;
}

/**
 * Provides a safe user-facing message when the server
 * does not return a usable error message.
 */
function getDefaultMessage(status?: number): string {
  switch (status) {
    case 400:
      return "The request is invalid. Please check your input.";
    case 401:
      return "Your session is invalid or has expired.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 405:
      return "This action is not supported.";
    case 408:
      return "The request timed out. Please try again.";
    case 409:
      return "This action conflicts with the current state.";
    case 410:
      return "The requested resource is no longer available.";
    case 413:
      return "The uploaded content is too large.";
    case 415:
      return "The submitted content type is not supported.";
    case 422:
      return "Please check the submitted information.";
    case 423:
      return "This resource is currently locked.";
    case 429:
      return "Too many requests. Please try again shortly.";
    case 500:
      return "An unexpected server error occurred.";
    case 502:
    case 503:
    case 504:
      return "The service is temporarily unavailable. Please try again.";
    default:
      return status !== undefined && status >= 500
        ? "A server error occurred. Please try again."
        : "The request could not be completed.";
  }
}

/**
 * Extracts a request correlation identifier from response headers.
 *
 * Useful when reporting API failures to backend developers.
 */
function getRequestId(headers: unknown): string | undefined {
  if (!isRecord(headers)) return undefined;

  return (
    getString(headers["x-request-id"]) ?? getString(headers["x-correlation-id"])
  );
}

/**
 * Converts Axios and unexpected errors into a consistent ApiError.
 *
 * This is the single normalization entry point used by the
 * shared Axios response interceptor.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (axios.isCancel(error)) {
    return new ApiError({
      type: "canceled",
      message: "The request was canceled.",
      code: "ERR_CANCELED",
    });
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      type: "unknown",
      message: "An unexpected error occurred.",
    });
  }

  const response = error.response;
  const status = response?.status;
  const payload = isRecord(response?.data) ? response.data : {};

  if (!response) {
    const timedOut =
      error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";

    return new ApiError({
      type: timedOut ? "timeout" : "network",
      message: timedOut
        ? "The request timed out. Please try again."
        : "Unable to connect to the service. Check your connection and try again.",
      ...(error.code ? { code: error.code } : {}),
      retryable: true,
    });
  }

  const message =
    getString(payload.detail) ??
    getString(payload.message) ??
    getString(payload.title) ??
    getDefaultMessage(status);

  const code = getString(payload.code) ?? error.code;
  const requestId = getRequestId(response.headers);

  return new ApiError({
    type: "http",
    message,
    ...(status !== undefined ? { status } : {}),
    ...(code ? { code } : {}),
    fieldErrors: getFieldErrors(payload),
    ...(requestId ? { requestId } : {}),
    retryable:
      status === 408 ||
      status === 425 ||
      status === 429 ||
      (status !== undefined && status >= 500),
  });
}
