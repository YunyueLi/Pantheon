import { defineConfig } from "vitest/config";

// Pure-logic tests (honor math, data integrity, i18n parity). No DOM needed —
// the node environment keeps the suite fast. `@/` aliases resolve from tsconfig
// via Vite's native tsconfig-paths support.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
