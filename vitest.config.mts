import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    // "@/lib/..." means the project folder, same as in tsconfig
    alias: { "@": path.resolve(import.meta.dirname, ".") },
  },
  test: {
    // only run unit tests; Playwright files in tests/ are run by Playwright
    include: ["lib/**/*.test.ts"],
  },
});
