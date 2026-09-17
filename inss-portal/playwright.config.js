import { defineConfig } from "@playwright/test";

// M15 — sobe só o Vite; a API o aluno deixa no Visual Studio (F5).
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
  },
});
