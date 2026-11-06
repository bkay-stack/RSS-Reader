import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

loadEnvConfig(process.cwd());

const authFile = path.join(process.cwd(), "playwright/.auth/user.json");

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
