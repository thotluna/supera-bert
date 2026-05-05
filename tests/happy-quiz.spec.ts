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

    // 2. Responder Pregunta 1 (Simple)
    await expect(page.locator('h3')).toContainText('color del cable de tierra');

  });
});
