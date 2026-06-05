import { defineConfig } from 'vitest/config'
import { TEST_DB_URL } from './tests/global-setup.js'

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: TEST_DB_URL,
      JWT_SECRET: 'test-secret',
    },
    globalSetup: './tests/global-setup.js',
    fileParallelism: false,
  },
})
