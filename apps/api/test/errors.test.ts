import type { ApiErrorBody } from '@gtl/shared'
import { env } from 'cloudflare:workers'
import { HTTPException } from 'hono/http-exception'
import { describe, expect, it } from 'vitest'
import { createApp } from '../src/app'

describe('error handling', () => {
  it('hides internals on unexpected errors', async () => {
    const app = createApp()
    app.get('/boom', () => {
      throw new Error('database password is hunter2')
    })
    const res = await app.request('/boom', {}, env)
    expect(res.status).toBe(500)
    const body = await res.json<ApiErrorBody>()
    expect(body).toEqual({ error: { code: 'internal', message: 'Something went wrong' } })
  })

  it('passes through 4xx HTTPExceptions with a matching code', async () => {
    const app = createApp()
    app.get('/denied', () => {
      throw new HTTPException(403, { message: 'Not your tier list' })
    })
    const res = await app.request('/denied', {}, env)
    expect(res.status).toBe(403)
    expect(await res.json<ApiErrorBody>()).toEqual({
      error: { code: 'forbidden', message: 'Not your tier list' },
    })
  })
})
