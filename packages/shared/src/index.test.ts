import { describe, expect, it } from 'vitest'
import { isTier, TIERS } from './index'

describe('isTier', () => {
  it('accepts every tier', () => {
    for (const t of TIERS) expect(isTier(t)).toBe(true)
  })

  it('rejects anything else', () => {
    for (const v of ['s', 'E', '', 1, null, undefined]) expect(isTier(v)).toBe(false)
  })
})
