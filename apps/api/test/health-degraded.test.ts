import type { HealthResponse } from '@gtl/shared'
import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app'

describe('GET /api/v1/health when the database is down', () => {
  it('returns 503 and status degraded', async () => {
    const brokenDb = {
      prepare: () => {
        throw new Error('D1 unavailable')
      },
    } as unknown as D1Database
    const res = await createApp().request('/api/v1/health', {}, { ...env, DB: brokenDb })
    expect(res.status).toBe(503)
    const body = await res.json<HealthResponse>()
    expect(body.status).toBe('degraded')
    expect(body.db).toBe('error')
  })
})
