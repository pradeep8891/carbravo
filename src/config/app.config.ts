import { env } from './env'

export const appConfig = {
  name: env.VITE_APP_NAME,
  environment: env.VITE_APP_ENV,
  isProduction: env.VITE_APP_ENV === 'production',
} as const
