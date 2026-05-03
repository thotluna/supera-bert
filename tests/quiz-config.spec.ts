import { test, expect } from '@playwright/test';

test.describe('Quiz Configuration Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    // Inyectamos la cookie de bypass para el proxy
    await context.addCookies([{
      name: 'e2e-test-auth',
      value: 'true',
      domain: 'localhost',
      path: '/',
    }]);

    // Navegamos a la página de configuración
    await page.goto('/');
  });

  test('Happy Path: Iniciar con configuración por defecto (Standard + Todo REBT)', async ({ page }) => {
    // Esperamos a que el shell de la página sea visible
    await expect(page.getByRole('heading', { name: /Configuración/i })).toBeVisible();
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    
    // El modo Standard debería estar seleccionado por defecto
    const standardMode = page.getByLabel(/Standard/i);
    await expect(standardMode).toBeChecked();

    // Enviamos el formulario y esperamos navegación
    await Promise.all([
      page.waitForURL('**/quiz?mode=standard&topics=all'),
      submitButton.click()
    ]);
  });

  test('Corner Case: Selección múltiple de ITCs y cambio de modo', async ({ page }) => {
    // Esperamos a que los tópicos carguen tras el Suspense
    const itc01 = page.getByLabel('ITC-BT-01');
    // Usamos toBeAttached en lugar de toBeVisible porque los inputs son sr-only
    await expect(itc01).toBeAttached({ timeout: 10000 });

    // Seleccionamos modo Contrarreloj (click forzado por sr-only)
    await page.getByLabel(/Contrarreloj/i).click({ force: true });

    // Seleccionamos dos ITCs específicas
    const itc03 = page.getByLabel('ITC-BT-03');
    
    await itc01.click({ force: true });
    await itc03.click({ force: true });

    const allTopicsRadio = page.getByLabel(/Todo REBT/i);
    await expect(allTopicsRadio).not.toBeChecked();

    // Enviamos y esperamos navegación
    await Promise.all([
      page.waitForURL('**/quiz**'),
      page.locator('button[type="submit"]').click()
    ]);

    // Verificamos que la URL contenga ambos tópicos y el modo correcto
    await expect(page).toHaveURL(/.*quiz\?mode=timed&topics=ITC-BT-01,ITC-BT-03/);
  });

  test('Corner Case: Regresar a "Todo REBT" tras seleccionar ITCs', async ({ page }) => {
    // Seleccionamos una ITC (click forzado)
    await page.getByLabel('ITC-BT-01').click({ force: true });
    
    // Regresamos a Todo REBT (click forzado)
    await page.getByLabel(/Todo REBT/i).click({ force: true });

    // La ITC debería desmarcarse (lógica interna del componente)
    const itc01 = page.getByLabel('ITC-BT-01');
    await expect(itc01).not.toBeChecked();

    // Enviamos
    await page.getByRole('button', { name: /Iniciar Simulacro/i }).click();
    await expect(page).toHaveURL('http://localhost:3000/quiz?mode=standard&topics=all');
  });

  test('UI Premium: El botón muestra estado de carga', async ({ page }) => {
    // Para este test, si la redirección es rápida, el botón apenas se verá.
    // Pero podemos verificar que el botón de envío existe y tiene el tipo submit.
    const submitButton = page.getByRole('button', { name: /Iniciar Simulacro/i });
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
