<<<<<<< HEAD
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environment: 'node'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  }
})
=======
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['tests/**/*.spec.ts']
  }
});
>>>>>>> origin/codex/set-up-next-intl-with-translations
