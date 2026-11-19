import axios, { AxiosError, AxiosHeaders, CanceledError } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, normalizeApiError } from './api-error'

function createAxiosError(
  status: number,
  data: unknown,
  headers: Record<string, string> = {},
): AxiosError {
  const config = {
    headers: new AxiosHeaders(),
  } as InternalAxiosRequestConfig

  const response = {
    data,
    status,
    statusText: '',
    headers: new AxiosHeaders(headers),
    config,
  } as AxiosResponse

  return new AxiosError('Request failed', undefined, config, undefined, response)
}

describe('normalizeApiError', () => {
  it.each([400, 401, 403, 404, 409, 500])('normalizes HTTP %i errors', (status) => {
    const result = normalizeApiError(createAxiosError(status, {}))

    expect(result).toBeInstanceOf(ApiError)
    expect(result.type).toBe('http')
    expect(result.status).toBe(status)
  })

  it('reads Spring ProblemDetail detail for client errors', () => {
    const result = normalizeApiError(
      createAxiosError(400, {
        title: 'Bad Request',
        status: 400,
        detail: 'Invalid customer information',
      }),
    )

    expect(result.message).toBe('Invalid customer information')
  })

  it('does not expose internal server error details', () => {
    const result = normalizeApiError(
      createAxiosError(500, { message: 'SQL connection failed' }),
    )

    expect(result.message).toBe(
      'Something went wrong on our side. Please try again.',
    )
  })

  it('extracts the backend error code and request ID', () => {
    const result = normalizeApiError(
      createAxiosError(
        400,
        { code: 'VALIDATION_ERROR' },
        { 'x-request-id': 'request-123' },
      ),
    )

    expect(result.code).toBe('VALIDATION_ERROR')
    expect(result.requestId).toBe('request-123')
  })

  it('extracts Spring validation errors', () => {
    const result = normalizeApiError(
      createAxiosError(400, {
        errors: [
          { field: 'email', defaultMessage: 'Email is invalid' },
          { field: 'name', defaultMessage: 'Name is required' },
        ],
      }),
    )

    expect(result.fieldErrors).toEqual({
      email: 'Email is invalid',
      name: 'Name is required',
    })
  })

  it('extracts validation errors from an object', () => {
    const result = normalizeApiError(
      createAxiosError(400, {
        errors: { email: 'Email is invalid', name: 'Name is required' },
      }),
    )

    expect(result.fieldErrors).toEqual({
      email: 'Email is invalid',
      name: 'Name is required',
    })
  })

  it('extracts RFC-style field errors and violations', () => {
    const fieldErrors = normalizeApiError(
      createAxiosError(422, {
        fieldErrors: [{ field: 'email', message: 'Invalid email' }],
      }),
    )
    const violations = normalizeApiError(
      createAxiosError(400, {
        violations: [{ propertyPath: 'name', message: 'Name is required' }],
      }),
    )

    expect(fieldErrors.fieldErrors).toEqual({ email: 'Invalid email' })
    expect(violations.fieldErrors).toEqual({ name: 'Name is required' })
  })

  it('keeps the first message for duplicate fields', () => {
    const result = normalizeApiError(
      createAxiosError(400, {
        errors: [
          { field: 'email', defaultMessage: 'Email is required' },
          { field: 'email', defaultMessage: 'Email is invalid' },
        ],
      }),
    )

    expect(result.fieldErrors).toEqual({ email: 'Email is required' })
  })

  it('normalizes network errors', () => {
    const result = normalizeApiError(new AxiosError('Network Error', 'ERR_NETWORK'))

    expect(result.type).toBe('network')
    expect(result.retryable).toBe(true)
  })

  it('normalizes timeout errors', () => {
    const result = normalizeApiError(new AxiosError('timeout', 'ECONNABORTED'))

    expect(result.type).toBe('timeout')
    expect(result.retryable).toBe(true)
  })

  it('normalizes canceled requests', () => {
    const result = normalizeApiError(new CanceledError())

    expect(result.type).toBe('canceled')
    expect(result.retryable).toBe(false)
  })

  it('normalizes unknown errors without exposing implementation details', () => {
    const result = normalizeApiError(new Error('Unexpected internal detail'))

    expect(result.type).toBe('unknown')
    expect(result.message).toBe('Something went wrong. Please try again.')
  })

  it('handles null safely', () => {
    const result = normalizeApiError(null)

    expect(result.type).toBe('unknown')
    expect(result).toBeInstanceOf(ApiError)
  })
})
