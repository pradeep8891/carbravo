import { env } from './env'

export const apiConfig = {
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT,
} as const
