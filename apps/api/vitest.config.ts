import path from 'node:path'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    cloudflareTest(async () => {
      const migrations = await readD1Migrations(path.join(import.meta.dirname, 'migrations'))
      return {
        wrangler: { configPath: './wrangler.jsonc' },
        // Test-only binding so the setup file can apply migrations to the local D1.
        miniflare: { bindings: { TEST_MIGRATIONS: migrations } },
      }
    }),
  ],
  test: {
    setupFiles: ['./test/apply-migrations.ts'],
  },
})
