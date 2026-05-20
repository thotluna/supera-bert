import { test, expect } from '@playwright/test';

test.describe('Quiz Happy Path - Modo Contrarreloj', () => {
  test.beforeEach(async ({ context }) => {
    // Bypass de Auth para evitar redirecciones
    await context.addCookies([{
      name: 'e2e-test-auth',
      value: 'true',
      domain: 'localhost',
      path: '/',
    }]);
  });

  test('debe completar un examen contrareloj exitosamente', async ({ page }) => {
    await page.goto('/');

    // Seleccionar modo Contrarreloj
    await page.click('label[for="timed"]');

    // Iniciar
    await page.click('button:has-text("Iniciar Simulacro")');

    // Esperar a que la pregunta cargue y verificar que el encabezado sea visible
    await expect(page.locator('h3')).toBeVisible();

    // Terminar el examen directamente (evita que el botón esté deshabilitado por el feedback)
    await page.click('button:has-text("Terminar")');

    // Verificar que redirige exitosamente a la página de resultados
    await expect(page).toHaveURL(/\/quiz\/results\//, { timeout: 15000 });

    // Comprobar que los paneles de resultados de Aciertos, Fallos y Puntos estén visibles
    await expect(page.locator('text=Aciertos')).toBeVisible();
    await expect(page.locator('text=Fallos')).toBeVisible();
    await expect(page.locator('text=Puntos')).toBeVisible();
  });
});


