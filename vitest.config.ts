import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": here,
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: [
      "blocks/**/*.test.ts",
      "lib/**/*.test.ts",
      "services/**/*.test.ts",
    ],
  },
});
