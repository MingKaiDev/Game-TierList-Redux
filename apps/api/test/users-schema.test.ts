import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

interface Column {
  name: string
  type: string
  notnull: number
  pk: number
}

const insert = (id: string, uid: string) =>
  env.DB.prepare(
    'INSERT INTO users (id, firebase_uid, display_name, avatar_url, created_at) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(id, uid, 'Ming Kai', null, Date.now())
    .run()

describe('users table', () => {
  it('has the R0 columns', async () => {
    const { results } = await env.DB.prepare('PRAGMA table_info(users)').all<Column>()
    const cols = Object.fromEntries(results.map((c) => [c.name, c]))
    expect(Object.keys(cols).sort()).toEqual(
      ['avatar_url', 'created_at', 'display_name', 'firebase_uid', 'id'].sort(),
    )
    expect(cols.id?.pk).toBe(1)
    expect(cols.firebase_uid?.notnull).toBe(1)
    expect(cols.display_name?.notnull).toBe(1)
    expect(cols.avatar_url?.notnull).toBe(0)
    expect(cols.created_at?.type).toBe('INTEGER')
  })

  it('stores and reads a user', async () => {
    await insert('01JUSER0000000000000000001', 'uid-1')
    const row = await env.DB.prepare('SELECT * FROM users WHERE firebase_uid = ?')
      .bind('uid-1')
      .first<{ display_name: string; avatar_url: string | null }>()
    expect(row?.display_name).toBe('Ming Kai')
    expect(row?.avatar_url).toBeNull()
  })

  it('rejects a second row for the same Firebase uid', async () => {
    await insert('01JUSER0000000000000000002', 'uid-2')
    await expect(insert('01JUSER0000000000000000003', 'uid-2')).rejects.toThrow(/UNIQUE/)
  })

  it('rejects wrong types (STRICT table)', async () => {
    await expect(
      env.DB.prepare(
        'INSERT INTO users (id, firebase_uid, display_name, created_at) VALUES (?, ?, ?, ?)',
      )
        .bind('01JUSER0000000000000000004', 'uid-4', 'X', 'not-a-number')
        .run(),
    ).rejects.toThrow()
  })
})
