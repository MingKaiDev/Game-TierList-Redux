/** Cheapest possible round trip to D1. Never throws. */
export async function pingDb(db: D1Database): Promise<'ok' | 'error'> {
  try {
    const row = await db.prepare('SELECT 1 AS ok').first<{ ok: number }>()
    return row?.ok === 1 ? 'ok' : 'error'
  } catch (err) {
    console.error(JSON.stringify({ msg: 'db ping failed', error: String(err) }))
    return 'error'
  }
}
