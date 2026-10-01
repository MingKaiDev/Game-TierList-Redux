export const APP_NAME = 'Game Tier List'

/** Tiers in display order, best first. Shared by the API and the web app. */
export const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'] as const
export type Tier = (typeof TIERS)[number]

export function isTier(value: unknown): value is Tier {
  return typeof value === 'string' && (TIERS as readonly string[]).includes(value)
}
