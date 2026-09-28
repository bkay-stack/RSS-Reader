import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    // "@/lib/..." means the project folder, same as in tsconfig
    alias: { "@": path.resolve(import.meta.dirname, ".") },
  },
});
