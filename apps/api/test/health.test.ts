import { exports } from 'cloudflare:workers'
import type { ApiErrorBody, HealthResponse } from '@gtl/shared'
import { describe, expect, it } from 'vitest'
import '../src/index'

const BASE = 'http://example.com'

describe('GET /api/v1/health', () => {
  it('returns ok with version and env', async () => {
    const res = await exports.default.fetch(`${BASE}/api/v1/health`)
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('x-request-id')).toBeTruthy()
    const body = await res.json<HealthResponse>()
    expect(body).toEqual({ status: 'ok', db: 'ok', version: 'dev', env: 'local' })
  })
})

describe('unknown routes', () => {
  it('return the standard 404 error body', async () => {
    const res = await exports.default.fetch(`${BASE}/api/v1/nope`)
    expect(res.status).toBe(404)
    expect(await res.json<ApiErrorBody>()).toEqual({
      error: { code: 'not_found', message: 'Not found' },
    })
  })
})

describe('CORS', () => {
  it('allows a listed origin', async () => {
    const res = await exports.default.fetch(`${BASE}/api/v1/health`, {
      headers: { Origin: 'http://localhost:5173' },
    })
    expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
  })

  it('does not allow other origins', async () => {
    const res = await exports.default.fetch(`${BASE}/api/v1/health`, {
      headers: { Origin: 'https://evil.example' },
    })
    expect(res.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('answers preflight requests for listed origins', async () => {
    const res = await exports.default.fetch(`${BASE}/api/v1/health`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization,content-type',
      },
    })
    expect(res.status).toBe(204)
    expect(res.headers.get('access-control-allow-headers')?.toLowerCase()).toContain(
      'authorization',
    )
  })
})
