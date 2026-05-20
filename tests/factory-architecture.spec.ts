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

    // Esperar a que la pregunta cargue y verificar que el encabezado sea visible
    await expect(page.locator('h3')).toBeVisible();

    // Terminar el examen directamente (evita que el botón esté deshabilitado por el feedback)
    await page.click('button:has-text("Terminar")');

    // Verificar que redirige exitosamente a la página de resultados
    await expect(page).toHaveURL(/\/quiz\/results\//, { timeout: 15000 });

    // Comprobar que los paneles de resultados estén visibles
    await expect(page.locator('text=Aciertos')).toBeVisible();
    await expect(page.locator('text=Fallos')).toBeVisible();
    await expect(page.locator('text=Puntos')).toBeVisible();
  });
});

