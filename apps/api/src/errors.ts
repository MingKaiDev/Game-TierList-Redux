import type { ApiErrorBody, ApiErrorCode } from '@gtl/shared'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const CODE_BY_STATUS: Record<number, ApiErrorCode> = {
  400: 'bad_request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
}

export function errorBody(code: ApiErrorCode, message: string): ApiErrorBody {
  return { error: { code, message } }
}

export function notFound(c: Context) {
  return c.json(errorBody('not_found', 'Not found'), 404)
}

export function onError(err: Error, c: Context) {
  if (err instanceof HTTPException && err.status < 500) {
    const status = err.status as ContentfulStatusCode
    const code = CODE_BY_STATUS[status] ?? 'bad_request'
    return c.json(errorBody(code, err.message || 'Request failed'), status)
  }
  console.error(
    JSON.stringify({ msg: 'unhandled error', requestId: c.get('requestId'), error: String(err) }),
  )
  // Never leak internals to clients.
  return c.json(errorBody('internal', 'Something went wrong'), 500)
}
