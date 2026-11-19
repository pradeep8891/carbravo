/**
 * Normalized errors returned by the shared HTTP client.
 *
 * Keep transport-specific details here so feature code can handle one stable
 * error shape instead of parsing Axios and Java response formats itself.
 */
import axios from 'axios'
import type { AxiosError, AxiosResponseHeaders } from 'axios'

export type ApiErrorType = 'http' | 'network' | 'timeout' | 'canceled' | 'unknown'

export interface ApiErrorOptions {
  message: string
  type: ApiErrorType
  status?: number
  code?: string
  requestId?: string
  fieldErrors?: Record<string, string>
  retryable?: boolean
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'The request is invalid. Please check your information.',
  401: 'Your session may have expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  405: 'This action is not supported.',
  408: 'The request timed out. Please try again.',
  409: 'This request conflicts with the current data.',
  410: 'The requested resource is no longer available.',
  413: 'The submitted content is too large.',
  415: 'The submitted file or content type is not supported.',
  422: 'The submitted information could not be processed.',
  423: 'This resource is currently locked.',
  429: 'Too many requests. Please try again shortly.',
  500: 'Something went wrong on our side. Please try again.',
  502: 'The service is temporarily unavailable. Please try again.',
  503: 'The service is temporarily unavailable. Please try again.',
  504: 'The service took too long to respond. Please try again.',
}

const NETWORK_MESSAGE = 'Unable to connect. Check your internet connection and try again.'
const TIMEOUT_MESSAGE = 'The request timed out. Please try again.'
const CANCELED_MESSAGE = 'The request was canceled.'
const UNKNOWN_MESSAGE = 'Something went wrong. Please try again.'

/**
 * A predictable application-level error independent of Axios or backend shape.
 */
export class ApiError extends Error {
  readonly type: ApiErrorType
  readonly status: number | undefined
  readonly code: string | undefined
  readonly requestId: string | undefined
  readonly fieldErrors: Readonly<Record<string, string>>
  readonly retryable: boolean

  constructor(options: ApiErrorOptions) {
    super(options.message)
    this.name = 'ApiError'
    this.type = options.type
    this.status = options.status
    this.code = options.code
    this.requestId = options.requestId
    this.fieldErrors = options.fieldErrors ?? {}
    this.retryable = options.retryable ?? false
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function getFieldAndMessage(
  value: unknown,
): { field: string; message: string } | undefined {
  if (!isRecord(value)) return undefined

  const field =
    getString(value.field) ??
    getString(value.fieldName) ??
    getString(value.name) ??
    getString(value.propertyPath)

  const message =
    getString(value.defaultMessage) ??
    getString(value.message) ??
    getString(value.msg)

  return field && message ? { field, message } : undefined
}

/**
 * Supports common Spring validation formats and RFC-style field error payloads.
 * The first message for a field is retained to keep form output deterministic.
 */
function getFieldErrors(payload: unknown): Record<string, string> {
  if (!isRecord(payload)) return {}

  const result: Record<string, string> = {}
  const add = (field: string, message: string) => {
    if (!(field in result)) result[field] = message
  }

  const addArray = (value: unknown) => {
    if (!Array.isArray(value)) return
    for (const item of value) {
      const parsed = getFieldAndMessage(item)
      if (parsed) add(parsed.field, parsed.message)
    }
  }

  const addObject = (value: unknown) => {
    if (!isRecord(value)) return
    for (const [field, messages] of Object.entries(value)) {
      if (typeof messages === 'string') add(field, messages)
      else if (Array.isArray(messages)) {
        const firstMessage = messages.map(getString).find(Boolean)
        if (firstMessage) add(field, firstMessage)
      }
    }
  }

  addArray(payload.errors)
  addObject(payload.errors)
  addArray(payload.fieldErrors)
  addObject(payload.fieldErrors)
  addArray(payload.violations)

  return result
}

function getRequestId(headers: AxiosResponseHeaders | undefined): string | undefined {
  if (!headers) return undefined

  const requestId =
    headers.get('x-request-id') ??
    headers.get('x-correlation-id') ??
    headers['x-request-id'] ??
    headers['x-correlation-id']

  return getString(requestId)
}

function getHttpMessage(status: number, payload: unknown): string {
  // Do not expose internal exception details from server errors to end users.
  if (status >= 500) return DEFAULT_MESSAGES[status] ?? UNKNOWN_MESSAGE

  if (isRecord(payload)) {
    return (
      getString(payload.detail) ??
      getString(payload.message) ??
      getString(payload.title) ??
      DEFAULT_MESSAGES[status] ??
      'The request could not be completed.'
    )
  }

  return DEFAULT_MESSAGES[status] ?? 'The request could not be completed.'
}

function isTimeoutError(error: AxiosError): boolean {
  return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500
}

/**
 * Converts Axios, cancellation, network and unknown errors into ApiError.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isCancel(error)) {
    return new ApiError({
      type: 'canceled',
      message: CANCELED_MESSAGE,
    })
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      type: 'unknown',
      message: UNKNOWN_MESSAGE,
    })
  }

  const axiosError = error as AxiosError

  if (axiosError.response) {
    const { status, data, headers } = axiosError.response

    const code = isRecord(data)
      ? getString(data.code) ?? getString(data.errorCode)
      : undefined

    return new ApiError({
      type: 'http',
      message: getHttpMessage(status, data),
      status,
      ...(code ? { code } : {}),
      ...(getRequestId(headers) ? { requestId: getRequestId(headers) } : {}),
      fieldErrors: getFieldErrors(data),
      retryable: isRetryableStatus(status),
    })
  }

  if (isTimeoutError(axiosError)) {
    return new ApiError({
      type: 'timeout',
      message: TIMEOUT_MESSAGE,
      code: axiosError.code,
      retryable: true,
    })
  }

  return new ApiError({
    type: 'network',
    message: NETWORK_MESSAGE,
    ...(axiosError.code ? { code: axiosError.code } : {}),
    retryable: true,
  })
}
