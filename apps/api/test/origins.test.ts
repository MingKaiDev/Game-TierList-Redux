import { describe, expect, it } from 'vitest'
import { isAllowedOrigin } from '../src/origins'

const LIST = 'http://localhost:5173, https://*.gtl-web.pages.dev'

describe('isAllowedOrigin', () => {
  it.each([
    ['http://localhost:5173', true],
    ['https://abc123.gtl-web.pages.dev', true],
    ['https://feat-login.gtl-web.pages.dev', true],
    ['https://gtl-web.pages.dev', false],
    ['https://a.b.gtl-web.pages.dev', false],
    ['http://abc123.gtl-web.pages.dev', false],
    ['https://evilgtl-web.pages.dev', false],
    ['https://abc.gtl-web.pages.dev.evil.com', false],
    ['http://localhost:3000', false],
  ])('%s -> %s', (origin, expected) => {
    expect(isAllowedOrigin(origin, LIST)).toBe(expected)
  })
})
