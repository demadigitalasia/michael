import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    // Muat .env sebelum test file diimport — src/lib/prisma membaca DATABASE_URL di module scope
    setupFiles: ["dotenv/config"],
  },
});
