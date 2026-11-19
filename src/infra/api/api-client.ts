import axios from 'axios'
import { apiConfig } from '@/config'
import { normalizeApiError } from './api-error'

/**
 * Shared HTTP client for Java API requests.
 *
 * Do not set Content-Type globally: the browser must add the multipart
 * boundary automatically for FormData uploads.
 */
export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
)
