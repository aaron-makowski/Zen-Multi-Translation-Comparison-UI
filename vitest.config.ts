import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  esbuild: {
    jsx: 'automatic'
  },
  test: {
    include: [
      'tests/**/*.test.{ts,tsx}',
      'components/__tests__/**/*.test.{ts,tsx}'
    ],
    environment: 'node'
  }
})
