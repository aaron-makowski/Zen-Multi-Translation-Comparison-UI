import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db'
    }
  },
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium'
  }
});
