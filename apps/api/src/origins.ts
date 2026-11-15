/**
 * ALLOWED_ORIGINS is a comma-separated list. An entry may use one leading
 * wildcard label, e.g. `https://*.gtl-web.pages.dev`, which matches any single
 * subdomain (PR preview deploys) but not the bare domain.
 */
export function isAllowedOrigin(origin: string, allowed: string): boolean {
  for (const raw of allowed.split(',')) {
    const pattern = raw.trim()
    if (!pattern) continue
    if (pattern === origin) return true

    const star = pattern.indexOf('://*.')
    if (star !== -1) {
      const scheme = pattern.slice(0, star + 3)
      const suffix = pattern.slice(star + 4) // ".gtl-web.pages.dev"
      if (!origin.startsWith(scheme) || !origin.endsWith(suffix)) continue
      const label = origin.slice(scheme.length, origin.length - suffix.length)
      if (/^[a-z0-9-]+$/i.test(label)) return true
    }
  }
  return false
}
