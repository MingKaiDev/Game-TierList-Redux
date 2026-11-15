/** Error body returned by every failing API response. */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode
    message: string
  }
}

export type ApiErrorCode = 'bad_request' | 'unauthorized' | 'forbidden' | 'not_found' | 'internal'

export interface HealthResponse {
  /** "degraded" (HTTP 503) when a dependency such as the database is down. */
  status: 'ok' | 'degraded'
  db: 'ok' | 'error'
  /** Deployed git commit (short SHA), or "dev" locally. */
  version: string
  env: 'local' | 'staging' | 'production'
}
