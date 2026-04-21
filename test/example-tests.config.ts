import { defineConfig, devices } from 'playwright/test';

const PORT = 4567;

export default defineConfig({
  testDir: './examples',
  retries: 2,
  testIgnore: process.env.FEATURE_TESTS ? [] : ['**/features/**'],

  webServer: {
    command: `npm run serve:test -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: `http://localhost:${PORT}`,
    screenshot: "only-on-failure",
    video: "off",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
