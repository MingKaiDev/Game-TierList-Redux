import type { HealthResponse } from '@gtl/shared'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { pingDb } from './db'
import { notFound, onError } from './errors'
import { isAllowedOrigin } from './origins'

export type AppEnv = { Bindings: Env }

export function createApp() {
  const app = new Hono<AppEnv>()

  app.use(requestId())
  app.use(secureHeaders())
  app.use(
    '/api/*',
    cors({
      origin: (origin, c) => (isAllowedOrigin(origin, c.env.ALLOWED_ORIGINS) ? origin : null),
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['X-Request-Id'],
      maxAge: 600,
    }),
  )

  const v1 = new Hono<AppEnv>()

  v1.get('/health', async (c) => {
    const db = await pingDb(c.env.DB)
    const body: HealthResponse = {
      status: db === 'ok' ? 'ok' : 'degraded',
      db,
      version: c.env.VERSION,
      env: c.env.APP_ENV as HealthResponse['env'],
    }
    c.header('Cache-Control', 'no-store')
    return c.json(body, db === 'ok' ? 200 : 503)
  })

  app.route('/api/v1', v1)
  app.notFound(notFound)
  app.onError(onError)

  return app
}
