// @ts-check
import { test, expect } from "@playwright/test";

/**
 * M15 — e2e: fluxo do atendente no browser.
 * Pré-requisito: API em :5088 (Visual Studio F5) e `npm run dev` em :5173.
 */
test.describe("Portal INSS", () => {
  test("login inválido mostra erro", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("ana@inss.gov.mz");
    await page.getByLabel("Senha").fill("errada");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("alert")).toContainText(/inválidos/i);
  });

  test("login válido abre a lista", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("ana@inss.gov.mz");
    await page.getByLabel("Senha").fill("1234");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Portal INSS" })).toBeVisible();
  });
});
