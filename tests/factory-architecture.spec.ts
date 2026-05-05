import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';



test.describe('Quiz Happy Path - Modo Contrarreloj', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const modes = ['light', 'dark'] as const;

  for (const mode of modes) {
    test(`prueba de contraste - modo ${mode}`, async ({ page }) => {
      // Configurar el esquema de color
      await page.emulateMedia({ colorScheme: mode });
      
      // Asegurarse de que la página haya cargado completamente
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Reportar violaciones de forma legible si fallan
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('debe completar un examen contrareloj exitosamente', async ({ page }) => {

    await page.click('label[for="timed"]');

    await page.click('button:has-text("Iniciar Simulacro")');

    await expect(page.locator('h3')).toContainText('color del cable de tierra');
    await page.click('text="Verde-Amarillo"');
    await page.click('button:has-text("Siguiente")');

    await expect(page.locator('h3')).toContainText('significa ITC');
    await page.click('text="Instrucción Técnica Complementaria"');
    await page.click('button:has-text("Siguiente")');

    await expect(page.locator('h3')).toContainText('Elementos de protección');
    await page.click('text="Magnetotérmico"');
    await page.click('text="Diferencial"');
    await page.click('button:has-text("Siguiente")');

    await expect(page).toHaveURL(/\/quiz\/results\//, { timeout: 15000 });

    await expect(page.locator('text=Aciertos')).toBeVisible();
    await expect(page.locator('text=Fallos')).toBeVisible();
    await expect(page.locator('text=Puntos')).toBeVisible();
  });
});
