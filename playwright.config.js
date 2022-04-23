const { devices } = require("@playwright/test");
const config = {
  use: {
    baseURL: "http://localhost:8080/",
  },
  testDir: "example/test/e2e",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
  webServer: {
    command: "cd example && npm run export && cd out/ && http-server",
    port: 8080,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};
module.exports = config;
