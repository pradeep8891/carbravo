import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('CarBravo'),
  VITE_APP_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_TIMEOUT: z.coerce.number().int().positive().default(30_000),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(
    `Invalid application environment:\n${parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n')}`,
  )
}

export const env = parsed.data
